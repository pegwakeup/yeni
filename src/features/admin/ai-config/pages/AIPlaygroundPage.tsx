import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Settings,
  RefreshCw,
  Copy,
  Check,
  Loader2,
  Trash2,
  FileJson,
  Code,
  Thermometer,
  Hash,
  Brain,
  Play,
  Save,
  Clock,
  Zap,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../../lib/config/supabase';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokens?: number;
  latency?: number;
}

interface PlaygroundConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

const AVAILABLE_MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Hızlı & Ekonomik' },
  { id: 'gpt-4o', name: 'GPT-4o', description: 'En Gelişmiş' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Güçlü & Hızlı' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Temel' },
];

const DEFAULT_SYSTEM_PROMPT = JSON.stringify({
  identity: {
    name: "DigiBot",
    role: "Test Asistanı",
    personality: "Yardımsever"
  },
  tasks: ["Soruları yanıtla", "Bilgi ver"],
  responseRules: {
    language: "Türkçe",
    maxLength: "200 kelime"
  }
}, null, 2);

const SAMPLE_CONTEXTS = [
  {
    name: "Düşük Skorlu Rapor",
    context: `ŞİRKET: Test A.Ş.
GENEL SKOR: 42/100
- Web Varlığı: 35/100
- Sosyal Medya: 28/100
- SEO: 45/100
ZAYIF YÖNLER: SEO eksik, sosyal medya pasif`
  },
  {
    name: "Yüksek Skorlu Rapor",
    context: `ŞİRKET: Başarılı Ltd.
GENEL SKOR: 78/100
- Web Varlığı: 85/100
- Sosyal Medya: 72/100
- SEO: 80/100
GÜÇLÜ YÖNLER: Modern web sitesi, aktif sosyal medya`
  },
  {
    name: "E-Ticaret Firması",
    context: `ŞİRKET: Online Mağaza
SEKTÖR: E-ticaret
GENEL SKOR: 55/100
- Web: 60/100
- Mobil: 45/100
- Pazarlama: 55/100
ÖNERİ: Mobil uygulama geliştirme`
  }
];

const AIPlaygroundPage: React.FC = () => {
  const [config, setConfig] = useState<PlaygroundConfig>({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 500,
    systemPrompt: DEFAULT_SYSTEM_PROMPT
  });
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const [testContext, setTestContext] = useState('');
  const [totalTokens, setTotalTokens] = useState(0);
  const [copied, setCopied] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load saved config from DB
  useEffect(() => {
    loadSavedConfig();
  }, []);

  const loadSavedConfig = async () => {
    try {
      const { data } = await supabase
        .from('digibot_config')
        .select('*')
        .eq('config_key', 'default')
        .single();

      if (data) {
        setConfig({
          model: data.model || 'gpt-4o-mini',
          temperature: data.temperature || 0.7,
          maxTokens: data.max_tokens || 500,
          systemPrompt: data.system_prompt || DEFAULT_SYSTEM_PROMPT
        });
      }
    } catch (error) {
      console.log('No saved config found');
    }
  };

  const validateJson = (value: string): boolean => {
    try {
      JSON.parse(value);
      setJsonError(null);
      return true;
    } catch (e: any) {
      setJsonError(e.message);
      return false;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const question = input;
    setInput('');
    setIsLoading(true);

    const startTime = Date.now();

    try {
      // Build context with test context if provided
      let fullContext = testContext;
      if (testContext) {
        fullContext = `\n\n## TEST BAĞLAMI\n${testContext}`;
      }

      // Call the streaming endpoint
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/digibot-stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            reportId: 'playground-test',
            sessionId: 'playground-' + Date.now(),
            message: question,
            reportContext: fullContext
          })
        }
      );

      if (!response.ok) {
        throw new Error('API error');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantId = crypto.randomUUID();

      // Add placeholder message
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const json = JSON.parse(data);
              if (json.content) {
                assistantContent += json.content;
                setMessages(prev => prev.map(m =>
                  m.id === assistantId
                    ? { ...m, content: assistantContent }
                    : m
                ));
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      const latency = Date.now() - startTime;
      const estimatedTokens = Math.round(assistantContent.length / 4);
      setTotalTokens(prev => prev + estimatedTokens);

      // Update with final data
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, tokens: estimatedTokens, latency }
          : m
      ));

    } catch (error) {
      console.error('Playground error:', error);
      toast.error('Yanıt alınamadı');
      
      // Remove placeholder on error
      setMessages(prev => prev.filter(m => m.role === 'user' || m.content));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setTotalTokens(0);
  };

  const copyConversation = async () => {
    const text = messages
      .map(m => `${m.role === 'user' ? 'Kullanıcı' : 'DigiBot'}: ${m.content}`)
      .join('\n\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Konuşma kopyalandı');
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSampleContext = (sample: typeof SAMPLE_CONTEXTS[0]) => {
    setTestContext(sample.context);
    toast.success(`${sample.name} yüklendi`);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6">
      {/* Config Panel */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col"
          >
            {/* Config Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-500 to-purple-600">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Test Ayarları
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Model Selection */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4" />
                  Model
                </label>
                <select
                  value={config.model}
                  onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {AVAILABLE_MODELS.map(m => (
                    <option key={m.id} value={m.id}>{m.name} - {m.description}</option>
                  ))}
                </select>
              </div>

              {/* Temperature */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                  <Thermometer className="w-4 h-4" />
                  Temperature: {config.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.temperature}
                  onChange={(e) => setConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Tutarlı</span>
                  <span>Yaratıcı</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                  <Hash className="w-4 h-4" />
                  Max Tokens
                </label>
                <input
                  type="number"
                  min="100"
                  max="2000"
                  value={config.maxTokens}
                  onChange={(e) => setConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Test Context */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                  <FileJson className="w-4 h-4" />
                  Test Bağlamı
                </label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {SAMPLE_CONTEXTS.map((sample, i) => (
                    <button
                      key={i}
                      onClick={() => loadSampleContext(sample)}
                      className="px-2 py-1 text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary rounded-md transition-colors"
                    >
                      {sample.name}
                    </button>
                  ))}
                </div>
                <textarea
                  value={testContext}
                  onChange={(e) => setTestContext(e.target.value)}
                  rows={6}
                  placeholder="Rapor bağlamı ekleyin..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              {/* Stats */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                <h4 className="text-xs font-medium text-slate-500 mb-3">Session İstatistikleri</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{messages.length}</p>
                    <p className="text-[10px] text-slate-500">Mesaj</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{totalTokens}</p>
                    <p className="text-[10px] text-slate-500">Token</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div className="flex-1 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">AI Playground</h2>
              <p className="text-xs text-slate-500">Promptları test et ve dene</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`p-2 rounded-lg transition-colors ${
                showConfig 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
              title="Ayarları Göster/Gizle"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={copyConversation}
              disabled={messages.length === 0}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
              title="Konuşmayı Kopyala"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-500" />
              ) : (
                <Copy className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              )}
            </button>
            <button
              onClick={clearChat}
              disabled={messages.length === 0}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
              title="Sohbeti Temizle"
            >
              <Trash2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Playground'a Hoş Geldiniz
              </h3>
              <p className="text-sm text-slate-500 max-w-md">
                DigiBot'u test etmek için bir mesaj yazın. Sol panelden model, temperature 
                ve test bağlamı ayarlayabilirsiniz.
              </p>
              <div className="flex flex-wrap gap-2 mt-6 justify-center">
                {['Merhaba, kimsin?', 'Hizmetleriniz nelerdir?', 'Fiyatlar hakkında bilgi'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:border-primary hover:text-primary transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-slate-200 dark:bg-slate-700'
                    : 'bg-gradient-to-br from-primary to-primary-dark'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  ) : (
                    <img src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotuyuk.webp" alt="DigiBot" className="w-4 h-4" />
                  )}
                </div>

                <div className={`max-w-[75%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-md shadow-sm border border-slate-100 dark:border-slate-700'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  <div className={`flex items-center gap-2 mt-1 text-[10px] text-slate-400 ${
                    msg.role === 'user' ? 'justify-end' : ''
                  }`}>
                    <Clock className="w-3 h-3" />
                    {formatTime(msg.timestamp)}
                    {msg.tokens && (
                      <>
                        <span>•</span>
                        <Zap className="w-3 h-3" />
                        {msg.tokens} token
                      </>
                    )}
                    {msg.latency && (
                      <>
                        <span>•</span>
                        {msg.latency}ms
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <img src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotuyuk.webp" alt="DigiBot" className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Bir şey yazın ve test edin..."
              className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Test Et
                </>
              )}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            Model: {config.model} • Temperature: {config.temperature} • Max: {config.maxTokens} tokens
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIPlaygroundPage;
