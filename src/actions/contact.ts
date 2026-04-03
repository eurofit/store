'use server';

import { env } from '@/env.mjs';
import config from '@/payload/config';
import { contactFormSchema } from '@/schemas/contact';
import { getPayload, SendEmailOptions } from 'payload';
import { z } from 'zod';

export async function sendContactEmail(unsafeData: z.input<typeof contactFormSchema>) {
  const validatedData = contactFormSchema.parse(unsafeData);

  // verify turnstile token
  const turnstileResponse = await fetch(
    `https://challenges.cloudflare.com/turnstile/v0/siteverify`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
        response: validatedData['cf-turnstile-response'],
      }),
    },
  );

  const turnstileData = await turnstileResponse.json();

  if (!turnstileData.success) {
    throw new Error('Failed to verify CAPTCHA');
  }

  const payload = await getPayload({ config });

  // Email content
  const mailOptions: SendEmailOptions = {
    from: env.SMTP_USERNAME,
    to: env.SMTP_INFO_USERNAME,
    subject:
      validatedData.subject || `New Contact Form Submission from ${validatedData.name}`,
    html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
      `,
    replyTo: validatedData.email,
  };

  await payload.sendEmail(mailOptions);

  return true;
}
