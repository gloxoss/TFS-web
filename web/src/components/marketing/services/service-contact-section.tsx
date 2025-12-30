"use client"

import { motion } from 'framer-motion'
import { ArrowRight, Download, Mail } from 'lucide-react'
import Link from 'next/link'

interface ServiceContactSectionProps {
    lng: string
    showCatalog?: boolean
}

export default function ServiceContactSection({ lng, showCatalog = false }: ServiceContactSectionProps) {
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
                            {lng === 'fr' ? 'Prêt à Démarrer ?' : 'Ready to Get Started?'}
                        </h2>
                        <p className="text-zinc-400 leading-relaxed">
                            {lng === 'fr'
                                ? 'Contactez notre équipe pour discuter de votre projet et obtenir un devis personnalisé.'
                                : 'Contact our team to discuss your project and get a personalized quote.'}
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
                            {lng === 'fr' ? 'Demander un Devis' : 'Request a Quote'}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {/* Download Catalog - Conditional */}
                        {showCatalog && (
                            <a
                                href="/catalog.pdf"
                                download
                                className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-transparent border border-white/20 hover:border-white/40 text-white font-medium rounded-lg transition-all duration-300 group"
                            >
                                <Download className="w-5 h-5" />
                                {lng === 'fr' ? 'Télécharger le Catalogue' : 'Download Catalog'}
                            </a>
                        )}

                        {/* Contact Us */}
                        <Link
                            href={`/${lng}/contact`}
                            className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-transparent border border-white/20 hover:border-white/40 text-white font-medium rounded-lg transition-all duration-300 group"
                        >
                            <Mail className="w-5 h-5" />
                            {lng === 'fr' ? 'Nous Contacter' : 'Contact Us'}
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
