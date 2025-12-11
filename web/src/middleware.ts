import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import PocketBase from 'pocketbase';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);

  // Load auth state from cookies
  const authCookie = request.cookies.get('pb_auth');
  if (authCookie) {
    pb.authStore.loadFromCookie(authCookie.value);
  }

  // 1. Check if user is logged in
  const isValid = pb.authStore.isValid;
  
  // 2. Define Protected Routes
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isAccountPath = request.nextUrl.pathname.startsWith('/account');

  // 3. Logic: Redirect if not allowed
  if ((isAdminPath || isAccountPath) && !isValid) {
    // Not logged in -> Go to Login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (isAdminPath && isValid) {
    // Logged in but checking Role
    const userRole = pb.authStore.model?.role;
    if (userRole !== 'admin') {
      // Not an admin -> Go to Home (or 403 page)
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};
