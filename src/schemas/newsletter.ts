import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z.email(),
  cfTurnstileResponse: z.string(),
});

export type NewsLetterData = z.infer<typeof newsletterSchema>;
