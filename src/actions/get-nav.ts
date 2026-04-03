'use server';

import config from '@/payload/config';
import { getPayload } from 'payload';
import { cacheLife, cacheTag } from 'next/cache';

export const getNav = async () => {
  // "use cache"

  // cacheTag("nav")
  // cacheLife("hours")

  const payload = await getPayload({
    config,
  });

  const nav = await payload.findGlobal({
    slug: 'nav',
  });

  return nav.items;
}
