'use client';

import { stepper } from '@/components/checkout/stepper/steps';
import { Large, Muted } from '@/components/typography';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/providers/cart';
import { cn } from '@/utils/cn';
import { formatWithCommas } from '@/utils/format-with-commas';
import { Lock, Truck } from 'lucide-react';

const { useStepper } = stepper;

type OrderSummaryProps = React.ComponentProps<typeof Card>;

export function OrderSummary({ className, ...props }: OrderSummaryProps) {
  const stepper = useStepper();
  const { totalPrice } = useCart();

  const stepperValues = stepper.metadata.values;

  const isButtonDisabled = !stepperValues.address || !stepperValues.payment;

  return (
    <Card
      className={cn('sticky top-22 mx-auto h-fit w-full max-w-xs', className)}
      {...props}
    >
      <CardHeader>
        <CardTitle className="text-lg leading-normal text-balance">
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <dl className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <dt className="flex justify-between">Subtotal</dt>
            <dd className="font-variant-numeric-tabular-nums flex items-center text-right">
              <span className="text-muted-foreground">Ksh</span>
              &nbsp;
              <p>{formatWithCommas(totalPrice)}</p>
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="flex justify-between">Delivery Fee</dt>
            <dd className="font-variant-numeric-tabular-nums flex items-center text-right">
              <span className="text-muted-foreground">Ksh</span>
              &nbsp;
              <p>2,000</p>
            </dd>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <dt className="flex justify-between">
              <Large>Total</Large>
            </dt>
            <dd className="font-variant-numeric-tabular-nums flex items-center text-right">
              <span className="text-muted-foreground">Ksh</span>
              &nbsp;
              <Large>7,000</Large>
            </dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <div className="bg-background fixed bottom-0 w-full space-y-2 max-md:py-2 md:relative">
          <Button className="w-full" size="lg" disabled={isButtonDisabled}>
            Place Order
          </Button>
          <Muted className="text-center">Taxes calculated at checkout</Muted>
        </div>
        <Separator className="my-4" />
        <div className="max-w-xs space-y-2 self-start text-sm">
          <div className="flex items-center gap-2">
            <Lock className="text-muted-foreground size-4" />
            <Muted>Secure Payment</Muted>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="text-muted-foreground size-4" />
            <Muted>Fast Delivery within Nairobi</Muted>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
