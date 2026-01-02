'use server';

import config from '@/payload.config';
import { getPayload } from 'payload';

export async function getNav() {
  // 'use cache';

  // cacheTag('nav');
  // cacheLife('weeks');

  const payload = await getPayload({
    config,
  });

  const nav = await payload.findGlobal({
    slug: 'nav',
  });

  return nav.items;
}
