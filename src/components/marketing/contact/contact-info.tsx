"use client";

import { useTranslation } from "@/app/i18n/client";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface ContactInfoProps {
    lng: string;
}

export default function ContactInfo({ lng }: ContactInfoProps) {
    const { t } = useTranslation(lng, "contact");

    const offices = [
        {
            key: "morocco",
            icon: MapPin,
        },
        {
            key: "uae",
            icon: Globe,
        },
    ];

    return (
        <div className="space-y-12">
            <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold font-display uppercase text-white">
                    {t("info.title")}
                </h2>
                <p className="text-zinc-400 text-lg max-w-md">
                    {t("info.subtitle")}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {offices.map((office, index) => (
                    <motion.div
                        key={office.key}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D00000]/50 transition-colors group"
                    >
                        <div className="shrink-0 h-12 w-12 rounded-full bg-[#D00000]/10 flex items-center justify-center text-[#D00000] group-hover:scale-110 transition-transform">
                            <office.icon className="w-6 h-6" />
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xl font-bold text-white font-display uppercase">
                                {t(`info.${office.key}.city`)}
                            </h4>

                            <div className="space-y-2 text-zinc-400">
                                <p className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 mt-1 shrink-0 text-zinc-500" />
                                    {t(`info.${office.key}.address`)}
                                </p>
                                <p className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 shrink-0 text-zinc-500" />
                                    {t(`info.${office.key}.phone`)}
                                </p>
                                <p className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 shrink-0 text-zinc-500" />
                                    {t(`info.${office.key}.email`)}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
