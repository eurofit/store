import { type NextRequest, NextResponse, userAgent } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { COOKIE_KEYS } from './constants/keys';

export function proxy(req: NextRequest) {
  const ua = userAgent(req);
  const res = NextResponse.next();

  // Add custom headers
  res.headers.set('x-pathname', req.nextUrl.pathname);
  res.headers.set('x-search', req.nextUrl.search);
  res.headers.set('x-referer', req.headers.get('referer') ?? '');

  // Manage session ID via cookies
  const guestSessionId = req.cookies.get(COOKIE_KEYS.GUEST_SESSION_ID)?.value ?? uuidv4();

  res.cookies.set(COOKIE_KEYS.GUEST_SESSION_ID, guestSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  // SOURCE
  if (!req.cookies.get('source')) {
    let source = 'direct';

    // 1. explicit UTM always wins
    const utm = req.nextUrl.searchParams.get('utm_source');
    if (utm) {
      source = utm;
    }
    // 2. external referrer only
    else if (isExternalReferrer(req)) {
      source = new URL(req.headers.get('referer')!).hostname;
    }

    res.cookies.set('source', source, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', //
      maxAge: 86400,
    }); // 1 day
  }

  // device
  const deviceType = ua.device.type ?? 'desktop';
  const deviceValue = req.cookies.get('device')?.value ?? deviceType;
  res.cookies.set('device', deviceValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 30, // 30 minutes
  });

  // is bot
  const isBotValue = req.cookies.get('is-bot')?.value ?? (ua.isBot ? '1' : '0');
  res.cookies.set('is-bot', isBotValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 30, // 30 minutes
  });

  // geo country
  const geoCountryValue =
    req.cookies.get('geo-country')?.value ?? req.headers.get('x-vercel-ip-country') ?? '';
  res.cookies.set('geo-country', geoCountryValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 30, // 30 minutes
  });

  // geo city
  const geoCityValue =
    req.cookies.get('geo-city')?.value ?? req.headers.get('x-vercel-ip-city') ?? '';
  res.cookies.set('geo-city', geoCityValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 30, // 30 minutes
  });

  return res;
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};

function isExternalReferrer(req: NextRequest) {
  const referer = req.headers.get('referer');
  if (!referer) return false;

  try {
    const refererUrl = new URL(referer);
    return refererUrl.hostname !== req.nextUrl.hostname;
  } catch {
    return false;
  }
}
