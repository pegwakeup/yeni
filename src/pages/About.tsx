import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Target, Eye, Sparkles } from 'lucide-react';
import TeamSection from '../components/ui/TeamSection';
import { useTranslation } from '../hooks/useTranslation';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-white dark:bg-dark overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
              <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-60 scale-105"
              >
                <source src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/IMG_3968%20(2)%20(1).mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/70 dark:from-dark/50 dark:via-dark/30 dark:to-dark/50" />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full py-24 md:pb-32 lg:pb-36 lg:pt-32">
              <div className="mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left"
                  >
                      <h1 className="mt-8 max-w-2xl text-balance text-5xl md:text-6xl lg:mt-16 xl:text-7xl font-bold tracking-tight text-gray-900 dark:text-white drop-shadow-sm">
                          {t('about.hero.title_prefix', 'Unilancer ile')} <br/>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">{t('about.hero.title_suffix', 'Geleceği İnşa Edin')}</span>
                      </h1>
                      <p className="mt-8 max-w-2xl text-balance text-lg text-gray-700 dark:text-gray-200 font-medium">
                          {t('about.hero.description', "Türkiye'nin en yetenekli üniversite öğrencileri ve mezunları ile işletmeleri buluşturan yeni nesil iş platformu.")}
                      </p>

                      <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                          <Button asChild size="lg" className="h-14 rounded-full pl-8 pr-6 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105">
                              <Link to="/tr/iletisim">
                                  <span className="text-nowrap">{t('about.hero.contact_button', 'İletişime Geç')}</span>
                                  <ChevronRight className="ml-2 w-5 h-5" />
                              </Link>
                          </Button>
                          <Button asChild size="lg" variant="outline" className="h-14 rounded-full px-8 text-lg border-2 hover:bg-zinc-50 dark:hover:bg-white/5 backdrop-blur-sm bg-white/30 dark:bg-black/30">
                              <Link to="/tr/portfolyo">
                                  <span className="text-nowrap">{t('about.hero.portfolio_button', 'Projelerimizi İncele')}</span>
                              </Link>
                          </Button>
                      </div>
                  </motion.div>
              </div>
          </div>
      </section>

      {/* WHO WE ARE SECTION */}
      <section className="relative py-32 bg-white dark:bg-dark overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                <span>{t('about.story.badge', 'Hikayemiz')}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900 dark:text-white leading-tight">
                {t('about.story.title', 'Biz Kimiz?')}
              </h2>
              <div className="space-y-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  {t('about.story.p1_part1', "Unilancer, Türkiye'nin en parlak genç yeteneklerini, vizyoner işletmelerle buluşturan")} <span className="font-semibold text-primary">{t('about.story.p1_highlight', 'dinamik bir ekosistemdir')}</span>. {t('about.story.p1_part2', 'Geleneksel freelance platformlarının ötesine geçerek, sürdürülebilir iş birlikleri ve kaliteli projeler üretmeyi hedefliyoruz.')}
                </p>
                <p>
                  {t('about.story.p2_part1', 'Teknolojiye, inovasyona ve gençlerin potansiyeline inanıyoruz. Her projenin arkasında, tutkuyla çalışan ve sürekli kendini geliştiren bir ekip var. Biz sadece iş yapmıyoruz,')} <span className="font-semibold text-primary">{t('about.story.p2_highlight', 'geleceği birlikte tasarlıyoruz')}</span>.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-[2rem] transform rotate-3 scale-105 blur-lg" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 aspect-[4/3] group">
                <img 
                  src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/ekiparkaplan.webp" 
                  alt={t('about.team_image_alt', 'Unilancer Team')}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <p className="text-sm font-medium uppercase tracking-wider opacity-80 mb-2">{t('about.image_caption.family', 'Unilancer Ailesi')}</p>
                  <p className="text-xl font-bold">{t('about.image_caption.stronger', 'Birlikte Daha Güçlüyüz')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VISION & MISSION SECTION */}
      <section className="py-32 bg-slate-50 dark:bg-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group bg-white dark:bg-dark p-10 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] transition-colors group-hover:bg-primary/10" />
              
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white group-hover:text-primary transition-colors">{t('about.vision.title', 'Vizyonumuz')}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('about.vision.description', "Türkiye'den dünyaya açılan, genç yeteneklerin potansiyelini en üst düzeye çıkaran ve dijital dönüşümde öncü rol oynayan global bir teknoloji ve yetenek merkezi olmak.")}
              </p>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10 }}
              className="group bg-white dark:bg-dark p-10 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-[4rem] transition-colors group-hover:bg-purple-500/10" />

              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              
              <h3 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">{t('about.mission.title', 'Misyonumuz')}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('about.mission.description', 'İşletmelere yenilikçi ve kaliteli dijital çözümler sunarken, üniversite öğrencilerine gerçek proje deneyimi kazandırarak kariyer yolculuklarında onlara rehberlik etmek ve ekonomik özgürlük sağlamak.')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <div className="bg-slate-50 dark:bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>{t('about.leadership.badge', 'Liderlik Ekibi')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              {t('about.leadership.title', "Unilancer'ı Yönlendirenler")}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {t('about.leadership.description', 'Vizyonumuzun arkasındaki deneyimli liderler ve yenilikçi düşünürler')}
            </p>
          </motion.div>
          
          <TeamSection limit={4} />
          
          <div className="flex justify-center mt-12">
            <Button asChild size="lg" className="h-14 rounded-full px-10 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Link to="/tr/ekibimiz">
                {t('about.view_all_team', 'Tüm Ekibi Gör')} <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
