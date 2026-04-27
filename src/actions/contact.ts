'use server';

import { env } from '@/env.mjs';
import config from '@/payload/config';
import { contactFormSchema } from '@/schemas/contact';
import { TurnstileServerValidationResponse } from '@marsidev/react-turnstile';
import { getPayload, SendEmailOptions } from 'payload';
import { z } from 'zod';


const schema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).;

export async function sendContactEmail(_prevState: any, unsafeFormData: FormData) {
  const unsafeData = Object.fromEntries(unsafeFormData.entries())
  const validationResult = schema.safeParse(unsafeData);

  if(!validationResult.success){
    return z.treeifyError(validationResult.error)
  }

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
        response: validationResult.data['cfTurnstileResponse'],
      }),
    },
  );

  const turnstileData = (await turnstileResponse.json()) as TurnstileServerValidationResponse;

  if (!turnstileData.success) {
    throw new Error('Failed to verify CAPTCHA');
  }

  const payload = await getPayload({ config });

  // Email content
  const mailOptions: SendEmailOptions = {
    from: env.SMTP_USERNAME,
    to: env.SMTP_INFO_USERNAME,
    subject:
      validationResult.subject || `New Contact Form Submission from ${validationResult.name}`,
    html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validationResult.name}</p>
        <p><strong>Email:</strong> ${validationResult.email}</p>
        <p><strong>Message:</strong></p>
        <p>${validationResult.message.replace(/\n/g, '<br>')}</p>
      `,
    replyTo: validationResult.email,
  };

  await payload.sendEmail(mailOptions);

  return true;
}
