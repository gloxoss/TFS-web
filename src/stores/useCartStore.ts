/**
 * Cart Store (Zustand)
 * 
 * Client-side cart state management with localStorage persistence.
 * Syncs with PocketBase for authenticated users.
 * 
 * BLIND QUOTE MODE:
 * - Cart stores items WITHOUT prices (pricing comes from admin quote)
 * - No line totals or subtotals calculated client-side
 * - Dates can be placeholder until checkout
 * 
 * @module stores/useCartStore
 */
'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product } from '@/services/products/types'

// ============================================================================
// Types
// ============================================================================

export interface CartItemDates {
  start: string // ISO date string for serialization
  end: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  dates: CartItemDates
  groupId?: string // Links bundle items together
  kitTemplateId?: string // Tracks which kit created this group
  kitSelections?: { [slotId: string]: string[] } // Selected item IDs per slot
}

export interface CartState {
  items: CartItem[]
  globalDates: CartItemDates | null // Optional global rental period
  
  // Actions
  addItem: (product: Product, quantity: number, dates: CartItemDates, kitSelections?: { [slotId: string]: string[] }) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  updateItemDates: (itemId: string, dates: CartItemDates) => void
  updateKitSelections: (itemId: string, kitSelections: { [slotId: string]: string[] }) => void
  setGlobalDates: (dates: CartItemDates | null) => void
  clearCart: () => void
  
  // Computed helpers
  getItemCount: () => number
  /** @deprecated Blind Quote mode - no client-side pricing. Returns 0. */
  getSubtotal: () => number
  getItemById: (itemId: string) => CartItem | undefined
}

// ============================================================================
// Helpers
// ============================================================================

function generateCartItemId(): string {
  return `cart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// BLIND QUOTE: No client-side price calculation
// Prices are determined by admin when processing the quote

// ============================================================================
// Store
// ============================================================================

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      globalDates: null,

      addItem: (product, quantity, dates, kitSelections) => {
        set((state) => {
          // Check if item with same product and dates already exists
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.dates.start === dates.start &&
              item.dates.end === dates.end
          )

          if (existingIndex >= 0) {
            // Update quantity of existing item
            const newItems = [...state.items]
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            }
            return { items: newItems }
          }

          // Add new item
          const newItem: CartItem = {
            id: generateCartItemId(),
            product,
            quantity,
            dates,
            kitSelections,
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }))
      },

      updateItemDates: (itemId, dates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, dates } : item
          ),
        }))
      },

      updateKitSelections: (itemId, kitSelections) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, kitSelections } : item
          ),
        }))
      },

      setGlobalDates: (dates) => {
        set({ globalDates: dates })
      },

      clearCart: () => {
        set({ items: [], globalDates: null })
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      /** 
       * @deprecated BLIND QUOTE MODE - No client-side pricing
       * Returns 0. Actual pricing is determined by admin quote.
       */
      getSubtotal: () => {
        // BLIND QUOTE: No prices calculated client-side
        return 0
      },

      getItemById: (itemId) => {
        return get().items.find((item) => item.id === itemId)
      },
    }),
    {
      name: 'tfs-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        globalDates: state.globalDates,
      }),
    }
  )
)

// ============================================================================
// Selectors (for optimized re-renders)
// ============================================================================

export const selectCartItems = (state: CartState) => state.items
export const selectCartItemCount = (state: CartState) => state.getItemCount()
export const selectCartSubtotal = (state: CartState) => state.getSubtotal()
export const selectGlobalDates = (state: CartState) => state.globalDates
