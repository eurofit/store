'use server';

import { safeUserSchema } from '@/schemas/safe-user';
import config from '@payload-config';
import { headers as getHeaders } from 'next/headers';
import { getPayload } from 'payload';

export const getCurrentUser = async () => {
  // 'use cache: private';

  // cacheLife({ stale: 60 });

  const [headers, payload] = await Promise.all([getHeaders(), getPayload({ config })]);

  const { user } = await payload.auth({
    headers,
  });

  if (!user) return null;

  // cacheTag(`user:${user.id}`);

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
