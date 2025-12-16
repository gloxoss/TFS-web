'use server'

/**
 * Admin Dashboard Server Actions
 * 
 * Server-side actions for admin dashboard stats and overview.
 * Different from user dashboard - this shows platform-wide metrics.
 */

import { verifyAdminAccess } from '@/services/auth/access-control'
import { createServerClient } from '@/lib/pocketbase/server'

export interface AdminDashboardStats {
    totalEquipment: number
    totalUsers: number
    pendingQuotes: number
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
        // Verify admin access
        const isAdmin = await verifyAdminAccess()
        if (!isAdmin) {
            return {
                success: false,
                stats: null,
                error: 'Unauthorized'
            }
        }

        const client = await createServerClient(false)

        // Fetch counts in parallel
        const [
            equipmentResult,
            usersResult,
            quotesResult
        ] = await Promise.all([
            client.collection('equipment').getList(1, 1),
            client.collection('users').getList(1, 1),
            client.collection('quotes').getFullList({
                sort: '-created'
            })
        ])

        // Calculate quote stats
        const pendingQuotes = quotesResult.filter(
            (q) => q.status === 'pending' || q.status === 'reviewing'
        ).length
        const confirmedQuotes = quotesResult.filter(
            (q) => q.status === 'confirmed' || q.status === 'quoted'
        ).length

        // Get recent activity (last 5 quotes)
        const recentActivity: ActivityItem[] = quotesResult.slice(0, 5).map((quote) => ({
            id: quote.id,
            type: 'quote' as const,
            action: 'Quote submitted',
            description: `${quote.client_name} submitted a rental request`,
            timestamp: quote.created,
            metadata: {
                status: quote.status,
                email: quote.client_email
            }
        }))

        return {
            success: true,
            stats: {
                totalEquipment: equipmentResult.totalItems,
                totalUsers: usersResult.totalItems,
                pendingQuotes,
                confirmedQuotes,
                totalQuotes: quotesResult.length,
                recentActivity
            }
        }
    } catch (error) {
        console.error('[AdminDashboard] Error fetching stats:', error)
        if ((error as any)?.response) {
            console.error('[AdminDashboard] Error Details:', JSON.stringify((error as any).response, null, 2))
        }
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

        const client = await createServerClient(false)
        const result = await client.collection('quotes').getList(1, limit, {
            sort: '-created'
        })

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
                status: q.status,
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
