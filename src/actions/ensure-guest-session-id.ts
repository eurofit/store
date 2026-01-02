'use server';

import { COOKIE_KEYS } from '@/constants/keys';
import { cookies as getCookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function ensureGuestSessionId() {
  const cookies = await getCookies();
  let guestSessionId = cookies.get(COOKIE_KEYS.GUEST_SESSION_ID)?.value;

  if (!guestSessionId) {
    guestSessionId = uuidv4();
  }

  // set the cookie in the response
  cookies.set(COOKIE_KEYS.GUEST_SESSION_ID, guestSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  return guestSessionId;
}
