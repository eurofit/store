import { type CartItem } from '@/schemas/cart';
import { cn } from '@/utils/cn';
import { formatWithCommas } from '@/utils/format-with-commas';

import { ImageWithRetry } from '@/components/image-with-retry';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import clamp from 'lodash-es/clamp';
import { ImageOff, Minus, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';

type CartItemProps = {
  item: CartItem;
  index: number;
};

export function CartItem({ index, item: { product, ...item } }: CartItemProps) {
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

  const cartItem = cart?.items.find((cartItem) => cartItem.id === item.id);

  const [qty, setQty] = React.useState(0);

  // Sync local qty state with cart item quantity
  React.useEffect(() => {
    if (cartItem && cartItem.quantity === qty) return;
    setQty(cartItem?.quantity ?? 0);
  }, [cartItem?.quantity]);

  const commitCartChange = (newQty: number) => {
    // if item has no price, do nothing
    if (!item.price) return;

    // if there is no cart, create one with the item
    if (!isQueryPending && !cart) {
      createCartWithItem({
        ...item,
        product,
        quantity: newQty,
        price: item.price!,
      });
      return;
    }

    // if there is a cart, but item not in it, add the item
    // if cart is creating, do nothing
    if (!isQueryPending && !isCreatingCart && cart && !cartItem && newQty > 0) {
      addItemToCart({
        ...item,
        product,
        quantity: newQty,
        price: item.price!,
      });

      return;
    }

    // if there is a cart and item in it, update the item quantity
    if (
      !isQueryPending &&
      cart &&
      cartItem &&
      newQty !== cartItem.quantity &&
      newQty > 0
    ) {
      updateCartItemQuantity({
        ...item,
        product,
        quantity: newQty,
        price: item.price!,
      });
      return;
    }

    // if new quantity is zero, and there are more than 1 items in the cart, remove the item
    if (!isQueryPending && cart && cart?.items.length > 1 && cartItem && newQty === 0) {
      removeItemFromCart({
        item: cartItem.id,
      });
      return;
    }

    // if new quantity is zero, and this is the only item in the cart, delete the cart
    if (!isQueryPending && cart && cart?.items.length === 1 && cartItem && newQty === 0) {
      deleteCart();
      return;
    }
  };

  const debouncedCommitChange = useDebouncedCallback(commitCartChange, 400);

  const handleQtyChange = (newQty: number) => {
    setQty(newQty);

    debouncedCommitChange(newQty);
  };

  const handleIncrement = () => {
    setQty((qty) => qty + 1);
    debouncedCommitChange(clamp(qty + 1, 0, item.stock));
  };

  const handleDecrement = () => {
    setQty((qty) => qty - 1);
    debouncedCommitChange(clamp(qty - 1, 0, item.stock));
  };

  return (
    <article className="flex items-start space-x-4">
      <div className="relative flex aspect-square size-16 items-center justify-center rounded-md bg-white shadow-sm">
        {product.image ? (
          <ImageWithRetry
            src={product.image}
            alt={product.title}
            width={64}
            height={64}
            className="rounded-md"
            priority={index < 3}
          />
        ) : (
          <ImageOff
            className="text-foreground/50 size-1/2"
            aria-label="Image not available"
          />
        )}
      </div>
      <div className="w-full space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-sm text-pretty">{item.title}</h3>

          <Button
            variant="ghost"
            className="text-destructive hover:bg-destructive/10 *:[svg]:text-destructive! size-7 rounded-sm p-0"
            onClick={() => handleQtyChange(0)}
          >
            <Trash2 className="size-3.5" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="text-muted-foreground text-sm">
              <span>{item.stock}</span> in stock
            </div>
            <div className="flex items-center space-x-2">
              <ButtonGroup
                className={cn({
                  'border border-amber-500': isUpdatingCartItem,
                })}
              >
                <Button
                  variant="outline"
                  className="size-7"
                  aria-label="Decrease quantity"
                  onClick={handleDecrement}
                  disabled={qty <= 0}
                >
                  <Minus className="size-3" />
                </Button>
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  max={item.stock}
                  min={1}
                  aria-label="Quantity input"
                  placeholder="0"
                  value={qty}
                  onChange={(e) =>
                    handleQtyChange(clamp(Number(e.target.value), 0, item.stock))
                  }
                  className={cn('h-7 w-14 text-center', {
                    'bg-destructive text-destructive-foreground border': false, // low items
                  })}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="size-7"
                  aria-label="Increase quantity"
                  onClick={handleIncrement}
                  disabled={qty >= item.stock}
                >
                  <Plus className="size-3" />
                </Button>
              </ButtonGroup>
            </div>
          </div>

          {item.price && (
            <div className="flex flex-col text-right">
              <div className="text-muted-foreground text-xs leading-none">
                <span className="text-muted-foreground">{item.quantity}</span>
                &nbsp;x&nbsp;<span>{formatWithCommas(item.price)}</span>
              </div>

              <div className="initem leading-none">
                <span className="text-[10px]">Ksh</span>
                <span className="text-sm font-medium oldstyle-nums">
                  {formatWithCommas(item.price * item.quantity)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
