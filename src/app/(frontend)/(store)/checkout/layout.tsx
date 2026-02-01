import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getCart } from '@/actions/cart';
import { PageHeading } from '@/components/page-heading';
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
    <div className="space-y-6 md:space-y-12">
      <PageHeading
        title="Secure Checkout"
        description="Complete your purchase securely and efficiently."
      />

      {children}
    </div>
  );
}
