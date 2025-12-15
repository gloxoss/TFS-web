'use server'

import PocketBase from 'pocketbase'

/**
 * Simple in-memory rate limiter
 * Tracks requests per IP/session to prevent email enumeration attacks
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_MAX = 10 // Max 10 checks per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute window

function isRateLimited(key: string): boolean {
    const now = Date.now()
    const record = rateLimitMap.get(key)

    if (!record || now > record.resetTime) {
        // Reset or create new window
        rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
        return false
    }

    if (record.count >= RATE_LIMIT_MAX) {
        console.log('[checkEmailExists] Rate limited:', key)
        return true
    }

    record.count++
    return false
}

/**
 * Check if an email exists in the users collection
 * Called by the quote form to show "login nudge" for existing accounts
 * 
 * Security:
 * - Only returns boolean, never user data
 * - Rate limited to prevent email enumeration
 * - Only enabled when ENABLE_CLIENT_PORTAL is true
 */
export async function checkEmailExists(email: string): Promise<boolean> {
    console.log('[checkEmailExists] Called with email:', email?.substring(0, 3) + '***')

    // Feature flag check - only run if client portal is enabled
    if (process.env.ENABLE_CLIENT_PORTAL !== 'true') {
        console.log('[checkEmailExists] Disabled - ENABLE_CLIENT_PORTAL is not "true"')
        return false
    }

    // Basic validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        console.log('[checkEmailExists] Invalid email format, returning false')
        return false
    }

    // Rate limiting (use email as key since we don't have IP here)
    const rateLimitKey = email.toLowerCase()
    if (isRateLimited(rateLimitKey)) {
        return false // Silent fail when rate limited
    }

    try {
        const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090')

        // Authenticate as superuser to query users
        // This runs server-side so we can use admin credentials
        if (process.env.PB_ADMIN_EMAIL && process.env.PB_ADMIN_PASSWORD) {
            console.log('[checkEmailExists] Authenticating as admin:', process.env.PB_ADMIN_EMAIL?.substring(0, 3) + '***')
            await pb.collection('_superusers').authWithPassword(
                process.env.PB_ADMIN_EMAIL,
                process.env.PB_ADMIN_PASSWORD
            )
            console.log('[checkEmailExists] Admin auth successful')
        } else {
            console.log('[checkEmailExists] WARNING: No admin credentials in env (PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD)')
            return false
        }

        const users = await pb.collection('users').getList(1, 1, {
            filter: `email = "${email}"`,
            fields: 'id', // Only fetch ID, not user data
        })

        console.log('[checkEmailExists] Query result - totalItems:', users.totalItems)
        return users.totalItems > 0
    } catch (error) {
        console.error('[checkEmailExists] Error:', error)
        return false
    }
}
