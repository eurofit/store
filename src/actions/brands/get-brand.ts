'use server';

import payloadConfig from '@/payload.config';
import { getPayload } from 'payload';

type GetBrandArgs = {
  slug: string;
};

export async function getBrand({ slug }: GetBrandArgs) {
  // 'use cache';

  // cacheTag('brands', `brands:${slug}`);
  // cacheLife('days');

  const payload = await getPayload({ config: payloadConfig });

  const { docs: brands } = await payload.find({
    collection: 'brands',
    where: {
      slug: {
        equals: slug,
      },
    },
    select: {
      title: true,
      srcImage: true,
    },
    limit: 1,
    pagination: false,
  });

  return brands[0] ?? null;
}
