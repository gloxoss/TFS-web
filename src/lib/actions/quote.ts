/**
 * Quote Request Server Action
 * 
 * Creates a quote request via the QuoteService.
 * Returns structured result per architecture rules (no raw throws).
 * 
 * BLIND QUOTE MODE:
 * - NO pricing information sent from client
 * - Admin will calculate and provide pricing
 * 
 * Uses 'quotes' collection per TDD specification.
 */

'use server'

import { cookies } from 'next/headers'
import PocketBase from 'pocketbase'
import { QuoteFormData } from '@/lib/schemas/quote'
import { getQuoteService } from '@/services'
import type { CreateQuotePayload, QuoteResult } from '@/services'

// BLIND QUOTE: Simplified cart item - no pricing data
interface SubmissionCartItem {
  id: string
  product: {
    id: string
    name: string
    slug: string
    imageUrl?: string
  }
  quantity: number
  dates: {
    start: string
    end: string
  }
  groupId?: string
  kitTemplateId?: string
  kitSelections?: { [slotId: string]: string[] }
}

interface QuoteSubmissionData {
  formData: QuoteFormData
  items: SubmissionCartItem[]
  globalDates?: {
    start: string
    end: string
  } | null
  lng: string
}

export async function submitQuote(submission: QuoteSubmissionData): Promise<QuoteResult> {
  try {
    const { formData, items, globalDates, lng } = submission

    // Validate items exist
    if (!items || items.length === 0) {
      return {
        success: false,
        error: 'Your cart is empty. Please add items before submitting.',
      }
    }

    // Validate dates exist (either global or per-item)
    const hasValidDates = globalDates || items.every((item) => item.dates)
    if (!hasValidDates) {
      return {
        success: false,
        error: 'Please select rental dates for your items.',
      }
    }

    // Initialize PocketBase with server cookies for authenticated requests
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090')
    
    // Try to load auth from cookies
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('pb_auth')
    if (authCookie) {
      try {
        pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`)
        await pb.collection('users').authRefresh()
      } catch {
        // Auth invalid, continue as guest
        pb.authStore.clear()
      }
    }

    // Calculate date range from first item or global dates
    const startDate = globalDates?.start || items[0]?.dates?.start || new Date().toISOString()
    const endDate = globalDates?.end || items[0]?.dates?.end || new Date().toISOString()

    // BLIND QUOTE: Prepare items WITHOUT pricing (admin will calculate)
    const quoteItems = items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      quantity: item.quantity,
      imageUrl: item.product.imageUrl,
      kitSelections: item.kitSelections,
    }))

    // Build payload for quote service (per TDD field mappings)
    const payload: CreateQuotePayload = {
      // Client info (TDD: client_name, client_email, client_phone, client_company)
      clientName: `${formData.firstName} ${formData.lastName}`.trim(),
      clientEmail: formData.email,
      clientPhone: formData.phone,
      clientCompany: formData.company || undefined,
      
      // Items
      items: quoteItems,
      
      // Dates (TDD: rental_start_date, rental_end_date)
      rentalStartDate: startDate,
      rentalEndDate: endDate,
      
      // Project details (TDD: project_description, special_requests)
      projectDescription: formData.projectDescription 
        ? `[${formData.projectType}] ${formData.projectDescription}`
        : `Project type: ${formData.projectType}`,
      specialRequests: [
        formData.deliveryPreference ? `Delivery: ${formData.deliveryPreference}` : '',
        formData.notes || '',
      ].filter(Boolean).join('\n'),
      
      // Language
      language: lng,
    }

    // Use quote service (with injected PB client)
    const quoteServiceInstance = getQuoteService(pb)
    const result = await quoteServiceInstance.createQuote(payload)

    // TODO: Send confirmation email (future feature)
    // await sendConfirmationEmail(formData.email, result.data?.confirmationNumber, quoteItems)

    return result
  } catch (error) {
    console.error('Quote submission error:', error)
    
    // Return user-friendly error
    return {
      success: false,
      error: 'Unable to submit your quote request. Please try again or contact us directly.',
    }
  }
}
