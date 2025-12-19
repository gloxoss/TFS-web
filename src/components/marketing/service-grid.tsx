/**
 * Service Grid Component
 * 
 * Displays a 2x5 grid of services on the homepage.
 * Each service can either:
 * - Link to an internal page (e.g., /equipment?category=cameras)
 * - Link to a dedicated service detail page (e.g., /services/full-production)
 * 
 * Design: Dark cinema aesthetic with hover effects
 */

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

interface Service {
    id: string
    title: string
    slug: string
    briefDescription?: string
    icon?: string
    type: 'internal_link' | 'content_page'
    targetUrl?: string
}

interface ServiceGridProps {
    title: string
    subtitle?: string
    services: Service[]
    lng: string
}

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'

export function ServiceGrid({ title, subtitle, services, lng }: ServiceGridProps) {
    const getServiceUrl = (service: Service) => {
        if (service.type === 'internal_link' && service.targetUrl) {
            return `/${lng}${service.targetUrl}`
        }
        return `/${lng}/services/${service.slug}`
    }

    return (
        <section className="relative py-20 md:py-32 bg-black overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    {subtitle && (
                        <p className="text-[#D00000] text-sm font-mono uppercase tracking-widest mb-3">
                            {subtitle}
                        </p>
                    )}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                        {title}
                    </h2>
                </div>

                {/* 2x5 Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                    {services.map((service) => (
                        <Link
                            key={service.id}
                            href={getServiceUrl(service)}
                            className="group relative aspect-square bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800/50 hover:border-[#D00000]/50 transition-all duration-300 hover:scale-[1.02]"
                        >
                            {/* Background Icon/Image */}
                            {service.icon && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Image
                                        src={`${PB_URL}/api/files/services/${service.id}/${service.icon}`}
                                        alt={service.title}
                                        fill
                                        className="object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                                    />
                                </div>
                            )}

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                            {/* Content */}
                            <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                <h3 className="text-white font-bold text-sm md:text-base lg:text-lg leading-tight mb-1 group-hover:text-[#D00000] transition-colors">
                                    {service.title}
                                </h3>
                                {service.briefDescription && (
                                    <p className="text-zinc-400 text-xs line-clamp-2 hidden md:block">
                                        {service.briefDescription}
                                    </p>
                                )}
                            </div>

                            {/* Hover Arrow */}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="w-5 h-5 text-[#D00000]" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
