/**
 * Authentication and Authorization Types
 * Single Source of Truth for User Roles
 */

export type UserRole = 'admin' | 'customer';

export const ROLES: Record<string, UserRole> = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
} as const;

/**
 * User interface with standardized role
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
}