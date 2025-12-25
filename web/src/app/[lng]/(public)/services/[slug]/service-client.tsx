
import { Service } from '@/services/services/interface'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/app/i18n/client'

// Section Components
import ServiceHeroSection from '@/components/marketing/services/service-hero-section'
import ServiceContentSection from '@/components/marketing/services/service-content-section'
import ServiceStatsSection from '@/components/marketing/services/service-stats-section'
import ServiceFeaturesSection from '@/components/marketing/services/service-features-section'
import ServiceContactSection from '@/components/marketing/services/service-contact-section'
import CTASection from '@/components/marketing/cta-section'

interface ServiceDetailClientProps {
    service: Service
    lng: string
}

export default function ServiceDetailClient({ service, lng }: ServiceDetailClientProps) {
    const { t } = useTranslation(lng, 'services')
    const [showFloatingButton, setShowFloatingButton] = useState(false)

    // Localized content
    const title = lng === 'fr' && service.titleFr ? service.titleFr : service.title
    const briefDescription = lng === 'fr' && service.briefDescriptionFr
        ? service.briefDescriptionFr
        : service.briefDescription
    const fullDescription = lng === 'fr' && service.fullDescriptionFr
        ? service.fullDescriptionFr
        : service.fullDescription

    // Check if we have structured content
    const hasStructuredContent = service.sections?.length || service.stats?.length || service.features?.length || service.tags?.length

    // Show floating button after scrolling
    useEffect(() => {
        const handleScroll = () => {
            setShowFloatingButton(window.scrollY > 400)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <main className="min-h-screen bg-black text-white">
            {/* Floating Equipment Button - Top Right */}
            <AnimatePresence>
                {showFloatingButton && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-24 right-6 md:right-12 z-50"
                    >
                        <Link
                            href={`/${lng}/equipment`}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-[#D00000] rounded-full text-white text-sm font-medium hover:bg-[#B00000] transition-all duration-300 group shadow-[0_0_20px_rgba(208,0,0,0.4)]"
                        >
                            {t('viewEquipment')}
                            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <ServiceHeroSection
                title={title}
                description={briefDescription}
                heroImage={service.heroImage}
                lng={lng}
            />

            {hasStructuredContent ? (
                <>
                    {/* Structured Sections */}
                    {service.sections && service.sections.length > 0 && (
                        <ServiceContentSection sections={service.sections} lng={lng} />
                    )}

                    {/* Stats */}
                    {service.stats && service.stats.length > 0 && (
                        <ServiceStatsSection stats={service.stats} lng={lng} />
                    )}

                    {/* Features (includes tags) */}
                    {service.features && service.features.length > 0 && (
                        <ServiceFeaturesSection
                            features={service.features}
                            tags={service.tags}
                            lng={lng}
                        />
                    )}
                </>
            ) : (
                /* Fallback: Simple full description */
                fullDescription && (
                    <section className="py-16 md:py-24 border-t border-white/5">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <div
                                className="prose prose-invert prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: fullDescription }}
                            />
                        </div>
                    </section>
                )
            )}

            {/* Contact Actions Section */}
            <ServiceContactSection lng={lng} />
        </main>
    )
}
