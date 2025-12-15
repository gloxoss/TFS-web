/**
 * PocketBase Quote Service
 * 
 * Implements IQuoteService using PocketBase 'quotes' collection.
 * Follows TDD schema from cinema-tdd.md:
 * - client_name, client_email, client_phone, client_company
 * - items_json, rental_start_date, rental_end_date
 * - project_description, location, special_requests
 * - status, internal_notes, estimated_price, pdf_generated, follow_up_date
 */

import PocketBase from 'pocketbase'
import type {
  IQuoteService,
  CreateQuotePayload,
  Quote,
  QuoteResult,
  QuoteStatus,
} from './interface'
import type { PaginatedResult } from '@/services/products/interface'

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'

export class PocketBaseQuoteService implements IQuoteService {
  private pb: PocketBase

  constructor(pbClient: PocketBase) {
    if (!pbClient) {
      throw new Error('[PocketBaseQuoteService] An authenticated PocketBase client is required.');
    }
    this.pb = pbClient
  }

  /**
   * Map PocketBase record to domain Quote type
   */
  private mapRecordToQuote(record: Record<string, unknown>): Quote {
    return {
      id: record.id as string,
      clientName: record.client_name as string,
      clientEmail: record.client_email as string,
      clientPhone: record.client_phone as string,
      clientCompany: record.client_company as string | undefined,
      // Safely handle items_json which might be object (PB auto-parse) or string
      itemsJson: typeof record.items_json === 'string'
        ? record.items_json
        : JSON.stringify(record.items_json || []),
      rentalStartDate: record.rental_start_date as string,
      rentalEndDate: record.rental_end_date as string,
      projectDescription: record.project_description as string | undefined,
      specialRequests: record.special_requests as string | undefined,
      status: (record.status as QuoteStatus) || 'pending',
      internalNotes: record.internal_notes as string | undefined,
      estimatedPrice: record.estimated_price as number | undefined,
      pdfGenerated: (record.pdf_generated as boolean) || false,
      // Map attached quote_pdf file field - PocketBase stores filename, we need to build full URL
      pdfFileUrl: record.quote_pdf
        ? `${process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'}/api/files/quotes/${record.id}/${record.quote_pdf}`
        : undefined,
      pdfFileName: record.quote_pdf as string | undefined,
      followUpDate: record.follow_up_date as string | undefined,
      quotedAt: record.quoted_at as string | undefined,  // Timestamp when quote was sent
      created: record.created as string,
      updated: record.updated as string,
      expand: record.expand as any,
      isLocked: record.locked as boolean,
    }
  }

  /**
   * Generate a human-readable confirmation number
   */
  private generateConfirmationNumber(): string {
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let suffix = ''
    for (let i = 0; i < 4; i++) {
      suffix += chars[Math.floor(Math.random() * chars.length)]
    }
    return `TFS-${year}${month}${day}-${suffix}`
  }

  async createQuote(payload: CreateQuotePayload): Promise<QuoteResult> {
    try {
      const confirmationNumber = this.generateConfirmationNumber()
      const accessToken = crypto.randomUUID()

      // Build the record data - only include user if provided
      const recordData: Record<string, unknown> = {
        client_name: payload.clientName,
        client_email: payload.clientEmail,
        client_phone: payload.clientPhone,
        client_company: payload.clientCompany || '',
        items_json: payload.items, // PocketBase json field expects the actual object
        rental_start_date: new Date(payload.rentalStartDate).toISOString().split('T')[0],
        rental_end_date: new Date(payload.rentalEndDate).toISOString().split('T')[0],
        project_description: payload.projectDescription || '',
        special_requests: payload.specialRequests || '',
        status: 'pending' as QuoteStatus,
        // pdf_generated: false, // Let database use default (false)
        confirmation_number: confirmationNumber,
        language: payload.language || 'en',
        access_token: accessToken, // Added via migration
      }

      // Only add user relation if provided (don't send empty string)
      if (payload.userId) {
        recordData.user = payload.userId
      }

      console.log('[QuoteService] Creating quote with payload:', JSON.stringify(recordData, null, 2))

      const record = await this.pb.collection('quotes').create(recordData)

      // Log the magic link for testing (temporary)
      console.log(`🎬 Magic Link Generated: /en/quote/${record.id}?token=${accessToken}`)

      return { success: true, data: { quoteId: record.id, confirmationNumber, accessToken } }
    } catch (error: any) {
      console.error('Quote creation error:', error)
      // Log detailed PocketBase error response if available
      if (error?.response?.data) {
        console.error('PocketBase error details:', JSON.stringify(error.response.data, null, 2))
      }
      if (error?.response) {
        console.error('PocketBase full response:', JSON.stringify(error.response, null, 2))
      }
      return { success: false, error: 'Unable to create quote. Please try again.' }
    }
  }

  async getUserQuotes(userId: string): Promise<Quote[]> {
    try {
      const records = await this.pb.collection('quotes').getList(1, 50, {
        filter: `user = "${userId}"`,
        sort: '-created',
      })
      return records.items.map((r) => this.mapRecordToQuote(r))
    } catch (error) {
      console.error('Error fetching user quotes:', error)
      return []
    }
  }

  async getQuotesByEmail(email: string): Promise<Quote[]> {
    try {
      const records = await this.pb.collection('quotes').getList(1, 50, {
        filter: `client_email = "${email}"`,
        sort: '-created',
      })
      return records.items.map((r) => this.mapRecordToQuote(r))
    } catch (error) {
      console.error('Error fetching quotes by email:', error)
      return []
    }
  }

  async getQuoteById(quoteId: string): Promise<Quote | null> {
    try {
      const record = await this.pb.collection('quotes').getOne(quoteId, { expand: 'user' })
      return this.mapRecordToQuote(record)
    } catch (error) {
      console.error('Error fetching quote:', error)
      return null
    }
  }

  // ... (existing methods)

  async getQuotes(page = 1, perPage = 20, status?: QuoteStatus): Promise<PaginatedResult<Quote>> {
    try {
      const filterString = status ? `status = "${status}"` : ''
      const options: any = {
        // sort: '-created', // TEMP: Disable to see if this is the cause
        expand: 'user',
      }
      // ONLY add filter if it is not empty string, otherwise API throws 400
      if (filterString) {
        options.filter = filterString
      }

      console.log('[PocketBaseQuoteService] Fetching quotes. Options:', JSON.stringify(options))

      const records = await this.pb.collection('quotes').getList(page, perPage, options)

      console.log('[PocketBaseQuoteService] Success. Total items:', records.totalItems)

      return {
        items: records.items.map((r) => this.mapRecordToQuote(r)),
        page: records.page,
        perPage: records.perPage,
        totalItems: records.totalItems,
        totalPages: records.totalPages,
      }
    } catch (error) {
      console.error('[PocketBaseQuoteService] Error fetching admin quotes:', error)
      return {
        items: [],
        page,
        perPage,
        totalItems: 0,
        totalPages: 0,
      }
    }
  }

  async updateQuoteStatus(
    quoteId: string,
    status: QuoteStatus,
    internalNotes?: string
  ): Promise<Quote> {
    const updateData: Record<string, unknown> = { status }
    if (internalNotes !== undefined) {
      updateData.internal_notes = internalNotes
    }

    const record = await this.pb.collection('quotes').update(quoteId, updateData)
    return this.mapRecordToQuote(record)
  }

  async setEstimatedPrice(quoteId: string, price: number): Promise<Quote> {
    const record = await this.pb.collection('quotes').update(quoteId, {
      estimated_price: price,
    })
    return this.mapRecordToQuote(record)
  }
  async uploadQuote(id: string, file: File, price: number): Promise<QuoteResult> {
    try {
      const formData = new FormData()
      formData.append('quote_pdf', file)
      formData.append('estimated_price', price.toString())
      formData.append('status', 'quoted')
      formData.append('locked', 'false')  // Changed: Allow editing during grace period
      formData.append('quoted_at', new Date().toISOString())  // Set timestamp for grace period

      const record = await this.pb.collection('quotes').update(id, formData)
      return { success: true, data: this.mapRecordToQuote(record) }
    } catch (error) {
      console.error('Error uploading quote:', error)
      return { success: false, error: 'Failed to upload quote and lock record.' }
    }
  }
}
