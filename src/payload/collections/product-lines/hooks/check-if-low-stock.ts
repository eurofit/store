import { ProductLine } from '@/payload/types';
import { FieldHook } from 'payload';

export const checkIfLowStock: FieldHook<
  ProductLine,
  ProductLine['isLowStock'],
  ProductLine
> = ({ data }) => {
  if (data?.stock === undefined && data?.srcStock === undefined) {
    throw new Error(
      `
      Error: (product-lines/hooks/check-if-low-stock) used in afterRead field hook.
      Cannot determine low stock status because both 'stock' and 'srcStock' fields are undefined.
      This afterRead hook runs after selected fields only are included. Ensure "stock" and "srcStock" is selected in the query.
        `,
    );
  }

  const isLowStock = data?.stock != undefined ? data.stock > 0 && data.stock <= 5 : false;
  const isLowSrcStock =
    data?.srcStock != undefined ? data.srcStock > 0 && data.srcStock <= 5 : false;
  return isLowStock || isLowSrcStock;
};
