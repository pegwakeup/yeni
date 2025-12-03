import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { memo } from 'react';

// Target Decoration
const TargetDecoration = memo(() => (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="text-slate-200 dark:text-slate-800">
        <circle cx="100" cy="100" r="99" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="25" stroke="currentColor" strokeWidth="1" />
    </svg>
));

// Spiral Arrow
const SpiralArrow = memo(() => (
    <svg width="300" height="150" viewBox="0 0 300 150" fill="none" className="text-slate-900 dark:text-white">
        <path 
            d="M50 100 C 50 100, 80 140, 130 120 C 170 100, 150 50, 110 60 C 80 70, 80 110, 110 120 C 150 140, 210 100, 250 80" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            fill="none"
        />
        <path 
            d="M240 75 L 250 80 L 242 88" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
    </svg>
));

const MemberCard = memo(({ member, index }: { member: { name: string; role: string; avatar: string; linkedin?: string }; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="group flex flex-col"
    >
        <div className="relative w-full aspect-[3/4] mb-4 overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-sm">
            <img
                src={member.avatar}
                alt={member.name}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                loading="lazy"
            />
            {member.linkedin && (
                <a 
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 p-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                >
                    <Linkedin size={18} />
                </a>
            )}
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
            {member.name}
        </h3>
        <p className="text-sm font-medium text-primary dark:text-primary/90">
            {member.role}
        </p>
    </motion.div>
));

export default function TeamSection({ limit }: { limit?: number }) {
    const { t } = useTranslation();

    const members = [
        // Co-Founders
        {
            name: 'Emrah Er',
            role: 'CEO & Kurucu Ortak',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400',
            linkedin: 'https://www.linkedin.com/in/emrah-er-550b52228/',
        },
        {
            name: 'Taha Karahüseyinoğlu',
            role: 'COO & Kurucu Ortak',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400',
            linkedin: 'https://www.linkedin.com/in/taha-karahüseyinoğlu-324924214/',
        },
        {
            name: 'Koray Andırınlı',
            role: 'Program Yöneticisi & Kurucu Ortak',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400',
            linkedin: 'https://www.linkedin.com/in/koray-a-9aaa6822a/',
        },
        {
            name: 'Selvinaz Deniz Koca',
            role: 'CMO',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
            linkedin: 'https://www.linkedin.com/in/selvinaz-deniz-koca/',
        },
        // Team Members
        {
            name: 'Berna Kalyon',
            role: 'Moda ve Grafik Tasarımcı',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654982?auto=format&fit=crop&q=80&w=400&h=400',
            linkedin: 'https://www.linkedin.com/in/berna-kalyon-120bb6386/',
        },
        {
            name: 'Deniz Aytekin',
            role: 'İçerik ve İletişim Uzmanı',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
            linkedin: 'https://www.linkedin.com/in/deniz-aytekin-283469216/',
        },
        {
            name: 'Dudunur Özdamar',
            role: 'İş Geliştirme Uzmanı',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
            linkedin: 'https://www.linkedin.com/in/dudunur-özdamar-6348a122b/',
        },
        {
            name: 'Muhammed Berkhan Karlık',
            role: 'Satış Sorumlusu',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400',
            linkedin: 'https://www.linkedin.com/in/muhammed-berkhan-karlık-191079327/',
        },
        {
            name: 'Muhammed Sergen Çetintürk',
            role: 'Web Geliştirici',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=400',
            linkedin: 'https://www.linkedin.com/in/sergen-cetinturk-a774b136a/',
        },
        {
            name: 'Ömer Çetin',
            role: 'Yapay Zeka ve Otomasyon Mühendisi',
            avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400&h=400',
            linkedin: 'https://www.linkedin.com/in/ömer-çetin-77a864240/',
        },
        {
            name: 'Rabia Fidan',
            role: 'Web Geliştirici',
            avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400&h=400',
            linkedin: 'https://www.linkedin.com/in/rabia-fidan-695a3a275/',
        },
        {
            name: 'Salih Cesur',
            role: 'Web Geliştirici',
            avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400&h=400',
            linkedin: 'https://www.linkedin.com/in/salih-cesur-461a14332/',
        },
        {
            name: 'Tanya Polat',
            role: 'Yapay Zeka ve Otomasyon Geliştirici',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400&h=400',
            linkedin: 'https://www.linkedin.com/in/tanya-polat-546a53321/',
        },
        {
            name: 'Yusuf Pehlivan',
            role: 'Sosyal Medya Uzmanı',
            avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&q=80&w=400&h=400',
            linkedin: 'https://www.linkedin.com/in/ypehlivan/',
        },
    ];

    const displayedMembers = limit ? members.slice(0, limit) : members;

    return (
        <section className="py-12 md:py-20 bg-white dark:bg-dark relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                
                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-center">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight mb-6">
                            {t('team.title_new', 'Yaratıcılar,')} <span className="text-primary">{t('team.creators', 'tasarımcılar')}</span> {t('team.and', 've dünya standartlarında')} <span className="text-primary">{t('team.problem_solvers', 'çözüm ortaklarından')}</span> {t('team.meet', 'oluşan ekibimizle tanışın')}
                        </h2>
                        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                            {t('team.description_new', 'Müşterilerimizin hayal ettiği şirket olmak için, tutkulu profesyonellerden oluşan')} <span className="font-medium text-slate-900 dark:text-white">{t('team.eclectic_group', 'eklektik bir grup')}</span> {t('team.of_passionate', 'gerekir. Unilancer\'a')} <span className="font-medium text-slate-900 dark:text-white">{t('team.leading_way', 'yön veren')}</span> {t('team.at_unilancer', 'insanları yakından tanıyın.')}
                        </p>
                    </div>

                    <div className="hidden lg:flex justify-end items-center relative">
                         <div className="relative w-64 h-40">
                            <div className="absolute right-0 top-0">
                                <TargetDecoration />
                            </div>
                            <div className="absolute right-12 top-8">
                                <SpiralArrow />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {displayedMembers.map((member, index) => (
                        <MemberCard key={member.name} member={member} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
