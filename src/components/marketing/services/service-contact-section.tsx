"use client"

import { motion } from 'framer-motion'
import { ArrowRight, Download, Mail } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/app/i18n/client'

interface ServiceContactSectionProps {
    lng: string
}

export default function ServiceContactSection({ lng }: ServiceContactSectionProps) {
    const { t } = useTranslation(lng, 'services')
    return (
        <section className="py-20 md:py-28 bg-zinc-950">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left - Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 uppercase tracking-tight">
                            {t('contact.title')}
                        </h2>
                        <p className="text-zinc-400 leading-relaxed">
                            {t('contact.description')}
                        </p>
                    </motion.div>

                    {/* Right - Buttons */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="space-y-4"
                    >
                        {/* Request Quote - Links to Equipment */}
                        <Link
                            href={`/${lng}/equipment`}
                            className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-[#D00000] hover:bg-[#B00000] text-white font-medium rounded-full transition-all duration-300 group"
                        >
                            {t('contact.cta.quote')}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {/* Download Catalog */}
                        <a
                            href="/catalog.pdf"
                            download
                            className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-transparent border border-white/20 hover:border-white/40 text-white font-medium rounded-lg transition-all duration-300 group"
                        >
                            <Download className="w-5 h-5" />
                            {t('contact.cta.catalog')}
                        </a>

                        {/* Contact Us */}
                        <Link
                            href={`/${lng}/contact`}
                            className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-transparent border border-white/20 hover:border-white/40 text-white font-medium rounded-lg transition-all duration-300 group"
                        >
                            <Mail className="w-5 h-5" />
                            {t('contact.cta.contact')}
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
