'use server';

import config from '@/payload/config';
import { Order } from '@/types';
import { getPayload } from 'payload';
import * as z from 'zod';

const inputSchema = z.object({
  userId: z.uuid(),
});

type Args = z.input<typeof inputSchema>;

export async function getOrders(args: Args): Promise<Order[]> {
  const { userId } = inputSchema.parse(args);

  const payload = await getPayload({
    config,
  });

  const { docs } = await payload.find({
    collection: 'orders',
    where: {
      customer: { equals: userId },
    },
    select: {
      items: true,
      status: true,
      total: true,
      createdAt: true,
    },
    sort: '-createdAt',
    limit: 20,
    depth: 1,
  });

  // remove items from orders
  const orders = docs.map(({ items, ...order }) => order);

  return orders;
}
