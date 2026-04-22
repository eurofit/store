import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z.email(),
});

export type NewsLetterData = z.infer<typeof newsletterSchema>;
