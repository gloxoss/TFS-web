'use client'

import { useEffect } from 'react'

/**
 * Analytics Beacon - Lightweight deployment tracking
 * Sends a ping when the site loads (if NEXT_PUBLIC_ANALYTICS_URL is configured)
 */
export function AnalyticsBeacon() {
    useEffect(() => {
        const BEACON_URL = process.env.NEXT_PUBLIC_ANALYTICS_URL

        if (!BEACON_URL) return

        const payload = {
            domain: window.location.hostname,
            path: window.location.pathname,
            version: '1.0.0',
            timestamp: new Date().toISOString(),
        }

        // Use sendBeacon for non-blocking request
        if (navigator.sendBeacon) {
            navigator.sendBeacon(BEACON_URL, JSON.stringify(payload))
        } else {
            // Fallback for older browsers
            fetch(BEACON_URL, {
                method: 'POST',
                body: JSON.stringify(payload),
                keepalive: true,
            }).catch(() => { })
        }
    }, [])

    return null
}
