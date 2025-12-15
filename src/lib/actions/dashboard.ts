'use server'

/**
 * Dashboard Server Actions
 * 
 * Server-side actions for the user dashboard.
 * Fetches quotes and other user-related data.
 */

import { createServerClient, createAdminClient } from '@/lib/pocketbase/server'
import { getQuoteService } from '@/services'
import type { Quote } from '@/services'

export type DashboardQuote = {
  id: string
  confirmationNumber?: string
  status: 'pending' | 'reviewing' | 'quoted' | 'confirmed' | 'rejected'
  rentalStartDate: string
  rentalEndDate: string
  itemCount: number
  items: Array<{
    name: string
    quantity: number
    imageUrl?: string
  }>
  created: string
  estimatedPrice?: number
  quotePdfUrl?: string
  isLocked?: boolean
}

/**
 * Get quotes for the currently authenticated user
 * Matches quotes by the user's email address
 */
export async function getUserDashboardQuotes(): Promise<{
  success: boolean
  quotes: DashboardQuote[]
  error?: string
}> {
  try {
    const client = await createServerClient(true)

    // Check if user is authenticated
    if (!client.authStore.isValid || !client.authStore.model) {
      return {
        success: false,
        quotes: [],
        error: 'Not authenticated'
      }
    }

    const userEmail = client.authStore.model.email
    if (!userEmail) {
      return {
        success: false,
        quotes: [],
        error: 'User email not found'
      }
    }

    // Use Admin Client to bypass ACLs and find "orphaned" quotes by email
    const adminClient = await createAdminClient()
    const service = getQuoteService(adminClient)

    console.log('[Dashboard] Fetching quotes (as Admin) for email:', userEmail)
    const quotes = await service.getQuotesByEmail(userEmail)
    console.log('[Dashboard] Found quotes count:', quotes.length)

    // Transform to dashboard-friendly format
    const dashboardQuotes: DashboardQuote[] = quotes.map((quote: Quote) => {
      // Parse items from JSON
      let items: Array<{ name: string; quantity: number; imageUrl?: string }> = []
      try {
        const parsedItems = JSON.parse(quote.itemsJson || '[]')
        items = parsedItems.map((item: { name?: string; quantity?: number; imageUrl?: string }) => ({
          name: item.name || 'Unknown Item',
          quantity: item.quantity || 1,
          imageUrl: item.imageUrl
        }))
      } catch {
        console.error('Failed to parse items JSON for quote:', quote.id)
      }

      return {
        id: quote.id,
        status: quote.status,
        rentalStartDate: quote.rentalStartDate,
        rentalEndDate: quote.rentalEndDate,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        items,
        created: quote.created,
        estimatedPrice: quote.estimatedPrice,
        quotePdfUrl: quote.pdfFileUrl, // Maps from Quote to DashboardQuote
        isLocked: quote.isLocked,
      }
    })

    return {
      success: true,
      quotes: dashboardQuotes,
    }
  } catch (error) {
    console.error('Error fetching dashboard quotes:', error)
    return {
      success: false,
      quotes: [],
      error: 'Failed to fetch quotes'
    }
  }
}

/**
 * Get dashboard summary stats
 */
export async function getDashboardStats(): Promise<{
  totalQuotes: number
  pendingQuotes: number
  confirmedQuotes: number
  activeRentals: number
}> {
  try {
    const result = await getUserDashboardQuotes()

    if (!result.success) {
      return {
        totalQuotes: 0,
        pendingQuotes: 0,
        confirmedQuotes: 0,
        activeRentals: 0
      }
    }

    const quotes = result.quotes
    const now = new Date()

    return {
      totalQuotes: quotes.length,
      pendingQuotes: quotes.filter(q => q.status === 'pending' || q.status === 'reviewing').length,
      confirmedQuotes: quotes.filter(q => q.status === 'confirmed').length,
      activeRentals: quotes.filter(q => {
        if (q.status !== 'confirmed') return false
        const start = new Date(q.rentalStartDate)
        const end = new Date(q.rentalEndDate)
        return start <= now && end >= now
      }).length,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalQuotes: 0,
      pendingQuotes: 0,
      confirmedQuotes: 0,
      activeRentals: 0
    }
  }
}
