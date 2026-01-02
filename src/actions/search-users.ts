'use server';

import { safeUser } from '@/utils/safe-user';
import config from '@payload-config';
import { getPayload } from 'payload';

type Options = {
  limit?: number;
  [key: string]: any;
};

export async function searchUsers(
  query: string,
  { limit = 15, where, ...options }: Options = {},
) {
  if (!query) return [];

  const payloadConfig = await config;

  const payload = await getPayload({
    config: payloadConfig,
  });

  try {
    const { docs } = await payload.find({
      collection: 'users',
      where: {
        or: [
          {
            email: {
              like: query,
            },
          },
          {
            firstName: {
              like: query,
            },
          },
          {
            middleName: {
              like: query,
            },
          },
          {
            lastName: {
              like: query,
            },
          },
          {
            phone: {
              like: query,
            },
          },
          {
            'address.line1': {
              like: query,
            },
          },
          {
            'address.line2': {
              like: query,
            },
          },
          {
            'address.city': {
              like: query,
            },
          },
          {
            'address.state': {
              like: query,
            },
          },
          {
            'address.zipCode': {
              like: query,
            },
          },
          {
            'address.country': {
              like: query,
            },
          },
        ],
        ...(where || {}),
      },
      limit,
      depth: 1,
      sort: 'title',
      ...options,
    });

    return docs.map(safeUser).filter((user) => user !== null);
  } catch (e: unknown) {
    return {
      error: 'An error occurred while searching for users.',
    };
  }
}
