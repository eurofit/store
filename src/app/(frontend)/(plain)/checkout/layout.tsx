import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getCart } from '@/actions/cart';
import { CheckoutHeader } from '@/components/checkout/header';
import { CartProvider } from '@/providers/cart';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import * as React from 'react';

export const metadata: Metadata = {
  title: {
    absolute: 'Secure Checkout',
  },
  description: 'Checkout page',
  robots: {
    index: false,
  },
};

type CheckoutLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function CheckoutLayout({ children }: CheckoutLayoutProps) {
  const [user, cart] = await Promise.all([getCurrentUser(), getCart()]);

  if (!user) {
    redirect('/login' + '?next=' + encodeURIComponent('/checkout'));
  }

  return (
    <div className="bg-muted/50 container mx-auto">
      <CheckoutHeader />
      <CartProvider cart={cart}>{children}</CartProvider>
    </div>
  );
}
