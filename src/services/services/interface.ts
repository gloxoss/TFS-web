/**
 * Services Interface
 * 
 * Types for the services collection used in the homepage grid and detail pages.
 */

// Section types for structured content
export interface ServiceSection {
    type: 'text_image' | 'text_only' | 'image_only'
    layout?: 'left' | 'right'
    title?: string
    titleFr?: string
    content?: string
    contentFr?: string
    image?: string
}

export interface ServiceStat {
    value: string
    label: string
    labelFr?: string
}

export interface ServiceFeature {
    title: string
    titleFr?: string
    description?: string
    descriptionFr?: string
    icon?: string
}

export interface Service {
    id: string
    title: string
    titleFr?: string
    slug: string
    icon?: string
    briefDescription?: string
    briefDescriptionFr?: string
    fullDescription?: string
    fullDescriptionFr?: string
    type: 'internal_link' | 'content_page'
    targetUrl?: string
    images?: string[]
    heroImage?: string
    sections?: ServiceSection[]
    stats?: ServiceStat[]
    tags?: string[]
    features?: ServiceFeature[]
    displayOrder: number
    isActive: boolean
    created: string
    updated: string
}

export interface IServicesService {
    getServices(): Promise<Service[]>
    getServiceBySlug(slug: string): Promise<Service | null>
}
