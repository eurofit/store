import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getCart } from '@/actions/cart';
import { Heading, Lead } from '@/components/typography';
import { notFound, redirect } from 'next/navigation';
import * as React from 'react';

type CheckoutLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function CheckoutLayout({ children }: CheckoutLayoutProps) {
  const [user, cart] = await Promise.all([getCurrentUser(), getCart()]);

  if (!user) {
    redirect('/login' + '?next=' + encodeURIComponent('/checkout'));
  }

  if (!cart || cart.items.length === 0) {
    notFound();
  }

  return (
    <div>
      <hgroup className="mb-10 max-w-md">
        <Heading>Secure Checkout</Heading>

        <Lead>Complete your purchase securely and efficiently.</Lead>
      </hgroup>
      {children}
    </div>
  );
}
