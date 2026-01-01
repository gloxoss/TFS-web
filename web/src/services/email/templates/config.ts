export function getEmailConfig() {
    return {
        apiKey: process.env.RESEND_API_KEY || '',
        fromEmail: process.env.EMAIL_FROM || 'Cinema Rentals <noreply@example.com>',
        adminEmail: process.env.ADMIN_EMAIL || '',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Cinema Equipment Rentals',
    }
}
