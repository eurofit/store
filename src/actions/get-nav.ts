'use server';

import config from '@/payload/config';
import { cache } from 'react';
import { getPayload } from 'payload';

export const getNav = cache(async () => {
  const payload = await getPayload({
    config,
  });

  const nav = await payload.findGlobal({
    slug: 'nav',
  });

  return nav.items;
});
