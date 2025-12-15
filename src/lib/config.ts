/**
 * Application Feature Flags and Configuration
 * 
 * Centralized config for feature toggles that can be controlled
 * via environment variables.
 */

// ============ FEATURE FLAGS ============

/**
 * Digital Signature Feature
 * When enabled, allows clients to sign quotes electronically.
 * Default: disabled (requires client upgrade/payment)
 */
export const ENABLE_DIGITAL_SIGNATURE = process.env.NEXT_PUBLIC_ENABLE_DIGITAL_SIGNATURE === 'true'

/**
 * Client Portal Feature
 * When enabled, allows client login/dashboard access.
 * When disabled, only admins can log in.
 */
export const ENABLE_CLIENT_PORTAL = process.env.ENABLE_CLIENT_PORTAL === 'true'
