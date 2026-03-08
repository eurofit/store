'use client';

import { CheckoutItem } from '@/app/(frontend)/(plain)/checkout/checkout-item';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCheckout } from '@/providers/checkout';
import * as React from 'react';
import { Separator } from '../ui/separator';

export function CheckoutItems() {
  const { totalItems, items, onCartPending } = useCheckout();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg leading-normal text-balance">
          Checkout Items
        </CardTitle>
        <CardDescription>
          {totalItems} item{totalItems === 1 ? '' : 's'} in your bag
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length > 0 && (
          <div className="scrollbar flex grow flex-col overflow-y-auto">
            {items.map((item, itemIndex) => (
              <React.Fragment key={item.id}>
                {itemIndex > 0 && itemIndex < items.length && (
                  <Separator className="my-6" />
                )}
                <CheckoutItem
                  key={item.id}
                  item={item}
                  index={itemIndex}
                  onCartPending={onCartPending}
                />
              </React.Fragment>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
