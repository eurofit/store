import { safeUserSchema, type SafeUser } from '@/lib/schemas/safe-user';
import { User } from '@/payload-types';

export function safeUser(user: User): SafeUser | null {
  const validatedUser = safeUserSchema.parse(user);

  return validatedUser;
}
