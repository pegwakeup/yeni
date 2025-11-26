import {
    ArrowUpRight,
    Code2,
    Palette,
    Smartphone,
    Search,
    Figma,
    BrainCircuit,
    Layers,
    Monitor
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "../../lib/utils";

const BentoCard = ({
    name,
    className,
    background,
    Icon,
    description,
    href,
    cta,
}) => {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            key={name}
            className={cn(
                "relative col-span-3 row-span-1 flex flex-col justify-between overflow-hidden rounded-xl",
                "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                "dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
                className
            )}
        >
            <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300">
                <Icon className="h-10 w-10 text-primary-light transform-gpu text-neutral-700 transition-all duration-300 dark:text-neutral-300" />
                <h3 className="mt-4 text-xl font-semibold text-neutral-700 dark:text-neutral-300">
                    {name}
                </h3>
                <p className="max-w-lg text-neutral-500 dark:text-neutral-400">{description}</p>
            </div>

            <div
                className={cn(
                    "pointer-events-none absolute bottom-0 left-4 right-4 top-8 -z-20 rounded-t-2xl bg-gradient-to-b from-neutral-50 to-neutral-100 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:from-neutral-900/50 dark:to-neutral-800/50",
                    background
                )}
            />
            <div
                className={cn(
                    "pointer-events-none absolute bottom-0 left-0 right-0 top-0 -z-10 rounded-2xl opacity-0 transition-all duration-300 group-hover:opacity-100",
                    background
                )}
            />

            <div className="absolute bottom-0 left-0 right-0 flex justify-between gap-4 p-4 px-6">
                <a
                    href={href}
                    className="group/button flex items-center gap-1 rounded-full border-2 border-primary/20 px-3 py-1 text-sm text-primary transition-all duration-150 hover:border-primary hover:bg-primary/10"
                >
                    {t(cta, "Learn More")}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover/button:-translate-y-px group-hover/button:translate-x-px" />
                </a>
            </div>
        </motion.div>
    );
};


const BentoServices = () => {
    const { t } = useTranslation();

    const features = [
        {
            Icon: Code2,
            name: t("services.bento.web.title", "Web Geliştirme"),
            description: t("services.bento.web.desc", "Modern ve performanslı web siteleri, platformlar ve uygulamalar."),
            href: "/services/web",
            cta: "services.bento.cta",
            className: "col-span-3 lg:col-span-2",
        },
        {
            Icon: Palette,
            name: t("services.bento.design.title", "UI/UX Tasarım"),
            description: t("services.bento.design.desc", "Kullanıcı odaklı, estetik ve sezgisel arayüz tasarımları."),
            href: "/services/design",
            cta: "services.bento.cta",
            className: "col-span-3 lg:col-span-1",
        },
        {
            Icon: Smartphone,
            name: t("services.bento.mobile.title", "Mobil Uygulamalar"),
            description: t("services.bento.mobile.desc", "iOS ve Android için native ve cross-platform çözümler."),
            href: "/services/mobile",
            cta: "services.bento.cta",
            className: "col-span-3 lg:col-span-1",
        },
        {
            Icon: BrainCircuit,
            name: t("services.bento.ai.title", "Yapay Zeka Çözümleri"),
            description: t("services.bento.ai.desc", "İşletmenizi geleceğe taşıyan akıllı otomasyon ve AI entegrasyonları."),
            href: "/services/ai",
            cta: "services.bento.cta",
            className: "col-span-3 lg:col-span-2",
        },
        {
            Icon: Search,
            name: t("services.bento.seo.title", "SEO & Pazarlama"),
            description: t("services.bento.seo.desc", "Arama motorlarında ve dijital kanallarda görünürlüğünüzü artırın."),
            href: "/services/marketing",
            cta: "services.bento.cta",
            className: "col-span-3 lg:col-span-2",
        },
        {
            Icon: Monitor,
            name: t("services.bento.saas.title", "SaaS Çözümleri"),
            description: t("services.bento.saas.desc", "İş süreçlerinizi otomatize eden bulut tabanlı yazılım hizmetleri."),
            href: "/services/saas",
            cta: "services.bento.cta",
            className: "col-span-3 lg:col-span-1",
        },
    ];

    return (
        <motion.div
            initial="initial"
            animate="animate"
            transition={{
                staggerChildren: 0.05,
            }}
            className="mx-auto grid max-w-[1600px] grid-cols-3 grid-rows-2 gap-4"
        >
            {features.map((feature) => (
                <BentoCard key={feature.name} {...feature} />
            ))}
        </motion.div>
    );
};

export default BentoServices;

