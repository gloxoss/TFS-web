import PocketBase from 'pocketbase';
import { IAuthService } from './interface';
import { User, UserRole, ROLES } from '@/types/auth';
import { cookies } from 'next/headers'; // Essential for Server Actions

// Singleton instance to avoid creating multiple connections
export const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);

/**
 * @deprecated This service is DEPRECATED. Use Server Actions in `src/lib/actions/session.ts` instead.
 * This class bypasses the secure HttpOnly cookie authentication flow.
 */
export class PocketBaseAuthService implements IAuthService {
  constructor() {
    console.warn('[DEPRECATED] PocketBaseAuthService is deprecated. Use session.ts Server Actions instead.');
  }

  async login(email: string, pass: string) {
    const authData = await pb.collection('users').authWithPassword(email, pass);

    // Map PB record to our clean User type
    const user: User = {
      id: authData.record.id,
      email: authData.record.email,
      name: authData.record.name,
      avatar: authData.record.avatar,
      role: (authData.record.role as UserRole) || 'customer',
    };

    return { user, token: authData.token };
  }

  logout() {
    pb.authStore.clear();
    // If using cookies for session, we would clear them here
  }

  async getCurrentUser(): Promise<User | null> {
    // In Next.js Server Components, we often check the cookie/header
    // For client-side, we check authStore
    if (!pb.authStore.isValid) return null;

    const model = pb.authStore.model;
    if (!model) return null;

    return {
      id: model.id,
      email: model.email,
      name: model.name,
      avatar: model.avatar,
      role: (model.role as UserRole) || 'customer',
    };
  }

  isAdmin(user: User): boolean {
    return user.role === ROLES.ADMIN;
  }
}