'use server';

import { env } from '@/env.mjs';
import config from '@/payload/config';
import { NewsLetterData, newsletterSchema } from '@/schemas/newsletter';
import { TurnstileServerValidationResponse } from '@marsidev/react-turnstile';
import { getPayload } from 'payload';
import { z } from 'zod';

export type NewletterActionState = true | z.core.$ZodErrorTree<NewsLetterData> | null;

export async function subscribeToNewsletter(
  _prevState: NewletterActionState,
  formData: FormData,
) {
  if (!(formData instanceof FormData)) {
    return {
      errors: ['Invalid form data'],
    };
  }

  const unsafeData = Object.fromEntries(formData.entries());

  const validationRes = newsletterSchema.safeParse(unsafeData);

  if (!validationRes.success) {
    return z.treeifyError<NewsLetterData>(validationRes.error);
  }

  const { email, cfTurnstileResponse } = validationRes.data;

  // verify turnstile token
  const turnstileResponse = await fetch(
    `https://challenges.cloudflare.com/turnstile/v0/siteverify`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: env.CLOUDFLARE_TURNSTILE_INVISIBLE_SECRET_KEY,
        response: cfTurnstileResponse,
      }),
    },
  );

  const turnstileData =
    (await turnstileResponse.json()) as TurnstileServerValidationResponse;

  if (!turnstileData.success) {
    return {
      errors: ['Failed to verify CAPTCHA'],
    };
  }

  const payload = await getPayload({
    config,
  });

  // check if email is already subscribed to the newsletter

  const { totalDocs } = await payload.count({
    collection: 'form-submissions',
    where: {
      'form.title': {
        equals: 'Newsletter',
      },
      and: [
        {
          'submissionData.field': {
            equals: 'email',
          },
          'submissionData.value': {
            equals: email,
          },
        },
      ],
    },
  });

  if (totalDocs > 0) {
    return {
      errors: ['Email is already subscribed to the newsletter'],
    };
  }

  const {
    docs: [form],
  } = await payload.find({
    collection: 'forms',
    where: {
      title: {
        equals: 'Newsletter',
      },
    },
  });

  try {
    await payload.create({
      collection: 'form-submissions',
      data: {
        form: form.id,
        submissionData: [
          {
            field: 'email',
            value: email,
          },
        ],
      },
    });
    return true;
  } catch (e) {
    return {
      errors: [
        'Unexpected error occurred while subscribing to the newsletter. Please try again later.',
      ],
    };
  }
}
