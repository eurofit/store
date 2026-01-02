'use client';

import { logout } from '@/actions/auth/logout';
import { cartAtom } from '@/atoms/cart';
import { userAtom } from '@/atoms/user';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { DropdownMenuItem } from './ui/dropdown-menu';

export function LogoutButton() {
  const setUser = useSetAtom(userAtom);
  const setCart = useSetAtom(cartAtom);

  const router = useRouter();
  const handleLogout = () => {
    toast.promise(logout(), {
      loading: 'Logging out...',
      success: (data) => {
        if ('message' in data && data.message === 'User already logged out')
          return 'You are already logged out.';

        setCart(null);
        setUser(null);

        // Redirect to login page after logout
        router.push('/login');

        return 'Successfully logged out. See you again soon!';
      },
      error: () => {
        return 'Logout failed. Please try again.';
      },
    });
  };

  return (
    <DropdownMenuItem variant="destructive" onClick={handleLogout}>
      Log out
    </DropdownMenuItem>
  );
}
