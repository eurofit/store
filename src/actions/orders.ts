'use server';

import config from '@/payload.config';
import { getPayload } from 'payload';
import * as z from 'zod';

const inputSchema = z.object({
  userId: z.uuid(),
});

type Args = z.input<typeof inputSchema>;

export async function getOrders(args: Args) {
  const { userId } = inputSchema.parse(args);

  const payload = await getPayload({
    config,
  });

  const orders = await payload.find({
    collection: 'orders',
    where: {
      user: { equals: userId },
    },
    sort: '-createdAt',
    limit: 20,
  });

  return orders.docs;
}
