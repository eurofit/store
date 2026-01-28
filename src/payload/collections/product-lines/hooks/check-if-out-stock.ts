import { ProductLine } from '@/payload/types';
import { FieldHook } from 'payload';

export const checkIfOutOfStock: FieldHook<
  ProductLine,
  ProductLine['isOutOfStock'],
  ProductLine
> = ({ data }) => {
  if (data?.stock === undefined || data?.srcStock === undefined) {
    throw new Error(
      `
      Error: (product-lines/hooks/check-if-out-stock) used in afterRead field hook.
      Cannot determine out of stock status because both 'stock' or 'srcStock' fields are undefined.
      This afterRead hook runs after selected fields only are included. Ensure "stock" and "srcStock" is selected in the query.
        `,
    );
  }

  if (data.stock && data.stock > 0) return false;
  if (data.srcStock && data.srcStock > 0) return false;

  return true;
};
