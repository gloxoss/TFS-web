/**
 * UI Store (Zustand)
 * 
 * Global UI state management for modals, drawers, toasts, and loading states.
 * 
 * @module stores/useUIStore
 */
'use client'

import { create } from 'zustand'

// ============================================================================
// Types
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number // ms, default 5000
}

export interface UIState {
  // Cart drawer
  cartDrawerOpen: boolean
  openCartDrawer: () => void
  closeCartDrawer: () => void
  toggleCartDrawer: () => void

  // Mobile menu
  mobileMenuOpen: boolean
  openMobileMenu: () => void
  closeMobileMenu: () => void
  toggleMobileMenu: () => void

  // Generic modal
  modalOpen: boolean
  modalContent: React.ReactNode | null
  openModal: (content: React.ReactNode) => void
  closeModal: () => void

  // Toast notifications
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void

  // Loading states
  isLoading: boolean
  loadingMessage: string | null
  setLoading: (loading: boolean, message?: string) => void

  // Search
  searchOpen: boolean
  searchQuery: string
  openSearch: () => void
  closeSearch: () => void
  setSearchQuery: (query: string) => void
}

// ============================================================================
// Helpers
// ============================================================================

function generateToastId(): string {
  return `toast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// ============================================================================
// Store
// ============================================================================

export const useUIStore = create<UIState>((set, get) => ({
  // Cart drawer
  cartDrawerOpen: false,
  openCartDrawer: () => set({ cartDrawerOpen: true }),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
  toggleCartDrawer: () => set((state) => ({ cartDrawerOpen: !state.cartDrawerOpen })),

  // Mobile menu
  mobileMenuOpen: false,
  openMobileMenu: () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  // Generic modal
  modalOpen: false,
  modalContent: null,
  openModal: (content) => set({ modalOpen: true, modalContent: content }),
  closeModal: () => set({ modalOpen: false, modalContent: null }),

  // Toast notifications
  toasts: [],
  addToast: (toast) => {
    const id = generateToastId()
    const newToast: Toast = { ...toast, id }
    
    set((state) => ({ toasts: [...state.toasts, newToast] }))

    // Auto-remove after duration
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id)
      }, duration)
    }
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },
  clearToasts: () => set({ toasts: [] }),

  // Loading states
  isLoading: false,
  loadingMessage: null,
  setLoading: (loading, message) => {
    set({ isLoading: loading, loadingMessage: message ?? null })
  },

  // Search
  searchOpen: false,
  searchQuery: '',
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false, searchQuery: '' }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))

// ============================================================================
// Convenience hooks for common patterns
// ============================================================================

/**
 * Show a success toast
 */
export function useSuccessToast() {
  const addToast = useUIStore((state) => state.addToast)
  return (message: string) => addToast({ type: 'success', message })
}

/**
 * Show an error toast
 */
export function useErrorToast() {
  const addToast = useUIStore((state) => state.addToast)
  return (message: string) => addToast({ type: 'error', message })
}
