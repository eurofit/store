import { z } from 'zod';
import { addressWithIdSchema } from './address';

export const safeUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  firstName: z.string(),
  middleName: z.string().optional().nullable(),
  lastName: z.string(),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  isVerified: z.boolean(),
  addresses: z.array(addressWithIdSchema).optional(),
});

export type SafeUser = z.infer<typeof safeUserSchema>;
