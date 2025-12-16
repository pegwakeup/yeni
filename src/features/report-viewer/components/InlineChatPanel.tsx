import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatMessage } from '../types';
import { sendChatMessage, getChatHistory } from '../api/reportApi';
import ReactMarkdown from 'react-markdown';

interface InlineChatPanelProps {
  reportId: string;
  reportContext: string;
  viewerId?: string;
}

// Hazır sorular - flat ve minimal
const QUICK_QUESTIONS = [
  'Bu raporun özeti nedir?',
  'En kritik sorun hangisi?',
  'SEO skorumu nasıl artırabilirim?',
  'Site hızımı nasıl iyileştirebilirim?',
  'Rakiplerimden nasıl öne çıkarım?',
  'Öncelikli yapılması gerekenler neler?',
];

const InlineChatPanel: React.FC<InlineChatPanelProps> = ({ reportId, reportContext, viewerId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Merhaba! 👋 Ben **DigiBot**, dijital analiz asistanınız. Raporunuz hakkında her türlü soruyu yanıtlayabilirim.`,
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
        content: `Merhaba! 👋 Ben **DigiBot**, dijital analiz asistanınız. Raporunuz hakkında her türlü soruyu yanıtlayabilirim.`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh]">
      {/* Messages Area - Clean and spacious */}
      <div className="flex-1 overflow-y-auto px-2 py-8 space-y-8">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            {message.role === 'assistant' ? (
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-white text-lg">🤖</span>
              </div>
            ) : (
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Message Content */}
            <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
              {message.isLoading ? (
                <div className="inline-flex items-center gap-1.5 px-5 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <div
                  className={`inline-block px-5 py-3.5 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800/80 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className={`prose prose-sm max-w-none ${
                    message.role === 'user' ? 'prose-invert' : 'dark:prose-invert'
                  }`}>
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions - Minimal pills */}
      <AnimatePresence>
        {messages.length <= 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-2 pb-6"
          >
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Hızlı sorular:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSend(question)}
                  disabled={isLoading}
                  className="px-4 py-2.5 text-sm bg-white dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700/50 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all disabled:opacity-50 hover:shadow-md"
                >
                  {question}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Follow-up Actions */}
      {messages.length > 2 && !isLoading && (
        <div className="px-2 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {['Daha detaylı açıkla', 'Somut adımlar öner', 'Öncelik sıralaması yap'].map((action) => (
              <button
                key={action}
                onClick={() => handleSend(action)}
                className="px-3.5 py-2 text-xs bg-gray-100 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {action}
              </button>
            ))}
            <button
              onClick={clearChat}
              className="px-3.5 py-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-auto"
            >
              Temizle
            </button>
          </div>
        </div>
      )}

      {/* Input Area - Clean and modern */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-5 px-2">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Raporunuz hakkında bir soru sorun..."
              disabled={isLoading}
              rows={1}
              className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 disabled:opacity-50 resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
              style={{ minHeight: '52px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isLoading}
            className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
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
        <p className="text-[11px] text-gray-400 text-center mt-3">
          Enter ile gönder • Shift+Enter ile yeni satır
        </p>
      </div>
    </div>
  );
};

export default InlineChatPanel;
