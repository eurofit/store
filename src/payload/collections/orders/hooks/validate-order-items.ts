import { Order } from '@/payload/types';
import { orderItemSnapShotSchema } from '@/schemas/order';
import { isEqual } from 'lodash-es';
import { CollectionBeforeChangeHook } from 'payload';

export const validateOrderItems: CollectionBeforeChangeHook<Order> = async ({
  operation,
  data,
  originalDoc,
  req,
}) => {
  // if operation is update and items not being modified, skip validation
  if (operation === 'update' && isEqual(data.items, originalDoc?.items)) {
    return data;
  }

  const userId = typeof req.user === 'string' ? req.user : req.user?.id;

  const productLineIds =
    data.items?.map((item) =>
      typeof item.productLine === 'string' ? item.productLine : item.productLine.id,
    ) ?? [];

  if (!productLineIds.length) {
    throw new Error('Order must have at least one item with a valid product.');
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
    user: userId,
    req,
  });

  // incase some product lines not found or inactive
  if (producLines.length !== productLineIds.length) {
    throw new Error('One or more products in the order are not found or inactive.');
  }

  for (const item of data.items!) {
    const itemId =
      typeof item.productLine === 'string' ? item.productLine : item.productLine.id;
    const quantity = item.quantity;
    const productLine = producLines.find((pl) => pl.id === itemId);

    if (!productLine) {
      throw new Error(`Product line with ID ${itemId} not found.`);
    }

    // check stock
    if (productLine.isOutOfStock) {
      throw new Error(`Product line with ID ${itemId} is out of stock.`);
    }

    // check requested quantity against available stock
    const availableStock = productLine.srcStock ?? productLine.stock;

    if (quantity > availableStock) {
      throw new Error(`Insufficient stock for product line with ID ${itemId}.`);
    }

    const itemSnapshot = orderItemSnapShotSchema.parse(item.snapshot);

    // validate price
    if (itemSnapshot.price !== productLine.retailPrice) {
      throw new Error(`Price mismatch for product line with ID ${itemId}.`);
    }
  }

  return data;
};
