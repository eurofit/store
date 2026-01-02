'use client';

import { userAtom } from '@/atoms/user';
import { useAtomValue } from 'jotai';
import Link from 'next/link';
import { Button } from '../ui/button';

export function LoginButton() {
  const userData = useAtomValue(userAtom);

  if (userData) return null;

  return (
    <Button variant="secondary" className="max-md:hidden" asChild>
      <Link href="/login">Login</Link>
    </Button>
  );
}
