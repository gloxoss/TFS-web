"use client"

import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ServiceHeroSectionProps {
    title: string
    description?: string
    heroImage?: string
    lng: string
}

export default function ServiceHeroSection({ title, description, heroImage, lng }: ServiceHeroSectionProps) {
    // Default hero image if none provided
    const backgroundImage = heroImage || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop'

    return (
        <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60" />
            {/* Gradient Overlays - Like homepage */}
            <div className="absolute bottom-0 left-0 w-full h-[70%] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-black via-black/0 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

            {/* Back Button - Top Left */}
            <div className="absolute top-24 left-6 md:left-12 z-20">
                <Link
                    href={`/${lng}`}
                    className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group text-sm"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>{lng === 'fr' ? 'Retour' : 'Back'}</span>
                </Link>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 py-32 text-center max-w-5xl">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block text-[#D00000] text-sm tracking-widest uppercase mb-6 font-medium"
                >
                    {lng === 'fr' ? 'Nos Services' : 'Our Services'}
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-8 leading-[0.9] uppercase tracking-tight"
                >
                    {title}
                </motion.h1>

                {description && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-10"
                    >
                        {description}
                    </motion.p>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Link
                        href={`/${lng}/equipment`}
                        className="inline-flex items-center gap-3 bg-[#D00000] hover:bg-[#B00000] text-white px-8 py-4 rounded-full font-medium transition-all duration-300 group"
                    >
                        {lng === 'fr' ? 'Demander un Devis' : 'Request a Quote'}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </section>
    )
}
