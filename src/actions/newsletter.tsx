'use server';

import config from '@/payload/config';
import { NewsLetterData, newsletterSchema } from '@/schemas/newsletter';
import { APIError, getPayload } from 'payload';

export async function subscribeToNewsletter(unsafeData: NewsLetterData) {
  const { email } = newsletterSchema.parse(unsafeData);

  const payload = await getPayload({
    config,
  });

  const isEmailSubscribed = await checkIfEmailSubscribedToNewsletter(email);

  if (isEmailSubscribed) {
    throw new Error('Email is already subscribed to the newsletter');
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
    if (e instanceof APIError) {
      throw new Error(
        'Something went wrong while subscribing to the newsletter. Please try again later.',
      );
    }
    if (e instanceof Error) {
      throw new Error(e.message);
    }

    throw new Error('Failed to subscribe to newsletter');
  }
}

async function checkIfEmailSubscribedToNewsletter(email: string) {
  const payload = await getPayload({
    config,
  });

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

  return totalDocs > 0;
}
