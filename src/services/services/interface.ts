/**
 * Services Interface
 * 
 * Types for the services collection used in the homepage grid.
 */

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
    displayOrder: number
    isActive: boolean
    created: string
    updated: string
}

export interface IServicesService {
    getServices(): Promise<Service[]>
    getServiceBySlug(slug: string): Promise<Service | null>
}
