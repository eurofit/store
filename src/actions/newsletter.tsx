'use server';

import config from '@/payload/config';
import { NewsLetterData, newsletterSchema } from '@/schemas/newsletter';
import { getPayload } from 'payload';

export async function subscribeToNewsletter(unsafeData: NewsLetterData) {
  const { email } = newsletterSchema.parse(unsafeData);

  const payload = await getPayload({
    config,
  });

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
    throw new Error('Failed to subscribe to newsletter');
  }
}
