import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { COOKIE_KEYS } from './constants/keys';

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Add custom headers with pathname and search parameters
  response.headers.set('x-pathname', request.nextUrl.pathname);
  response.headers.set('x-search', request.nextUrl.search);

  // Manage session ID via cookies
  let guestSessionId = request.cookies.get(COOKIE_KEYS.GUEST_SESSION_ID)?.value;

  if (!guestSessionId) {
    guestSessionId = uuidv4();
  }

  // Set the new session ID as a cookie in the response
  // Use secure, HttpOnly cookies for production
  response.cookies.set(COOKIE_KEYS.GUEST_SESSION_ID, guestSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  return response;
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};
