import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, RefreshCw, Search, Filter, CheckCircle, XCircle,
  AlertCircle, Download, Upload, Loader2, X
} from 'lucide-react';
import { supabase } from '../../../../lib/config/supabase';
import { initializeStaticTranslations } from '../../../../lib/translations';
import { generateContentKey, generateHash, deduplicateTranslations } from '../../../../utils/translationScanner';
import { getAllStaticTranslations } from '../../../../data/static/translationSources';
import type { ScannedTranslation } from '../../../../utils/translationScanner';

interface Translation {
  id: string;
  content_key: string;
  language: string;
  translated_text: string;
  content_hash: string;
  created_at: string;
  updated_at: string;
}

interface SyncResult {
  success: boolean;
  found: number;
  existing: number;
  added: number;
  addedKeys: string[];
  errors?: string[];
}

const TranslationManager = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [retranslating, setRetranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState({ current: 0, total: 0 });
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    tr: 0,
    en: 0,
  });

  const loadTranslations = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('content_key', { ascending: true });

      if (error) throw error;

      setTranslations(data || []);

      const trCount = data?.filter(t => t.language === 'tr').length || 0;
      const enCount = data?.filter(t => t.language === 'en').length || 0;

      setStats({
        total: data?.length || 0,
        tr: trCount,
        en: enCount,
      });
    } catch (error) {
      console.error('Error loading translations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAndLoad = async () => {
      setLoading(true);
      try {
        await initializeStaticTranslations();
      } catch (error) {
        console.error('Error initializing static translations:', error);
      } finally {
        await loadTranslations();
      }
    };

    initializeAndLoad();
  }, [loadTranslations]);

  const retranslateContent = async (contentKey: string, originalText: string) => {
    try {
      setRetranslating(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-content`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: originalText,
          targetLang: 'EN',
          sourceLang: 'TR',
          contentKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const result = await response.json();

      const { error } = await supabase
        .from('translations')
        .upsert({
          content_key: contentKey,
          language: 'en',
          translated_text: result.translatedText,
          content_hash: generateHashLocal(originalText),
        });

      if (error) throw error;

      await loadTranslations();

      return { success: true };
    } catch (error) {
      console.error('Error retranslating:', error);
      return { success: false, error };
    } finally {
      setRetranslating(false);
    }
  };

  const retranslateAll = async () => {
    const confirmed = window.confirm('This will translate all Turkish texts to English. This may take several minutes. Continue?');
    if (!confirmed) return;

    try {
      setRetranslating(true);

      const { data: trTranslations, error: fetchError } = await supabase
        .from('translations')
        .select('content_key, translated_text')
        .eq('language', 'tr');

      if (fetchError) throw fetchError;

      if (!trTranslations || trTranslations.length === 0) {
        alert('No Turkish translations found');
        return;
      }

      const textsToTranslate = trTranslations.map(t => ({
        text: t.translated_text,
        contentKey: t.content_key,
      }));

      const BATCH_SIZE = 10;
      let totalSuccess = 0;
      let totalProcessed = 0;
      let lastError = '';

      setTranslationProgress({ current: 0, total: textsToTranslate.length });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      for (let i = 0; i < textsToTranslate.length; i += BATCH_SIZE) {
        const batch = textsToTranslate.slice(i, i + BATCH_SIZE);

        try {
          const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-content/batch`;

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              texts: batch,
              targetLang: 'EN',
              sourceLang: 'TR',
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Translation API Error:', errorText);
            lastError = errorText;
            totalProcessed += batch.length;
            setTranslationProgress({ current: totalProcessed, total: textsToTranslate.length });
            continue;
          }

          const result = await response.json();

          const upsertBatch = [];
          for (const translation of result.translations) {
            if (translation.success) {
              upsertBatch.push({
                content_key: translation.contentKey,
                language: 'en',
                translated_text: translation.translatedText,
                content_hash: generateHashLocal(translation.originalText),
              });
              totalSuccess++;
            } else {
              if (translation.error) lastError = translation.error;
            }
          }

          if (upsertBatch.length > 0) {
            await supabase
              .from('translations')
              .upsert(upsertBatch);
          }

          totalProcessed += batch.length;
          setTranslationProgress({ current: totalProcessed, total: textsToTranslate.length });
          console.log(`Translated batch ${Math.floor(i / BATCH_SIZE) + 1}: ${totalSuccess}/${totalProcessed}`);

          // Reduced delay to 500ms to speed up but still be safe
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (batchError) {
          console.error('Batch error:', batchError);
          lastError = batchError.message;
          totalProcessed += batch.length;
          setTranslationProgress({ current: totalProcessed, total: textsToTranslate.length });
        }
      }

      await loadTranslations();

      if (totalSuccess === 0 && lastError) {
        alert(`Translation failed. Last error: ${lastError}`);
      } else {
        alert(`Successfully translated ${totalSuccess} out of ${totalProcessed} items!`);
      }
    } catch (error) {
      console.error('Error retranslating all:', error);
      alert(`Error retranslating content: ${error.message}`);
    } finally {
      setRetranslating(false);
      setTranslationProgress({ current: 0, total: 0 });
    }
  };

  const generateHashLocal = (text: string): string => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36).substring(0, 6);
  };

  const syncMissingTranslations = async () => {
    try {
      setSyncing(true);
      setSyncResult(null);

      const staticTranslations = getAllStaticTranslations();

      const scannedTranslations: ScannedTranslation[] = staticTranslations.map(({ context, text }) => ({
        contentKey: generateContentKey(text, context),
        text,
        hash: generateHash(text),
        context,
      }));

      const uniqueTranslations = deduplicateTranslations(scannedTranslations);

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-translations`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          translations: uniqueTranslations,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sync failed: ${errorText}`);
      }

      const result: SyncResult = await response.json();
      setSyncResult(result);
      setShowSyncModal(true);

      await loadTranslations();
    } catch (error) {
      console.error('Error syncing translations:', error);
      alert('Failed to sync translations. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const autoTranslateNewOnes = async () => {
    if (!syncResult || syncResult.added === 0) return;

    try {
      setRetranslating(true);

      const trTranslations = translations.filter(t =>
        t.language === 'tr' && syncResult.addedKeys.includes(t.content_key)
      );

      const textsToTranslate = trTranslations.map(t => ({
        text: t.translated_text,
        contentKey: t.content_key,
      }));

      // Process in batches of 10 to avoid timeouts and rate limits
      const BATCH_SIZE = 10;
      let totalSuccess = 0;
      let totalProcessed = 0;
      let lastError = '';
      
      setTranslationProgress({ current: 0, total: textsToTranslate.length });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      for (let i = 0; i < textsToTranslate.length; i += BATCH_SIZE) {
        const batch = textsToTranslate.slice(i, i + BATCH_SIZE);
        
        try {
          const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-content/batch`;

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              texts: batch,
              targetLang: 'EN',
              sourceLang: 'TR',
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Batch translation failed:', errorText);
            lastError = errorText;
            // Continue to next batch instead of failing completely
            totalProcessed += batch.length;
            setTranslationProgress({ current: totalProcessed, total: textsToTranslate.length });
            continue;
          }

          const result = await response.json();

          // Upsert successful translations
          const upsertBatch = [];
          for (const translation of result.translations) {
            if (translation.success) {
              upsertBatch.push({
                content_key: translation.contentKey,
                language: 'en',
                translated_text: translation.translatedText,
                content_hash: generateHashLocal(translation.originalText),
              });
              totalSuccess++;
            }
          }

          if (upsertBatch.length > 0) {
            const { error: upsertError } = await supabase
              .from('translations')
              .upsert(upsertBatch);
            
            if (upsertError) console.error('Error saving translations:', upsertError);
          }

          totalProcessed += batch.length;
          setTranslationProgress({ current: totalProcessed, total: textsToTranslate.length });
          
          // Small delay to be nice to the API
          await new Promise(resolve => setTimeout(resolve, 500));

        } catch (batchError) {
          console.error('Error processing batch:', batchError);
          totalProcessed += batch.length;
          setTranslationProgress({ current: totalProcessed, total: textsToTranslate.length });
        }
      }

      await loadTranslations();
      setShowSyncModal(false);
      
      if (totalSuccess === 0) {
        alert(`Failed to translate items. Last error: ${lastError || 'Unknown error'}`);
      } else {
        alert(`Successfully translated ${totalSuccess} out of ${textsToTranslate.length} items`);
      }
      
    } catch (error) {
      console.error('Error auto-translating:', error);
      alert('An unexpected error occurred during translation.');
    } finally {
      setRetranslating(false);
      setTranslationProgress({ current: 0, total: 0 });
    }
  };

  const filteredTranslations = translations.filter(t => {
    const matchesSearch = t.content_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.translated_text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || t.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Globe className="w-8 h-8 text-primary" />
            Translation Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and update translations across the website
          </p>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={syncMissingTranslations}
            disabled={syncing || retranslating}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            <span>Sync Missing</span>
          </motion.button>

          <motion.button
            onClick={retranslateAll}
            disabled={retranslating || syncing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {retranslating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{translationProgress.current}/{translationProgress.total}</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>Retranslate All</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-light rounded-lg p-6 border border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Translations</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-light rounded-lg p-6 border border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-blue-500">TR</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Turkish</p>
              <p className="text-2xl font-bold">{stats.tr}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-light rounded-lg p-6 border border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-green-500">EN</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">English</p>
              <p className="text-2xl font-bold">{stats.en}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-light rounded-lg border border-slate-200 dark:border-white/10 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search translations..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-white/10 rounded-lg bg-white dark:bg-dark focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-lg bg-white dark:bg-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Languages</option>
            <option value="tr">Turkish</option>
            <option value="en">English</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTranslations.map((translation) => (
              <div
                key={translation.id}
                className="p-4 border border-slate-200 dark:border-white/10 rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                        {translation.content_key}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        translation.language === 'tr'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-green-500/10 text-green-500'
                      }`}>
                        {translation.language.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100">
                      {translation.translated_text}
                    </p>
                  </div>

                  {translation.language === 'tr' && (
                    <button
                      onClick={() => retranslateContent(translation.content_key, translation.translated_text)}
                      disabled={retranslating}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-dark rounded-lg transition-colors disabled:opacity-50"
                      title="Retranslate to English"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSyncModal && syncResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSyncModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-light rounded-lg shadow-xl max-w-2xl w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {syncResult.success ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  )}
                  Sync Results
                </h2>
                <button
                  onClick={() => setShowSyncModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-500/10 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Found</p>
                    <p className="text-2xl font-bold text-blue-500">{syncResult.found}</p>
                  </div>
                  <div className="bg-gray-500/10 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Already in DB</p>
                    <p className="text-2xl font-bold text-gray-500">{syncResult.existing}</p>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Newly Added</p>
                    <p className="text-2xl font-bold text-green-500">{syncResult.added}</p>
                  </div>
                </div>

                {syncResult.added > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Newly Added Translations:</h3>
                    <div className="bg-gray-50 dark:bg-dark rounded-lg p-4 max-h-48 overflow-y-auto">
                      <ul className="space-y-1 text-sm">
                        {syncResult.addedKeys.slice(0, 10).map((key, idx) => (
                          <li key={idx} className="font-mono text-gray-600 dark:text-gray-400">
                            • {key}
                          </li>
                        ))}
                        {syncResult.addedKeys.length > 10 && (
                          <li className="text-gray-500 italic">
                            ... and {syncResult.addedKeys.length - 10} more
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {syncResult.errors && syncResult.errors.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-red-500">Errors:</h3>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 max-h-32 overflow-y-auto">
                      <ul className="space-y-1 text-sm text-red-600 dark:text-red-400">
                        {syncResult.errors.map((error, idx) => (
                          <li key={idx}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowSyncModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-dark transition-colors"
                >
                  Close
                </button>
                {syncResult.added > 0 && (
                  <button
                    onClick={autoTranslateNewOnes}
                    disabled={retranslating}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {retranslating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Translating... ({translationProgress.current}/{translationProgress.total})
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Auto-Translate Now
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TranslationManager;
