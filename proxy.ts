import { type NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['en', 'fil'];
const defaultLocale = 'en';

function getLocale(req: NextRequest): string {
  const headers = {
    'accept-language': req.headers.get('accept-language') || 'en-US,en;q=0.9',
  };
  const languages = new Negotiator({ headers }).languages();

  try {
    return match(languages, locales, defaultLocale);
  } catch {
    return defaultLocale;
  }
}

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
      const locale = getLocale(req);
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = getLocale(req);
  req.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(req.nextUrl);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
