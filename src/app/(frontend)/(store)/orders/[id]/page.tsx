import { getOrderById } from '@/actions/orders';
import { notFound } from 'next/navigation';

type OrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { id: orderId } = await params;

  const order = await getOrderById(Number(orderId));

  if (!order) notFound();

  return (
    <div>
      OrderPage
      <pre>{JSON.stringify(order, null, 2)}</pre>
    </div>
  );
}
