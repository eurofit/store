'use server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { EVENT_TYPES } from '@/constants/events';
import { COOKIE_KEYS } from '@/constants/keys';
import config from '@/payload/config';
import { cookies as getCookies } from 'next/headers';
import { getPayload } from 'payload';
import { cache } from 'react';
import * as z from 'zod';

export async function getEventContext() {
  const [cookies, user] = await Promise.all([getCookies(), getCurrentUser()]);

  const sessionId = cookies.get(COOKIE_KEYS.GUEST_SESSION_ID)?.value!;

  const source = cookies.get('source')?.value;
  const device = cookies.get('device')?.value;
  const geoCountry = cookies.get('geo-country')?.value;
  const geoCity = cookies.get('geo-city')?.value;
  const isBot = cookies.get('is-bot')?.value === '1';

  return {
    user: user?.id,
    session: sessionId,
    source,
    device,
    geoCountry,
    geoCity,
    isBot,
  };
}

export const createEvent = cache(async (input: EventInput) => {
  const validatedEvent = eventSchema.parse(input);

  // if is bot, don't create the event
  if (validatedEvent.isBot) {
    return;
  }

  const payload = await getPayload({ config });

  const newEvent = await payload.create({
    collection: 'events',
    data: validatedEvent,
    draft: false,
    depth: 0,
  });

  return eventSchema.parse(newEvent);
});

const eventSchema = z.object({
  type: z.enum(EVENT_TYPES.map((type) => type.value)),
  time: z.string(),
  user: z.string().optional(),
  session: z.string(),
  brand: z.string().optional(),
  category: z.string().optional(),
  product: z.string().optional(),
  productLine: z.string().optional(),
  quantity: z.number().optional(),
  price: z.number().optional(),
  source: z.string().optional(),
  device: z.string().optional(),
  geoCountry: z.string().optional(),
  geoCity: z.string().optional(),
  isBot: z.boolean().optional(),
});

type EventInput = z.infer<typeof eventSchema>;
