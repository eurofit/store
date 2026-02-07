'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { useMounted } from '@/hooks/use-mounted';
import { CartItem } from '@/schemas/cart';
import { type ProductLine } from '@/types';
import { buildWhatsAppLink } from '@/utils/build-wa-link';
import { cn } from '@/utils/cn';
import { formatWithCommas } from '@/utils/format-with-commas';
import { clamp } from 'lodash-es';
import { Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Whatsapp } from './icons/whatsapp';
import { NotifyMeButton } from './notify-me-button';
import { Badge } from './ui/badge';
import { ButtonGroup } from './ui/button-group';

type ProductLineProps = {
  product: CartItem['product'];
  line: ProductLine;
  userId?: string | null;
};

export function ProductLine({ product, userId, line }: ProductLineProps) {
  const {
    queryResult: { cart, isQueryPending },
    createCartWithItemMutation: { mutate: createCartWithItem, isPending: isCreatingCart },
    addItemToCartMutation: { mutate: addItemToCart },
    updateCartItemQuantityMutation: {
      mutate: updateCartItemQuantity,
      isPending: isUpdatingCartItem,
    },
    removeItemFromCartMutation: { mutate: removeItemFromCart },
    deleteCartMutation: { mutate: deleteCart },
  } = useCart();
  const isMounted = useMounted();

  const cartItem = cart?.items.find((item) => item.id === line.id);

  const [qty, setQty] = React.useState(0);
  const cartQty = cartItem?.quantity ?? 0;

  React.useEffect(() => {
    setQty((current) => (current === cartQty ? current : cartQty));
  }, [cartQty]);

  const commitCartChange = React.useCallback(
    (newQty: number) => {
      if (!line.price) return;

      if (!isQueryPending && !cart) {
        createCartWithItem({
          ...line,
          product,
          quantity: newQty,
          price: line.price,
          snapshot: {
            retailPrice: line.price,
          },
        });
        return;
      }

      if (!isQueryPending && !isCreatingCart && cart && !cartItem && newQty > 0) {
        addItemToCart({
          ...line,
          product,
          quantity: newQty,
          price: line.price,
          snapshot: { retailPrice: line.price },
        });
        return;
      }

      if (
        !isQueryPending &&
        cart &&
        cartItem &&
        newQty !== cartItem.quantity &&
        newQty > 0
      ) {
        updateCartItemQuantity({
          ...line,
          product,
          quantity: newQty,
          price: line.price,
          snapshot: { retailPrice: line.price },
        });
        return;
      }

      if (!isQueryPending && cart && cart.items.length > 1 && cartItem && newQty === 0) {
        removeItemFromCart({
          item: cartItem.id,
        });
        return;
      }

      if (!isQueryPending && cart && cart.items.length === 1 && cartItem && newQty === 0) {
        deleteCart();
        return;
      }
    },
    [
      line,
      product,
      isQueryPending,
      cart,
      cartItem,
      isCreatingCart,
      createCartWithItem,
      addItemToCart,
      updateCartItemQuantity,
      removeItemFromCart,
      deleteCart,
    ],
  );

  const debouncedCommitChange = useDebouncedCallback(commitCartChange, 400);

  const handleQtyChange = React.useCallback(
    (newQty: number) => {
      setQty(newQty);
      debouncedCommitChange(newQty);
    },
    [debouncedCommitChange],
  );

  const handleIncrement = React.useCallback(() => {
    setQty((qty) => {
      const newQty = clamp(qty + 1, 0, line.stock);
      debouncedCommitChange(newQty);
      return newQty;
    });
  }, [line.stock, debouncedCommitChange]);

  const handleDecrement = React.useCallback(() => {
    setQty((qty) => {
      const newQty = clamp(qty - 1, 0, line.stock);
      debouncedCommitChange(newQty);
      return newQty;
    });
  }, [line.stock, debouncedCommitChange]);

  // TODO: refactor qty input to separate component be reusable in cart sheet and checkout item

  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-between rounded-lg p-3 transition-all duration-200 md:flex-row',
        {
          'border-blue-300 bg-blue-50': line.price && qty > 0,
          'border-gray-200 bg-white hover:bg-gray-50': !line.price || qty === 0,
          'border-red-200 bg-red-50 hover:bg-red-50': line.isOutOfStock,
          'gap-4 max-md:flex-col max-md:items-start': line.stock,
        },
      )}
      aria-label={line.title}
    >
      <div className="w-full min-w-0 grow">
        <div className="mb-1 flex items-center gap-2">
          {line.variant && (
            <h3 id={line.slug} className="scroll-m-20 text-sm text-gray-600 capitalize">
              {line.variant}
            </h3>
          )}
          {false && (
            <Badge variant="destructive" className="text-xs">
              {52}%
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          {line.price && (
            <span className="font-semibold font-variant-numeric-tabular-nums">
              <span className="text-muted-foreground text-xs">Ksh</span>
              {formatWithCommas(line.price)}
            </span>
          )}
          {line.isLowStock && (
            <span className="font-variant-numeric-tabular-nums text-xs font-medium text-red-600">
              Only {line.stock} Left
            </span>
          )}
          {!line.isLowStock && !line.isOutOfStock && (
            <span className="font-variant-numeric-tabular-nums text-xs text-green-600">
              {line.stock} in Stock
            </span>
          )}
          {line.isOutOfStock && (
            <span className="text-xs text-gray-500">Out of Stock</span>
          )}
        </div>
      </div>

      <div>
        {line.isOutOfStock && (
          <NotifyMeButton
            userId={userId}
            productLineId={line.id}
            isNotifyRequested={line.isNotifyRequested}
          />
        )}

        {!line.isOutOfStock && line.price && (
          <ButtonGroup
            className={cn('relative w-full', {
              'border border-amber-500': isUpdatingCartItem,
            })}
          >
            <Button
              variant="outline"
              size="icon"
              aria-label="Decrease quantity"
              disabled={isMounted() && qty <= 0}
              onClick={handleDecrement}
            >
              <Minus aria-hidden="true" />
            </Button>

            <Input
              type="number"
              min={0}
              max={line.stock}
              className="bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 w-16 text-center text-sm shadow-xs"
              aria-label="Quantity input"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0"
              value={qty || ''}
              onChange={(e) =>
                handleQtyChange(clamp(Number(e.target.value), 0, line.stock))
              }
            />

            <Button
              variant="outline"
              size="icon"
              aria-label="Increase quantity"
              disabled={isMounted() && qty >= line.stock}
              onClick={handleIncrement}
            >
              <Plus aria-hidden="true" />
            </Button>
          </ButtonGroup>
        )}

        {!line.isOutOfStock && !line.price && (
          <Button variant="outline" className="text-[#103928]" asChild>
            <Link
              href={buildWhatsAppLink({
                phone: '254110990666',
                message: `Hello Eurofit Team,\n\nI would like to inquire about the price for this product:\n\n*Product*: ${line.title}\n${line.variant ? `*Variant*: ${line.variant}` : ''}\n*SKU*: ${line.sku}\n\nThank you.`,
              })}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Whatsapp aria-hidden="true" />
              Inquire Price
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
