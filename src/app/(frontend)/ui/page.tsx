import { getInvoice } from '@/actions/get-invoice';

export default async function Page() {
  const invoice = await getInvoice({ orderId: 31032026 });

  return (
    <div>
      <pre>{JSON.stringify(invoice, null, 2)}</pre>
    </div>
  );
}
