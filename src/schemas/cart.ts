import { z } from 'zod';

const cartProductLine = z.object({
  id: z.string(),
  sku: z.string().min(1, 'Product line SKU is required'),
  slug: z.string().min(1, 'Product line slug is required'),
  title: z.string().min(1, 'Product line title is required'),
  stock: z.number(),
  variant: z.string().optional().nullable(),
  price: z.number().min(0, 'Price must be a positive number'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  isBackorder: z.boolean().default(false),
  isLowStock: z.boolean().default(false),
  isOutOfStock: z.boolean().default(false),
});

export const productSchema = z.object({
  id: z.uuid('Product ID must be a valid UUID'),
  title: z.string().min(1, 'Product title is required'),
  slug: z.string().min(1, 'Product slug is required'),
  image: z.string().optional().nullable(),
});

export const cartItemSchema = cartProductLine.extend({
  product: productSchema,
  snapshot: z.object({
    retailPrice: z.number().min(0, 'Snapshot retail price must be a positive number'),
  }),
});

export const cartSchema = z.object({
  id: z.uuid('Cart ID must be a valid UUID'),
  items: z.array(cartItemSchema).nonempty('Cart must have at least one item').min(1),
});

export type CartProduct = z.infer<typeof productSchema>;
export type CartProductLine = z.infer<typeof cartProductLine>;
export type Cart = z.infer<typeof cartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
