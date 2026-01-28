import { Cart } from '@/payload/types';
import { APIError, CollectionBeforeChangeHook } from 'payload';

export const validateCartItems: CollectionBeforeChangeHook<Cart> = async ({
  data,
  req,
}) => {
  const productLineIds =
    data.items?.map((item) =>
      typeof item.productLine === 'string' ? item.productLine : item.productLine.id,
    ) ?? [];

  if (!productLineIds.length) {
    throw new APIError('Cart must have at least one item with a valid product.', 400);
  }

  // find the corrosponding product line, inorder to verify prices and stocks
  const { docs: producLines } = await req.payload.find({
    collection: 'product-lines',
    where: {
      id: {
        in: productLineIds,
      },
      active: {
        equals: true,
      },
      retailPrice: {
        exists: true,
      },
    },
    select: {
      retailPrice: true,
      stock: true,
      srcStock: true,
      isOutOfStock: true,
    },
    pagination: false,
  });

  // incase some product lines not found or inactive
  if (producLines.length !== productLineIds.length) {
    throw new APIError(
      'One or more products in the cart are not found or inactive.',
      404,
    );
  }

  data.items?.forEach((item) => {
    const itemId =
      typeof item.productLine === 'string' ? item.productLine : item.productLine.id;
    const quantity = item.quantity;
    const productLine = producLines.find((pl) => pl.id === itemId);

    if (!productLine) {
      throw new APIError('Product Not Found', 404);
    }

    // check stock
    if (productLine.isOutOfStock) {
      throw new APIError('Product is Out of Stock', 403);
    }

    // check requested quantity against available stock
    const availableStock = productLine.stock || (productLine.srcStock ?? 0);

    if (quantity > availableStock) {
      throw new APIError('Product has low stock', 400);
    }

    // validate price
    // if (item.snapshot.retailPrice !== productLine.retailPrice) {
    //   throw new CartPriceMismatchError(
    //     itemId,
    //     productLine.retailPrice!,
    //     item.snapshot.retailPrice,
    //   );
    // }
  });

  return data;
};
