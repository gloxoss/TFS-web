/**
 * Quote Form Validation Schema
 * 
 * Uses Zod for runtime validation of quote request form data.
 * Aligned with rental_requests collection in PocketBase.
 */

import { z } from 'zod'

export const quoteFormSchema = z.object({
  // Contact Information
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),

  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^[\d\s\-+()]+$/,
      'Please enter a valid phone number'
    ),

  // Optional Company
  company: z
    .string()
    .max(100, 'Company name must be less than 100 characters')
    .optional()
    .or(z.literal('')),

  // Project Details
  projectType: z
    .enum(['film', 'commercial', 'documentary', 'music_video', 'corporate', 'event', 'other'], {
      message: 'Please select a project type',
    }),

  projectDescription: z
    .string()
    .max(1000, 'Project description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),

  // Additional Notes
  notes: z
    .string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional()
    .or(z.literal('')),

  // Pickup/Delivery Preference
  deliveryPreference: z
    .enum(['pickup', 'delivery'], {
      message: 'Please select a delivery preference',
    }),

  // Location (for delivery or shooting location)
  location: z
    .string()
    .max(200, 'Location must be less than 200 characters')
    .optional()
    .or(z.literal('')),

  // Terms acceptance
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
})

export type QuoteFormData = z.infer<typeof quoteFormSchema>

// Project type labels for UI
export const projectTypeLabels: Record<QuoteFormData['projectType'], string> = {
  film: 'Film / Feature',
  commercial: 'Commercial / Ad',
  documentary: 'Documentary',
  music_video: 'Music Video',
  corporate: 'Corporate Video',
  event: 'Event Coverage',
  other: 'Other',
}

// Delivery preference labels
export const deliveryPreferenceLabels: Record<QuoteFormData['deliveryPreference'], string> = {
  pickup: 'I will pick up at your location',
  delivery: 'Please deliver to my location',
}
