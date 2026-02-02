'use server';

import payloadConfig from '@/payload/config';
import { Product, ProductLine } from '@/types';
import { isEmpty } from 'lodash-es';
import { getPayload } from 'payload';
import { z } from 'zod';
import { getCurrentUser } from '../auth/get-current-user';

const DEFAULT_PRODUCTS_PER_PAGE = 20;
const DEFAULT_PAGE = 1;

const optionsSchema = z.object({
  slug: z.string(),
  page: z
    .number()
    .optional()
    .default(DEFAULT_PAGE)
    .pipe(z.transform((val) => Math.max(1, val))),
  limit: z
    .number()
    .optional()
    .default(DEFAULT_PRODUCTS_PER_PAGE)
    .pipe(z.transform((val) => Math.max(1, val))),
  sort: z.string().optional().nullable(),
  brand: z.array(z.string()).optional().nullable(),
  size: z.array(z.string()).optional().nullable(),
  flavourColour: z.array(z.string()).optional().nullable(),
});

type GetProductsByCategory = z.infer<typeof optionsSchema>;

export async function getProductsByCategory(opts: GetProductsByCategory) {
  const { slug, page, limit, sort, brand, size, flavourColour } =
    optionsSchema.parse(opts);

  const [user, payload] = await Promise.all([
    getCurrentUser(),
    getPayload({
      config: payloadConfig,
    }),
  ]);

  const {
    docs: products,
    totalDocs: totalProducts,
    ...rest
  } = await payload.find({
    collection: 'products',
    where: {
      'categories.slug': {
        equals: slug,
      },
      or: [
        ...(!isEmpty(brand)
          ? [
              {
                'brand.slug': {
                  in: brand,
                },
              },
            ]
          : []),
        ...(!isEmpty(size)
          ? [
              {
                'productLines.size': {
                  in: size,
                },
              },
            ]
          : []),
        ...(!isEmpty(flavourColour)
          ? [
              {
                'productLines.flavorColor': {
                  in: flavourColour,
                },
              },
            ]
          : []),
      ],
    },
    select: {
      slug: true,
      title: true,
      origin: true,
      srcImage: true,
      productLines: true,
    },
    joins: {
      productLines: {
        sort: sort === 'desc' ? '-title' : 'title',
        limit: 0,
      },
    },
    populate: {
      'product-lines': {
        sku: true,
        slug: true,
        title: true,
        variant: true,
        stock: true,
        srcStock: true,
        retailPrice: true,
        isBackorder: true,
        isLowStock: true,
        isOutOfStock: true,
        isNotifyRequested: true,
      },
    },
    sort: sort === 'desc' ? '-title' : 'title',
    user: user?.id,
    page,
    limit,
  });

  const formattedProducts = products.map((product) => {
    const { srcImage, ...p } = product;
    return {
      ...p,
      image: srcImage ?? null,
      productLines: (product.productLines.docs
        ?.filter((pl) => typeof pl === 'object')
        .map((productLine) => {
          const { srcStock, retailPrice, ...pl } = productLine;

          return {
            ...pl,
            stock: pl.stock || (srcStock ?? 0),
            price: retailPrice ?? null,
          };
        }) || []) as ProductLine[],
    };
  }) as Product[];

  return {
    products: formattedProducts,
    totalProducts,
    ...rest,
  };
}

export async function getTotalProductsByCategory(slug: string) {
  const payload = await getPayload({ config: payloadConfig });
  const { totalDocs: totalProducts } = await payload.count({
    collection: 'products',
    where: {
      'categories.slug': {
        equals: slug,
      },
    },
  });

  return totalProducts;
}
