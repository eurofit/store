'use server';

import config from '@/payload/config';
import { getPayload } from 'payload';
import * as z from 'zod';

export async function getProductLineById(unSafeId: string) {
  const id = z.string().parse(unSafeId);

  const payload = await getPayload({ config });

  const productLine = await payload.findByID({
    collection: 'product-lines',
    id,
    select: {
      slug: true,
      title: true,
    },
  });

  return productLine;
}
