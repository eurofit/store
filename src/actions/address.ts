'use server';

import config from '@/payload.config';
import { Address, addressSchema } from '@/schemas/address';
import { getPayload } from 'payload';
import { getCurrentUser } from './auth/get-current-user';

export async function createAddress(unsafeAddress: Address) {
  const address = addressSchema.parse(unsafeAddress);

  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User must be logged in to create an address');
  }

  const payload = await getPayload({
    config,
  });

  const res = await payload.create({
    collection: 'addresses',
    data: {
      user: user?.id,
      ...address,
    },
    draft: false,
  });

  return addressSchema.parse(res);
}
