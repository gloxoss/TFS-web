/**
 * Cart Synchronization Hook
 * 
 * Provides automatic cart persistence between localStorage and database
 * for authenticated users. Features:
 * - Auto-load cart from DB on mount
 * - Auto-save changes to DB (debounced)
 * - Smart merge of local and DB carts
 * - Graceful error handling
 */
'use client'

import { useEffect, useRef } from 'react'
import { useCartStore } from '@/stores/useCartStore'
import { CartItem } from '@/stores/useCartStore'
import { saveCartToDatabase, loadCartFromDatabase } from '@/lib/actions/cart-sync'

interface UseCartSyncOptions {
    isAuthenticated: boolean
    debounceMs?: number
}

export function useCartSync({ isAuthenticated, debounceMs = 1000 }: UseCartSyncOptions) {
    const items = useCartStore(state => state.items)
    const setItems = useCartStore(state => state.setItems)
    const hasLoadedRef = useRef(false)
    const isSavingRef = useRef(false)

    // Load cart from database on mount (authenticated users only)
    useEffect(() => {
        if (!isAuthenticated || hasLoadedRef.current) return

        hasLoadedRef.current = true

        loadCartFromDatabase().then(result => {
            if (result.success && result.items.length > 0) {
                const localItems = useCartStore.getState().items

                // Merge with localStorage cart
                const merged = mergeCartItems(localItems, result.items)

                if (merged.length > 0) {
                    setItems(merged)
                }
            }
        })
    }, [isAuthenticated, setItems])

    // Auto-save to database on changes (debounced)
    useEffect(() => {
        if (!isAuthenticated || items.length === 0 || isSavingRef.current) return

        const timeoutId = setTimeout(() => {
            isSavingRef.current = true

            saveCartToDatabase(items)
                .catch(error => {
                    console.error('Cart auto-save failed:', error)
                })
                .finally(() => {
                    isSavingRef.current = false
                })
        }, debounceMs)

        return () => clearTimeout(timeoutId)
    }, [items, isAuthenticated, debounceMs])

    // Clear cart from DB when user logs out
    useEffect(() => {
        if (!isAuthenticated && hasLoadedRef.current) {
            hasLoadedRef.current = false
        }
    }, [isAuthenticated])
}

/**
 * Merge local and database cart items
 * Strategy: DB items take precedence, then add unique local items
 */
function mergeCartItems(localItems: CartItem[], dbItems: CartItem[]): CartItem[] {
    const merged = [...dbItems]
    const dbItemKeys = new Set(
        dbItems.map(item =>
            `${item.product.id}_${item.dates.start}_${item.dates.end}`
        )
    )

    // Add local items that don't exist in DB
    for (const localItem of localItems) {
        const key = `${localItem.product.id}_${localItem.dates.start}_${localItem.dates.end}`

        if (!dbItemKeys.has(key)) {
            merged.push(localItem)
        }
    }

    return merged
}
