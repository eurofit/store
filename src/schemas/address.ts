import { titles } from '@/constants/titles';
import { z } from 'zod';

const titleValues = titles.map((t) => t.value);

export const addressSchema = z.object({
  // Contact Information
  title: z.enum(titleValues),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'Contact name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Contact name is too long'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .max(20, 'Contact phone is too long'),
  email: z.email('Invalid email address'),
  // Address Details
  line1: z.string().min(1, 'Primary address is required').max(200, 'Address is too long'),
  line2: z.string().max(200, 'Address detail is too long').optional(),
  line3: z.string().max(150, 'Street is too long').optional(),
  postalCode: z.string().length(5, 'Postal code must be 5 characters long'),
  city: z.string().min(1, 'City is required').max(100, 'City is too long'),
  county: z.string().min(1, 'County is required').max(100, 'County is too long'),
  country: z.string().min(1, 'Country is required').max(100, 'Country is too long'),

  // Other Details
  label: z.string().max(50, 'Label is too long').optional(),
  note: z.string().max(500, 'Delivery notes are too long').optional(),
  isDefault: z.boolean(),
});

export const addressWithIdSchema = addressSchema.extend({
  id: z.uuid(),
});

export type Address = z.infer<typeof addressSchema>;
export type AddressWithId = z.infer<typeof addressWithIdSchema>;
