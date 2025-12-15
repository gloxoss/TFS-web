import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import PocketBase from 'pocketbase';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages } from './app/i18n/settings';
import { ROLES } from './types/auth';

acceptLanguage.languages(languages);

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, `..` etc
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  // -----------------------------------------------------------------------
  // 1. I18n Redirection Logic
  // -----------------------------------------------------------------------
  let lng;
  if (request.cookies.has('i18next')) {
    lng = acceptLanguage.get(request.cookies.get('i18next')?.value);
  }
  if (!lng) {
    lng = acceptLanguage.get(request.headers.get('Accept-Language'));
  }
  if (!lng) {
    lng = fallbackLng;
  }

  // Check if pathname already has a locale
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = languages.every(
    (l) => !pathname.startsWith(`/${l}/`) && pathname !== `/${l}`
  );

  // Redirect if missing locale
  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${lng}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // 2. RBAC Strategy (Unified Security)
  // -----------------------------------------------------------------------

  // Extract path without locale for checking protected routes
  // e.g. "/en/admin" -> "/admin"
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');

  const isAdminPath = pathWithoutLocale.startsWith('/admin') || pathWithoutLocale === '/admin';
  const isDashboardPath = pathWithoutLocale.startsWith('/dashboard') || pathWithoutLocale === '/dashboard';
  const isAccountPath = pathWithoutLocale.startsWith('/account');
  const isLoginPath = pathWithoutLocale.startsWith('/login') || pathWithoutLocale === '/login';
  const isRegisterPath = pathWithoutLocale.startsWith('/register') || pathWithoutLocale === '/register';

  // -----------------------------------------------------------------------
  // 2.1 Client Portal Feature Flag Check
  // -----------------------------------------------------------------------
  const isClientPortalEnabled = process.env.ENABLE_CLIENT_PORTAL === 'true';
  // Login is allowed (admins need it), but register/dashboard/account are blocked for clients
  const isClientOnlyPath = isRegisterPath || isDashboardPath || isAccountPath;

  // Block client-only routes when portal disabled (login stays available for admins)
  if (!isClientPortalEnabled && isClientOnlyPath && !isAdminPath) {
    console.log('[Middleware] Client portal disabled, blocking:', pathWithoutLocale);
    const currentLocale = pathname.split('/')[1] || fallbackLng;
    const url = request.nextUrl.clone();
    url.pathname = `/${currentLocale}/`;
    return NextResponse.redirect(url);
  }

  // If it's a protected path, we check auth
  if (isAdminPath || isDashboardPath || isAccountPath) {
    console.log("[Middleware] Protected path detected:", pathWithoutLocale);

    // Load auth state from cookies
    const authCookie = request.cookies.get('pb_auth');
    console.log("[Middleware] pb_auth cookie present:", !!authCookie);
    console.log("[Middleware] pb_auth cookie value (first 50 chars):", authCookie?.value?.substring(0, 50));

    if (authCookie) {
      try {
        // Parse the JSON cookie payload
        let decoded = decodeURIComponent(authCookie.value);

        // Handle legacy format: strip "pb_auth=" prefix if present
        if (decoded.startsWith("pb_auth=")) {
          decoded = decoded.substring(8); // Remove "pb_auth=" prefix
        }

        const authData = JSON.parse(decoded);
        console.log("[Middleware] Parsed authData - token present:", !!authData.token);
        console.log("[Middleware] Parsed authData - record present:", !!authData.record);

        // Load token and model directly into authStore
        pb.authStore.save(authData.token, authData.record);
        console.log("[Middleware] After save - isValid:", pb.authStore.isValid);
        console.log("[Middleware] After save - model id:", pb.authStore.model?.id);
      } catch (parseError) {
        console.error("[Middleware] Failed to parse auth cookie:", parseError);
      }
    }

    const isValid = pb.authStore.isValid;
    console.log("[Middleware] Final isValid check:", isValid);

    // Logic: Redirect if not allowed
    if (!isValid) {
      console.log("[Middleware] === NOT VALID - Redirecting to login ===");
      // Not logged in -> Go to Login (preserving locale)
      // Extract locale from current path to keep user in same language
      const currentLocale = pathname.split('/')[1] || fallbackLng;
      const url = request.nextUrl.clone();
      url.pathname = `/${currentLocale}/login`;
      url.searchParams.set('redirect', pathname); // Add redirect param
      return NextResponse.redirect(url);
    }

    console.log("[Middleware] === VALID - Allowing access ===");

    if (isAdminPath && isValid) {
      // Logged in but checking Role
      // NOTE: PocketBase 'admins' collection behaves differently than 'users' with role field.
      // If you are using a unified 'users' collection with a 'role' field:
      const userRole = pb.authStore.model?.role;

      // If you are using the separate 'admins' collection, pb.authStore.model will be an Admin model.
      // We check if it's NOT an admin (assuming 'users' collection role approach for now based on prompt context)
      // If using native PB admins, we would check `pb.authStore.model.collectionName === '_superusers'` or similar.

      // Strict Admin Check
      console.log(`[Middleware] Checking Admin Path: ${pathWithoutLocale}`);
      console.log(`[Middleware] User Role: ${userRole}, Email: ${pb.authStore.model?.email}`);

      if (userRole !== ROLES.ADMIN) {
        console.log('[Middleware] Access Denied: User is not admin.');
        // Not an admin -> Go to Home
        const currentLocale = pathname.split('/')[1] || fallbackLng;
        const url = request.nextUrl.clone();
        url.pathname = `/${currentLocale}/`;
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}
