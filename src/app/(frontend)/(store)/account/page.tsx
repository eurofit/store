import { getCurrentUser } from '@/actions/auth/get-current-user';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { BadgeCheckIcon, Clock } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AccountForm } from './form';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Manage your account settings.',
  robots: {
    index: false,
  },
};

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login' + '?next=' + encodeURIComponent('/account'));
  }

  return (
    <div className="space-y-6">
      <hgroup>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-muted-foreground text-sm">Update your account settings.</p>
      </hgroup>
      <Item variant="outline" size="sm">
        <ItemMedia>
          {user.isVerified ? (
            <BadgeCheckIcon className="size-5" />
          ) : (
            <Clock className="size-5" />
          )}
        </ItemMedia>
        <ItemContent>
          {user.isVerified && (
            <ItemTitle className="flex gap-0">
              Your verified email is:&nbsp;
              <strong>{user.email}</strong>.
            </ItemTitle>
          )}

          {!user.isVerified && (
            <>
              <ItemTitle>Email Not Verified</ItemTitle>
              <ItemDescription>{user.email} is not verified.</ItemDescription>
            </>
          )}
        </ItemContent>
        {!user.isVerified && (
          <ItemActions>
            <Button variant="outline" size="sm" asChild>
              <Link href="/verify">Verify now</Link>
            </Button>
          </ItemActions>
        )}
      </Item>
      <AccountForm user={user} />
    </div>
  );
}
