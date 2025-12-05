import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Mail, Phone, MapPin, Send,
  MessageSquare, ExternalLink, Sparkles, Loader2, CheckCircle, AlertCircle
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useRecaptcha } from '../hooks/useRecaptcha';
import { submitContactForm } from '../lib/api/contact';
import { trackFormSubmission } from '../lib/analytics';
import { trackContact, trackFormSubmit, trackLead } from '../lib/gtm';

const Contact = () => {
  const { t } = useTranslation();
  const { validateSubmission, isLoaded: recaptchaLoaded } = useRecaptcha();
  
  // SEO meta data
  const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'tr';
  const seoTitle = currentLang === 'tr' 
    ? 'İletişim | Unilancer - Bize Ulaşın, Projenizi Hayata Geçirelim'
    : 'Contact | Unilancer - Get in Touch, Let\'s Bring Your Project to Life';
  const seoDescription = currentLang === 'tr'
    ? 'Unilancer ile iletişime geçin. Proje talepleriniz, iş birlikleri ve sorularınız için bize ulaşın. İstanbul, Beyoğlu - Cube. Tel: +90 506 152 32 55'
    : 'Contact Unilancer. Reach out for project requests, collaborations, and inquiries. Istanbul, Beyoğlu - Cube. Tel: +90 506 152 32 55';
  const canonicalUrl = `https://unilancerlabs.com/${currentLang}/iletisim`;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    
    try {
      // Validate with reCAPTCHA (permissive - allows submission on any error)
      const recaptchaResult = await validateSubmission('contact_form', 0.3);
      
      if (!recaptchaResult.valid) {
        setErrorMessage(recaptchaResult.error || t('contact.error.spam_detected', 'Spam algılandı. Lütfen tekrar deneyin.'));
        setSubmitStatus('error');
        trackFormSubmission('contact', false);
        setIsSubmitting(false);
        return;
      }
      
      // Submit form
      const result = await submitContactForm({
        ...formData,
        recaptcha_score: recaptchaResult.score,
      });
      
      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        trackFormSubmission('contact', true);
        
        // GTM DataLayer: Track for Meta Pixel & Google Ads
        trackFormSubmit('contact_form', 'Contact Form', true);
        trackContact('form');
        trackLead('contact', { lead_type: 'contact_inquiry' });
      } else {
        setErrorMessage(result.error || t('contact.error.generic', 'Bir hata oluştu. Lütfen tekrar deneyin.'));
        setSubmitStatus('error');
        trackFormSubmission('contact', false);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage(t('contact.error.generic', 'Bir hata oluştu. Lütfen tekrar deneyin.'));
      setSubmitStatus('error');
      trackFormSubmission('contact', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{seoTitle}</title>
        <meta name="title" content={seoTitle} />
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="iletişim, contact, unilancer, proje talebi, iş birliği, İstanbul, Beyoğlu, dijital ajans" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Language alternates */}
        <link rel="alternate" hrefLang="tr" href="https://unilancerlabs.com/tr/iletisim" />
        <link rel="alternate" hrefLang="en" href="https://unilancerlabs.com/en/contact" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content="https://unilancerlabs.com/og-contact.jpg" />
        <meta property="og:site_name" content="Unilancer" />
        <meta property="og:locale" content={currentLang === 'tr' ? 'tr_TR' : 'en_US'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content="https://unilancerlabs.com/og-contact.jpg" />
        
        {/* ContactPage Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": seoTitle,
            "description": seoDescription,
            "url": canonicalUrl,
            "mainEntity": {
              "@type": "LocalBusiness",
              "name": "Unilancer",
              "description": seoDescription,
              "url": "https://unilancerlabs.com",
              "logo": "https://unilancerlabs.com/logo.png",
              "image": "https://unilancerlabs.com/og-image.jpg",
              "telephone": "+90-506-152-32-55",
              "email": "info@unilancerlabs.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Şehit Muhtar, Mis Sk. No:24",
                "addressLocality": "Beyoğlu",
                "addressRegion": "İstanbul",
                "postalCode": "34435",
                "addressCountry": "TR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "41.03473",
                "longitude": "28.97772"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
              },
              "priceRange": "$$"
            }
          })}
        </script>
        
        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": currentLang === 'tr' ? "Ana Sayfa" : "Home",
                "item": `https://unilancerlabs.com/${currentLang}`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": currentLang === 'tr' ? "İletişim" : "Contact",
                "item": canonicalUrl
              }
            ]
          })}
        </script>
      </Helmet>

    <div className="min-h-screen bg-white dark:bg-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xl md:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('contact.sorularınız_proje_talepleriniz', 'Sorularınız, proje talepleriniz veya iş birlikleri için bizimle iletişime geçin. Ekibimiz en kısa sürede size dönüş yapacaktır.')}
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-white/10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">{t('contact.mesaj_gönderin', 'Mesaj Gönderin')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                      {t('contact.form.name')}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                      placeholder={t('contact.placeholder.name', 'Adınız Soyadınız')}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                      {t('contact.form.email')}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                      placeholder={t('contact.placeholder.email', 'ornek@sirket.com')}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                    {t('contact.form.subject')}
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                    placeholder={t('contact.placeholder.subject', 'Proje, İş Birliği vb.')}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={6}
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
                    placeholder={t('contact.placeholder.message', 'Size nasıl yardımcı olabiliriz?')}
                    required
                  />
                </div>
                
                <div className="pt-4">
                  {/* Success Message */}
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <p className="text-green-700 dark:text-green-400 text-sm">
                        {t('contact.success', 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.')}
                      </p>
                    </motion.div>
                  )}
                  
                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 dark:text-red-400 text-sm">{errorMessage}</p>
                    </motion.div>
                  )}
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                    className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center justify-center space-x-2 font-semibold text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{t('contact.form.sending', 'Gönderiliyor...')}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>{t('contact.form.submit')}</span>
                      </>
                    )}
                  </motion.button>
                  
                  {/* reCAPTCHA Badge Notice */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
                    {t('contact.recaptcha_notice', 'Bu site reCAPTCHA tarafından korunmaktadır.')}
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
          
          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Info Cards */}
            <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-8 border border-slate-200 dark:border-white/10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('contact.info.title', 'İletişim Bilgileri')}</h3>
              <div className="space-y-6">
                <a 
                  href="mailto:info@unilancerlabs.com"
                  className="flex items-start space-x-4 group p-4 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/5"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('contact.info.email')}</h4>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">info@unilancerlabs.com</p>
                  </div>
                </a>
                
                <a 
                  href="tel:+905061523255"
                  className="flex items-start space-x-4 group p-4 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/5"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('contact.info.phone')}</h4>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">+90 506 152 32 55</p>
                  </div>
                </a>

                <div className="flex items-start space-x-4 p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('contact.info.address')}</h4>
                    <p className="text-base text-slate-900 dark:text-white leading-relaxed">
                      Şehit Muhtar, Mis Sk. No:24<br />
                      34435 Beyoğlu/İstanbul<br />
                      Cube Beyoğlu
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10">
                <motion.a
                  href="https://wa.me/+905061523255"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white px-6 py-4 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-green-500/20"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-semibold">{t('contact.whatsapp', "WhatsApp'tan Yazın")}</span>
                  <ExternalLink className="w-5 h-5 opacity-80" />
                </motion.a>
                
                {/* Social Media Links */}
                <div className="mt-6 flex items-center justify-center gap-4">
                  <a
                    href="https://www.instagram.com/unilancerlabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white hover:scale-110 transition-transform shadow-lg"
                    aria-label="Instagram"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/unilancer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#0A66C2] text-white hover:scale-110 transition-transform shadow-lg"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a
                    href="https://www.tiktok.com/@unilancerlabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-black dark:bg-white dark:text-black text-white hover:scale-110 transition-transform shadow-lg"
                    aria-label="TikTok"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                  </a>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Full Width Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 h-[400px] relative group">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.3663197525847!2d28.97772937668711!3d41.03473017134433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9e7a7777c43%3A0x4c76cf3c5e80d90f!2sCube%20Beyo%C4%9Flu!5e0!3m2!1str!2str!4v1707997561783!5m2!1str!2str"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="transition-all duration-500"
            />
            <a 
              href="https://maps.app.goo.gl/8KiKNLnQzxPD6DSBA"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-6 right-6 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg flex items-center gap-2 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              {t('contact.get_directions', 'Yol Tarifi Al')}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
};

export default Contact;