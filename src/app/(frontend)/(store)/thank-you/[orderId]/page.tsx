import { getCurrentUser } from '@/actions/auth/get-current-user';
import { OrderCard } from '@/components/orders/card';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import config from '@/payload/config';
import { SearchParams } from '@/types';
import { CheckIcon, ChevronDownIcon, Mail } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import { getPayload } from 'payload';

type ThankYouPageProps = {
  params: Promise<{
    orderId: string;
  }>;
  searchParams: Promise<SearchParams>;
};

export default async function ThankYouPage({ params, searchParams }: ThankYouPageProps) {
  const { orderId } = await params;

  //TODO: validate orderId number to be positive integer

  const orderIdNumber = Number(orderId);

  const user = await getCurrentUser();

  if (!user) {
    redirect('/login' + '?next=/thank-you/' + orderId);
  }

  const payload = await getPayload({
    config,
  });

  const { docs: orders } = await payload.find({
    collection: 'orders',
    where: {
      and: [
        {
          id: {
            equals: orderIdNumber,
          },
        },
        {
          customer: {
            equals: user.id,
          },
        },
      ],
    },
    select: {
      items: true,
    },
    populate: {
      products: {
        srcImage: true,
      },
      'product-lines': {
        product: true,
        variant: true,
        retailPrice: true,
      },
    },
    overrideAccess: false,
    user: user.id,
    depth: 2,
    limit: 1,
    pagination: false,
    showHiddenFields: false,
  });

  const order = orders[0];

  if (!order) notFound();

  return (
    <>
      <pre>{JSON.stringify(order, null, 2)}</pre>
      <main className="mx-auto flex max-w-3xl flex-col items-center justify-center">
        <div className="relative flex max-w-sm flex-col items-center justify-center gap-4">
          <div className="flex size-12 rounded-full bg-green-50 text-green-700">
            <CheckIcon className="m-auto size-8" />
          </div>
          <hgroup className="space-y-2">
            <h1 className="text-3xl font-bold">Thank You for Your Order!</h1>
            <p className="text-muted-foreground text-sm">
              Your order has been received and is being processed.
            </p>
          </hgroup>
          <OrderCard orderId={orderIdNumber} />
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Mail className="size-4.5" />
            <p>
              Order confirmation sent to <strong className="inline">{user.email}</strong>
            </p>
          </div>

          <Collapsible defaultOpen className="mt-10 w-full">
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="group w-full data-[state=open]:rounded-b-none"
              >
                Order Summary
                <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="rounded-b-lg border px-2.5 py-2">
              Yes. Free to use for personal and commercial projects. No attribution
              required.
            </CollapsibleContent>
          </Collapsible>
        </div>
      </main>
    </>
  );
}
