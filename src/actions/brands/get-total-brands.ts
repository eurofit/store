'use server';

import payloadConfig from '@/payload.config';
import { getPayload } from 'payload';

export async function getTotalBrand() {
  // 'use cache';
  // cacheTag('brands');
  // cacheLife('days');

  const payload = await getPayload({
    config: payloadConfig,
  });

  const { totalDocs: totalBrands } = await payload.count({
    collection: 'brands',
  });

  return totalBrands;
}
