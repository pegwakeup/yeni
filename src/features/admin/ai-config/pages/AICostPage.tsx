import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Settings,
  Save,
  Loader2,
  RefreshCw,
  PieChart,
  BarChart3,
  Zap,
  Brain,
  Info
} from 'lucide-react';
import { supabase } from '../../../../lib/config/supabase';
import { toast } from 'sonner';

// OpenAI Pricing ($ per 1M tokens) - December 2024
const MODEL_PRICING: Record<string, { input: number; output: number; name: string }> = {
  'gpt-4o': { input: 2.50, output: 10.00, name: 'GPT-4o' },
  'gpt-4o-mini': { input: 0.15, output: 0.60, name: 'GPT-4o Mini' },
  'gpt-4-turbo': { input: 10.00, output: 30.00, name: 'GPT-4 Turbo' },
  'gpt-3.5-turbo': { input: 0.50, output: 1.50, name: 'GPT-3.5 Turbo' },
};

interface UsageStats {
  totalTokens: number;
  totalCost: number;
  dailyUsage: { date: string; tokens: number; cost: number }[];
  modelBreakdown: { model: string; tokens: number; cost: number; percentage: number }[];
}

interface BudgetConfig {
  monthlyBudget: number;
  alertThreshold: number;
  autoDisable: boolean;
}

const AICostPage: React.FC = () => {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig>({
    monthlyBudget: 50,
    alertThreshold: 80,
    autoDisable: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'month'>('30d');
  const [currentModel, setCurrentModel] = useState('gpt-4o-mini');

  useEffect(() => {
    fetchUsageStats();
    fetchBudgetConfig();
  }, [dateRange]);

  const fetchUsageStats = async () => {
    setIsLoading(true);
    try {
      let startDate = new Date();
      if (dateRange === '7d') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (dateRange === '30d') {
        startDate.setDate(startDate.getDate() - 30);
      } else {
        // Current month
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      }

      const { data, error } = await supabase
        .from('report_chat_conversations')
        .select('tokens_used, created_at, role')
        .gte('created_at', startDate.toISOString())
        .neq('role', 'system');

      if (error) throw error;

      // Calculate totals
      const totalTokens = data?.reduce((sum, d) => sum + (d.tokens_used || 0), 0) || 0;
      
      // Assume 50/50 input/output split for cost calculation
      const inputTokens = totalTokens * 0.4;
      const outputTokens = totalTokens * 0.6;
      const pricing = MODEL_PRICING[currentModel];
      const totalCost = (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;

      // Daily breakdown
      const dailyMap: Record<string, { tokens: number }> = {};
      const daysCount = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : new Date().getDate();
      
      for (let i = 0; i < daysCount; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dailyMap[dateStr] = { tokens: 0 };
      }

      data?.forEach(d => {
        const dateStr = d.created_at.split('T')[0];
        if (dailyMap[dateStr]) {
          dailyMap[dateStr].tokens += d.tokens_used || 0;
        }
      });

      const dailyUsage = Object.entries(dailyMap)
        .map(([date, data]) => {
          const tokens = data.tokens;
          const inputT = tokens * 0.4;
          const outputT = tokens * 0.6;
          const cost = (inputT * pricing.input + outputT * pricing.output) / 1_000_000;
          return { date, tokens, cost };
        })
        .sort((a, b) => a.date.localeCompare(b.date));

      // Model breakdown (simulated - in real app, track model per message)
      const modelBreakdown = Object.entries(MODEL_PRICING).map(([model, info]) => {
        const isActive = model === currentModel;
        const tokens = isActive ? totalTokens : 0;
        const inputT = tokens * 0.4;
        const outputT = tokens * 0.6;
        const cost = (inputT * info.input + outputT * info.output) / 1_000_000;
        return {
          model: info.name,
          tokens,
          cost,
          percentage: isActive ? 100 : 0
        };
      }).filter(m => m.tokens > 0);

      setUsageStats({
        totalTokens,
        totalCost,
        dailyUsage,
        modelBreakdown
      });

      // Get current model from config
      const { data: config } = await supabase
        .from('digibot_config')
        .select('model')
        .eq('config_key', 'default')
        .single();
      
      if (config?.model) {
        setCurrentModel(config.model);
      }

    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Veriler yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBudgetConfig = async () => {
    try {
      const { data } = await supabase
        .from('ai_budget_config')
        .select('*')
        .single();
      
      if (data) {
        setBudgetConfig({
          monthlyBudget: data.monthly_budget_usd || 50,
          alertThreshold: data.alert_threshold_percent || 80,
          autoDisable: data.auto_disable_on_exceed || false
        });
      }
    } catch (error) {
      // Table may not exist yet
      console.log('Budget config not found');
    }
  };

  const saveBudgetConfig = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('ai_budget_config')
        .upsert({
          id: '1',
          monthly_budget_usd: budgetConfig.monthlyBudget,
          alert_threshold_percent: budgetConfig.alertThreshold,
          auto_disable_on_exceed: budgetConfig.autoDisable,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Bütçe ayarları kaydedildi');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Kaydetme başarısız');
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(amount);
  };

  const budgetPercentage = usageStats 
    ? Math.min((usageStats.totalCost / budgetConfig.monthlyBudget) * 100, 100)
    : 0;

  const getBudgetStatus = () => {
    if (budgetPercentage >= 100) return { color: 'red', text: 'Bütçe Aşıldı', icon: AlertTriangle };
    if (budgetPercentage >= budgetConfig.alertThreshold) return { color: 'amber', text: 'Uyarı Eşiğinde', icon: AlertTriangle };
    return { color: 'emerald', text: 'Normal', icon: CheckCircle };
  };

  const status = getBudgetStatus();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            Kullanım & Maliyet
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            AI kullanım istatistikleri ve maliyet takibi
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            {(['7d', '30d', 'month'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  dateRange === range
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {range === '7d' ? '7 Gün' : range === '30d' ? '30 Gün' : 'Bu Ay'}
              </button>
            ))}
          </div>
          <button
            onClick={fetchUsageStats}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Progress Card */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white">Aylık Bütçe Durumu</h3>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
              status.color === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
              status.color === 'amber' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
              'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            }`}>
              <status.icon className="w-3.5 h-3.5" />
              {status.text}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600 dark:text-slate-400">Kullanılan</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {formatCurrency(usageStats?.totalCost || 0)} / {formatCurrency(budgetConfig.monthlyBudget)}
              </span>
            </div>
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${budgetPercentage}%` }}
                className={`h-full rounded-full ${
                  status.color === 'red' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                  status.color === 'amber' ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                  'bg-gradient-to-r from-emerald-500 to-emerald-600'
                }`}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>%{budgetPercentage.toFixed(1)}</span>
              <span>Uyarı: %{budgetConfig.alertThreshold}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {(usageStats?.totalTokens || 0).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">Toplam Token</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(usageStats?.totalCost || 0)}
              </p>
              <p className="text-xs text-slate-500">Toplam Maliyet</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(budgetConfig.monthlyBudget - (usageStats?.totalCost || 0))}
              </p>
              <p className="text-xs text-slate-500">Kalan Bütçe</p>
            </div>
          </div>
        </div>

        {/* Budget Settings */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Bütçe Ayarları</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">
                Aylık Bütçe ($)
              </label>
              <input
                type="number"
                min="1"
                value={budgetConfig.monthlyBudget}
                onChange={(e) => setBudgetConfig(prev => ({ ...prev, monthlyBudget: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">
                Uyarı Eşiği (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={budgetConfig.alertThreshold}
                onChange={(e) => setBudgetConfig(prev => ({ ...prev, alertThreshold: parseInt(e.target.value) || 80 }))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Otomatik Durdur</p>
                <p className="text-xs text-slate-500">Bütçe aşıldığında AI'ı durdur</p>
              </div>
              <button
                onClick={() => setBudgetConfig(prev => ({ ...prev, autoDisable: !prev.autoDisable }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  budgetConfig.autoDisable ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <motion.div
                  animate={{ x: budgetConfig.autoDisable ? 20 : 0 }}
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>

            <button
              onClick={saveBudgetConfig}
              disabled={isSaving}
              className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Kaydet
            </button>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Cost Chart */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Günlük Maliyet</h3>
              <p className="text-xs text-slate-500">Son {dateRange === '7d' ? '7' : dateRange === '30d' ? '30' : ''} gün</p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="h-48 flex items-end gap-1">
            {usageStats?.dailyUsage.slice(-14).map((day, i) => {
              const maxCost = Math.max(...(usageStats?.dailyUsage.map(d => d.cost) || [0.001]));
              const height = maxCost > 0 ? (day.cost / maxCost) * 100 : 0;
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 2)}%` }}
                    transition={{ delay: i * 0.03 }}
                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-sm cursor-pointer hover:from-emerald-600 hover:to-emerald-500 transition-colors"
                    title={`${day.date}: ${formatCurrency(day.cost)}`}
                  />
                  <span className="text-[8px] text-slate-400">
                    {new Date(day.date).getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Model Pricing Reference */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Model Fiyatlandırması</h3>
              <p className="text-xs text-slate-500">OpenAI fiyatları (1M token başına)</p>
            </div>
            <Brain className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-3">
            {Object.entries(MODEL_PRICING).map(([id, info]) => (
              <div
                key={id}
                className={`p-3 rounded-xl border-2 transition-colors ${
                  currentModel === id
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent bg-slate-50 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {currentModel === id && (
                      <span className="w-2 h-2 bg-primary rounded-full" />
                    )}
                    <span className="font-medium text-slate-900 dark:text-white">{info.name}</span>
                    {currentModel === id && (
                      <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">Aktif</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                  <span>Input: ${info.input.toFixed(2)}</span>
                  <span>Output: ${info.output.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                GPT-4o-mini en ekonomik seçenektir. Çoğu kullanım senaryosu için yeterlidir.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Projection */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Aylık Maliyet Tahmini</h3>
            <p className="text-sm text-slate-400">Mevcut kullanım hızına göre</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">
              {formatCurrency((usageStats?.totalCost || 0) * (30 / (dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : new Date().getDate())))}
            </p>
            <p className="text-sm text-slate-400">tahmini aylık</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
          <div>
            <p className="text-slate-400 text-xs">Günlük Ortalama</p>
            <p className="text-lg font-semibold">
              {formatCurrency((usageStats?.totalCost || 0) / (dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : new Date().getDate()))}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">Token/Gün</p>
            <p className="text-lg font-semibold">
              {Math.round((usageStats?.totalTokens || 0) / (dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : new Date().getDate())).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">Maliyet/1K Token</p>
            <p className="text-lg font-semibold">
              {formatCurrency(((usageStats?.totalCost || 0) / Math.max(usageStats?.totalTokens || 1, 1)) * 1000)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICostPage;
