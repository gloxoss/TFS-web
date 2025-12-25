"use client"

import { motion } from 'framer-motion'
import type { ServiceFeature } from '@/services/services/interface'
import { useTranslation } from '@/app/i18n/client'

interface ServiceFeaturesSectionProps {
    features: ServiceFeature[]
    tags?: string[]
    lng: string
}

export default function ServiceFeaturesSection({ features, tags, lng }: ServiceFeaturesSectionProps) {
    const { t } = useTranslation(lng, 'services')
    if (!features || features.length === 0) return null

    return (
        <section className="py-24 md:py-32 bg-black relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#D00000]/5 rounded-full blur-[150px] -translate-y-1/2" />
            </div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                {/* Tags Row - With separators */}
                {tags && tags.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-16"
                    >
                        {tags.map((tag, index) => (
                            <span key={index} className="flex items-center gap-6">
                                <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-[#D00000] transition-colors cursor-default">
                                    {tag}
                                </span>
                                {index < tags.length - 1 && (
                                    <span className="w-1 h-1 rounded-full bg-zinc-600" />
                                )}
                            </span>
                        ))}
                    </motion.div>
                )}

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 uppercase tracking-tight">
                        {t('features.title')}
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        {t('features.subtitle')}
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {features.map((feature, index) => {
                        const title = lng === 'fr' && feature.titleFr ? feature.titleFr : feature.title
                        const description = lng === 'fr' && feature.descriptionFr ? feature.descriptionFr : feature.description

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="flex gap-5 p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-[#D00000]/30 transition-all duration-300 group"
                            >
                                {/* Number */}
                                <div className="flex-shrink-0">
                                    <span className="text-[#D00000]/40 font-display text-2xl font-light group-hover:text-[#D00000] transition-colors duration-300">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-white mb-2 group-hover:text-[#D00000] transition-colors duration-300">
                                        {title}
                                    </h3>
                                    {description && (
                                        <p className="text-zinc-400 text-sm leading-relaxed">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
