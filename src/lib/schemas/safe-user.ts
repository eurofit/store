import { z } from 'zod';
import { addressWithIdSchema } from './address';

export const safeUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  addresses: z.array(addressWithIdSchema).optional(),
});

export type SafeUser = z.infer<typeof safeUserSchema>;
