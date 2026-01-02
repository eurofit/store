'use server';

import { ProductNotFoundError, UserNotFoundError } from '@/errors';
import config from '@payload-config';
import { getPayload } from 'payload';
import { z } from 'zod';

const CreateStockAlertSchema = z.object({
  userId: z.string().min(1),
  productLineId: z.string().min(1),
});

type CreateStockAlertInput = z.infer<typeof CreateStockAlertSchema>;

export async function createStockAlert(input: CreateStockAlertInput) {
  const { userId, productLineId } = CreateStockAlertSchema.parse(input);

  const payload = await getPayload({ config });

  // get the user & product line
  const [user, productLine] = await Promise.all([
    payload.findByID({
      collection: 'users',
      id: userId,
    }),
    payload.findByID({
      collection: 'product-lines',
      id: productLineId,
    }),
  ]);

  if (!user) {
    throw new UserNotFoundError();
  }

  if (!productLine) {
    throw new ProductNotFoundError();
  }

  const stock = productLine.stock || (productLine.srcStock ?? 0);

  if (stock > 0) {
    // product is in stock, no need to create alert
    return false;
  }

  await payload.create({
    collection: 'stock-alerts',
    data: {
      user: userId,
      productLine: productLineId,
    },
  });

  return true;
}
