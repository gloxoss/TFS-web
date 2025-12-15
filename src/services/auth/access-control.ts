import PocketBase, { AuthModel } from 'pocketbase';
import { UserRole, ROLES } from '@/types/auth';

// ============================================================================
// Service Logic
// ============================================================================

/**
 * Extract the role from a PocketBase client/model.
 * Handles both "Admin" collection and "Users" collection with 'role' field.
 */
export function getCurrentUserRole(model: AuthModel): UserRole | 'guest' {
    if (!model) return 'guest';

    // 1. Native PocketBase Admin
    // (In PB, admins are in a special collection usually called '_superusers' or similar internally,
    // but the SDK exposes them via .admins alias. The model itself usually lacks 'collectionName' 
    // in the same way, but let's check widely used patterns)
    // 
    // However, often we use a unified 'users' collection with a 'role' field.
    // We'll prioritize the explicity 'role' field.
    if ('role' in model && model.role === ROLES.ADMIN) {
        return ROLES.ADMIN;
    }

    // 2. Check for "Admins" collection (if using native separate admins)
    // This is a safeguard if you use PB's built-in Admin UI users.
    // Note: PB AuthStore Model for admins usually doesn't have a collectionId/Name exposed easily 
    // in the type definition, but valid admin models exist.
    // For now, we assume if you are authenticated as an admin on the SDK, it might not be a RecordModel.
    // A simple heuristic: if it has an email but no 'role' field, and it came from .admins.authWith...,
    // we might treat it as admin IF we trust the source. 
    // BETTER: Stick to the unified 'users' collection with 'role'='admin' for this app.

    return ROLES.CUSTOMER;
}

/**
 * Verify if the current session has Admin access.
 * Returns true if allowed, false otherwise.
 * 
 * Logic:
 * 1. Check if authStore is valid.
 * 2. Check if role is 'admin'.
 */
export function hasAdminAccess(pb: { authStore: PocketBase['authStore'] }): boolean {
    if (!pb.authStore.isValid || !pb.authStore.model) {
        return false;
    }

    const role = getCurrentUserRole(pb.authStore.model);
    return role === ROLES.ADMIN;
}

/**
 * Server-Side Helper: Verify Admin Access from Cookies
 * Used in Page/Layouts (Server Components).
 * 
 * @throws Error (or handled by redirect in consumer) - actually returns boolean for easier handling
 */
import { createServerClient } from '@/lib/pocketbase/server';

/**
 * Server-Side Helper: Verify Admin Access from Cookies
 * Used in Page/Layouts (Server Components) and Middleware.
 * 
 * @throws Error (or handled by redirect in consumer) - actually returns boolean for easier handling
 */
export async function verifyAdminAccess(): Promise<boolean> {
    // Usage in Layouts/Pages requires Read-Only client preventing "Cookies can only be modified" errors.
    const pb = await createServerClient(false);
    return hasAdminAccess(pb);
}
