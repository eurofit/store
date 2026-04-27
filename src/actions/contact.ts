'use server';

import { env } from '@/env.mjs';
import config from '@/payload/config';
import { contactFormSchema, ContactFormValues } from '@/schemas/contact';
import { TurnstileServerValidationResponse } from '@marsidev/react-turnstile';
import { getPayload } from 'payload';
import { z } from 'zod';

export type ContactFormActionReturn =
  | true
  | z.core.$ZodErrorTree<ContactFormValues>
  | null;

export async function submitContactForm(
  _prevState: ContactFormActionReturn,
  unsafeFormData: FormData,
): Promise<ContactFormActionReturn> {
  const unsafeData = Object.fromEntries(unsafeFormData.entries());
  const validationResult = contactFormSchema.safeParse(unsafeData);

  if (!validationResult.success) {
    return z.treeifyError(validationResult.error);
  }

  const { cfTurnstileResponse, ...data } = validationResult.data;

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
        response: cfTurnstileResponse,
      }),
    },
  );

  const turnstileRes =
    (await turnstileResponse.json()) as TurnstileServerValidationResponse;

  if (!turnstileRes.success) {
    return {
      errors: ['Failed to verify CAPTCHA'],
    };
  }

  const payload = await getPayload({ config });

  const {
    docs: [form],
  } = await payload.find({
    collection: 'forms',
    where: {
      title: {
        equals: 'Contact us',
      },
    },
    limit: 0,
    pagination: false,
  });

  await payload.create({
    collection: 'form-submissions',
    data: {
      form: form.id,
      submissionData: Object.entries(data).map(([field, value]) => ({
        field,
        value: value.toString(),
      })),
    },
  });

  return true;
}
