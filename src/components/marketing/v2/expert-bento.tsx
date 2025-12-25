'use client'

import React from "react"
import { PlusCard } from "@/components/ui/plus-card"
import { MapPin, Phone, Mail, Trophy, Briefcase, ShieldCheck } from "lucide-react"
import { useTranslation } from "@/app/i18n/client";

export function ExpertiseBento({ lng = 'en' }: { lng?: string }) {
    const { t } = useTranslation(lng, 'home');

    const mainDescription = [0, 1, 2].map((i) => t(`expertise.mainDescription.${i}`));

    return (
        <section className="bg-black py-24 relative overflow-hidden">
            {/* Background Elements matching "Cinema" vibe */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D00000]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="mx-auto container max-w-7xl px-4 relative z-10">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold font-display uppercase tracking-tight text-white mb-4">
                        {t('expertise.title')}
                    </h2>
                    <div className="w-24 h-1 bg-[#D00000]" />
                </div>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 auto-rows-[minmax(180px,auto)] gap-4">

                    {/* Main Text Card */}
                    <PlusCard
                        title={t('expertise.mainTitle')}
                        description={
                            <div className="space-y-4 mt-4 text-base md:text-lg">
                                {mainDescription.map((p, i) => <p key={i}>{p}</p>)}
                            </div>
                        }
                        className="lg:col-span-4 lg:row-span-2 bg-zinc-900/80"
                    />

                    {/* Stat 1 */}
                    <PlusCard
                        title={t('expertise.stat1.title')}
                        description={t('expertise.stat1.description')}
                        icon={<Trophy className="w-6 h-6" />}
                        className="lg:col-span-2 lg:row-span-1"
                    />

                    {/* Stat 2 */}
                    <PlusCard
                        title={t('expertise.stat2.title')}
                        description={t('expertise.stat2.description')}
                        icon={<Briefcase className="w-6 h-6" />}
                        className="lg:col-span-2 lg:row-span-1"
                    />

                    {/* Fact 1 */}
                    <PlusCard
                        title={t('expertise.fact1.title')}
                        description={t('expertise.fact1.description')}
                        icon={<ShieldCheck className="w-6 h-6" />}
                        className="lg:col-span-2 lg:row-span-1"
                    />

                    {/* Fact 2 */}
                    <PlusCard
                        title={t('expertise.fact2.title')}
                        description={t('expertise.fact2.description')}
                        icon={<Briefcase className="w-6 h-6" />}
                        className="lg:col-span-2 lg:row-span-1"
                    />

                    {/* Fact 3 */}
                    <PlusCard
                        title={t('expertise.fact3.title')}
                        description={t('expertise.fact3.description')}
                        icon={<Trophy className="w-6 h-6" />}
                        className="lg:col-span-2 lg:row-span-1"
                    />

                </div>
            </div>
        </section>
    )
}

