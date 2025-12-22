/**
 * Product Domain Types
 * 
 * Per TDD cinema-tdd.md 'equipment' collection schema:
 * - name_en, name_fr (bilingual)
 * - description_en, description_fr (bilingual)
 * - specs_en, specs_fr (bilingual)
 * - slug, category, brand, daily_rate, visibility, featured, etc.
 * 
 * CATALOG MODE / BLIND QUOTE:
 * - Public API does NOT expose: dailyRate, stockTotal, stockAvailable
 * - These fields are only used internally (admin) or for availability checks
 * - Client UI uses `isAvailable` boolean only
 */

export interface Product {
  id: string
  // Bilingual fields per TDD
  nameEn: string
  nameFr: string
  // Computed 'name' based on current language (set by service)
  name: string
  slug: string
  categoryId: string
  category?: Category
  brand?: string
  // Bilingual descriptions per TDD
  descriptionEn?: string
  descriptionFr?: string
  description?: string // Computed based on current language
  // Bilingual specs per TDD
  specsEn?: string
  specsFr?: string
  specs?: Record<string, string | number>
  imageUrl?: string
  images?: string[]
  isFeatured?: boolean
  /** Public availability flag - hides actual stock numbers */
  isAvailable: boolean
  visibility?: boolean
  /** Daily rate (exposed only if show_prices is true, or always exposed but hidden by UI) */
  price?: number
  /** Flag to indicate if product is a kit with accessories (for builder UI) */
  is_kit?: boolean
}

/**
 * Internal Product type with sensitive business data
 * Used only for admin views and internal calculations
 * NEVER expose to public API or client components
 */
export interface ProductInternal extends Product {
  dailyRate: number
  stockTotal: number
  stockAvailable: number
  availabilityStatus?: 'available' | 'rented' | 'maintenance'
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  thumbnail?: string
  productCount?: number
}
