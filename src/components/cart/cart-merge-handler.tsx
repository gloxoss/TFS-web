/**
 * Cart Merge Handler Component
 *
 * Automatically merges guest cart (localStorage) with user cart (DB) after login.
 * This ensures no cart items are lost during the guest-to-user transition.
 *
 * Design Archetype: Utility Component (no UI, pure logic)
 */
'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/useCartStore'
import { useUIStore } from '@/stores'
import { mergeGuestCart, getUserCart } from '@/lib/actions/cart'

export function CartMergeHandler() {
  const { user } = useAuthStore()
  const { items, setItems } = useCartStore()
  const { addToast } = useUIStore()

  // Use ref to prevent multiple merge attempts
  const hasMergedRef = useRef(false)

  useEffect(() => {
    // Only merge if:
    // 1. User is logged in
    // 2. There are items in the cart (guest cart)
    // 3. We haven't already attempted a merge
    if (user && items.length > 0 && !hasMergedRef.current) {
      hasMergedRef.current = true // Prevent duplicate merges

      console.log('[CartMergeHandler] Syncing items to server...')

      mergeGuestCart(items)
        .then(async (result) => {
          if (result.success) {
            // Update local cart with server state to ensure consistency
            const cartResult = await getUserCart()
            if (cartResult.success && cartResult.items) {
              console.log('[CartMergeHandler] Sync complete, updating local store w/ ', cartResult.items.length)
              setItems(cartResult.items)
            }

            // Show success message only if it was a significant merge?
            // constant toasts might be annoying if this runs on every add. 
            // For now, removing the toast to be less intrusive or only logging it.
            console.log('Cart synced with server')
          } else {
            console.error('Failed to merge cart:', result.error)
          }
        })
        .catch((error) => {
          console.error('Cart merge error:', error)
          // Reset ref so we can try again? Or better to fail silently?
          // hasMergedRef.current = false 
        })
    }
  }, [user, items, setItems, addToast])

  // This component renders nothing - it's purely functional
  return null
}