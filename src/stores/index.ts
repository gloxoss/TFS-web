/**
 * Zustand Stores - Barrel Export
 * 
 * Central export for all Zustand stores.
 * Import from '@/stores' for cleaner imports.
 */

export { useCartStore, selectCartItems, selectCartItemCount, selectCartSubtotal, selectGlobalDates } from './useCartStore'
export type { CartItem, CartItemDates, CartState } from './useCartStore'

export { useUIStore, useSuccessToast, useErrorToast } from './useUIStore'
export type { Toast, ToastType, UIState } from './useUIStore'

export { useAuthStore } from './auth-store'
export type { User } from '@/types/auth'
