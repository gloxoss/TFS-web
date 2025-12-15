/**
 * Email Service Interface
 * 
 * Backend-agnostic interface for sending emails.
 * Implementations can use Resend, SMTP, SendGrid, etc.
 * 
 * Per AI_ARCHITECT_RULES: All services use dependency injection and interfaces.
 */

// ============================================================================
// Email Types
// ============================================================================

/**
 * Base email payload
 */
export interface EmailPayload {
  to: string | string[]
  subject: string
  replyTo?: string
}

/**
 * Quote confirmation email payload (sent to customer)
 */
export interface QuoteConfirmationEmailPayload extends EmailPayload {
  customerName: string
  confirmationNumber: string
  items: QuoteEmailItem[]
  rentalStartDate: string
  rentalEndDate: string
  projectDescription?: string
  specialRequests?: string
  // Magic link fields for quote tracking
  quoteId?: string
  accessToken?: string
  language?: string
}

/**
 * Admin notification email payload (sent to admin on new quote)
 */
export interface AdminQuoteNotificationPayload extends EmailPayload {
  customerName: string
  customerEmail: string
  customerPhone: string
  customerCompany?: string
  confirmationNumber: string
  items: QuoteEmailItem[]
  rentalStartDate: string
  rentalEndDate: string
  projectDescription?: string
  specialRequests?: string
  quoteId: string
}

export interface QuoteEmailItem {
  name: string
  quantity: number
  imageUrl?: string
  slug?: string
}

/**
 * Quote ready notification email payload (sent to customer when quote is processed)
 * Subject is optional - defaults to "Your Quote is Ready - {confirmationNumber}"
 */
export interface QuoteReadyNotificationPayload extends Omit<EmailPayload, 'subject'> {
  subject?: string // Optional - service provides default
  customerName: string
  confirmationNumber: string
  quoteId: string
  accessToken: string
  estimatedPrice?: number
  language: string
}

/**
 * Email send result
 */
export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

// ============================================================================
// Service Interface
// ============================================================================

/**
 * Email Service Interface
 * 
 * Implementations must handle:
 * - Customer quote confirmation emails
 * - Admin notification emails
 * - Error handling with graceful degradation
 */
export interface IEmailService {
  /**
   * Send quote confirmation to customer
   */
  sendQuoteConfirmation(payload: QuoteConfirmationEmailPayload): Promise<EmailResult>

  /**
   * Send new quote notification to admin
   */
  sendAdminQuoteNotification(payload: AdminQuoteNotificationPayload): Promise<EmailResult>

  /**
   * Send quote ready notification to customer (with magic link)
   */
  sendQuoteReadyNotification(payload: QuoteReadyNotificationPayload): Promise<EmailResult>

  /**
   * Generic send method for custom emails
   */
  send(payload: EmailPayload & { html: string }): Promise<EmailResult>
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format date for email display
 */
export function formatDateForEmail(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

/**
 * Calculate rental days between two dates
 */
export function calculateRentalDays(startDate: string, endDate: string): number {
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, diffDays + 1) // Include both start and end day
  } catch {
    return 1
  }
}
