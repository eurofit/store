'use server';

import { formatProductLine } from '@/utils/format-product-line';
import config from '@payload-config';
import { getPayload } from 'payload';

type Options = {
  limit?: number;
  [key: string]: any;
};

export async function searchProductLine(
  query: string,
  { limit = 1, where, ...options }: Options = {},
) {
  if (!query) return [];

  const payloadConfig = await config;

  const payload = await getPayload({
    config: payloadConfig,
  });

  try {
    const { docs } = await payload.find({
      collection: 'product-lines',
      where: {
        or: [
          {
            id: {
              like: query,
            },
          },
          {
            slug: {
              like: query,
            },
          },
          {
            sku: {
              like: query,
            },
          },
          {
            title: {
              like: query,
            },
          },
          {
            barcode: {
              like: query,
            },
          },
          {
            supplierCode: {
              like: query,
            },
          },
        ],
        ...(where || {}),
      },
      populate: {
        products: {
          srcImage: true,
        },
      },
      limit,
      depth: 1,
      sort: 'title',
      ...options,
    });

    return docs.map(formatProductLine);
  } catch (e: unknown) {
    return {
      error: 'An error occurred while searching for products',
    };
  }
}
