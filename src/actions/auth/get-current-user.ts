'use server';

import { safeUserSchema } from '@/schemas/safe-user';
import config from '@payload-config';
import { headers as getHeaders } from 'next/headers';
import { getPayload } from 'payload';

export const getCurrentUser = async () => {
  const [headers, payload] = await Promise.all([getHeaders(), getPayload({ config })]);

  const { user } = await payload.auth({
    headers,
  });

  if (!user) return null;

  // default address should come first
  return safeUserSchema.parse({
    ...user,
    addresses:
      user.addresses?.docs
        ?.filter((a) => typeof a !== 'string')
        .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)) ?? [],
  });
};

export type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;
