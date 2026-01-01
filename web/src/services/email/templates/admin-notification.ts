import { AdminQuoteNotificationPayload, calculateRentalDays, formatDateForEmail } from '../interface'
import { getEmailConfig } from './config'

export function generateAdminNotificationHtml(payload: AdminQuoteNotificationPayload): string {
    const config = getEmailConfig()
    const rentalDays = calculateRentalDays(payload.rentalStartDate, payload.rentalEndDate)

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
          ${formatDateForEmail(payload.rentalStartDate)} — ${formatDateForEmail(payload.rentalEndDate)}
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
