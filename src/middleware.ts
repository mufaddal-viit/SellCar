import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const isAuthed = await verifySessionToken(token);
  const isLoginPage = pathname === '/admin/login';

  // Already signed in → skip the login page.
  if (isLoginPage) {
    if (isAuthed) return NextResponse.redirect(new URL('/admin', req.url));
    return NextResponse.next();
  }

  // Protect everything else under /admin.
  if (!isAuthed) {
    const url = new URL('/admin/login', req.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
