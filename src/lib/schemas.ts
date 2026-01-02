import { startOfDay } from 'date-fns';
import { z } from 'zod';
import { safeUserSchema } from './schemas/safe-user';

export const paymentTermSchema = z.object({
  code: z.string(),
  name: z.string(),
  description: z.string(),
});

export const clientSchema = safeUserSchema.extend({
  type: z.enum(['registered', 'new', 'guest']).default('registered'),
});

export const invoiceItemSchema = z.object({
  id: z.string(),
  sku: z.string(),
  slug: z.string(),
  title: z.string().optional(),
  barcode: z.string().optional(),
  image: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Original rate must be positive').nullable().optional(),
  newPrice: z.number().nullable().optional(),
  amount: z.number().optional(),
});

export const invoiceSchema = z
  .object({
    invoiceNumber: z.string().min(1, 'Invoice number is required'),
    dueDate: z
      .date()
      .min(startOfDay(new Date()), 'Due date must be today or in the future'),
    status: z.enum(['open', 'paid']).default('open'),
    representative: z.string().min(1, 'Representative is required'),
    requisitioner: z.string(),
    shipmentMethod: z
      .enum(['Delivery', 'Pickup', 'Express', 'Standard'])
      .default('Delivery'),
    paymentTerms: paymentTermSchema,
    client: clientSchema,
    items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
    notes: z.string().optional(),
    taxRate: z
      .number()
      .min(0, 'Tax rate should be positive rate')
      .max(100, 'Tax rate must be between 0 and 100'),
    subtotal: z.number(),
    taxAmount: z.number(),
    total: z.number(),
    createdBy: z.string().min(1, 'Created by is required'),
  })
  .refine(
    (data) => {
      return data.total === data.subtotal + data.taxAmount;
    },
    {
      message: 'Total must be equal to Subtotal + Tax Amount',
    },
  )

  .refine(
    (data) => {
      return data.client.type === 'guest' || (data.client.firstName && data.client.email);
    },
    {
      message: 'Client name and email are required for registered or new clients',
      path: ['client'],
    },
  )
  .refine(
    (data) => {
      return Boolean(data.client);
    },
    {
      message: 'Client information is required',
      path: ['client'],
    },
  );

export type PaymentTerm = z.infer<typeof paymentTermSchema>;
export type Client = z.infer<typeof clientSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;
