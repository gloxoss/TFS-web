/**
 * Quote Service Interface
 * 
 * Backend-agnostic interface for quote/rental request operations.
 * Follows the replaceable backend pattern per AI_ARCHITECT_RULES.
 */

import type { CartItem } from '@/stores/useCartStore'

// ============================================================================
// Domain Types (Backend-agnostic)
// ============================================================================

/**
 * Quote status options per TDD cinema-tdd.md
 */
export type QuoteStatus = 'pending' | 'reviewing' | 'confirmed' | 'rejected'

/**
 * Quote creation payload - matches form data structure
 */
export interface CreateQuotePayload {
  // Client contact (TDD: client_name, client_email, client_phone, client_company)
  clientName: string
  clientEmail: string
  clientPhone: string
  clientCompany?: string
  
  // Rental items (TDD: items_json)
  items: QuoteItemPayload[]
  
  // Dates (TDD: rental_start_date, rental_end_date)
  rentalStartDate: string
  rentalEndDate: string
  
  // Project details (TDD: project_description, location, special_requests)
  projectDescription?: string
  location?: string
  specialRequests?: string
  
  // Language preference (for follow-up communications)
  language?: string
}

/**
 * Simplified item structure for quote submission
 * 
 * BLIND QUOTE MODE:
 * - NO prices sent from client
 * - Admin determines pricing after review
 * - Only product references, quantities, and dates sent
 */
export interface QuoteItemPayload {
  productId: string
  name: string
  slug: string
  quantity: number
  imageUrl?: string
  // Kit selections if this item is a kit
  kitSelections?: { [slotId: string]: string[] }
}

/**
 * Quote record returned from backend
 */
export interface Quote {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientCompany?: string
  itemsJson: string // Stringified JSON of items
  rentalStartDate: string
  rentalEndDate: string
  projectDescription?: string
  location?: string
  specialRequests?: string
  status: QuoteStatus
  internalNotes?: string
  estimatedPrice?: number
  pdfGenerated: boolean
  followUpDate?: string
  created: string
  updated: string
}

/**
 * Quote creation result
 */
export interface QuoteResult {
  success: boolean
  data?: {
    quoteId: string
    confirmationNumber: string
  }
  error?: string
}

// ============================================================================
// Service Interface
// ============================================================================

export interface IQuoteService {
  /**
   * Create a new quote request
   */
  createQuote(payload: CreateQuotePayload): Promise<QuoteResult>
  
  /**
   * Get quotes for authenticated user (customer view)
   */
  getUserQuotes(userId: string): Promise<Quote[]>
  
  /**
   * Get quote by ID
   */
  getQuoteById(quoteId: string): Promise<Quote | null>
  
  /**
   * Admin: Get all quotes with optional status filter
   */
  getAllQuotes(status?: QuoteStatus): Promise<Quote[]>
  
  /**
   * Admin: Update quote status
   */
  updateQuoteStatus(
    quoteId: string, 
    status: QuoteStatus, 
    internalNotes?: string
  ): Promise<Quote>
  
  /**
   * Admin: Set estimated price
   */
  setEstimatedPrice(quoteId: string, price: number): Promise<Quote>
}

// ============================================================================
// Helper: Convert CartItems to QuoteItemPayload
// ============================================================================

/**
 * Convert cart items to quote submission format
 * 
 * BLIND QUOTE MODE:
 * - NO pricing information included
 * - Only product references, quantities, and kit selections
 * - Admin will calculate and set prices
 */
export function cartItemsToQuotePayload(items: CartItem[]): QuoteItemPayload[] {
  return items.map((item) => ({
    productId: item.product.id,
    name: item.product.name,
    slug: item.product.slug,
    quantity: item.quantity,
    imageUrl: item.product.imageUrl,
    kitSelections: item.kitSelections,
  }))
}
