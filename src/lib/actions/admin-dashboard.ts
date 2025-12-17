'use server'

/**
 * Admin Dashboard Server Actions
 * 
 * Server-side actions for admin dashboard stats and overview.
 * Different from user dashboard - this shows platform-wide metrics.
 */

import { verifyAdminAccess } from '@/services/auth/access-control'
import { createAdminClient } from '@/lib/pocketbase/server'

export interface AdminDashboardStats {
    totalEquipment: number
    totalUsers: number
    pendingQuotes: number
    quotedQuotes: number
    confirmedQuotes: number
    totalQuotes: number
    recentActivity: ActivityItem[]
}

export interface ActivityItem {
    id: string
    type: 'quote' | 'equipment' | 'user' | 'blog'
    action: string
    description: string
    timestamp: string
    metadata?: Record<string, unknown>
}

export interface QuoteOverview {
    id: string
    clientName: string
    clientEmail: string
    status: string
    itemCount: number
    rentalStartDate: string
    created: string
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminDashboardStats(): Promise<{
    success: boolean
    stats: AdminDashboardStats | null
    error?: string
}> {
    try {
        // Verify admin access (Web Layer Security)
        const isAdmin = await verifyAdminAccess()
        if (!isAdmin) {
            return {
                success: false,
                stats: null,
                error: 'Unauthorized'
            }
        }

        // Use Admin Client for Data Fetching (Bypass API Rules)
        const client = await createAdminClient()

        // Debug log
        console.log('[AdminDashboard] Using Admin Client for stats fetch')
        console.log('[AdminDashboard] Connected to:', client.baseUrl)

        // Debug auth state
        // console.log('[AdminDashboard] Auth State:', {
        //     isValid: client.authStore.isValid,
        //     modelId: client.authStore.model?.id,
        //     role: client.authStore.model?.role
        // });

        // Initialize defaults
        let totalEquipment = 0;
        let totalUsers = 0;
        let quotesResult: any[] = [];

        // 1. Fetch Equipment Count
        try {
            const result = await client.collection('equipment').getList(1, 1);
            totalEquipment = result.totalItems;
        } catch (e) {
            console.error('[AdminDashboard] Failed to fetch equipment count:', e);
        }

        // 2. Fetch Users Count
        try {
            const result = await client.collection('users').getList(1, 1);
            totalUsers = result.totalItems;
        } catch (e) {
            console.error('[AdminDashboard] Failed to fetch users count:', e);
        }

        // 3. Fetch Quotes (Use getList instead of getFullList to be safer)
        try {
            console.log('[AdminDashboard] Fetching quotes...');
            const result = await client.collection('quotes').getList(1, 100);
            console.log(`[AdminDashboard] Fetched ${result.items.length} quotes (Total: ${result.totalItems})`);
            quotesResult = result.items;
        } catch (e: any) {
            console.error('[AdminDashboard] Failed to fetch quotes:', e);
            if (e.response) {
                console.error('[AdminDashboard] Error details:', JSON.stringify(e.response, null, 2));
            }
        }

        // Calculate quote stats
        const pendingQuotes = quotesResult.filter((q) => {
            const status = Array.isArray(q.status) ? q.status[0] : q.status;
            return status === 'pending' || status === 'reviewing';
        }).length

        const quotedQuotes = quotesResult.filter((q) => {
            const status = Array.isArray(q.status) ? q.status[0] : q.status;
            return status === 'quoted';
        }).length

        const confirmedQuotes = quotesResult.filter((q) => {
            const status = Array.isArray(q.status) ? q.status[0] : q.status;
            return status === 'confirmed';
        }).length

        // Get recent activity (last 5 quotes)
        const recentActivity: ActivityItem[] = quotesResult.slice(0, 5).map((quote) => ({
            id: quote.id,
            type: 'quote' as const,
            action: 'Quote submitted',
            description: `${quote.client_name} submitted a rental request`,
            timestamp: quote.created,
            metadata: {
                status: Array.isArray(quote.status) ? quote.status[0] : quote.status,
                email: quote.client_email
            }
        }))

        return {
            success: true,
            stats: {
                totalEquipment,
                totalUsers,
                pendingQuotes,
                quotedQuotes,
                confirmedQuotes,
                totalQuotes: quotesResult.length,
                recentActivity
            }
        }
    } catch (error) {
        console.error('[AdminDashboard] Fatal error fetching stats:', error)
        return {
            success: false,
            stats: null,
            error: error instanceof Error ? error.message : 'Failed to fetch stats'
        }
    }
}

/**
 * Get recent quotes for admin dashboard
 */
export async function getRecentQuotes(limit: number = 5): Promise<{
    success: boolean
    quotes: QuoteOverview[]
    error?: string
}> {
    try {
        const isAdmin = await verifyAdminAccess()
        if (!isAdmin) {
            return { success: false, quotes: [], error: 'Unauthorized' }
        }

        // Use Admin Client for Data Fetching
        const client = await createAdminClient()
        console.log('[AdminDashboard] Requesting recent quotes...')
        const result = await client.collection('quotes').getList(1, limit)
        console.log(`[AdminDashboard] Found ${result.items.length} recent quotes`)

        const quotes: QuoteOverview[] = result.items.map((q) => {
            let itemCount = 0
            try {
                const items = JSON.parse(q.items_json || '[]')
                itemCount = items.length
            } catch { /* ignore */ }

            return {
                id: q.id,
                clientName: q.client_name,
                clientEmail: q.client_email,
                status: Array.isArray(q.status) ? q.status[0] : q.status,
                itemCount,
                rentalStartDate: q.rental_start_date,
                created: q.created
            }
        })

        return { success: true, quotes }
    } catch (error) {
        console.error('[AdminDashboard] Error fetching quotes:', error)
        return {
            success: false,
            quotes: [],
            error: error instanceof Error ? error.message : 'Failed to fetch quotes'
        }
    }
}
