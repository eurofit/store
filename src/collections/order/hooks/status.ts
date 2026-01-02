import { Order } from '@/payload-types';
import { FieldHook } from 'payload';

export const getOrderStatus: FieldHook<Order, Order['status'], Order> = async ({
  data: currentOrder,
  req,
}) => {
  // get latest order status from order-statuses collection
  const { docs: orderStatuses } = await req.payload.find({
    collection: 'order-statuses',
    where: {
      order: {
        equals: currentOrder?.id,
      },
    },
    sort: '-createdAt',
    limit: 1,
    pagination: false,
  });

  const orderStatus = orderStatuses[0];
  return orderStatus?.status ?? 'pending';
};
