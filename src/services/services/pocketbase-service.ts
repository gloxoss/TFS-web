/**
 * PocketBase Services Service
 * 
 * Fetches services for the homepage grid and service detail pages.
 */

import PocketBase from 'pocketbase'
import type { Service, IServicesService } from './interface'

export class PocketBaseServicesService implements IServicesService {
    private pb: PocketBase

    constructor(pbClient: PocketBase) {
        this.pb = pbClient
    }

    private mapRecordToService(record: Record<string, unknown>): Service {
        return {
            id: record.id as string,
            title: record.title as string,
            titleFr: record.title_fr as string | undefined,
            slug: record.slug as string,
            icon: record.icon as string | undefined,
            briefDescription: record.brief_description as string | undefined,
            briefDescriptionFr: record.brief_description_fr as string | undefined,
            fullDescription: record.full_description as string | undefined,
            fullDescriptionFr: record.full_description_fr as string | undefined,
            type: record.type as 'internal_link' | 'content_page',
            targetUrl: record.target_url as string | undefined,
            images: record.images as string[] | undefined,
            displayOrder: record.display_order as number || 0,
            isActive: record.is_active as boolean ?? true,
            created: record.created as string,
            updated: record.updated as string,
        }
    }

    async getServices(): Promise<Service[]> {
        try {
            const records = await this.pb.collection('services').getFullList({
                filter: 'is_active = true',
                sort: 'display_order',
            })
            return records.map((r) => this.mapRecordToService(r))
        } catch (error) {
            console.error('[ServicesService] Error fetching services:', error)
            return []
        }
    }

    async getServiceBySlug(slug: string): Promise<Service | null> {
        try {
            const record = await this.pb.collection('services').getFirstListItem(
                `slug = "${slug}" && is_active = true`
            )
            return this.mapRecordToService(record)
        } catch (error) {
            console.error('[ServicesService] Error fetching service by slug:', error)
            return null
        }
    }
}

// Factory function
export function getServicesService(pb: PocketBase): IServicesService {
    return new PocketBaseServicesService(pb)
}
