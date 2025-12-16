"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PocketBase from "pocketbase";
import { ClientResponseError } from "pocketbase";

interface AuthResult {
  error?: string;
}

export async function login(prevState: AuthResult | undefined, formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const defaultRedirect = formData.get("redirect") as string || "/en/dashboard";

  console.log("[LOGIN] === Starting Login ===");
  console.log("[LOGIN] Email:", email);
  console.log("[LOGIN] Default Redirect To:", defaultRedirect);

  let finalRedirect = defaultRedirect;

  try {
    // Create a temporary client for authentication
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    console.log("[LOGIN] PocketBase URL:", process.env.NEXT_PUBLIC_POCKETBASE_URL);

    // Perform authentication
    console.log("[LOGIN] Attempting authWithPassword...");
    const authData = await pb.collection("users").authWithPassword(email, password);
    console.log("[LOGIN] Auth successful! User ID:", authData.record.id);
    console.log("[LOGIN] Auth Token present:", !!authData.token);
    console.log("[LOGIN] User Role:", authData.record.role);

    // Set the httpOnly cookie
    const cookieStore = await cookies();
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1); // 1 year expiration

    // Store just the token and model as JSON (not the full cookie string)
    const cookiePayload = JSON.stringify({
      token: pb.authStore.token,
      record: pb.authStore.record,
    });
    console.log("[LOGIN] Cookie payload length:", cookiePayload.length);
    console.log("[LOGIN] Cookie payload (first 100 chars):", cookiePayload.substring(0, 100));

    cookieStore.set("pb_auth", cookiePayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_POCKETBASE_URL?.startsWith("https"),
      sameSite: "lax",
      path: "/",
      expires: expires,
    });
    console.log("[LOGIN] Cookie set successfully!");

    // Determine redirect based on role and client portal status
    const isAdmin = authData.record.role === 'admin';
    const isClientPortalEnabled = process.env.ENABLE_CLIENT_PORTAL === 'true';

    // Extract locale from default redirect
    const localeMatch = defaultRedirect.match(/^\/([a-z]{2})\//);
    const locale = localeMatch ? localeMatch[1] : 'en';

    if (isAdmin) {
      // Admin users go to admin panel
      finalRedirect = `/${locale}/admin/requests`;
      console.log("[LOGIN] Admin user detected, redirecting to admin panel");
    } else if (!isClientPortalEnabled) {
      // Non-admin + client portal disabled = redirect to home
      finalRedirect = `/${locale}/`;
      console.log("[LOGIN] Client portal disabled, non-admin user redirecting to home");
    }
    // else: use the default redirect (dashboard)

    // Revalidate paths
    revalidatePath("/", "layout");
    console.log("[LOGIN] Paths revalidated, about to redirect to:", finalRedirect);
  } catch (error) {
    console.error("[LOGIN] === Login Error ===", error);
    if (error instanceof ClientResponseError) {
      console.error("[LOGIN] ClientResponseError:", error.message);
      return { error: "Invalid email or password" };
    }
    return { error: "An unexpected error occurred" };
  }

  // Redirect MUST be outside try/catch as it throws a special error
  console.log("[LOGIN] === Redirecting to:", finalRedirect, "===");
  redirect(finalRedirect);
}

export async function logout(): Promise<void> {
  try {
    // Clear the httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.delete("pb_auth");

    // Revalidate and redirect
    revalidatePath("/", "layout");
    redirect("/login");
  } catch (error) {
    console.error("Logout error:", error);
    // Even if there's an error, try to redirect
    redirect("/login");
  }
}