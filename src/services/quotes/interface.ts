/**
 * Quote Service Interface
 * 
 * Backend-agnostic interface for quote/rental request operations.
 * Follows the replaceable backend pattern per AI_ARCHITECT_RULES.
 */

import type { CartItem } from '@/stores/useCartStore'
import type { PaginatedResult } from '@/services/products/interface'

// ============================================================================
// Domain Types (Backend-agnostic)
// ============================================================================

/**
 * Quote status options per TDD cinema-tdd.md
 */
export type QuoteStatus = 'pending' | 'reviewing' | 'quoted' | 'confirmed' | 'rejected'

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

  // Project details (TDD: project_description, special_requests)
  projectDescription?: string
  specialRequests?: string

  // Language preference (for follow-up communications)
  language?: string

  // Link to registered user (if authenticated)
  userId?: string
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
  accessToken?: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientCompany?: string
  itemsJson: string // Stringified JSON of items
  rentalStartDate: string
  rentalEndDate: string
  projectDescription?: string
  specialRequests?: string
  status: QuoteStatus
  confirmationNumber?: string
  language?: string
  internalNotes?: string
  estimatedPrice?: number
  pdfGenerated: boolean
  pdfFileUrl?: string
  pdfFileName?: string
  isLocked?: boolean
  followUpDate?: string
  quotedAt?: string  // Timestamp when quote was sent (for grace period editing)
  created: string
  updated: string
  // Optional expanded fields
  expand?: {
    user?: {
      email: string
      name?: string
    }
  }
}

/**
 * Quote creation result
 */
export interface QuoteResult {
  success: boolean
  data?: {
    quoteId: string
    confirmationNumber: string
    accessToken?: string
  } | Quote
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
   * Get quotes with pagination and optional filtering
   * Used for Admin Dashboard
   */
  getQuotes(page?: number, perPage?: number, status?: QuoteStatus): Promise<PaginatedResult<Quote>>

  /**
   * Get quotes for authenticated user (customer view)
   */
  getUserQuotes(userId: string): Promise<Quote[]>

  /**
   * Get quotes by email address
   * Used when quotes are linked by client_email rather than user relation
   */
  getQuotesByEmail(email: string): Promise<Quote[]>

  /**
   * Get quote by ID
   */
  /**
   * Get quote by ID
   */
  getQuoteById(quoteId: string): Promise<Quote | null>

  /**
   * Get quote by ID and Token (Secure Public Access)
   * Used for Magic Links
   */
  getQuoteByToken(quoteId: string, token: string): Promise<Quote | null>

  /**
   * Admin: Upload a PDF quote and lock the record
   */
  uploadQuote(id: string, file: File, price: number): Promise<QuoteResult>

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
