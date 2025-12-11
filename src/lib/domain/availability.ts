/**
 * Availability Domain Logic
 * 
 * Pure functions for date validation and stock availability checking.
 * All business logic is testable and backend-agnostic.
 * 
 * @module lib/domain/availability
 */

import { parseISO, startOfDay, isAfter, isBefore, isEqual } from 'date-fns'

// ============================================================================
// Types
// ============================================================================

export interface DateRange {
  startDate: Date | string
  endDate: Date | string
}

export interface ExistingBooking extends DateRange {
  quantity: number
}

export interface StockCheck {
  totalStock: number
  requestedQuantity: number
  requestedRange: DateRange
  existingBookings: ExistingBooking[]
}

export interface AvailabilityResult {
  available: boolean
  availableQuantity: number
  message?: string
}

// ============================================================================
// Helper: Normalize dates
// ============================================================================

function normalizeDate(date: Date | string): Date {
  const d = typeof date === 'string' ? parseISO(date) : date
  return startOfDay(d)
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Validates a date range is logical (end >= start).
 * 
 * @param range - Date range to validate
 * @returns true if range is valid
 */
export function isDateRangeValid(range: DateRange): boolean {
  const start = normalizeDate(range.startDate)
  const end = normalizeDate(range.endDate)
  
  return !isBefore(end, start)
}

/**
 * Checks if a date is today or in the future.
 * 
 * @param date - Date to check
 * @returns true if date is today or future
 */
export function isDateInFuture(date: Date | string): boolean {
  const checkDate = normalizeDate(date)
  const today = startOfDay(new Date())
  
  return isAfter(checkDate, today) || isEqual(checkDate, today)
}

/**
 * Checks if two date ranges overlap.
 * Ranges are considered overlapping if they share any day.
 * Adjacent ranges (one ends, other starts next day) do NOT overlap.
 * 
 * @param range1 - First date range
 * @param range2 - Second date range
 * @returns true if ranges overlap
 */
export function doDateRangesOverlap(range1: DateRange, range2: DateRange): boolean {
  const start1 = normalizeDate(range1.startDate)
  const end1 = normalizeDate(range1.endDate)
  const start2 = normalizeDate(range2.startDate)
  const end2 = normalizeDate(range2.endDate)
  
  // Ranges overlap if: start1 <= end2 AND start2 <= end1
  // Using negation of non-overlap: NOT (end1 < start2 OR end2 < start1)
  return !isBefore(end1, start2) && !isBefore(end2, start1)
}

/**
 * Calculates available quantity for a given date range.
 * 
 * @param totalStock - Total units in inventory
 * @param existingBookings - Current bookings with quantities
 * @param requestedRange - Date range to check
 * @returns Number of units available for the requested range
 */
export function getAvailableQuantity(
  totalStock: number,
  existingBookings: ExistingBooking[],
  requestedRange: DateRange
): number {
  // Sum up all quantities from overlapping bookings
  const reservedQuantity = existingBookings
    .filter(booking => doDateRangesOverlap(booking, requestedRange))
    .reduce((sum, booking) => sum + booking.quantity, 0)
  
  return Math.max(0, totalStock - reservedQuantity)
}

/**
 * Checks if requested quantity is available for the date range.
 * 
 * @param check - Stock check parameters
 * @returns Availability result with quantity and message
 */
export function checkStockAvailability(check: StockCheck): AvailabilityResult {
  const { totalStock, requestedQuantity, requestedRange, existingBookings } = check
  
  const availableQuantity = getAvailableQuantity(totalStock, existingBookings, requestedRange)
  const available = availableQuantity >= requestedQuantity
  
  return {
    available,
    availableQuantity,
    message: available 
      ? undefined 
      : `Only ${availableQuantity} units available for this period`,
  }
}

/**
 * Validates a rental request's date range.
 * Checks both logical validity and that dates are not in the past.
 * 
 * @param range - Date range to validate
 * @returns Object with valid status and optional error message
 */
export function validateRentalDates(range: DateRange): { valid: boolean; error?: string } {
  if (!isDateRangeValid(range)) {
    return { valid: false, error: 'End date must be on or after start date' }
  }
  
  if (!isDateInFuture(range.startDate)) {
    return { valid: false, error: 'Start date cannot be in the past' }
  }
  
  return { valid: true }
}
