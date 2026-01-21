import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getOrders } from '@/actions/orders';
import { Heading } from '@/components/typography';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Orders',
  robots: {
    index: false,
  },
};

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const orders = await getOrders({ userId: user.id });

  return (
    <main>
      <Heading>Orders</Heading>

      <pre>{JSON.stringify(orders, null, 2)}</pre>
    </main>
  );
}
