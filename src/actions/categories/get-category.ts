'use server';

import payloadConfig from '@/payload/config';
import { getPayload } from 'payload';
import { cache } from 'react';

type GetCategoryArgs = {
  slug: string;
};

export const getCategory = cache(async ({ slug }: GetCategoryArgs) => {
  const payload = await getPayload({ config: payloadConfig });

  const { docs: categories } = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: slug,
      },
    },
    select: {
      title: true,
    },
    limit: 1,
    pagination: false,
  });

  return categories[0] ?? null;
});
