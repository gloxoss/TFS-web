"use client"

import { motion } from 'framer-motion'
import type { ServiceSection } from '@/services/services/interface'

interface ServiceContentSectionProps {
    sections: ServiceSection[]
    lng: string
}

export default function ServiceContentSection({ sections, lng }: ServiceContentSectionProps) {
    if (!sections || sections.length === 0) return null

    return (
        <div className="bg-black">
            {sections.map((section, index) => {
                const title = lng === 'fr' && section.titleFr ? section.titleFr : section.title
                const content = lng === 'fr' && section.contentFr ? section.contentFr : section.content
                const isReversed = section.layout === 'left'

                return (
                    <section
                        key={index}
                        className="relative min-h-screen flex items-center overflow-hidden"
                    >
                        {/* Background Image */}
                        {section.image && (
                            <>
                                <div
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
                                    style={{ backgroundImage: `url(${section.image})` }}
                                />
                                {/* Dark Overlay - Gradient based on layout */}
                                <div className={`absolute inset-0 ${isReversed
                                    ? 'bg-gradient-to-l from-black via-black/80 to-black/40'
                                    : 'bg-gradient-to-r from-black via-black/80 to-black/40'
                                    }`} />
                            </>
                        )}

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="relative z-10 container mx-auto px-6 py-24 max-w-7xl flex justify-start"
                        >
                            {/* Content Box */}
                            <div className="max-w-2xl">
                                {title && (
                                    <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-[0.95] uppercase tracking-tight">
                                        {title}
                                    </h2>
                                )}
                                {content && (
                                    <div
                                        className="prose prose-invert prose-xl max-w-none text-zinc-200 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: content }}
                                    />
                                )}
                            </div>
                        </motion.div>
                    </section>
                )
            })}
        </div>
    )
}
