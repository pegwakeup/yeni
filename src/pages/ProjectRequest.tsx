import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Palette,
  LineChart,
  Zap,
  ArrowUpRight,
  ArrowLeft,
  Upload,
  Building2,
  User,
  Mail,
  Phone,
  CheckCircle,
  Info,
  X,
  Send,
  PartyPopper,
  CheckCircle as CheckCircleIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { createProjectRequest } from '../lib/api/projectRequests';
import { usePrivacyTerms } from '../components/ui/modals/privacy-terms-provider';
import { useTranslation } from '../hooks/useTranslation';

/* -----------------------------
   Adım Tipleri ve Veri Yapıları
------------------------------ */
type ServiceCategory = 'software' | 'design' | 'digital-strategy';
type ProjectDuration =
  | '1-week'
  | '1-4-weeks'
  | '1-3-months'
  | '3-6-months'
  | '6-months-plus'
  | 'undecided';
type SolutionType = 'one-time' | 'additional-support' | 'regular-service' | 'other';
type FormStep = 1 | 2 | 3 | 4 | 5;

interface FormData {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  project_description: string;
  service_categories: ServiceCategory[];
  solution_type: SolutionType;
  timeline: ProjectDuration;
  brief_url?: string;
  budget_range?: string;
}

/* -----------------------------
   Hizmet Kategorileri ve İçerik
------------------------------ */
const getServices = (t: (key: string, defaultVal?: string) => string) => ({
  software: {
    label: t('project_request.services.software.label', 'Yazılım'),
    icon: Code2,
    subServices: [
      t('project_request.services.software.web', 'Web Sitesi - Kurumsal, Statik ve E-Ticaret'),
      t('project_request.services.software.mobile', 'Mobil Uygulama'),
      t('project_request.services.software.saas', 'S.a.a.S (Software as a Service)'),
      t('project_request.services.software.ai', 'Yapay Zeka'),
    ],
  },
  design: {
    label: t('project_request.services.design.label', 'Tasarım'),
    icon: Palette,
    subServices: [
      t('project_request.services.design.ui_ux', 'Web & Mobil Uygulama UI/UX Tasarımı'),
      t('project_request.services.design.print', 'Basılı & Grafik Tasarım'),
      t('project_request.services.design.illustration', 'İllüstrasyon & Özel Grafik Çalışmaları'),
      t('project_request.services.design.branding', 'Kurumsal Kimlik & Marka Tasarımı'),
    ],
  },
  'digital-strategy': {
    label: t('project_request.services.strategy.label', 'Dijital Pazarlama ve Strateji'),
    icon: LineChart,
    subServices: [
      t('project_request.services.strategy.seo', 'SEO ve Dijital Reklam Yönetimi'),
      t('project_request.services.strategy.market_research', 'Pazar Araştırması & Marka Stratejisi'),
      t('project_request.services.strategy.content', 'İçerik Stratejisi ve Yönetimi'),
    ],
  },
});

/* -----------------------------
   Çözüm Türleri ve Zaman Çizelgesi
------------------------------ */
const getSolutionTypes = (t: (key: string, defaultVal?: string) => string) => [
  {
    id: 'one-time',
    title: t('project_request.solutions.one_time.title', 'Tek Seferlik Projeler'),
    description:
      t('project_request.solutions.one_time.desc', 'İhtiyacınızı dinliyor, uygun ekibi kuruyor ve işinizi tamamlıyoruz.'),
  },
  {
    id: 'additional-support',
    title: t('project_request.solutions.support.title', 'Ek Freelancer Desteği'),
    description:
      t('project_request.solutions.support.desc', 'Mevcut ekibinizin kapasitesini artırmak için freelancerlarımızı devreye alıyoruz.'),
  },
  {
    id: 'regular-service',
    title: t('project_request.solutions.regular.title', 'Yıllık ve Aylık Düzenli İşler'),
    description:
      t('project_request.solutions.regular.desc', 'Sürekli destek gerektiren işleriniz için düzenli hizmet paketlerimizle yanınızdayız.'),
  },
  {
    id: 'other',
    title: t('project_request.solutions.other.title', 'Farklı Bir Çözüme İhtiyacım Var'),
    description:
      t('project_request.solutions.other.desc', 'Özel ihtiyaçlarınızı bizimle paylaşın, size uygun çözümü birlikte geliştirelim.'),
  },
];

const getDurations = (t: (key: string, defaultVal?: string) => string) => [
  { id: '1-week', label: t('project_request.durations.1_week', '1 haftadan kısa sürede') },
  { id: '1-4-weeks', label: t('project_request.durations.1_4_weeks', '1 ila 4 hafta') },
  { id: '1-3-months', label: t('project_request.durations.1_3_months', '1 ila 3 ay') },
  { id: '3-6-months', label: t('project_request.durations.3_6_months', '3 ila 6 ay') },
  { id: '6-months-plus', label: t('project_request.durations.6_months_plus', '6 aydan uzun') },
  { id: 'undecided', label: t('project_request.durations.undecided', 'Daha sonra karar vereceğim') },
];

/* -----------------------------
   Başlangıç Form Verisi
------------------------------ */
const initialFormData: FormData = {
  company_name: '',
  contact_name: '',
  email: '',
  phone: '',
  project_description: '',
  service_categories: [],
  solution_type: 'one-time',
  timeline: '1-4-weeks',
};

/* -----------------------------
   İlerleyiş (Adım) Göstergesi
------------------------------ */
const FormSteps = ({ currentStep, t }: { currentStep: FormStep, t: (key: string, defaultVal?: string) => string }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between relative space-x-2">
      {/* Ana çizgi */}
      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/10 -translate-y-1/2" />
      {/* Dolu çizgi */}
      <div
        className="absolute left-0 right-0 top-1/2 h-0.5 bg-primary -translate-y-1/2 transition-all duration-300"
        style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
      />
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="relative z-10">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300 ${
              currentStep === step
                ? 'bg-primary text-white scale-110'
                : currentStep > step
                ? 'bg-primary/20 text-primary'
                : 'bg-white/10 text-gray-400'
            }`}
          >
            {step}
          </div>
          <div
            className={`absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.6rem] sm:text-sm transition-all duration-300 ${
              currentStep === step ? 'text-primary' : 'text-gray-400'
            }`}
          >
            {step === 1
              ? t('project_request.steps.services', 'Hizmet Alanları')
              : step === 2
              ? t('project_request.steps.solution', 'Çözüm Türü')
              : step === 3
              ? t('project_request.steps.timeline', 'Zaman Çizelgesi')
              : step === 4
              ? t('project_request.steps.brief', 'Açıklama & Brief')
              : t('project_request.steps.contact', 'İletişim & Onay')}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* -----------------------------
   Ana Bileşen: ProjectRequest
------------------------------ */
const ProjectRequest = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openPrivacyPolicy, openTerms } = usePrivacyTerms();

  const services = React.useMemo(() => getServices(t), [t]);
  const solutionTypes = React.useMemo(() => getSolutionTypes(t), [t]);
  const durations = React.useMemo(() => getDurations(t), [t]);

  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedSubServices, setSelectedSubServices] = useState<
    Record<ServiceCategory, string[]>
  >({
    software: [],
    design: [],
    'digital-strategy': [],
  });
  const [briefFile, setBriefFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  /* -----------------------------
     Kategori ve Alt Hizmet Seçimi
  ------------------------------ */
  const handleServiceToggle = (category: ServiceCategory) => {
    setFormData((prev) => ({
      ...prev,
      service_categories: prev.service_categories.includes(category)
        ? prev.service_categories.filter((c) => c !== category)
        : [...prev.service_categories, category],
    }));
  };

  const handleSubServiceToggle = (category: ServiceCategory, subService: string) => {
    setSelectedSubServices((prev) => ({
      ...prev,
      [category]: prev[category].includes(subService)
        ? prev[category].filter((s) => s !== subService)
        : [...prev[category], subService],
    }));
  };

  /* -----------------------------
     Brief Dosyası Yükleme
  ------------------------------ */
  const handleBriefUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError(t('project_request.error.file_size', 'Brief dosyası 8MB\'dan küçük olmalıdır.'));
      return;
    }
    setBriefFile(file);
  };

  /* -----------------------------
     Form Gönderme
  ------------------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError(t('project_request.error.terms', 'Lütfen gizlilik politikasını ve kullanım koşullarını kabul edin.'));
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Örnek dosya yükleme (URL dönüyor)
      let briefUrl = '';
      if (briefFile) {
        // TODO: Dosya yükleme işlemini implement edin
        briefUrl = 'temp-url';
      }

      await createProjectRequest({
        ...formData,
        brief_url: briefUrl || undefined,
      });
      setSuccess(true);
      triggerConfetti();
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || t('project_request.error.submission', 'Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'));
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     Başvuru Başarılı Ekranı
  ------------------------------ */
  if (success) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark flex items-center justify-center px-4">
        <div className="bg-white dark:bg-dark-light/80 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-2xl p-8 max-w-md w-full mx-auto text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] pointer-events-none bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" />
          <div className="absolute -left-20 -top-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl opacity-20 pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl opacity-20 pointer-events-none" />
          <div className="relative">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6"
            >
              <CheckCircle className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{t('project_request.success.title', 'Talebiniz Alındı!')}</h2>
            <p className="text-slate-600 dark:text-gray-400 mb-8">
              {t('project_request.success.message', 'Proje talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.')}
            </p>
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors inline-flex items-center space-x-2 shadow-lg shadow-primary/20"
            >
              <span>{t('project_request.success.home', 'Ana Sayfaya Dön')}</span>
              <ArrowUpRight className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </div>
    );
  }

  /* -----------------------------
     Formun Adım İçeriklerini 
     Ekleyen JSX
  ------------------------------ */
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        /* Adım 1: Hizmet Alanları */
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900 dark:text-white">{t('project_request.step1.title', '1. Size Hangi Alanlarda Yardımcı Olabiliriz?')}</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mb-4">
              {t('project_request.step1.subtitle', 'Önce ana alanları seçin, ardından alt alanları belirleyin.')}
            </p>
            <div className="grid gap-4">
              {Object.entries(services).map(([key, service]) => {
                const category = key as ServiceCategory;
                const Icon = service.icon;
                const isSelected = formData.service_categories.includes(category);
                return (
                  <div key={key} className="space-y-4">
                    <button
                      type="button"
                      onClick={() => handleServiceToggle(category)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-slate-50 dark:bg-dark-light/50 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium">{service.label}</span>
                      </div>
                      <CheckCircleIcon
                        className={`w-5 h-5 transition-opacity ${
                          isSelected ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </button>

                    {/* Alt hizmetler */}
                    {isSelected && (
                      <div className="grid sm:grid-cols-2 gap-3 pl-4">
                        {service.subServices.map((subService, idx) => {
                          const isSubSelected = selectedSubServices[category].includes(subService);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSubServiceToggle(category, subService)}
                              className={`px-4 py-3 rounded-xl border text-left flex items-center space-x-2 transition-colors ${
                                isSubSelected
                                  ? 'bg-primary/10 border-primary text-primary'
                                  : 'bg-slate-50 dark:bg-dark-light/50 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5'
                              }`}
                            >
                              <CheckCircleIcon
                                className={`w-4 h-4 ${isSubSelected ? 'opacity-100' : 'opacity-0'}`}
                              />
                              <span>{subService}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        );

      case 2:
        /* Adım 2: Çözüm Türü */
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{t('project_request.step2.title', '2. Hangi Çözümümüz Sizin İçin Uygun?')}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {solutionTypes.map((solution) => (
                <button
                  key={solution.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      solution_type: solution.id as SolutionType,
                    }))
                  }
                  className={`p-6 rounded-xl border text-left transition-all ${
                    formData.solution_type === solution.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-slate-50 dark:bg-dark-light/50 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      formData.solution_type === solution.id ? 'text-primary' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {solution.title}
                  </h3>
                  <p className="text-slate-500 dark:text-gray-400 text-sm">{solution.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        /* Adım 3: Zaman Çizelgesi */
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{t('project_request.step3.title', '3. Ne Kadar Sürede Projenin Tamamlanmasını İstersiniz?')}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {durations.map((duration) => (
                <button
                  key={duration.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      timeline: duration.id as ProjectDuration,
                    }))
                  }
                  className={`px-6 py-4 rounded-xl border transition-colors ${
                    formData.timeline === duration.id
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-slate-50 dark:bg-dark-light/50 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  {duration.label}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        /* Adım 4: Açıklama & Brief */
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{t('project_request.step4.title', '4. İstediğiniz Hizmetten Biraz Bahsedebilir Misiniz?')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">{t('project_request.step4.description_label', 'Proje Açıklaması')}</label>
                <textarea
                  value={formData.project_description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      project_description: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-50 dark:bg-dark-light/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary min-h-[120px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500"
                  placeholder={t('project_request.step4.description_placeholder', 'Projenizi kısaca anlatın...')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">{t('project_request.step4.brief_label', 'Brief Belgesi (Opsiyonel)')}</label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleBriefUpload}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="brief-file"
                  />
                  <label
                    htmlFor="brief-file"
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-slate-50 dark:bg-dark-light/50 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-slate-600 dark:text-gray-300"
                  >
                    <Upload className="w-5 h-5" />
                    <span>{briefFile ? briefFile.name : t('project_request.step4.brief_placeholder', 'Brief Belgesi Yükle (PDF, Word)')}</span>
                  </label>
                  {briefFile && (
                    <button
                      type="button"
                      onClick={() => setBriefFile(null)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-500 dark:text-gray-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">{t('project_request.step4.file_size_limit', 'Maksimum dosya boyutu: 8MB')}</p>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        /* Adım 5: İletişim & Onay */
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{t('project_request.step5.title', '5. İletişim Bilgileri')}</h2>
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">{t('project_request.step5.company_label', 'Şirket Adı')}</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-400" />
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, company_name: e.target.value }))
                    }
                    className="w-full bg-slate-50 dark:bg-dark-light/50 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500"
                    placeholder={t('project_request.step5.company_placeholder', 'Şirketinizin adı')}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">{t('project_request.step5.contact_label', 'İletişim Kişisi')}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-400" />
                  <input
                    type="text"
                    value={formData.contact_name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, contact_name: e.target.value }))
                    }
                    className="w-full bg-slate-50 dark:bg-dark-light/50 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500"
                    placeholder={t('project_request.step5.contact_placeholder', 'Adınız ve soyadınız')}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">{t('project_request.step5.email_label', 'E-posta')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full bg-slate-50 dark:bg-dark-light/50 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500"
                    placeholder={t('project_request.step5.email_placeholder', 'E-posta adresiniz')}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">{t('project_request.step5.phone_label', 'Telefon')}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full bg-slate-50 dark:bg-dark-light/50 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500"
                    placeholder="+90 555 555 5555"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-start space-x-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  <button
                    type="button"
                    onClick={openPrivacyPolicy}
                    className="text-primary hover:text-primary-light underline"
                  >
                    {t('project_request.step5.privacy', 'Gizlilik Politikası')}
                  </button>
                  {' '}{t('project_request.step5.and', 've')}{' '}
                  <button
                    type="button"
                    onClick={openTerms}
                    className="text-primary hover:text-primary-light underline"
                  >
                    {t('project_request.step5.terms', 'Kullanım Koşulları')}
                  </button>
                  {' '}{t('project_request.step5.accept', 'nı okudum ve kabul ediyorum.')}
                </span>
              </label>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  /* -----------------------------
     Ana Render
  ------------------------------ */
  return (
    <div className="min-h-screen bg-white dark:bg-dark relative overflow-hidden">
      {/* Sabit Kare Arka Plan Deseni */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Sol Taraf: Hero & Bilgi */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-slate-500 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('project_request.back_home', 'Ana Sayfaya Dön')}</span>
            </button>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Zap className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{t('project_request.hero.badge', 'Proje Teklifi')}</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
                {t('project_request.hero.title_prefix', 'Projenizi')} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">{t('project_request.hero.title_highlight', 'Hayata Geçirelim')}</span>
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-gray-300 mb-8 leading-relaxed">
                {t('project_request.hero.description', 'Hayalinizdeki projeyi gerçeğe dönüştürmek için ilk adımı atın. Size özel çözümler ve profesyonel ekibimizle yanınızdayız.')}
              </p>

              {/* İlerleyiş Göstergesi - Sol Tarafta */}
              <div className="hidden lg:block">
                <div className="space-y-6 relative">
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-white/10" />
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className="relative flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 relative z-10 ${
                          currentStep === step
                            ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/25'
                            : currentStep > step
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-gray-500 border border-slate-200 dark:border-white/10'
                        }`}
                      >
                        {currentStep > step ? <CheckCircleIcon className="w-5 h-5" /> : step}
                      </div>
                      <div className={`text-sm font-medium transition-colors ${
                        currentStep === step 
                          ? 'text-primary' 
                          : currentStep > step 
                          ? 'text-slate-900 dark:text-white' 
                          : 'text-slate-400 dark:text-gray-500'
                      }`}>
                        {step === 1 ? t('project_request.steps.services', 'Hizmet Alanları') :
                         step === 2 ? t('project_request.steps.solution', 'Çözüm Türü') :
                         step === 3 ? t('project_request.steps.timeline', 'Zaman Çizelgesi') :
                         step === 4 ? t('project_request.steps.brief', 'Açıklama & Brief') :
                         t('project_request.steps.contact', 'İletişim & Onay')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sağ Taraf: Form */}
          <div className="lg:col-span-7">
            {/* Mobil Stepper */}
            <div className="lg:hidden mb-8">
              <FormSteps currentStep={currentStep} t={t} />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-dark-light/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl"
            >
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 flex items-center space-x-2">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {renderStepContent()}

                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => (prev - 1) as FormStep)}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-colors font-medium ${
                      currentStep === 1 
                        ? 'opacity-0 pointer-events-none' 
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t('project_request.nav.back', 'Geri')}</span>
                  </button>

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => (prev + 1) as FormStep)}
                      className="flex items-center space-x-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 font-medium"
                    >
                      <span>{t('project_request.nav.next', 'İleri')}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading || !acceptedTerms}
                      className="flex items-center space-x-2 px-8 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{t('project_request.nav.sending', 'Gönderiliyor...')}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{t('project_request.nav.submit', 'Teklif Al')}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -----------------------------
   Konfeti Efekti
------------------------------ */
function triggerConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 1000,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

export default ProjectRequest;
