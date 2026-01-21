'use client';

import { useCart } from '@/hooks/use-cart';
import { cn } from '@/utils/cn';
import { formatWithCommas } from '@/utils/format-with-commas';
import { uniqBy } from 'lodash-es';
import { ChevronRight, ShoppingBag, ShoppingBasket, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';
import { Large, Muted } from '../typography';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { CartItem } from './cart-item';

export function Cart() {
  const {
    queryResult: { cart, isQueryPending },
  } = useCart();
  const totalItems = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  const isCartEmpty = !cart || (cart && cart.items.length === 0);
  return (
    <Sheet modal>
      <SheetTrigger disabled={isQueryPending} asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingBag />

          <span className="sr-only">Cart Button</span>
          {totalItems > 0 && (
            <Badge className="bg-destructive absolute -end-2.5 -top-2.5 h-5 min-w-5 rounded-full px-1 tabular-nums">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex h-full w-11/12! min-w-1/3 flex-col">
        {/* HEADER  */}
        <SheetHeader className="flex-row items-center gap-2 border-b">
          <SheetTitle>Cart</SheetTitle>
          {cart && cart.items.length > 0 && (
            <SheetDescription className="text-xs">
              ({cart && cart.items.length} item
              {cart && cart.items.length > 1 ? 's' : ''})
            </SheetDescription>
          )}
        </SheetHeader>

        {/* EMPTY CART  */}
        {isCartEmpty && (
          <div className="relative flex grow items-center justify-center">
            <section className="m-auto flex max-w-sm flex-col items-center gap-6 text-center">
              <ShoppingBasket className="size-24 text-gray-200" />
              <hgroup className="space-y-2">
                <h2 className="text-muted-foreground text-xl font-medium">Empty Cart</h2>
                <p className="text-muted-foreground mx-auto max-w-3/5 text-sm text-pretty">
                  Your cart is empty. Add some items to see them here!
                </p>
              </hgroup>
            </section>
          </div>
        )}

        {/* CART ITEMS */}
        {cart && cart.items.length > 0 && (
          <div className="scrollbar flex grow flex-col overflow-y-auto px-6">
            {uniqBy(cart.items, 'id').map((item, itemIndex) => (
              <Fragment key={item.id}>
                {itemIndex > 0 && itemIndex < cart.items.length && (
                  <Separator className="my-6" />
                )}
                <CartItem key={item.id} item={item} index={itemIndex} />
              </Fragment>
            ))}
          </div>
        )}

        {/* FOOTER   */}
        <SheetFooter
          className={cn('bg-background mt-auto flex-col space-y-0 p-6', {
            'border-t': cart && cart.items.length > 0,
          })}
        >
          {cart && cart.items.length > 0 && (
            <>
              {/* Streamlined Subtotal */}
              <div className="flex items-center justify-between">
                <dl className="flex w-full items-center justify-between gap-2">
                  <dt className="max-w-3/5">
                    <Large>Subtotal</Large>
                    <Muted className="text-balance">
                      Shipping and taxes calculated at checkout.
                    </Muted>
                  </dt>
                  <div className="flex items-center">
                    <dd className="flex items-center">
                      <span className="text-muted-foreground">Ksh</span>
                      &nbsp;
                      <Large className="lining-nums">
                        {formatWithCommas(
                          cart.items.reduce(
                            (total, item) => total + item.price * item.quantity,
                            0,
                          ),
                        )}
                      </Large>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <SheetClose asChild>
                  <Button variant="secondary" className="flex-1">
                    <ShoppingCart className="h-4 w-4" />
                    Continue Shopping
                  </Button>
                </SheetClose>

                <SheetClose asChild>
                  <Button className="flex-1" asChild>
                    <Link
                      href="/checkout"
                      className="flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="size-4" />
                      Checkout
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </>
          )}

          {/* EMPTY CART CLOSE BTN  */}
          {isCartEmpty && (
            <SheetClose asChild>
              <Button variant="outline" className="items-center" asChild>
                <Link href="/brands">
                  Start Shopping
                  <ChevronRight />
                </Link>
              </Button>
            </SheetClose>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
