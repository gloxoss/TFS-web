/**
 * Services - Barrel Export & Factory
 * 
 * Central export for all services with dependency injection.
 * Import from '@/services' for cleaner imports.
 */

import PocketBase from 'pocketbase'
import { PocketBaseProductService } from './products/pocketbase-service'
import { PocketBaseQuoteService } from './quotes/pocketbase-service'
import { CartService } from './cart/cart-service'
import { ResendEmailService, ConsoleEmailService } from './email/resend-service'
import { BlogService } from './blog/service'
import type { IProductService } from './products/interface'
import type { IQuoteService } from './quotes/interface'
import type { IEmailService } from './email/interface'

// Re-export types
export type { IProductService, ProductFilters, PaginatedResult } from './products/interface'
export type { Product, Category } from './products/types'
export type {
  IQuoteService,
  Quote,
  QuoteStatus,
  QuoteResult,
  CreateQuotePayload,
  QuoteItemPayload,
  cartItemsToQuotePayload,
} from './quotes/interface'
export type {
  IEmailService,
  EmailResult,
  QuoteConfirmationEmailPayload,
  AdminQuoteNotificationPayload,
  QuoteEmailItem,
} from './email/interface'
export type { BlogPost, BlogFilters } from './blog/types'

// ============================================================================
// Service Factory
// ============================================================================

/**
 * Creates a product service instance.
 * Requires PocketBase client for authentication.
 */
export function getProductService(pbClient: PocketBase): IProductService {
  return new PocketBaseProductService(pbClient)
}

/**
 * Creates a cart service instance.
 * Requires PocketBase client for authentication.
 */
export function getCartService(pbClient: PocketBase) {
  return new CartService(pbClient)
}

/**
 * Creates a quote service instance.
 * Requires authenticated PocketBase client for dependency injection.
 */
export function getQuoteService(pbClient: PocketBase): IQuoteService {
  return new PocketBaseQuoteService(pbClient)
}

// ============================================================================
// Default instances (for convenience in server components)
// ============================================================================

// Helper to get safe PB URL
const getPbUrl = () => {
  const url = process.env.NEXT_PUBLIC_POCKETBASE_URL
  if (!url) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('NEXT_PUBLIC_POCKETBASE_URL is not defined')
    }
    return 'http://127.0.0.1:8090'
  }
  return url
}

/**
 * Gets a product service instance.
 * Creates a fresh instance for each call to avoid stale connection issues
 * that can occur with serverless/edge function cold starts.
 */
export function productService(): IProductService {
  // Create a fresh PocketBase client (anonymous - products are public)
  const pb = new PocketBase(getPbUrl())
  return new PocketBaseProductService(pb)
}

/**
 * @deprecated Use `getQuoteService(pbClient)` instead. Quote service now requires authentication.
 */
// export function quoteService(): IQuoteService {
//   return new PocketBaseQuoteService()
// }

/**
 * Gets an email service instance.
 * Uses Resend in production, Console logger in development (if RESEND_API_KEY not set).
 */
export function getEmailService(): IEmailService {
  const hasResendKey = !!process.env.RESEND_API_KEY

  if (hasResendKey) {
    return new ResendEmailService()
  }

  // Fall back to console logging in development
  console.info('[Email Service] Using console logger (RESEND_API_KEY not configured)')
  return new ConsoleEmailService()
}

/**
 * Convenience email service getter
 */
export function emailService(): IEmailService {
  return getEmailService()
}

/**
 * Creates a blog service instance.
 * Requires PocketBase client for authentication.
 */
export function getBlogService(pbClient: PocketBase) {
  return new BlogService(pbClient)
}

/**
 * Gets a blog service instance with anonymous client.
 * Blog posts use listRule/viewRule for public access.
 */
export function blogService() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090')
  return new BlogService(pb)
}

// ============================================================================
// Services (Homepage Grid)
// ============================================================================

import { PocketBaseServicesService } from './services/pocketbase-service'
export type { Service, IServicesService } from './services/interface'

/**
 * Creates a services service instance for fetching homepage services.
 * Requires PocketBase client for authentication.
 */
export function getServicesService(pbClient: PocketBase) {
  return new PocketBaseServicesService(pbClient)
}

/**
 * Gets a services service instance with anonymous client.
 * Services use listRule/viewRule for public access.
 */
export function servicesService() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090')
  return new PocketBaseServicesService(pb)
}
