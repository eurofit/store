'use server';

import payloadConfig from '@/payload/config';
import { cache } from 'react';
import { getPayload } from 'payload';

type GetBrandArgs = {
  slug: string;
};

export const getBrand = cache(async ({ slug }: GetBrandArgs) => {
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

  const { srcImage, ...brand } = brands[0];

  return {
    image: srcImage ?? undefined,
    ...brand,
  };
});
