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

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'

export class PocketBaseQuoteService implements IQuoteService {
  private pb: PocketBase

  constructor(pbClient?: PocketBase) {
    this.pb = pbClient || new PocketBase(POCKETBASE_URL)
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
      itemsJson: record.items_json as string,
      rentalStartDate: record.rental_start_date as string,
      rentalEndDate: record.rental_end_date as string,
      projectDescription: record.project_description as string | undefined,
      location: record.location as string | undefined,
      specialRequests: record.special_requests as string | undefined,
      status: (record.status as QuoteStatus) || 'pending',
      internalNotes: record.internal_notes as string | undefined,
      estimatedPrice: record.estimated_price as number | undefined,
      pdfGenerated: (record.pdf_generated as boolean) || false,
      followUpDate: record.follow_up_date as string | undefined,
      created: record.created as string,
      updated: record.updated as string,
    }
  }

  /**
   * Generate a human-readable confirmation number
   * Format: TFS-YYMMDD-XXXX (e.g., TFS-240115-A7B2)
   */
  private generateConfirmationNumber(): string {
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    
    // Generate 4 character alphanumeric suffix
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Exclude confusing chars
    let suffix = ''
    for (let i = 0; i < 4; i++) {
      suffix += chars[Math.floor(Math.random() * chars.length)]
    }
    
    return `TFS-${year}${month}${day}-${suffix}`
  }

  async createQuote(payload: CreateQuotePayload): Promise<QuoteResult> {
    try {
      const confirmationNumber = this.generateConfirmationNumber()
      
      // Create record in 'quotes' collection per TDD schema
      const record = await this.pb.collection('quotes').create({
        // Contact info (TDD field names)
        client_name: payload.clientName,
        client_email: payload.clientEmail,
        client_phone: payload.clientPhone,
        client_company: payload.clientCompany || '',
        
        // Items (TDD: items_json is stringified JSON)
        items_json: JSON.stringify(payload.items),
        
        // Dates (TDD field names)
        rental_start_date: payload.rentalStartDate,
        rental_end_date: payload.rentalEndDate,
        
        // Project details
        project_description: payload.projectDescription || '',
        location: payload.location || '',
        special_requests: payload.specialRequests || '',
        
        // Status and tracking
        status: 'pending' as QuoteStatus,
        pdf_generated: false,
        
        // Extras
        confirmation_number: confirmationNumber,
        language: payload.language || 'en',
      })

      return {
        success: true,
        data: {
          quoteId: record.id,
          confirmationNumber,
        },
      }
    } catch (error) {
      console.error('Quote creation error:', error)
      return {
        success: false,
        error: 'Unable to create quote. Please try again.',
      }
    }
  }

  async getUserQuotes(userId: string): Promise<Quote[]> {
    try {
      // Note: If quotes are linked to users, add filter
      // For now, this is admin-only per TDD
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

  async getQuoteById(quoteId: string): Promise<Quote | null> {
    try {
      const record = await this.pb.collection('quotes').getOne(quoteId)
      return this.mapRecordToQuote(record)
    } catch (error) {
      console.error('Error fetching quote:', error)
      return null
    }
  }

  async getAllQuotes(status?: QuoteStatus): Promise<Quote[]> {
    try {
      const filter = status ? `status = "${status}"` : ''
      const records = await this.pb.collection('quotes').getList(1, 100, {
        filter,
        sort: '-created',
      })
      return records.items.map((r) => this.mapRecordToQuote(r))
    } catch (error) {
      console.error('Error fetching all quotes:', error)
      return []
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
}
