import { ProductLine, StockAlert } from '@/payload-types';
import { APIError, CollectionBeforeChangeHook } from 'payload';

export const validateOutOfStock: CollectionBeforeChangeHook<StockAlert> = async ({
  req,
  operation,
  data,
}) => {
  if (operation !== 'create') return data;

  const pl = data.productLine;

  if (!pl) {
    throw new Error('Product Not Specified');
  }

  let productLine: ProductLine | null = null;

  if (typeof pl === 'string') {
    productLine = await req.payload.findByID({
      collection: 'product-lines',
      id: pl,
    });
  }

  if (!productLine) {
    throw new Error('Product Not Found');
  }

  const stock = productLine.stock || (productLine.srcStock ?? 0);

  if (stock) {
    throw new APIError(
      `Product has already stock.`,
      400,
      [
        {
          field: 'productLine',
          message: 'This product has stock',
        },
      ],
      true, // isPublic: true makes the error message visible in the admin UI
    );
  }

  return data;
};
