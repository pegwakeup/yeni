import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatMessage } from '../types';
import { sendChatMessage, getChatHistory } from '../api/reportApi';
import ReactMarkdown from 'react-markdown';

const DIGIBOT_LOGO = 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/digibot-logo-02%20(1).webp';

interface InlineChatPanelProps {
  reportId: string;
  reportContext: string;
  viewerId?: string;
}

// Hazır soru kategorileri
const SUGGESTED_CATEGORIES = [
  {
    title: 'Genel',
    icon: '📊',
    questions: [
      'Bu raporun özeti nedir?',
      'En kritik sorun hangisi?',
      'Güçlü yönlerim neler?',
    ],
  },
  {
    title: 'SEO',
    icon: '🔍',
    questions: [
      'SEO skorumu nasıl artırabilirim?',
      'Hangi anahtar kelimeleri hedeflemeliyim?',
      'Backlink stratejisi önerir misin?',
    ],
  },
  {
    title: 'Performans',
    icon: '⚡',
    questions: [
      'Site hızımı nasıl artırabilirim?',
      'Mobil performans için ne yapmalıyım?',
      'Core Web Vitals skorlarım nasıl?',
    ],
  },
  {
    title: 'Strateji',
    icon: '🎯',
    questions: [
      'Rakiplerimden nasıl öne çıkarım?',
      'Öncelikli yapılması gerekenler neler?',
      'Hangi hizmet paketini önerirsin?',
    ],
  },
];

const InlineChatPanel: React.FC<InlineChatPanelProps> = ({ reportId, reportContext, viewerId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Merhaba! 👋 Ben **DigiBot**, dijital analiz asistanınız.

Raporunuz hakkında her türlü soruyu yanıtlayabilirim:
- 📊 Skorlarınızı ve performansınızı açıklayabilirim
- 💡 İyileştirme önerileri sunabilirim
- 🎯 Stratejik yol haritası çizebilirim
- 🔍 Rakip analizi yapabilirim

Aşağıdaki hazır sorulardan birini seçebilir veya kendi sorunuzu yazabilirsiniz.`,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Load chat history
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatHistory = async () => {
    const history = await getChatHistory(sessionId);
    if (history.length > 0) {
      const historicalMessages: ChatMessage[] = history.map((msg, index) => ({
        id: `history-${index}`,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(),
      }));
      setMessages(prev => [...prev.slice(0, 1), ...historicalMessages]);
      setShowSuggestions(false);
    }
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowSuggestions(false);

    // Add loading message
    const loadingMessage: ChatMessage = {
      id: 'loading',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await sendChatMessage(
        reportId,
        sessionId,
        text,
        reportContext,
        viewerId
      );

      // Remove loading message and add response
      setMessages(prev => {
        const withoutLoading = prev.filter(m => m.id !== 'loading');
        if (response.success && response.message) {
          return [
            ...withoutLoading,
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: response.message,
              timestamp: new Date(),
            },
          ];
        } else {
          return [
            ...withoutLoading,
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
              timestamp: new Date(),
            },
          ];
        }
      });
    } catch (error) {
      setMessages(prev => {
        const withoutLoading = prev.filter(m => m.id !== 'loading');
        return [
          ...withoutLoading,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: 'Bağlantı hatası. Lütfen tekrar deneyin.',
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Merhaba! 👋 Ben **DigiBot**, dijital analiz asistanınız.

Raporunuz hakkında her türlü soruyu yanıtlayabilirim:
- 📊 Skorlarınızı ve performansınızı açıklayabilirim
- 💡 İyileştirme önerileri sunabilirim
- 🎯 Stratejik yol haritası çizebilirim
- 🔍 Rakip analizi yapabilirim

Aşağıdaki hazır sorulardan birini seçebilir veya kendi sorunuzu yazabilirsiniz.`,
        timestamp: new Date(),
      },
    ]);
    setShowSuggestions(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={DIGIBOT_LOGO} alt="DigiBot" className="w-12 h-12 rounded-full bg-white p-1 shadow-lg" />
          <div>
            <h3 className="text-white font-semibold text-lg">DigiBot ile Sohbet</h3>
            <p className="text-emerald-100 text-sm">Raporunuz hakkında her şeyi sorun</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
            <span className="text-emerald-100 text-sm">Çevrimiçi</span>
          </div>
          {messages.length > 1 && (
            <button
              onClick={clearChat}
              className="text-emerald-100 hover:text-white transition-colors text-sm flex items-center gap-1"
              title="Sohbeti temizle"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Temizle
            </button>
          )}
        </div>
      </div>

      {/* Suggested Questions Grid */}
      <AnimatePresence>
        {showSuggestions && messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
          >
            <div className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">
                💡 Hızlı başlangıç için bir soru seçin:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {SUGGESTED_CATEGORIES.map((category) => (
                  <div key={category.title} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <span>{category.icon}</span>
                      <span>{category.title}</span>
                    </div>
                    <div className="space-y-1">
                      {category.questions.map((question) => (
                        <button
                          key={question}
                          onClick={() => handleSend(question)}
                          disabled={isLoading}
                          className="w-full text-left text-xs px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 disabled:opacity-50"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <div className="h-[400px] overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900/30">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
              message.role === 'user' 
                ? 'bg-blue-100 dark:bg-blue-900' 
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }`}>
              {message.role === 'user' ? (
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              ) : (
                <img src={DIGIBOT_LOGO} alt="DigiBot" className="w-7 h-7 rounded-full" />
              )}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${
              message.role === 'user'
                ? 'bg-blue-500 text-white rounded-br-sm'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm border border-gray-200 dark:border-gray-700'
            }`}>
              {message.isLoading ? (
                <div className="flex gap-1 py-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <div className={`prose prose-sm max-w-none ${
                  message.role === 'user' 
                    ? 'prose-invert' 
                    : 'dark:prose-invert'
                }`}>
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-sm">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      code: ({ children }) => (
                        <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">{children}</code>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions - Show after first message */}
      {!showSuggestions && messages.length > 2 && (
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex flex-wrap gap-2">
            {[
              'Daha detaylı açıkla',
              'Somut adımlar öner',
              'Maliyetleri karşılaştır',
              'Öncelik sıralaması yap',
            ].map((action) => (
              <button
                key={action}
                onClick={() => handleSend(action)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border border-gray-200 dark:border-gray-700 disabled:opacity-50"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Raporunuz hakkında bir soru sorun..."
              disabled={isLoading}
              rows={1}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 resize-none"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isLoading}
            className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
          Enter ile gönder • Shift+Enter ile yeni satır
        </p>
      </div>
    </div>
  );
};

export default InlineChatPanel;
