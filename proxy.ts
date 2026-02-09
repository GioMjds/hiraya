import { type NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const { pathname, searchParams } = req.nextUrl;

  if (pathname === '/verify') {
    const verificationToken = searchParams.get('email');
    if (!verificationToken) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/verify');

  if (isAuthPage) {
    if (token && pathname !== '/verify') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
