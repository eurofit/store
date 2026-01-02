'use server';

import payloadConfig from '@/payload.config';
import { getPayload } from 'payload';

type GetCategoryArgs = {
  slug: string;
};

export async function getCategory({ slug }: GetCategoryArgs) {
  // 'use cache';

  // cacheTag('categories', `categories:${slug}`);
  // cacheLife('days');

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
}
