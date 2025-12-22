/**
 * Cart Sync Provider
 * 
 * Client component that enables automatic cart synchronization
 * for authenticated users. Should be placed in root layout.
 */
'use client'

import { useAuthStore } from '@/stores/auth-store'
import { useCartSync } from '@/hooks/useCartSync'

export function CartSyncProvider() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)

    // Enable cart sync with 1-second debounce
    useCartSync({ isAuthenticated, debounceMs: 1000 })

    return null
}
