import { QuoteReadyNotificationPayload } from '../interface'
import { getEmailConfig } from './config'

export function generateQuoteReadyHtml(payload: QuoteReadyNotificationPayload): string {
    const config = getEmailConfig()
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
