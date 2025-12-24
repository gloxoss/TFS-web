import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/pocketbase/server'
import { getServicesService } from '@/services/services/pocketbase-service'
import ServiceDetailClient from './service-client'

interface PageProps {
    params: Promise<{ lng: string; slug: string }>
}

async function getService(slug: string) {
    const pb = await createServerClient()
    const servicesService = getServicesService(pb)
    return servicesService.getServiceBySlug(slug)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, lng } = await params
    const service = await getService(slug)

    if (!service) {
        return {
            title: 'Service Not Found',
        }
    }

    const title = lng === 'fr' && service.titleFr ? service.titleFr : service.title
    const description = lng === 'fr' && service.briefDescriptionFr
        ? service.briefDescriptionFr
        : service.briefDescription

    return {
        title: `${title} | TFS`,
        description: description || `Learn more about our ${title} services.`,
    }
}

export default async function ServicePage({ params }: PageProps) {
    const { slug, lng } = await params
    const service = await getService(slug)

    if (!service) {
        notFound()
    }

    // If this is an internal_link type, redirect to the target URL
    if (service.type === 'internal_link' && service.targetUrl) {
        const { redirect } = await import('next/navigation')
        redirect(service.targetUrl)
    }

    return <ServiceDetailClient service={service} lng={lng} />
}
