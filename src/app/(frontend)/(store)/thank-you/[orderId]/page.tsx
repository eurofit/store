import { getCurrentUser } from '@/actions/auth/get-current-user';
import { ImageWithRetry } from '@/components/image-with-retry';
import { OrderCard } from '@/components/orders/card';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import config from '@/payload/config';
import { orderItem, orderItemSnapShotSchema } from '@/schemas/order';
import { SearchParams } from '@/types';
import { formatWithCommas } from '@/utils/format-with-commas';
import { CheckIcon, ChevronDownIcon, ImageOff, Mail } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import { getPayload } from 'payload';
import z from 'zod';

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
      items: {
        productLine: true,
        quantity: true,
        snapshot: true,
      },
      total: true,
    },
    populate: {
      'product-lines': {},
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

  const items = order.items.map(({ snapshot, ...item }) => ({
    ...item,
    ...(typeof snapshot === 'object' ? snapshot : {}),
    id: typeof item.productLine === 'string' ? item.productLine : item.productLine.id,
  }));

  const itemSchema = orderItemSnapShotSchema.extend(
    orderItem.pick({ id: true, quantity: true }).shape,
  );

  const formattedItems = z.array(itemSchema).parse(items);

  return (
    <>
      <main className="mx-auto flex max-w-lg flex-col items-center justify-center">
        <div className="relative flex w-full flex-col items-center justify-center gap-4">
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
            <CollapsibleContent className="rounded-b-lg border px-2.5 py-3">
              <div className="space-y-2">
                {formattedItems.map((item) => (
                  <div key={item.variant} className="flex items-start gap-2.5">
                    <div className="bg-muted relative flex size-16 items-center justify-center rounded-md">
                      {item.product.image ? (
                        <ImageWithRetry
                          src={item.product.image}
                          alt={item.product.title}
                          width={64}
                          height={64}
                          className="m-auto max-h-11/12 max-w-11/12 rounded-md object-contain"
                        />
                      ) : (
                        <ImageOff
                          className="text-muted-foreground/50 size-3/5"
                          aria-label="Image not available"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="max-w-xs text-sm font-medium text-pretty">
                        {item.product.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{item.variant}</p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="ml-auto space-y-2">
                      <div className="flex items-center justify-end text-right text-sm font-medium">
                        <span className="text-muted-foreground text-xs">Ksh</span>
                        &nbsp;
                        <span>{formatWithCommas(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <dl className="text-sm">
                <div className="flex items-start justify-between gap-2 py-1.5">
                  <dt className="font-medium">Subtotal</dt>
                  <dd className="text-right slashed-zero tabular-nums">
                    <span className="text-muted-foreground">Ksh</span>
                    &nbsp;
                    <span>{formatWithCommas(order.total!)}</span>
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-2 py-1.5">
                  <dt className="font-medium">Delivery Fee</dt>
                  <dd className="text-right slashed-zero tabular-nums">
                    <span className="text-muted-foreground">Ksh</span>
                    &nbsp;
                    <span>{formatWithCommas(2000)}</span>
                  </dd>
                </div>
                <Separator className="my-2" />
                <div className="flex items-start justify-between gap-2 py-1.5 font-medium">
                  <dt className="uppercase">Total</dt>
                  <dd className="text-right slashed-zero tabular-nums">
                    <span className="text-muted-foreground">Ksh</span>
                    &nbsp;
                    <span>{formatWithCommas(order.total! + 2000)}</span>
                  </dd>
                </div>
              </dl>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </main>
    </>
  );
}
