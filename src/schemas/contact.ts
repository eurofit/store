import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  'cf-turnstile-response': z.string().min(1, 'Please verify you are human'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
