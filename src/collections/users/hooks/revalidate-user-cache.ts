'use server';

import { User } from '@/payload-types';
import { updateTag } from 'next/cache';
import { CollectionAfterLoginHook } from 'payload';

export const revalidateUserCache: CollectionAfterLoginHook<User> = async ({ user }) => {
  updateTag(`user:${user.id}`);
};
