import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail, Sparkles } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export default function TeamSection({ limit }: { limit?: number }) {
    const { t } = useTranslation();

    const members = [
        {
            name: 'Taha Arslan',
            role: t('team.roles.ceo', 'Kurucu & CEO'),
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800&h=1000',
            link: '#',
        },
        {
            name: 'Elif Yılmaz',
            role: t('team.roles.cto', 'Kurucu Ortak & CTO'),
            avatar: 'https://images.unsplash.com/photo-1573496359-136d47552640?auto=format&fit=crop&q=80&w=800&h=1000',
            link: '#',
        },
        {
            name: 'Burak Demir',
            role: t('team.roles.coo', 'Operasyon Direktörü'),
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800&h=1000',
            link: '#',
        },
        {
            name: 'Ayşe Kaya',
            role: t('team.roles.marketing', 'Pazarlama Müdürü'),
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800&h=1000',
            link: '#',
        },
        {
            name: 'Can Yıldız',
            role: t('team.roles.product', 'Ürün Yöneticisi'),
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800&h=1000',
            link: '#',
        },
        {
            name: 'Zeynep Çelik',
            role: t('team.roles.creative', 'Kreatif Direktör'),
            avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800&h=1000',
            link: '#',
        },
        {
            name: 'Mert Öztürk',
            role: t('team.roles.developer', 'Yazılım Geliştirici'),
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800&h=1000',
            link: '#',
        },
        {
            name: 'Selin Aksoy',
            role: t('team.roles.hr', 'İnsan Kaynakları'),
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800&h=1000',
            link: '#',
        },
    ];

    const displayedMembers = limit ? members.slice(0, limit) : members;

    return (
        <section className="py-20 md:py-28 bg-white dark:bg-dark relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center text-xs sm:text-sm text-primary font-medium bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-6"
                    >
                        <Sparkles className="w-3.5 h-3.5 mr-2" />
                        {t('team.badge', 'Ekibimiz')}
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6"
                    >
                        {t('team.title_prefix', "Unilancer'ın Arkasındaki")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">{t('team.title_suffix', 'Güç')}</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-600 dark:text-gray-300 leading-relaxed"
                    >
                        {t('team.description', 'Dijital dönüşüm yolculuğunuzda size eşlik eden tutkulu ve yetenekli ekibimizle tanışın.')}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayedMembers.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <div className="relative overflow-hidden rounded-[2rem] aspect-[3/4] mb-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500">
                                <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                                    <div className="flex justify-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <a href="#" className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110 border border-white/20">
                                            <Linkedin size={20} />
                                        </a>
                                        <a href="#" className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110 border border-white/20">
                                            <Twitter size={20} />
                                        </a>
                                        <a href="#" className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110 border border-white/20">
                                            <Mail size={20} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors duration-300">
                                    {member.name}
                                </h3>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    {member.role}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
