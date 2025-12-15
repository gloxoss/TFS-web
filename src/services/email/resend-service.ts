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
  formatDateForEmail,
  calculateRentalDays,
} from './interface'
import { formatDateForEmail as formatDate, calculateRentalDays as calcDays } from './interface'

// ============================================================================
// Configuration
// ============================================================================

const RESEND_API_URL = 'https://api.resend.com/emails'

function getConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY || '',
    fromEmail: process.env.EMAIL_FROM || 'Cinema Rentals <noreply@example.com>',
    adminEmail: process.env.ADMIN_EMAIL || '',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Cinema Equipment Rentals',
  }
}

// ============================================================================
// Email Templates (Inline HTML for simplicity - can be moved to React Email later)
// ============================================================================

function generateQuoteConfirmationHtml(payload: QuoteConfirmationEmailPayload): string {
  const config = getConfig()
  const rentalDays = calcDays(payload.rentalStartDate, payload.rentalEndDate)

  const itemsHtml = payload.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #27272a;">
          <div style="display: flex; align-items: center; gap: 12px;">
            ${item.imageUrl
          ? `<img src="${item.imageUrl}" alt="${item.name}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px;" />`
          : ''
        }
            <span style="color: #fafafa; font-weight: 500;">${item.name}</span>
          </div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #27272a; text-align: right; color: #a1a1aa;">
          x${item.quantity}
        </td>
      </tr>
    `
    )
    .join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quote Request Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #fafafa; font-size: 24px; font-weight: 700; margin: 0;">
        ${config.siteName}
      </h1>
    </div>

    <!-- Main Card -->
    <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px;">
      
      <!-- Success Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 64px; height: 64px; background-color: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 50%; line-height: 64px;">
          <span style="font-size: 32px;">✓</span>
        </div>
      </div>

      <h2 style="color: #fafafa; font-size: 20px; font-weight: 600; text-align: center; margin: 0 0 8px;">
        Quote Request Received!
      </h2>
      
      <p style="color: #a1a1aa; text-align: center; margin: 0 0 32px;">
        Thank you, ${payload.customerName}. We've received your quote request and will get back to you within 24 hours.
      </p>

      <!-- Confirmation Number -->
      <div style="background-color: #09090b; border: 1px solid #27272a; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 32px;">
        <p style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px;">
          Confirmation Number
        </p>
        <p style="color: #fafafa; font-size: 24px; font-weight: 600; font-family: monospace; margin: 0;">
          ${payload.confirmationNumber}
        </p>
      </div>

      <!-- Rental Period -->
      <div style="background-color: #09090b; border: 1px solid #27272a; border-radius: 8px; padding: 16px; margin-bottom: 32px;">
        <p style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px;">
          Rental Period (${rentalDays} day${rentalDays > 1 ? 's' : ''})
        </p>
        <p style="color: #fafafa; font-size: 14px; margin: 0;">
          ${formatDate(payload.rentalStartDate)} — ${formatDate(payload.rentalEndDate)}
        </p>
      </div>

      <!-- Items -->
      <div style="margin-bottom: 32px;">
        <p style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px;">
          Requested Equipment
        </p>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
        </table>
      </div>

      ${payload.projectDescription
      ? `
      <!-- Project Details -->
      <div style="margin-bottom: 32px;">
        <p style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px;">
          Project Details
        </p>
        <p style="color: #a1a1aa; font-size: 14px; margin: 0;">
          ${payload.projectDescription}
      </p>
      </div>
      `
      : ''
    }

      ${payload.quoteId && payload.accessToken ? `
      <!-- Track Your Quote Button -->
      <div style="text-align: center; margin-bottom: 32px;">
        <a href="${config.siteUrl}/${payload.language || 'en'}/quote/${payload.quoteId}?token=${payload.accessToken}" 
           style="display: inline-block; background-color: #a855f7; color: #09090b; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
          Track Your Quote →
        </a>
        <p style="color: #71717a; font-size: 12px; margin-top: 12px;">
          Bookmark this link to check your quote status anytime
        </p>
      </div>
      ` : ''}

      <!-- What's Next -->
      <div style="background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; padding: 16px;">
        <p style="color: #3b82f6; font-weight: 600; margin: 0 0 8px;">
          What happens next?
        </p>
        <ul style="color: #a1a1aa; font-size: 14px; margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 4px;">Our team will review your request</li>
          <li style="margin-bottom: 4px;">We'll check equipment availability for your dates</li>
          <li style="margin-bottom: 4px;">You'll receive a detailed quote via email within 24 hours</li>
        </ul>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px;">
      <p style="color: #71717a; font-size: 12px; margin: 0 0 8px;">
        Questions? Reply to this email or call us directly.
      </p>
      <p style="color: #52525b; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} ${config.siteName}. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>
  `
}

function generateAdminNotificationHtml(payload: AdminQuoteNotificationPayload): string {
  const config = getConfig()
  const rentalDays = calcDays(payload.rentalStartDate, payload.rentalEndDate)

  const itemsHtml = payload.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #27272a; color: #fafafa;">
          ${item.name}
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid #27272a; text-align: center; color: #a1a1aa;">
          ${item.quantity}
        </td>
      </tr>
    `
    )
    .join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="background-color: #f59e0b; padding: 16px; border-radius: 8px 8px 0 0;">
      <h1 style="color: #000; font-size: 18px; font-weight: 600; margin: 0;">
        🎬 New Quote Request
      </h1>
    </div>

    <!-- Main Card -->
    <div style="background-color: #18181b; border: 1px solid #27272a; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
      
      <!-- Confirmation Number -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #27272a;">
        <span style="color: #71717a; font-size: 14px;">Reference</span>
        <span style="color: #fafafa; font-size: 18px; font-weight: 600; font-family: monospace;">
          ${payload.confirmationNumber}
        </span>
      </div>

      <!-- Customer Info -->
      <div style="margin-bottom: 24px;">
        <h3 style="color: #fafafa; font-size: 14px; font-weight: 600; margin: 0 0 12px;">
          Customer Information
        </h3>
        <table style="width: 100%;">
          <tr>
            <td style="color: #71717a; padding: 4px 0; width: 100px;">Name</td>
            <td style="color: #fafafa; padding: 4px 0;">${payload.customerName}</td>
          </tr>
          <tr>
            <td style="color: #71717a; padding: 4px 0;">Email</td>
            <td style="color: #fafafa; padding: 4px 0;">
              <a href="mailto:${payload.customerEmail}" style="color: #3b82f6; text-decoration: none;">
                ${payload.customerEmail}
              </a>
            </td>
          </tr>
          <tr>
            <td style="color: #71717a; padding: 4px 0;">Phone</td>
            <td style="color: #fafafa; padding: 4px 0;">
              <a href="tel:${payload.customerPhone}" style="color: #3b82f6; text-decoration: none;">
                ${payload.customerPhone}
              </a>
            </td>
          </tr>
          ${payload.customerCompany
      ? `
          <tr>
            <td style="color: #71717a; padding: 4px 0;">Company</td>
            <td style="color: #fafafa; padding: 4px 0;">${payload.customerCompany}</td>
          </tr>
          `
      : ''
    }
        </table>
      </div>

      <!-- Rental Period -->
      <div style="margin-bottom: 24px;">
        <h3 style="color: #fafafa; font-size: 14px; font-weight: 600; margin: 0 0 12px;">
          Rental Period (${rentalDays} day${rentalDays > 1 ? 's' : ''})
        </h3>
        <p style="color: #a1a1aa; margin: 0;">
          ${formatDate(payload.rentalStartDate)} — ${formatDate(payload.rentalEndDate)}
        </p>
      </div>

      <!-- Equipment -->
      <div style="margin-bottom: 24px;">
        <h3 style="color: #fafafa; font-size: 14px; font-weight: 600; margin: 0 0 12px;">
          Requested Equipment
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid #27272a;">
              <th style="text-align: left; padding: 8px 0; color: #71717a; font-size: 12px; font-weight: 500;">Item</th>
              <th style="text-align: center; padding: 8px 0; color: #71717a; font-size: 12px; font-weight: 500;">Qty</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>

      ${payload.projectDescription
      ? `
      <!-- Project Details -->
      <div style="margin-bottom: 24px;">
        <h3 style="color: #fafafa; font-size: 14px; font-weight: 600; margin: 0 0 12px;">
          Project Details
        </h3>
        <p style="color: #a1a1aa; font-size: 14px; margin: 0; white-space: pre-wrap;">
          ${payload.projectDescription}
        </p>
      </div>
      `
      : ''
    }

      ${payload.specialRequests
      ? `
      <!-- Special Requests -->
      <div style="margin-bottom: 24px;">
        <h3 style="color: #fafafa; font-size: 14px; font-weight: 600; margin: 0 0 12px;">
          Special Requests
        </h3>
        <p style="color: #a1a1aa; font-size: 14px; margin: 0; white-space: pre-wrap;">
          ${payload.specialRequests}
        </p>
      </div>
      `
      : ''
    }

      <!-- Action Button -->
      <div style="text-align: center; margin-top: 32px;">
        <a href="${config.siteUrl}/admin/quotes/${payload.quoteId}" 
           style="display: inline-block; background-color: #fafafa; color: #09090b; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
          View Quote in Admin
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 24px;">
      <p style="color: #52525b; font-size: 12px; margin: 0;">
        ${config.siteName} Admin Notification
      </p>
    </div>

  </div>
</body>
</html>
  `
}

function generateQuoteReadyHtml(payload: QuoteReadyNotificationPayload): string {
  const config = getConfig()
  const magicLink = `${config.siteUrl}/${payload.language}/quote/${payload.quoteId}?token=${payload.accessToken}`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Quote is Ready!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #fafafa; font-size: 24px; font-weight: 700; margin: 0;">
        ${config.siteName}
      </h1>
    </div>

    <!-- Main Card -->
    <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px;">
      
      <!-- Success Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 64px; height: 64px; background-color: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 50%; line-height: 64px;">
          <span style="font-size: 32px;">✓</span>
        </div>
      </div>

      <h2 style="color: #fafafa; font-size: 20px; font-weight: 600; text-align: center; margin: 0 0 8px;">
        Your Quote is Ready!
      </h2>
      
      <p style="color: #a1a1aa; text-align: center; margin: 0 0 32px;">
        Hi ${payload.customerName}, your personalized quote for reference <strong style="color: #fafafa;">#${payload.confirmationNumber}</strong> has been prepared and is ready for your review.
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin-bottom: 32px;">
        <a href="${magicLink}" 
           style="display: inline-block; background-color: #22c55e; color: #09090b; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          View Your Quote →
        </a>
      </div>

      <!-- What's Next -->
      <div style="background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; padding: 16px;">
        <p style="color: #3b82f6; font-weight: 600; margin: 0 0 8px;">
          What happens next?
        </p>
        <ul style="color: #a1a1aa; font-size: 14px; margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 4px;">Click the link above to view your detailed quote</li>
          <li style="margin-bottom: 4px;">Download the official PDF document</li>
          <li style="margin-bottom: 4px;">Reply to this email if you have any questions</li>
        </ul>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px;">
      <p style="color: #71717a; font-size: 12px; margin: 0 0 8px;">
        This link is unique to your quote. Do not share it with others.
      </p>
      <p style="color: #52525b; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} ${config.siteName}. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>
  `
}

// ============================================================================
// Resend Email Service Implementation
// ============================================================================

export class ResendEmailService implements IEmailService {
  private apiKey: string
  private fromEmail: string
  private adminEmail: string

  constructor() {
    const config = getConfig()
    this.apiKey = config.apiKey
    this.fromEmail = config.fromEmail
    this.adminEmail = config.adminEmail
  }

  /**
   * Send an email via Resend API
   */
  async send(payload: EmailPayload & { html: string }): Promise<EmailResult> {
    if (!this.apiKey) {
      console.warn('RESEND_API_KEY not configured - email not sent')
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
        console.error('Resend API error:', errorData)
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
      console.error('Email send error:', error)
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
      console.warn('ADMIN_EMAIL not configured - admin notification not sent')
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
