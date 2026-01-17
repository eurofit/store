'use server';

import config from '@/payload.config';
import { LoginData, loginSchema } from '@/schemas/login';
import { safeUser } from '@/utils/safe-user';
import { login as payloadLogin } from '@payloadcms/next/auth';
import { AuthenticationError } from 'payload';

export async function login(unSafeData: LoginData) {
  const { email, password } = loginSchema.parse(unSafeData);

  try {
    const result = await payloadLogin({
      collection: 'users',
      config,
      email,
      password,
    });

    const res = {
      user: safeUser({ ...result.user, addresses: result.user.addresses?.docs ?? [] })!,
    };

    return res;
  } catch (error: unknown) {
    if (error instanceof AuthenticationError) {
      throw new Error('Invalid email or password.');
    }
    console.log(error);
    throw new Error('Something went wrong. Please try again later.');
  }
}

export type LoginResult = Awaited<ReturnType<typeof login>>;
