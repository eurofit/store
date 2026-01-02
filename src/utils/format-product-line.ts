import { ProductLine } from '@/payload-types';

export function formatProductLine(productLine: ProductLine) {
  return {
    ...productLine,
    product:
      productLine.product && typeof productLine.product === 'object'
        ? {
            id: productLine.product.id,
            image: productLine.product.srcImage,
          }
        : undefined,
  };
}

export type FormattedProductLine = ReturnType<typeof formatProductLine>;
