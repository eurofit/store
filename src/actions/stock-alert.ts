'use server';

import config from '@/payload/config';
import { StockAlert } from '@/types';
import { getPayload } from 'payload';

type Args = {
  userId: string;
};

export async function getUserStockAlerts({ userId }: Args) {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: 'stock-alerts',
    where: {
      user: {
        equals: userId,
      },
    },
    select: {
      productLine: true,
    },
    populate: {
      'product-lines': {
        title: true,
        product: true,
        isOutOfStock: true,
      },
      products: {
        slug: true,
        srcImage: true,
      },
    },
    depth: 2,
  });

  return {
    stockAlerts: docs.map(
      (alert) =>
        ({
          id: alert.id,
          title:
            typeof alert.productLine === 'string'
              ? alert.productLine
              : alert.productLine.title,
          image:
            typeof alert.productLine === 'string'
              ? null
              : typeof alert.productLine.product === 'string'
                ? null
                : alert.productLine.product.srcImage,
          slug:
            typeof alert.productLine === 'string'
              ? null
              : typeof alert.productLine.product === 'string'
                ? null
                : alert.productLine.product.slug,
          isOutOfStock:
            typeof alert.productLine === 'string'
              ? false
              : alert.productLine.isOutOfStock,
        }) as StockAlert,
    ),
  };
}
