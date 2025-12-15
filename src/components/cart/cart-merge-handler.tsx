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
import { mergeGuestCart } from '@/lib/actions/cart'

export function CartMergeHandler() {
  const { user } = useAuthStore()
  const { items, clearCart } = useCartStore()
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

      mergeGuestCart(items)
        .then((result) => {
          if (result.success) {
            // Clear local cart after successful merge
            clearCart()

            // Show success message
            addToast({
              type: 'success',
              message: 'Your cart has been synced with your account!',
            })
          } else {
            console.error('Failed to merge cart:', result.error)
            addToast({
              type: 'error',
              message: 'Failed to sync your cart. Please try refreshing the page.',
            })
          }
        })
        .catch((error) => {
          console.error('Cart merge error:', error)
          addToast({
            type: 'error',
            message: 'Failed to sync your cart. Please try refreshing the page.',
          })
        })
    }
  }, [user, items, clearCart, addToast])

  // This component renders nothing - it's purely functional
  return null
}