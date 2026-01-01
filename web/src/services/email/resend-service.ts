/**
 * Resend Email Service
 * 
 * Implementation of IEmailService using Resend API.
 * Handles quote confirmations and admin notifications.
 * 
 * Environment Variables Required:
 * - RESEND_API_KEY: Your Resend API key
 * - EMAIL_FROM: Sender email (e.g., "Cinema Rentals <noreply@yoursite.com>")
 * - ADMIN_EMAIL: Admin notification recipient
 */

import type {
  IEmailService,
  EmailPayload,
  EmailResult,
  QuoteConfirmationEmailPayload,
  AdminQuoteNotificationPayload,
  QuoteReadyNotificationPayload,
} from './interface'
import { createServiceLogger } from '@/lib/logger'
import { getEmailConfig } from './templates/config'
import { generateQuoteConfirmationHtml } from './templates/quote-confirmation'
import { generateAdminNotificationHtml } from './templates/admin-notification'
import { generateQuoteReadyHtml } from './templates/quote-ready'

// ============================================================================
// Configuration
// ============================================================================

const RESEND_API_URL = 'https://api.resend.com/emails'

// ============================================================================
// Resend Email Service Implementation
// ============================================================================

export class ResendEmailService implements IEmailService {
  private apiKey: string
  private fromEmail: string
  private adminEmail: string
  private log = createServiceLogger('EmailService')

  constructor() {
    const config = getEmailConfig()
    this.apiKey = config.apiKey
    this.fromEmail = config.fromEmail
    this.adminEmail = config.adminEmail
  }

  /**
   * Send an email via Resend API
   */
  async send(payload: EmailPayload & { html: string }): Promise<EmailResult> {
    if (!this.apiKey) {
      this.log.warn('RESEND_API_KEY not configured - email not sent')
      return {
        success: false,
        error: 'Email service not configured',
      }
    }

    try {
      const response = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: Array.isArray(payload.to) ? payload.to : [payload.to],
          subject: payload.subject,
          html: payload.html,
          reply_to: payload.replyTo,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        this.log.error('Resend API error', new Error(errorData.message || 'API error'), { errorData })
        return {
          success: false,
          error: errorData.message || 'Failed to send email',
        }
      }

      const data = await response.json()
      return {
        success: true,
        messageId: data.id,
      }
    } catch (error) {
      this.log.error('Email send error', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Send quote confirmation to customer
   */
  async sendQuoteConfirmation(payload: QuoteConfirmationEmailPayload): Promise<EmailResult> {
    const html = generateQuoteConfirmationHtml(payload)

    return this.send({
      to: payload.to,
      subject: payload.subject || `Quote Request Received - ${payload.confirmationNumber}`,
      html,
      replyTo: payload.replyTo,
    })
  }

  /**
   * Send new quote notification to admin
   */
  async sendAdminQuoteNotification(payload: AdminQuoteNotificationPayload): Promise<EmailResult> {
    if (!this.adminEmail) {
      this.log.warn('ADMIN_EMAIL not configured - admin notification not sent')
      return {
        success: false,
        error: 'Admin email not configured',
      }
    }

    const html = generateAdminNotificationHtml(payload)

    return this.send({
      to: payload.to || this.adminEmail,
      subject: payload.subject || `🎬 New Quote Request: ${payload.confirmationNumber}`,
      html,
      replyTo: payload.customerEmail,
    })
  }

  /**
   * Send quote ready notification to customer (with magic link)
   */
  async sendQuoteReadyNotification(payload: QuoteReadyNotificationPayload): Promise<EmailResult> {
    const html = generateQuoteReadyHtml(payload)

    return this.send({
      to: payload.to,
      subject: payload.subject || `Your Quote is Ready - ${payload.confirmationNumber}`,
      html,
      replyTo: payload.replyTo,
    })
  }
}

// ============================================================================
// Console/Mock Email Service (for development without Resend)
// ============================================================================

export class ConsoleEmailService implements IEmailService {
  async send(payload: EmailPayload & { html: string }): Promise<EmailResult> {
    console.log('📧 [DEV] Email would be sent:')
    console.log('  To:', payload.to)
    console.log('  Subject:', payload.subject)
    console.log('  HTML length:', payload.html.length)
    return { success: true, messageId: 'dev-' + Date.now() }
  }

  async sendQuoteConfirmation(payload: QuoteConfirmationEmailPayload): Promise<EmailResult> {
    console.log('📧 [DEV] Quote Confirmation Email:')
    console.log('  To:', payload.to)
    console.log('  Customer:', payload.customerName)
    console.log('  Confirmation:', payload.confirmationNumber)
    console.log('  Items:', payload.items.length)
    return { success: true, messageId: 'dev-confirmation-' + Date.now() }
  }

  async sendAdminQuoteNotification(payload: AdminQuoteNotificationPayload): Promise<EmailResult> {
    console.log('📧 [DEV] Admin Notification Email:')
    console.log('  Quote ID:', payload.quoteId)
    console.log('  Customer:', payload.customerName, `<${payload.customerEmail}>`)
    console.log('  Confirmation:', payload.confirmationNumber)
    console.log('  Items:', payload.items.length)
    return { success: true, messageId: 'dev-admin-' + Date.now() }
  }

  async sendQuoteReadyNotification(payload: QuoteReadyNotificationPayload): Promise<EmailResult> {
    console.log('📧 [DEV] Quote Ready Notification Email:')
    console.log('  To:', payload.to)
    console.log('  Customer:', payload.customerName)
    console.log('  Confirmation:', payload.confirmationNumber)
    console.log('  Quote ID:', payload.quoteId)
    console.log('  Price:', payload.estimatedPrice || 'Not set')
    return { success: true, messageId: 'dev-ready-' + Date.now() }
  }
}
