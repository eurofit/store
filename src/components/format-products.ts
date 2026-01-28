import { Category, Product, ProductLine } from '@/payload/types';
import { formatProductLine } from '@/utils/format-product-line';

export function formatProducts(products?: (string | Product)[]) {
  return (
    products
      // Filter out any non-Product items and ensure they have an 'id' property
      ?.filter(
        (product): product is Product =>
          product !== null && typeof product === 'object' && 'id' in product,
      )
      // format the product lines to pass the 'docs' property
      .map((product) => ({
        ...product,
        productLines: (
          product.productLines?.docs?.filter(
            (line): line is ProductLine =>
              typeof line === 'object' && line !== null && 'id' in line,
          ) ?? []
        ).map(formatProductLine),
        categories:
          product.categories?.filter(
            (category): category is Category =>
              category !== null && typeof category === 'object' && 'id' in category,
          ) ?? [],
      })) ?? []
  );
}

export type FormattedProduct = Exclude<
  ReturnType<typeof formatProducts>,
  undefined
>[number];
