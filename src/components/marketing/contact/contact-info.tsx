"use client";

import { useTranslation } from "@/app/i18n/client";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface ContactInfoProps {
    lng: string;
}

import { useSiteSettings } from "@/components/providers/site-settings-provider";

export default function ContactInfo({ lng }: ContactInfoProps) {
    const { t } = useTranslation(lng, "contact");
    const { company } = useSiteSettings();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold font-display uppercase text-white">
                    {t("info.title")}
                </h2>
                <p className="text-zinc-400 text-lg">
                    {t("info.subtitle")}
                </p>
            </div>

            {/* Location Card - Premium Design */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 p-8"
            >
                {/* Subtle gradient accent */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#D00000]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

                {/* City Header */}
                <div className="relative flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                    <div className="h-14 w-14 rounded-xl bg-[#D00000]/10 flex items-center justify-center text-[#D00000]">
                        <MapPin className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white font-display uppercase tracking-wide">
                            {t("info.casablanca.city")}
                        </h3>
                        <p className="text-sm text-zinc-500">Headquarters</p>
                    </div>
                </div>

                {/* Contact Details - Grid Layout */}
                <div className="relative grid gap-5">
                    {/* Address */}
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Address</p>
                            <p className="text-white leading-relaxed">{company.address.street}</p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                            <Phone className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Phone</p>
                            <a
                                href={`tel:${company.phone.link}`}
                                className="text-white hover:text-[#D00000] transition-colors"
                            >
                                {company.phone.display}
                            </a>
                            {company.fax && (
                                <a
                                    href={`tel:${company.fax.link}`}
                                    className="block text-white hover:text-[#D00000] transition-colors mt-1"
                                >
                                    {company.fax.display}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                            <Mail className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Email</p>
                            <a
                                href={`mailto:${company.email}`}
                                className="text-white hover:text-[#D00000] transition-colors"
                            >
                                {company.email}
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Hours Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 p-8"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 rounded-xl bg-[#D00000]/10 flex items-center justify-center text-[#D00000]">
                        <Clock className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-white font-display uppercase tracking-wide">
                        {t("hours.title")}
                    </h3>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-zinc-400">Mon - Fri</span>
                        <span className="text-white font-medium">9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-zinc-400">Saturday</span>
                        <span className="text-white font-medium">10:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-zinc-400">Sunday</span>
                        <span className="text-zinc-500">Closed</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
