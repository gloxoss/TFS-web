'use server'

/**
 * Admin Inventory (Equipment) Server Actions
 * 
 * CRUD operations for equipment management.
 */

import { verifyAdminAccess } from '@/services/auth/access-control'
import { createServerClient, createAdminClient } from '@/lib/pocketbase/server'
import { revalidatePath } from 'next/cache'

export interface EquipmentItem {
    id: string
    name: string
    nameEn: string
    nameFr: string
    slug: string
    category: string
    brand: string
    descriptionEn: string
    descriptionFr: string
    dailyRate: number
    stock: number
    images: string[]
    imageUrls: string[]
    visibility: boolean
    featured: boolean
    availabilityStatus: 'available' | 'rented' | 'maintenance'
    created: string
    updated: string
}

export interface EquipmentListResponse {
    success: boolean
    items: EquipmentItem[]
    totalItems: number
    totalPages: number
    page: number
    error?: string
}

/**
 * Transform PocketBase record to EquipmentItem
 */
function transformEquipment(record: Record<string, any>, baseUrl: string): EquipmentItem {
    const images = Array.isArray(record.images) ? record.images : []

    return {
        id: record.id,
        name: record.name || record.name_en || '',
        nameEn: record.name_en || record.name || '',
        nameFr: record.name_fr || '',
        slug: record.slug || '',
        category: record.category || '',
        brand: record.brand || '',
        descriptionEn: record.description_en || '',
        descriptionFr: record.description_fr || '',
        dailyRate: record.daily_rate || 0,
        stock: record.stock || 0,
        images,
        imageUrls: images.map((img: string) =>
            `${baseUrl}/api/files/${record.collectionId}/${record.id}/${img}`
        ),
        visibility: record.visibility ?? true,
        featured: record.featured || false,
        availabilityStatus: record.availability_status || 'available',
        created: record.created,
        updated: record.updated
    }
}

/**
 * Get paginated equipment list
 */
export async function getEquipmentList(
    page: number = 1,
    limit: number = 20,
    filters?: {
        category?: string
        visibility?: boolean
        search?: string
    }
): Promise<EquipmentListResponse> {
    try {
        const isAdmin = await verifyAdminAccess()
        if (!isAdmin) {
            return { success: false, items: [], totalItems: 0, totalPages: 0, page, error: 'Unauthorized' }
        }

        const client = await createAdminClient()
        const baseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'

        // Build filter
        const filterParts: string[] = []
        if (filters?.category) {
            filterParts.push(`category = "${filters.category}"`)
        }
        if (filters?.visibility !== undefined) {
            filterParts.push(`visibility = ${filters.visibility}`)
        }
        if (filters?.search) {
            filterParts.push(`(name_en ~ "${filters.search}" || name_fr ~ "${filters.search}" || brand ~ "${filters.search}")`)
        }

        const filter = filterParts.length > 0 ? filterParts.join(' && ') : undefined

        const result = await client.collection('equipment').getList(page, limit, {
            filter
        })

        const items = result.items.map(item => transformEquipment(item, baseUrl))

        return {
            success: true,
            items,
            totalItems: result.totalItems,
            totalPages: result.totalPages,
            page: result.page
        }
    } catch (error) {
        console.error('[AdminInventory] Error fetching equipment:', error)
        return {
            success: false,
            items: [],
            totalItems: 0,
            totalPages: 0,
            page,
            error: error instanceof Error ? error.message : 'Failed to fetch equipment'
        }
    }
}

/**
 * Get single equipment by ID
 */
export async function getEquipmentById(id: string): Promise<{
    success: boolean
    item: EquipmentItem | null
    error?: string
}> {
    try {
        const isAdmin = await verifyAdminAccess()
        if (!isAdmin) {
            return { success: false, item: null, error: 'Unauthorized' }
        }

        const client = await createAdminClient()
        const baseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'
        const record = await client.collection('equipment').getOne(id)

        return {
            success: true,
            item: transformEquipment(record, baseUrl)
        }
    } catch (error) {
        console.error('[AdminInventory] Error fetching equipment:', error)
        return {
            success: false,
            item: null,
            error: error instanceof Error ? error.message : 'Equipment not found'
        }
    }
}

/**
 * Create new equipment
 */
export async function createEquipment(formData: FormData): Promise<{
    success: boolean
    id?: string
    error?: string
}> {
    try {
        const isAdmin = await verifyAdminAccess()
        if (!isAdmin) {
            return { success: false, error: 'Unauthorized' }
        }

        const client = await createAdminClient()

        // Prepare data
        const data = new FormData()
        data.append('name_en', formData.get('name_en') as string)
        data.append('name_fr', formData.get('name_fr') as string || formData.get('name_en') as string)
        data.append('slug', formData.get('slug') as string)

        // Handle Category
        let category = formData.get('category') as string
        console.log('[AdminInventory] Raw category input:', category)
        if (category) {
            try {
                // If it looks like a slug (not length 15 record ID), try to find it
                if (category.length !== 15) {
                    const catRecord = await client.collection('categories').getFirstListItem(`slug="${category}" || name="${category}"`)
                    category = catRecord.id
                    console.log('[AdminInventory] Resolved category slug to ID:', category)
                }
            } catch (err) {
                console.error('[AdminInventory] Failed to resolve category slug:', err)
            }
        }
        data.append('category', category)

        data.append('brand', formData.get('brand') as string || '')
        data.append('description_en', formData.get('description_en') as string || '')
        data.append('description_fr', formData.get('description_fr') as string || '')

        // Handle Numbers (with explicit defaults)
        const dailyRate = formData.get('daily_rate')
        const stock = formData.get('stock')

        data.append('daily_rate', dailyRate ? dailyRate.toString() : '1')
        data.append('stock', stock ? stock.toString() : '1')
        data.append('stock_available', stock ? stock.toString() : '1')

        data.append('visibility', formData.get('visibility') as string || 'true')
        data.append('featured', formData.get('featured') as string || 'false')
        data.append('availability_status', formData.get('availability_status') as string || 'available')

        // Handle images
        const images = formData.getAll('images')
        images.forEach(img => {
            if (img instanceof File && img.size > 0) {
                data.append('images', img)
            }
        })



        const record = await client.collection('equipment').create(data)

        revalidatePath('/[lng]/admin/inventory')
        revalidatePath('/[lng]/equipment')

        return { success: true, id: record.id }
    } catch (error) {
        console.error('[AdminInventory] Error creating equipment:', error)

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create equipment'
        }
    }
}

/**
 * Update equipment
 */
export async function updateEquipment(id: string, formData: FormData): Promise<{
    success: boolean
    error?: string
}> {
    try {
        const isAdmin = await verifyAdminAccess()
        if (!isAdmin) {
            return { success: false, error: 'Unauthorized' }
        }

        const client = await createAdminClient()

        // Prepare data
        const data = new FormData()

        // Only include fields that are being updated
        const fields = ['name_en', 'name_fr', 'slug', 'category', 'brand',
            'description_en', 'description_fr', 'daily_rate',
            'stock', 'visibility', 'featured', 'availability_status']

        fields.forEach(field => {
            const value = formData.get(field)
            if (value !== null) {
                data.append(field, value as string)
            }
        })

        // Handle new images
        const images = formData.getAll('images')
        images.forEach(img => {
            if (img instanceof File && img.size > 0) {
                data.append('images', img)
            }
        })

        await client.collection('equipment').update(id, data)

        revalidatePath('/[lng]/admin/inventory')
        revalidatePath(`/[lng]/admin/inventory/${id}`)
        revalidatePath('/[lng]/equipment')

        return { success: true }
    } catch (error) {
        console.error('[AdminInventory] Error updating equipment:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update equipment'
        }
    }
}

/**
 * Delete equipment
 */
export async function deleteEquipment(id: string): Promise<{
    success: boolean
    error?: string
}> {
    try {
        const isAdmin = await verifyAdminAccess()
        if (!isAdmin) {
            return { success: false, error: 'Unauthorized' }
        }

        const client = await createAdminClient()
        await client.collection('equipment').delete(id)

        revalidatePath('/[lng]/admin/inventory')
        revalidatePath('/[lng]/equipment')

        return { success: true }
    } catch (error) {
        console.error('[AdminInventory] Error deleting equipment:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete equipment'
        }
    }
}

/**
 * Toggle equipment visibility
 */
export async function toggleEquipmentVisibility(id: string): Promise<{
    success: boolean
    newVisibility?: boolean
    error?: string
}> {
    try {
        const isAdmin = await verifyAdminAccess()
        if (!isAdmin) {
            return { success: false, error: 'Unauthorized' }
        }

        const client = await createAdminClient()
        const current = await client.collection('equipment').getOne(id)
        const newVisibility = !current.visibility

        await client.collection('equipment').update(id, { visibility: newVisibility })

        revalidatePath('/[lng]/admin/inventory')
        revalidatePath('/[lng]/equipment')

        return { success: true, newVisibility }
    } catch (error) {
        console.error('[AdminInventory] Error toggling visibility:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to toggle visibility'
        }
    }
}

/**
 * Get equipment categories for dropdown
 */
export async function getEquipmentCategories(): Promise<{
    success: boolean
    categories: Array<{ id: string; name: string; slug: string }>
    error?: string
}> {
    try {
        const isAdmin = await verifyAdminAccess()
        if (!isAdmin) {
            return { success: false, categories: [], error: 'Unauthorized' }
        }

        const client = await createAdminClient()
        const result = await client.collection('categories').getFullList({
            sort: 'name'
        })

        const categories = result.map(cat => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug
        }))

        return { success: true, categories }
    } catch (error) {
        console.error('[AdminInventory] Error fetching categories:', error)
        return {
            success: false,
            categories: [],
            error: error instanceof Error ? error.message : 'Failed to fetch categories'
        }
    }
}
