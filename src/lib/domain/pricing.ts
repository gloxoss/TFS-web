/**
 * Pricing Domain Logic
 * 
 * Pure functions for rental pricing calculations.
 * All business logic is testable and backend-agnostic.
 * 
 * @module lib/domain/pricing
 */

import { differenceInDays, parseISO } from 'date-fns'

// ============================================================================
// Types
// ============================================================================

export interface RentalPriceInput {
  dailyRate: number
  days: number
  quantity: number
}

export interface LineTotalInput {
  dailyRate: number
  startDate: Date | string
  endDate: Date | string
  quantity: number
}

// ============================================================================
// Duration Discount Tiers
// ============================================================================

/**
 * Discount tiers based on rental duration.
 * - 7-13 days: 10% off (weekly rate)
 * - 14-29 days: 20% off (bi-weekly rate)
 * - 30+ days: 30% off (monthly rate)
 */
const DISCOUNT_TIERS = [
  { minDays: 30, discount: 0.30 }, // Monthly: 30% off
  { minDays: 14, discount: 0.20 }, // Bi-weekly: 20% off
  { minDays: 7, discount: 0.10 },  // Weekly: 10% off
] as const

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Calculates the number of rental days between two dates (inclusive).
 * Same-day rental = 1 day.
 * 
 * @param startDate - Rental start date
 * @param endDate - Rental end date
 * @returns Number of rental days, or 0 if invalid range
 */
export function calculateRentalDays(
  startDate: Date | string,
  endDate: Date | string
): number {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate

  const diff = differenceInDays(end, start)
  
  // Return 0 for invalid ranges (end before start)
  if (diff < 0) return 0
  
  // Add 1 because rental days are inclusive (same day = 1 day)
  return diff + 1
}

/**
 * Calculates the base rental price without discounts.
 * Formula: dailyRate × days × quantity
 * 
 * @param input - Pricing parameters
 * @returns Total price before discounts
 */
export function calculateRentalPrice(input: RentalPriceInput): number {
  const { dailyRate, days, quantity } = input
  
  if (days <= 0 || quantity <= 0) return 0
  
  return dailyRate * days * quantity
}

/**
 * Calculates line total for a cart item using start/end dates.
 * Convenience function combining calculateRentalDays + calculateRentalPrice.
 * 
 * @param input - Line item with dates
 * @returns Total price for this line item
 */
export function calculateLineTotal(input: LineTotalInput): number {
  const { dailyRate, startDate, endDate, quantity } = input
  const days = calculateRentalDays(startDate, endDate)
  
  return calculateRentalPrice({ dailyRate, days, quantity })
}

/**
 * Applies duration-based discount to a price.
 * 
 * Discount tiers:
 * - 7-13 days: 10% off
 * - 14-29 days: 20% off
 * - 30+ days: 30% off
 * 
 * @param basePrice - Price before discount
 * @param days - Number of rental days
 * @returns Price after discount
 */
export function applyDurationDiscount(basePrice: number, days: number): number {
  // Find applicable discount tier
  const tier = DISCOUNT_TIERS.find(t => days >= t.minDays)
  
  if (!tier) return basePrice
  
  return basePrice * (1 - tier.discount)
}

/**
 * Calculates the final price with all discounts applied.
 * 
 * @param input - Pricing parameters
 * @returns Final price after all discounts
 */
export function calculateFinalPrice(input: RentalPriceInput): number {
  const basePrice = calculateRentalPrice(input)
  return applyDurationDiscount(basePrice, input.days)
}
