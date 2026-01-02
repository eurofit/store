import * as z from 'zod';
import { addressWithIdSchema } from './address';

const orderSnapShotSchema = z.object({
  user: z.object({
    id: z.uuid('User ID must be a valid UUID'),
    fullName: z.string().min(1, 'User name is required'),
    email: z.email('User email must be valid'),
  }),
  shippingAddress: addressWithIdSchema,
});

export const orderItemSnapShotSchema = z.object({
  price: z.number().min(0, 'Price must be a positive number'),
  title: z.string().min(1, 'Product line title is required'),
});

export const orderItem = z.object({
  id: z.uuid('Product line ID must be a valid UUID'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  snapshot: orderItemSnapShotSchema,
});

export const orderSchema = z.object({
  items: z.array(orderItem).nonempty('Order must have at least one item').min(1),
  snapshot: orderSnapShotSchema,
});

export type Order = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItem>;
