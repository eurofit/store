import { User } from '@/payload/types';
import { safeUserSchema, type SafeUser } from '@/schemas/safe-user';

export function safeUser(user: User): SafeUser | null {
  const validatedUser = safeUserSchema.parse(user);

  return validatedUser;
}
