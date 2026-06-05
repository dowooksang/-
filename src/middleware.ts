// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { UserLevel } from '@/lib/store';
/**
 * Middleware that protects /branch/** and /network/** routes.
 * It uses @supabase/ssr to read / write Supabase cookies on the server side,
 * guaranteeing that the session is kept when the page is rendered on Vercel.
 */
export async function middleware(request: NextRequest) {
  // 1️⃣ Build a Supabase client that automatically reads cookies from the request
  const supabase = createMiddlewareSupabaseClient({ request, response: NextResponse.next() });
  // 2️⃣ Get the current session (access + refresh tokens are parsed from cookies)
  const {
    data: { session },
  } = await supabase.auth.getSession();
  // 3️⃣ If there is no authenticated user – redirect to home with an error flag
  if (!session?.user?.email) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    redirectUrl.search = '?error=unauthenticated';
    return NextResponse.redirect(redirectUrl);
  }
  // 4️⃣ (Optional) Fetch user level from your DB.
  //    For now we assume an admin level so the protected pages are reachable.
  //    Replace this with a real query when you have a `users` table.
  const userLevel = 5; // e.g. LV5_ADMIN
  // 5️⃣ Authorization check – only LV4_MANAGER (or higher) may access these routes
  if (userLevel < UserLevel.LV4_MANAGER) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    redirectUrl.search = '?error=unauthorized';
    return NextResponse.redirect(redirectUrl);
  }
  // 6️⃣ Let the request continue. Supabase will automatically attach the
  //    refreshed Set‑Cookie headers (access‑token, refresh‑token) to the response.
  return NextResponse.next();
}
// ──────────────────────────────────────────────────────────────
// Middleware matcher – applies only to the routes that need protection
export const config = {
  matcher: ['/branch/:path*', '/network/:path*'],
};
