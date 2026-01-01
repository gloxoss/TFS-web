import { QuoteConfirmationEmailPayload, calculateRentalDays, formatDateForEmail } from '../interface'
import { getEmailConfig } from './config'

export function generateQuoteConfirmationHtml(payload: QuoteConfirmationEmailPayload): string {
    const config = getEmailConfig()
    const rentalDays = calculateRentalDays(payload.rentalStartDate, payload.rentalEndDate)

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
          ${formatDateForEmail(payload.rentalStartDate)} — ${formatDateForEmail(payload.rentalEndDate)}
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
