'use server';

import config from '@/payload/config';
import { ProductLine } from '@/payload/types';
import { Order } from '@/types';
import { getPayload } from 'payload';
import * as z from 'zod';
import { getCurrentUser } from './auth/get-current-user';

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
      paymentStatus: true,
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

export async function getOrderById(id: number) {
  const user = await getCurrentUser();
  const payload = await getPayload({
    config,
  });

  const { docs, totalDocs } = await payload.find({
    collection: 'orders',
    where: {
      id: {
        equals: id,
      },
      customer: {
        equals: user?.id,
      },
    },
    depth: 1,
    select: {
      customer: true,
      items: {
        productLine: true,
        quantity: true,
        snapshot: true,
      },
      shippingAddress: true,
      billingAddress: true,
    },
    populate: {
      'product-lines': {
        sku: true,
      },
      users: {
        fullName: true,
        accountNumber: true,
      },
      addresses: {
        title: true,
        firstName: true,
        lastName: true,
        line1: true,
        line2: true,
        city: true,
        county: true,
        postalCode: true,
        country: true,
      },
    },
  });

  if (totalDocs === 0) return null;

  const order = docs[0];

  // return order;

  return {
    ...order,
    items: order.items.map(({ id, productLine, quantity, snapshot }) => ({
      ...(productLine as ProductLine),
      quantity,
      ...(snapshot as Record<string, unknown>),
    })),
  };
}
