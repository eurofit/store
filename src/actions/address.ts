'use server';

import config from '@/payload/config';
import {
  Address,
  AddressId,
  addressIdSchema,
  addressSchema,
  AddressWithId,
  addressWithIdSchema,
} from '@/schemas/address';
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

  return addressWithIdSchema.parse(res);
}

export async function updateAddress(unsafeAddress: AddressWithId) {
  const { id, ...address } = addressWithIdSchema.parse(unsafeAddress);

  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User must be logged in to update an address');
  }

  const payload = await getPayload({
    config,
  });

  const res = await payload.update({
    collection: 'addresses',
    id,
    data: address,
  });

  return addressWithIdSchema.parse(res);
}

export async function deleteAddress(unSafeId: AddressId) {
  const { id } = addressIdSchema.parse(unSafeId);

  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User must be logged in to delete an address');
  }

  const payload = await getPayload({
    config,
  });

  const deleteAddress = await payload.delete({
    collection: 'addresses',
    id,
    depth: 0,
    user: user.id,
  });

  return deleteAddress;
}

export async function setDefaultAddress(unSafeId: AddressId) {
  const { id } = addressIdSchema.parse(unSafeId);

  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User must be logged in to set an address as default');
  }

  const payload = await getPayload({
    config,
  });

  const updatedAddress = await payload.update({
    collection: 'addresses',
    id,
    data: { isDefault: true },
  });

  return addressWithIdSchema.parse(updatedAddress);
}
