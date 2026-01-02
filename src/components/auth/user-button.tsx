import { getCurrentUser } from '@/actions/auth/get-current-user';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from 'lucide-react';
import { headers as getHeaders } from 'next/headers';
import Link from 'next/link';
import { LogoutButton } from '../logout';

export async function UserButton({ className }: { className?: string }) {
  const [headers, user] = await Promise.all([getHeaders(), getCurrentUser()]);
  const pathname = headers.get('x-pathname') ?? '/';
  const search = headers.get('x-search') ?? '';

  const fullPath = pathname + search;

  if (!user)
    return (
      <Button variant="outline" size="icon" asChild>
        <Link href={`/login?next=${fullPath}`} className={className}>
          <User />
          <span className="sr-only">User menu</span>
        </Link>
      </Button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <Button variant="outline" size="icon">
          <User />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-muted-foreground text-xs leading-none">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account">Account</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Orders</DropdownMenuItem>
          <DropdownMenuItem disabled>Stock Alerts</DropdownMenuItem>
          <DropdownMenuItem disabled>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserButtonSkeleton() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="text-muted-foreground relative"
      disabled
    >
      <User />
      <span className="sr-only"></span>
    </Button>
  );
}
