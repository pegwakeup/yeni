import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { DigitalAnalysisReport } from '../types';
import { sendReportEmail, logAnalyticsEvent } from '../api/reportApi';
import { generateReportContext } from '../utils/reportParser';
import OverallScore from './OverallScore';
import ScoreCard from './ScoreCard';
import { RecommendationsList } from './RecommendationCard';
import DigiBotChat from './DigiBotChat';

interface ReportDashboardProps {
  report: DigitalAnalysisReport;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  website: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  seo: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  social_media: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
    </svg>
  ),
  content: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  branding: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  analytics: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

const CATEGORY_COLORS: Record<string, string> = {
  website: 'blue',
  seo: 'purple',
  social_media: 'pink',
  content: 'emerald',
  branding: 'orange',
  analytics: 'cyan',
};

const ReportDashboard: React.FC<ReportDashboardProps> = ({ report }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'recommendations'>('overview');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailName, setEmailName] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const analysisResult = report.analysis_result;
  const reportContext = generateReportContext(report);

  const handlePdfDownload = async () => {
    await logAnalyticsEvent(report.id, 'pdf_download');
    
    // Create print-friendly version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${report.company_name} - Dijital Analiz Raporu</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1f2937; }
            h1 { color: #10b981; }
            .score { font-size: 48px; font-weight: bold; color: #10b981; }
            .section { margin: 20px 0; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
            .recommendation { padding: 10px; margin: 10px 0; background: #f3f4f6; border-radius: 4px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>🎯 Dijital Analiz Raporu</h1>
          <h2>${report.company_name}</h2>
          <p>Oluşturulma: ${new Date(report.created_at).toLocaleDateString('tr-TR')}</p>
          
          <div class="section">
            <h3>Genel Skor</h3>
            <div class="score">${report.digital_score || 0}/100</div>
          </div>
          
          ${analysisResult?.scores ? `
            <div class="section">
              <h3>Kategori Skorları</h3>
              ${Object.entries(analysisResult.scores).map(([_key, value]) => `
                <p><strong>${(value as any).label}:</strong> ${(value as any).score}/${(value as any).maxScore}</p>
              `).join('')}
            </div>
          ` : ''}
          
          ${analysisResult?.recommendations?.length ? `
            <div class="section">
              <h3>Öneriler</h3>
              ${analysisResult.recommendations.map(r => `
                <div class="recommendation">
                  <strong>[${r.priority.toUpperCase()}]</strong> ${r.title}
                  ${r.description ? `<p>${r.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <p style="margin-top: 40px; color: #6b7280; font-size: 12px;">
            Bu rapor Unilancer Labs tarafından hazırlanmıştır. © ${new Date().getFullYear()}
          </p>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSendEmail = async () => {
    if (!emailTo) return;
    
    setIsSendingEmail(true);
    try {
      const result = await sendReportEmail(report.id, emailTo, emailName, emailMessage);
      if (result.success) {
        setEmailSent(true);
        setTimeout(() => {
          setEmailDialogOpen(false);
          setEmailSent(false);
          setEmailTo('');
          setEmailName('');
          setEmailMessage('');
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/digibot-logo-02%20(1).webp"
              alt="DigiBot"
              className="w-10 h-10 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {report.company_name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Dijital Analiz Raporu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePdfDownload}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">PDF İndir</span>
            </button>

            <button
              onClick={() => setEmailDialogOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">E-posta Gönder</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
            {[
              { key: 'overview', label: 'Genel Bakış', icon: '📊' },
              { key: 'details', label: 'Detaylar', icon: '📋' },
              { key: 'recommendations', label: 'Öneriler', icon: '💡' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.key
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Overall Score */}
            <OverallScore
              score={report.digital_score || 0}
              companyName={report.company_name}
              reportDate={new Date(report.created_at).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            />

            {/* Category Scores Grid */}
            {analysisResult?.scores && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(analysisResult.scores).map(([key, value]) => (
                  <ScoreCard
                    key={key}
                    category={key}
                    score={(value as any).score}
                    maxScore={(value as any).maxScore}
                    label={(value as any).label}
                    description={(value as any).description || ''}
                    icon={CATEGORY_ICONS[key]}
                    color={CATEGORY_COLORS[key]}
                  />
                ))}
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              {analysisResult?.strengths && analysisResult.strengths.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
                    <span>✅</span> Güçlü Yönler
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-green-700 dark:text-green-300">
                        <span className="mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {analysisResult?.weaknesses && analysisResult.weaknesses.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                    <span>⚠️</span> Geliştirme Alanları
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2 text-red-700 dark:text-red-300">
                        <span className="mt-1">•</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Summary */}
            {analysisResult?.summary && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📝 Özet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>
            )}

            {/* Detailed Scores */}
            {analysisResult?.scores && (
              <div className="space-y-4">
                {Object.entries(analysisResult.scores).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                        {CATEGORY_ICONS[key]}
                        {(value as any).label}
                      </h3>
                      <span className="text-2xl font-bold text-emerald-500">
                        {(value as any).score}/{(value as any).maxScore}
                      </span>
                    </div>
                    {(value as any).details && (value as any).details.length > 0 && (
                      <ul className="space-y-2">
                        {(value as any).details.map((detail: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-sm"
                          >
                            <span className="text-emerald-500 mt-0.5">•</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'recommendations' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {analysisResult?.recommendations && analysisResult.recommendations.length > 0 ? (
              <RecommendationsList recommendations={analysisResult.recommendations} />
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💡</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Henüz öneri yok
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Analiz tamamlandığında öneriler burada görünecek.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* DigiBot Chat */}
      <DigiBotChat
        reportId={report.id}
        reportContext={reportContext}
      />

      {/* Email Dialog */}
      {emailDialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                📧 Raporu E-posta ile Gönder
              </h3>
              <button
                onClick={() => setEmailDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {emailSent ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  E-posta gönderildi!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    E-posta Adresi *
                  </label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="ornek@sirket.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    İsim (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={emailName}
                    onChange={(e) => setEmailName(e.target.value)}
                    placeholder="Alıcı ismi"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mesaj (Opsiyonel)
                  </label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Ek mesajınız..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setEmailDialogOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleSendEmail}
                    disabled={!emailTo || isSendingEmail}
                    className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSendingEmail ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Gönderiliyor...
                      </>
                    ) : (
                      'Gönder'
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReportDashboard;
