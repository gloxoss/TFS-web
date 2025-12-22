'use server'

import { createAdminClient } from '@/lib/pocketbase/server'
import { verifyAdminAccess } from '@/services/auth/access-control'
import { revalidatePath } from 'next/cache'

export interface AppSettings {
    id: string
    company_name: string
    contact_email: string
    company_phone: string
    company_address: string
    email_notifications: boolean
    new_quote_alert: boolean
    quote_status_alert: boolean
    show_prices: boolean
    maintenance_mode: boolean
    default_language: string
    currency: string
}

const DEFAULT_SETTINGS: Omit<AppSettings, 'id'> = {
    company_name: 'TV Film Solutions',  // Matches site-content.ts
    contact_email: 'contact@tfs.ma',    // Matches site-content.ts
    company_phone: '+212522246372',      // Matches site-content.ts (format: link)
    company_address: '55-57, Rue Souleimane el Farissi, Casablanca 20330, Morocco',  // Matches site-content.ts
    email_notifications: true,
    new_quote_alert: true,
    quote_status_alert: true,
    show_prices: false,
    maintenance_mode: false,
    default_language: 'en',
    currency: 'MAD'  // Morocco uses MAD, not USD
}

/**
 * Get application settings.
 * Ensures a settings record always exists.
 */
export async function getSettings(): Promise<{ success: boolean, settings: AppSettings | null, error?: string }> {
    try {
        // We might want to allow public read access for some settings in the future,
        // but for now let's use admin client to be safe and consistent.
        // Actually, public needs to see some of this (like company info), but this action is for the ADMIN PAGE.

        const client = await createAdminClient()

        try {
            // Try to get the first record
            const record = await client.collection('settings').getFirstListItem('')
            return {
                success: true,
                settings: {
                    id: record.id,
                    company_name: record.company_name,
                    contact_email: record.contact_email,
                    company_phone: record.company_phone,
                    company_address: record.company_address,
                    email_notifications: record.email_notifications,
                    new_quote_alert: record.new_quote_alert,
                    quote_status_alert: record.quote_status_alert,
                    show_prices: record.show_prices,
                    maintenance_mode: record.maintenance_mode,
                    default_language: record.default_language,
                    currency: record.currency
                }
            }
        } catch (e: any) {
            // Check if the collection doesn't exist (404)
            if (e?.status === 404 && e?.message?.includes('collection')) {
                console.log('[Settings] Settings collection not found, using defaults.')
                return {
                    success: true,
                    settings: {
                        id: 'default',
                        ...DEFAULT_SETTINGS
                    }
                }
            }

            // If no record found (but collection exists), try to create one
            console.log('[Settings] No settings found, creating default.')
            try {
                const record = await client.collection('settings').create(DEFAULT_SETTINGS)
                return {
                    success: true,
                    settings: {
                        id: record.id,
                        ...DEFAULT_SETTINGS
                    }
                }
            } catch (createError: any) {
                // If creation also fails (e.g., collection doesn't exist), return defaults
                console.log('[Settings] Could not create settings, using defaults.')
                return {
                    success: true,
                    settings: {
                        id: 'default',
                        ...DEFAULT_SETTINGS
                    }
                }
            }
        }

    } catch (error) {
        console.error('[Settings] Error fetching settings:', error)
        // Return default settings even on error to prevent app crash
        return {
            success: true,
            settings: {
                id: 'default',
                ...DEFAULT_SETTINGS
            }
        }
    }
}

/**
 * Update application settings
 */
export async function updateSettings(formData: FormData): Promise<{ success: boolean, error?: string }> {
    try {
        const isAdmin = await verifyAdminAccess()
        if (!isAdmin) {
            return { success: false, error: 'Unauthorized' }
        }

        const client = await createAdminClient()

        // Find the record to update (should be the first/only one)
        let id: string
        try {
            const record = await client.collection('settings').getFirstListItem('')
            id = record.id
        } catch {
            return { success: false, error: 'Settings record not found' }
        }

        const data: any = {}

        // Text fields
        const textFields = ['company_name', 'contact_email', 'company_phone', 'company_address', 'default_language', 'currency']
        textFields.forEach(field => {
            const val = formData.get(field)
            if (val !== null) data[field] = val.toString()
        })

        // Boolean fields - checkboxes send 'on' or nothing. Handled in client usually, 
        // but robustly: if client sends "true" string or checkbox state.
        // We'll assume the form sends explicit boolean-like strings or we check presence.
        // Wait, checkboxes in FormData: if unchecked, they are MISSING from FormData.
        // So we must know which fields are booleans to default them to false if missing?
        // OR, the client sends explicit "true"/"false" values. 
        // Let's assume the client will handle sending explicit values for simplicity, 
        // OR we map them here.

        const boolFields = ['email_notifications', 'new_quote_alert', 'quote_status_alert', 'show_prices', 'maintenance_mode']

        // Strategy: The payload from our client component will ensure these are sent as strings 'true'/'false'
        // or we check strictly.
        boolFields.forEach(field => {
            const val = formData.get(field)
            // If receiving from JSON payload (via hidden inputs or controlled form), likely 'true'/'false'.
            if (val === 'true' || val === 'on') data[field] = true
            else if (val === 'false') data[field] = false
            // If completely missing, usually means false for checkboxes, but let's be careful.
        })

        await client.collection('settings').update(id, data)

        revalidatePath('/[lng]/admin/settings')

        return { success: true }
    } catch (error) {
        console.error('[Settings] Error updating settings:', error)
        return { success: false, error: 'Failed to update settings' }
    }
}
