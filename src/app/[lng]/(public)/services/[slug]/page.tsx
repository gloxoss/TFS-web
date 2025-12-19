/**
 * Service Detail Page
 * 
 * Premium cinema-style layout for production services.
 * Matches the dark aesthetic of the main site.
 */

import { createServerClient } from '@/lib/pocketbase/server'
import { getServicesService } from '@/services'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, Mail, Phone, MapPin } from 'lucide-react'
import { StickyServiceCTA } from '@/components/ui/sticky-service-cta'

interface PageProps {
    params: Promise<{
        lng: string
        slug: string
    }>
}

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'

// Service-specific features for display
const SERVICE_FEATURES: Record<string, { en: string[]; fr: string[] }> = {
    'full-production': {
        en: ['Complete crew management', 'Location scouting', 'Equipment rental', 'Post-production support', 'Permit coordination'],
        fr: ['Gestion d\'équipe complète', 'Repérage de lieux', 'Location d\'équipement', 'Support post-production', 'Coordination des permis'],
    },
    'location-scouting': {
        en: ['Desert landscapes', 'Historic medinas', 'Coastal locations', 'Mountain scenery', 'Urban environments'],
        fr: ['Paysages désertiques', 'Médinas historiques', 'Lieux côtiers', 'Paysages montagneux', 'Environnements urbains'],
    },
    'crew-talent': {
        en: ['Camera operators', 'Sound technicians', 'Lighting specialists', 'Production assistants', 'Local fixers'],
        fr: ['Cadreurs', 'Techniciens son', 'Spécialistes éclairage', 'Assistants de production', 'Fixeurs locaux'],
    },
    'permits-logistics': {
        en: ['Filming permits', 'Transport coordination', 'Accommodation booking', 'Customs clearance', 'Security arrangements'],
        fr: ['Permis de tournage', 'Coordination transport', 'Réservation hébergement', 'Dédouanement', 'Dispositifs de sécurité'],
    },
    'post-production': {
        en: ['DaVinci color grading', 'Sound design', 'VFX services', 'Final delivery formats', 'Archive management'],
        fr: ['Étalonnage DaVinci', 'Sound design', 'Services VFX', 'Formats de livraison', 'Gestion des archives'],
    },
}

// Hero images for each service (using Unsplash)
const SERVICE_HERO_IMAGES: Record<string, string> = {
    'full-production': 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2559&auto=format&fit=crop',
    'location-scouting': 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?q=80&w=2574&auto=format&fit=crop',
    'crew-talent': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2670&auto=format&fit=crop',
    'permits-logistics': 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=2526&auto=format&fit=crop',
    'post-production': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2670&auto=format&fit=crop',
}

export default async function ServiceDetailPage({ params }: PageProps) {
    const { lng, slug } = await params
    const client = await createServerClient()
    const servicesService = getServicesService(client)

    const service = await servicesService.getServiceBySlug(slug)

    if (!service) {
        notFound()
    }

    // If this is an internal link type, redirect to the target URL
    if (service.type === 'internal_link' && service.targetUrl) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <p className="text-zinc-400 mb-4">Redirecting...</p>
                    <Link
                        href={`/${lng}${service.targetUrl}`}
                        className="text-[#D00000] hover:underline"
                    >
                        Go to {service.title}
                    </Link>
                </div>
            </div>
        )
    }

    // Get localized content
    const title = lng === 'fr' ? (service.titleFr || service.title) : service.title
    const briefDescription = lng === 'fr'
        ? (service.briefDescriptionFr || service.briefDescription)
        : service.briefDescription

    // Get features for this service
    const features = SERVICE_FEATURES[slug] || { en: [], fr: [] }
    const featureList = lng === 'fr' ? features.fr : features.en

    // Get hero image
    const heroImage = SERVICE_HERO_IMAGES[slug] || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2559&auto=format&fit=crop'

    return (
        <main className="relative min-h-screen bg-black text-white">
            {/* Sticky CTA - appears on scroll */}
            <StickyServiceCTA lng={lng} />

            {/* Hero Section with Full Background */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-end">
                {/* Background Image */}
                <Image
                    src={heroImage}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20 w-full">
                    {/* Back Link */}
                    <Link
                        href={`/${lng}`}
                        className="inline-flex items-center gap-2 text-zinc-300 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{lng === 'fr' ? 'Accueil' : 'Home'}</span>
                    </Link>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-display uppercase tracking-tight mb-4">
                        {title}
                    </h1>

                    {/* Brief Description */}
                    {briefDescription && (
                        <p className="text-lg md:text-xl text-zinc-300 max-w-2xl">
                            {briefDescription}
                        </p>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-24 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left: Features List */}
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">
                                {lng === 'fr' ? 'Ce que nous offrons' : 'What We Offer'}
                            </h2>
                            <ul className="space-y-4">
                                {featureList.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-[#D00000] flex-shrink-0 mt-0.5" />
                                        <span className="text-lg text-zinc-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right: CTA Card */}
                        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-4 text-white">
                                {lng === 'fr' ? 'Prêt à démarrer?' : 'Ready to get started?'}
                            </h3>
                            <p className="text-zinc-400 mb-6">
                                {lng === 'fr'
                                    ? 'Contactez notre équipe pour discuter de votre projet et obtenir un devis personnalisé.'
                                    : 'Contact our team to discuss your project and get a personalized quote.'}
                            </p>
                            <div className="space-y-3">
                                <Link
                                    href={`/${lng}/equipment`}
                                    className="flex items-center justify-center gap-2 w-full bg-[#D00000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#D00000]/90 transition-colors"
                                >
                                    {lng === 'fr' ? 'Voir l\'Équipement' : 'Browse Equipment'}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href={`/${lng}/contact`}
                                    className="flex items-center justify-center gap-2 w-full bg-zinc-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-zinc-700 transition-colors border border-zinc-700"
                                >
                                    <Mail className="w-4 h-4" />
                                    {lng === 'fr' ? 'Demander un Devis' : 'Request a Quote'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section className="py-16 bg-zinc-950 border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#D00000]/10 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-[#D00000]" />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-500 uppercase tracking-wider">
                                    {lng === 'fr' ? 'Basé à' : 'Based in'}
                                </p>
                                <p className="text-xl font-bold text-white">Casablanca, Morocco</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="tel:+212600000000" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                                <Phone className="w-5 h-5" />
                                <span>+212 6 00 00 00 00</span>
                            </a>
                            <a href="mailto:contact@tvfilm-solutions.com" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                                <Mail className="w-5 h-5" />
                                <span>contact@tvfilm-solutions.com</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
