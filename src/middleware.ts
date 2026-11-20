import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://txhwkaesmhntloiwiuzo.supabase.co'
  )
    .replace(/^["']|["']$/g, '')
    .trim();

  const supabaseAnonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ''
  )
    .replace(/^["']|["']$/g, '')
    .trim();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // getUser() validates the token against Supabase auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = new URL(request.url);
  const pathname = url.pathname;

  // 1. If user is NOT logged in and tries to access /dashboard or any subroute -> Redirect to /login
  if (!user && (pathname === '/dashboard' || pathname.startsWith('/dashboard/'))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If user IS logged in and tries to access /login -> Redirect to /dashboard
  if (user && pathname === '/login') {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/login', '/dashboard', '/dashboard/:path*'],
};
