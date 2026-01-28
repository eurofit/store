import { Order } from '@/payload/types';
import { orderItem } from '@/schemas/order';
import { FieldHook } from 'payload';
import * as z from 'zod';

export const getOrderTotal: FieldHook<Order, Order['total'], Order> = async ({
  data,
}) => {
  if (!data) {
    throw new Error('No order found');
  }

  if (!('items' in data) || !data.items) {
    throw new Error('Order items are missing');
  }

  const areOrderItemsPopulated =
    data?.items?.every((item) => item?.snapshot && item?.quantity) ?? false;

  if (!areOrderItemsPopulated) {
    throw new Error('Order items must be populated to calculate total');
  }

  const formattedItems = data.items.map((item) => ({
    ...item,
    id: typeof item.productLine === 'string' ? item.productLine : item.productLine?.id,
  }));

  const items = z.array(orderItem).parse(formattedItems);

  const total = items.reduce((acc, item) => {
    return acc + item.snapshot.price * item.quantity;
  }, 0);

  return total;
};
