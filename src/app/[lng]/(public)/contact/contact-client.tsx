"use client";

import { useTranslation } from "@/app/i18n/client";
import { motion } from "framer-motion";
import ContactForm from "@/components/marketing/contact/contact-form";
import ContactInfo from "@/components/marketing/contact/contact-info";

export function ContactClient({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "contact");

    return (
        <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
            {/* Background Decorations (reusing global theme) */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D00000]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold font-display uppercase tracking-tight text-white mb-6"
                    >
                        {t("hero.title")}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-zinc-400 font-light"
                    >
                        {t("hero.subtitle")}
                    </motion.p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                    {/* Left: Info */}
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <ContactInfo lng={lng} />
                    </div>

                    {/* Right: Form */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <ContactForm lng={lng} />
                    </div>
                </div>

            </div>
        </div>
    );
}
