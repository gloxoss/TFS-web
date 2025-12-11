/**
 * Services - Barrel Export & Factory
 * 
 * Central export for all services with dependency injection.
 * Import from '@/services' for cleaner imports.
 */

import PocketBase from 'pocketbase'
import { PocketBaseProductService } from './products/pocketbase-service'
import { PocketBaseQuoteService } from './quotes/pocketbase-service'
import type { IProductService } from './products/interface'
import type { IQuoteService } from './quotes/interface'

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

// ============================================================================
// Service Factory
// ============================================================================

/**
 * Creates a product service instance.
 * Accepts optional PocketBase client for dependency injection.
 */
export function getProductService(pbClient?: PocketBase): IProductService {
  return new PocketBaseProductService(pbClient)
}

/**
 * Creates a quote service instance.
 * Accepts optional PocketBase client for dependency injection.
 */
export function getQuoteService(pbClient?: PocketBase): IQuoteService {
  return new PocketBaseQuoteService(pbClient)
}

// ============================================================================
// Default instances (for convenience in server components)
// ============================================================================

/**
 * Gets a product service instance.
 * Creates a fresh instance for each call to avoid stale connection issues
 * that can occur with serverless/edge function cold starts.
 */
export function productService(): IProductService {
  // Always create fresh instance to avoid stale connections
  return new PocketBaseProductService()
}

/**
 * Gets a quote service instance.
 * Creates a fresh instance for each call to avoid stale connection issues.
 */
export function quoteService(): IQuoteService {
  // Always create fresh instance to avoid stale connections
  return new PocketBaseQuoteService()
}
