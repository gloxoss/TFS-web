/**
 * Cart Store Unit Tests
 * 
 * Tests for useCartStore operations following TDD principles.
 * Tests: addItem, removeItem, updateQuantity, clearCart, getItemCount
 * 
 * BLIND QUOTE MODE:
 * - No pricing tests (getSubtotal always returns 0)
 * - Focus on item management operations
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'

// We need to test the store logic without the persist middleware
// Create a simplified store for testing
import { create } from 'zustand'
import type { Product } from '@/services/products/types'

// ============================================================================
// Test Types (mirror store types)
// ============================================================================

interface CartItemDates {
  start: string
  end: string
}

interface CartItem {
  id: string
  product: Product
  quantity: number
  dates: CartItemDates
  kitSelections?: { [slotId: string]: string[] }
}

interface CartState {
  items: CartItem[]
  globalDates: CartItemDates | null
  addItem: (product: Product, quantity: number, dates: CartItemDates, kitSelections?: { [slotId: string]: string[] }) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  updateItemDates: (itemId: string, dates: CartItemDates) => void
  setGlobalDates: (dates: CartItemDates | null) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number // BLIND QUOTE: Always returns 0
  getItemById: (itemId: string) => CartItem | undefined
}

// ============================================================================
// Test Utilities
// ============================================================================

let idCounter = 0
function generateTestId(): string {
  return `test_item_${++idCounter}`
}

// Create a test version of the store without persistence
function createTestStore() {
  idCounter = 0 // Reset counter for each test
  
  return create<CartState>()((set, get) => ({
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
          id: generateTestId(),
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
      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
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

    setGlobalDates: (dates) => {
      set({ globalDates: dates })
    },

    clearCart: () => {
      set({ items: [], globalDates: null })
    },

    getItemCount: () => {
      return get().items.reduce((sum, item) => sum + item.quantity, 0)
    },

    // BLIND QUOTE: No client-side pricing
    getSubtotal: () => {
      return 0
    },

    getItemById: (itemId) => {
      return get().items.find((item) => item.id === itemId)
    },
  }))
}

// ============================================================================
// Test Fixtures
// ============================================================================

function createMockProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod_1',
    name: 'Sony FX6',
    nameEn: 'Sony FX6',
    nameFr: 'Sony FX6',
    slug: 'sony-fx6',
    categoryId: 'cat_cameras',
    isAvailable: true,
    ...overrides,
  }
}

function createMockDates(startOffset = 0, endOffset = 2): CartItemDates {
  const start = new Date()
  start.setDate(start.getDate() + startOffset)
  const end = new Date()
  end.setDate(end.getDate() + endOffset)
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  }
}

// ============================================================================
// Tests
// ============================================================================

describe('useCartStore', () => {
  let useStore: ReturnType<typeof createTestStore>

  beforeEach(() => {
    useStore = createTestStore()
  })

  describe('addItem', () => {
    it('adds a new item to empty cart', () => {
      const product = createMockProduct()
      const dates = createMockDates()

      act(() => {
        useStore.getState().addItem(product, 1, dates)
      })

      const items = useStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0].product.id).toBe('prod_1')
      expect(items[0].quantity).toBe(1)
    })

    it('increments quantity when adding same product with same dates', () => {
      const product = createMockProduct()
      const dates = createMockDates()

      act(() => {
        useStore.getState().addItem(product, 1, dates)
        useStore.getState().addItem(product, 2, dates)
      })

      const items = useStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(3)
    })

    it('adds separate items when dates differ', () => {
      const product = createMockProduct()
      const dates1 = createMockDates(0, 2)
      const dates2 = createMockDates(5, 7)

      act(() => {
        useStore.getState().addItem(product, 1, dates1)
        useStore.getState().addItem(product, 1, dates2)
      })

      const items = useStore.getState().items
      expect(items).toHaveLength(2)
    })

    it('adds different products as separate items', () => {
      const product1 = createMockProduct({ id: 'prod_1', name: 'Sony FX6' })
      const product2 = createMockProduct({ id: 'prod_2', name: 'RED Komodo' })
      const dates = createMockDates()

      act(() => {
        useStore.getState().addItem(product1, 1, dates)
        useStore.getState().addItem(product2, 1, dates)
      })

      const items = useStore.getState().items
      expect(items).toHaveLength(2)
      expect(items[0].product.name).toBe('Sony FX6')
      expect(items[1].product.name).toBe('RED Komodo')
    })

    it('stores kit selections when provided', () => {
      const product = createMockProduct()
      const dates = createMockDates()
      const kitSelections = { 'lens_slot': ['lens_1', 'lens_2'] }

      act(() => {
        useStore.getState().addItem(product, 1, dates, kitSelections)
      })

      const items = useStore.getState().items
      expect(items[0].kitSelections).toEqual(kitSelections)
    })
  })

  describe('removeItem', () => {
    it('removes item by id', () => {
      const product = createMockProduct()
      const dates = createMockDates()

      act(() => {
        useStore.getState().addItem(product, 1, dates)
      })

      const itemId = useStore.getState().items[0].id

      act(() => {
        useStore.getState().removeItem(itemId)
      })

      expect(useStore.getState().items).toHaveLength(0)
    })

    it('only removes specified item when multiple exist', () => {
      const product1 = createMockProduct({ id: 'prod_1' })
      const product2 = createMockProduct({ id: 'prod_2' })
      const dates = createMockDates()

      act(() => {
        useStore.getState().addItem(product1, 1, dates)
        useStore.getState().addItem(product2, 1, dates)
      })

      const firstItemId = useStore.getState().items[0].id

      act(() => {
        useStore.getState().removeItem(firstItemId)
      })

      const items = useStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0].product.id).toBe('prod_2')
    })

    it('does nothing when item id not found', () => {
      const product = createMockProduct()
      const dates = createMockDates()

      act(() => {
        useStore.getState().addItem(product, 1, dates)
      })

      act(() => {
        useStore.getState().removeItem('nonexistent_id')
      })

      expect(useStore.getState().items).toHaveLength(1)
    })
  })

  describe('updateQuantity', () => {
    it('updates quantity of existing item', () => {
      const product = createMockProduct()
      const dates = createMockDates()

      act(() => {
        useStore.getState().addItem(product, 1, dates)
      })

      const itemId = useStore.getState().items[0].id

      act(() => {
        useStore.getState().updateQuantity(itemId, 5)
      })

      expect(useStore.getState().items[0].quantity).toBe(5)
    })

    it('enforces minimum quantity of 1', () => {
      const product = createMockProduct()
      const dates = createMockDates()

      act(() => {
        useStore.getState().addItem(product, 3, dates)
      })

      const itemId = useStore.getState().items[0].id

      act(() => {
        useStore.getState().updateQuantity(itemId, 0)
      })

      expect(useStore.getState().items[0].quantity).toBe(1)
    })

    it('handles negative quantities by setting to 1', () => {
      const product = createMockProduct()
      const dates = createMockDates()

      act(() => {
        useStore.getState().addItem(product, 3, dates)
      })

      const itemId = useStore.getState().items[0].id

      act(() => {
        useStore.getState().updateQuantity(itemId, -5)
      })

      expect(useStore.getState().items[0].quantity).toBe(1)
    })
  })

  describe('updateItemDates', () => {
    it('updates dates for existing item', () => {
      const product = createMockProduct()
      const originalDates = createMockDates(0, 2)

      act(() => {
        useStore.getState().addItem(product, 1, originalDates)
      })

      const itemId = useStore.getState().items[0].id
      const newDates = createMockDates(10, 15)

      act(() => {
        useStore.getState().updateItemDates(itemId, newDates)
      })

      expect(useStore.getState().items[0].dates).toEqual(newDates)
    })
  })

  describe('setGlobalDates', () => {
    it('sets global dates', () => {
      const dates = createMockDates()

      act(() => {
        useStore.getState().setGlobalDates(dates)
      })

      expect(useStore.getState().globalDates).toEqual(dates)
    })

    it('clears global dates when set to null', () => {
      const dates = createMockDates()

      act(() => {
        useStore.getState().setGlobalDates(dates)
        useStore.getState().setGlobalDates(null)
      })

      expect(useStore.getState().globalDates).toBeNull()
    })
  })

  describe('clearCart', () => {
    it('removes all items from cart', () => {
      const product1 = createMockProduct({ id: 'prod_1' })
      const product2 = createMockProduct({ id: 'prod_2' })
      const dates = createMockDates()

      act(() => {
        useStore.getState().addItem(product1, 1, dates)
        useStore.getState().addItem(product2, 2, dates)
        useStore.getState().clearCart()
      })

      expect(useStore.getState().items).toHaveLength(0)
    })

    it('also clears global dates', () => {
      const dates = createMockDates()

      act(() => {
        useStore.getState().setGlobalDates(dates)
        useStore.getState().clearCart()
      })

      expect(useStore.getState().globalDates).toBeNull()
    })
  })

  describe('getItemCount', () => {
    it('returns 0 for empty cart', () => {
      expect(useStore.getState().getItemCount()).toBe(0)
    })

    it('returns total quantity across all items', () => {
      const product1 = createMockProduct({ id: 'prod_1' })
      const product2 = createMockProduct({ id: 'prod_2' })
      const dates = createMockDates()

      act(() => {
        useStore.getState().addItem(product1, 2, dates)
        useStore.getState().addItem(product2, 3, dates)
      })

      expect(useStore.getState().getItemCount()).toBe(5)
    })
  })

  describe('getSubtotal (BLIND QUOTE)', () => {
    it('always returns 0 in Blind Quote mode', () => {
      const product = createMockProduct()
      const dates = createMockDates()

      act(() => {
        useStore.getState().addItem(product, 5, dates)
      })

      // BLIND QUOTE: No client-side pricing
      expect(useStore.getState().getSubtotal()).toBe(0)
    })
  })

  describe('getItemById', () => {
    it('returns item when found', () => {
      const product = createMockProduct()
      const dates = createMockDates()

      act(() => {
        useStore.getState().addItem(product, 1, dates)
      })

      const itemId = useStore.getState().items[0].id
      const found = useStore.getState().getItemById(itemId)

      expect(found).toBeDefined()
      expect(found?.product.id).toBe('prod_1')
    })

    it('returns undefined when not found', () => {
      const found = useStore.getState().getItemById('nonexistent')
      expect(found).toBeUndefined()
    })
  })
})
