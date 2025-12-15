import { cookies } from "next/headers";
import PocketBase, { AsyncAuthStore } from "pocketbase";
import "server-only";
import { TypedPocketBase } from "./types";
import { User, UserRole } from "@/types/auth";

export const COOKIE_NAME = "pb_auth";

export async function createServerClient(writable: boolean = false) {
  const cookieStore = await cookies();
  const authCookieValue = cookieStore.get(COOKIE_NAME)?.value;

  // Parse the JSON cookie to get token and record
  let initialToken = "";
  let initialRecord = null;

  if (authCookieValue) {
    try {
      let decoded = decodeURIComponent(authCookieValue);

      // Handle legacy format: strip "pb_auth=" prefix if present
      if (decoded.startsWith("pb_auth=")) {
        decoded = decoded.substring(8); // Remove "pb_auth=" prefix
      }

      const authData = JSON.parse(decoded);
      initialToken = authData.token || "";
      initialRecord = authData.record || null;
    } catch (e) {
      console.error("Failed to parse auth cookie in createServerClient:", e);
    }
  }

  const client = new PocketBase(
    process.env.NEXT_PUBLIC_POCKETBASE_URL,
    new AsyncAuthStore({
      save: async (serializedPayload) => {
        if (!writable) return; // Silent return for read-only contexts
        try {
          const expires = new Date();
          expires.setFullYear(expires.getFullYear() + 1); // 1 year expiration

          cookieStore.set(COOKIE_NAME, serializedPayload, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: expires,
          });
        } catch (e) {
          // This method might be called from a Server Component where setting cookies is restricted
          // unless inside a Server Action or Route Handler.
          console.error("Failed to save auth cookie:", e);
        }
      },
      clear: async () => {
        if (!writable) return; // Silent return for read-only contexts
        try {
          cookieStore.delete(COOKIE_NAME);
        } catch (e) {
          console.error("Failed to delete auth cookie:", e);
        }
      },
      initial: "", // We'll manually set auth below
    }),
  ) as TypedPocketBase;

  // Manually load the parsed auth data
  if (initialToken) {
    client.authStore.save(initialToken, initialRecord);
  }

  return client;
}

export async function createAdminClient() {
  const client = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL) as TypedPocketBase;

  if (process.env.POCKETBASE_ADMIN_EMAIL && process.env.POCKETBASE_ADMIN_PASSWORD) {
    await client.admins.authWithPassword(
      process.env.POCKETBASE_ADMIN_EMAIL,
      process.env.POCKETBASE_ADMIN_PASSWORD
    );
  }

  return client;
}

/**
 * Get the current authenticated user from the server session
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const client = await createServerClient(false); // Read-only client

    if (!client.authStore.isValid || !client.authStore.model) {
      return null;
    }

    const model = client.authStore.model;

    return {
      id: model.id,
      email: model.email,
      name: model.name || '',
      avatar: model.avatar || undefined,
      role: (model.role as UserRole) || 'customer',
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
