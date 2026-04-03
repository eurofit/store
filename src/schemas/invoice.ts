import * as z from 'zod';
import { addressSchema } from './address';
import { orderItemSnapShotSchema } from './order';

export const invoiceItemSchema = z.object({
  id: z.string(),
  sku: z.string(),
  bbe: z.string().optional().nullable(),
  title: z.string(),
  qty: z.string(),
  price: z.string(),
});

export const invoiceSchema = z.object({
  id: z.string(),
  fao: z.string(),
  date: z.string(),
  dueDate: z.string(),
  status: z.string(),
  shippingAddress: addressSchema.omit({ isDefault: true }),
  items: z.array(
    orderItemSnapShotSchema.omit({ product: true }).extend({ quantity: z.number() }),
  ),
  subtotal: z.number(),
  deliveryFee: z.number().nullable().optional(),
  tax: z.number().nullable().optional(),
  total: z.number().nullable().optional(),
});

export type Invoice = z.infer<typeof invoiceSchema>;
