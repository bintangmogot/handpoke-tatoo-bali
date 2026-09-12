import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  if (isAdminPath && !isLoginPage) {
    const adminCookie = request.cookies.get('admin_session')?.value;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // If no password is set in ENV, we block access entirely to be safe
    if (!adminPassword || adminCookie !== adminPassword) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If they are on login page but already authenticated, send to admin
  if (isLoginPage) {
    const adminCookie = request.cookies.get('admin_session')?.value;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (adminPassword && adminCookie === adminPassword) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
