import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getCart } from '@/actions/cart';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { CartContent } from './checkout-content';

export const metadata: Metadata = {
  title: {
    absolute: 'Secure Checkout',
  },
  description: 'Checkout page',
  robots: {
    index: false,
  },
};

export default async function CheckoutPage() {
  const [user, cart] = await Promise.all([getCurrentUser(), getCart()]);

  if (!user) {
    redirect('/login' + '?next=' + encodeURIComponent('/checkout'));
  }

  if (!cart || cart.items.length === 0) {
    notFound();
  }
  return (
    <main>
      <CartContent user={user} />
    </main>
  );
}
