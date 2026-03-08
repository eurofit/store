'use client';

import { CurrentUser } from '@/actions/auth/get-current-user';
import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useCart as useCartMutations } from '@/hooks/use-cart';
import { useToggle } from '@/hooks/use-toggle';
import { useCart } from '@/providers/cart';
import { Address, AddressId, AddressWithId } from '@/schemas/address';
import { type CartItem } from '@/schemas/cart';
import { cn } from '@/utils/cn';
import { formatWithCommas } from '@/utils/format-with-commas';
import {
  CheckCircleIcon,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash,
} from 'lucide-react';
import * as React from 'react';
import { AddressSelector } from '../address-selector';
import { CreateAddressForm } from '../create-address';
import { UpdateAddressForm } from '../update-address';
import { stepper } from './steps';
const { Stepper, useStepper } = stepper;

type CheckoutStepperProps = React.ComponentProps<typeof Stepper.Root> & {
  user: CurrentUser | undefined;
};

export function CheckoutStepper(props: CheckoutStepperProps) {
  return <Stepper.Root {...props} />;
}

export function CheckoutStepperHeader({
  className,
  ...props
}: React.ComponentProps<typeof Stepper.List>) {
  const stepper = useStepper();
  return (
    <Stepper.List
      className={cn(
        'm-0 mx-auto flex max-w-md list-none flex-row items-center justify-between gap-2 p-0',
        className,
      )}
      {...props}
    >
      {stepper.state.all.map((step, index) => {
        const currentIndex = stepper.state.current.index;
        const status =
          index < currentIndex
            ? 'success'
            : index === currentIndex
              ? 'active'
              : 'inactive';
        const isLast = index === stepper.state.all.length - 1;

        return (
          <Stepper.Item
            key={step.id}
            step={step.id}
            className="group peer relative flex w-full flex-col items-center justify-center gap-2"
          >
            <Stepper.Trigger
              render={(props) => (
                <Button
                  className={cn(
                    'rounded-full data-[status=success]:bg-green-50 data-[status=success]:text-green-700 data-[status=success]:hover:bg-green-50',
                    {
                      'ring-primary ring-2 ring-offset-2': status === 'active',
                    },
                  )}
                  variant={status === 'inactive' ? 'outline' : 'default'}
                  size="icon"
                  {...props}
                  disabled={status === 'inactive'}
                >
                  <Stepper.Indicator>
                    {status === 'success' && <CheckCircleIcon />}
                    {status !== 'success' && index + 1}
                  </Stepper.Indicator>
                </Button>
              )}
            />
            {!isLast && (
              <Stepper.Separator
                orientation="horizontal"
                data-status={status}
                className="bg-muted absolute top-5 right-[calc(-50%+20px)] left-[calc(50%+30px)] block h-0.5 shrink-0 transition-all duration-300 ease-in-out data-disabled:opacity-50 data-[status=success]:bg-green-500"
              />
            )}

            <div className="flex flex-col items-center gap-1 text-center">
              <Stepper.Title
                render={(props) => (
                  <h4 className="text-sm font-medium" {...props}>
                    {step.title}
                  </h4>
                )}
              />
            </div>
          </Stepper.Item>
        );
      })}
    </Stepper.List>
  );
}

type AddressStepProps = {
  addresses: AddressWithId[];
};

export function CartStep() {
  const stepper = useStepper();
  const { items, isEmpty } = useCart();

  return (
    <Stepper.Content step="cart">
      <Card>
        <CardHeader>
          <CardTitle>Cart</CardTitle>
          <CardDescription>Review your cart before placing your order.</CardDescription>
        </CardHeader>
        <CardContent>
          {isEmpty && (
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-4" />
              <p>Your cart is empty</p>
            </div>
          )}

          {!isEmpty && (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => stepper.navigation.next()} disabled={isEmpty}>
            Next: Address
          </Button>
        </CardFooter>
      </Card>
    </Stepper.Content>
  );
}

export function AddressStep({ addresses }: AddressStepProps) {
  const isAddressesEmpty = addresses.length === 0;

  const {
    value: isCreateAddressOpen,
    setOn: openCreateAddress,
    setOff: closeCreateAddress,
  } = useToggle(isAddressesEmpty);

  const [isCreatingAddress, setIsCreatingAddress] = React.useState(false);
  const [editingAddressId, setEditingAddressId] = React.useState<AddressId['id'] | null>(
    null,
  );
  const [isUpdatingAddress, setIsUpdatingAddress] = React.useState(false);
  const editingAddress = addresses.find((address) => address.id === editingAddressId);

  return (
    <Stepper.Content step="address">
      <Card>
        <CardHeader>
          <CardTitle>Delivery address</CardTitle>
          <CardDescription>
            {isAddressesEmpty
              ? 'Add new address for your order.'
              : 'Select a delivery address for your order.'}
          </CardDescription>
          {!isAddressesEmpty && (
            <CardAction>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openCreateAddress()}
                disabled={isCreatingAddress || isCreateAddressOpen}
              >
                <Plus aria-hidden="true" />
                Add New Address
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          {(isAddressesEmpty || isCreateAddressOpen) && !editingAddressId && (
            <CreateAddressForm
              onClose={closeCreateAddress}
              isDefault={isAddressesEmpty}
              onPending={setIsCreatingAddress}
            />
          )}

          {!isAddressesEmpty && !isCreateAddressOpen && !editingAddressId && (
            <AddressSelector addresses={addresses} onEditAddress={setEditingAddressId} />
          )}

          {editingAddress && (
            <UpdateAddressForm
              address={editingAddress}
              onClose={() => setEditingAddressId(null)}
              onPending={setIsUpdatingAddress}
            />
          )}
        </CardContent>
      </Card>
    </Stepper.Content>
  );
}

export function ReviewStep() {
  const stepper = useStepper();
  const address = stepper.metadata.get<Address | null>('address');

  return (
    <Stepper.Content step="place-order">
      <Card>
        <CardHeader>
          <CardTitle>Review Order</CardTitle>
          <CardDescription>Review your order & place it.</CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="space-y-4">
            <div className="bg-muted/50 space-y-6 rounded-md p-2">
              <div className="flex gap-4">
                <div className="bg-muted flex size-10 rounded-md">
                  <MapPin className="m-auto size-6" />
                </div>
                <div>
                  <h3 className="text-foreground font-medium">Shipping Address</h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Where your order will be delivered
                  </p>
                </div>
                <div className="ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => stepper.navigation.goTo('address')}
                  >
                    Edit
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium capitalize">
                  {address?.title} {address?.firstName} {address?.lastName}
                </p>
                <div className="text-muted-foreground text-sm">
                  <p>{address?.line1},</p>
                  {address?.line2 && <p>{address?.line2},</p>}
                  <p>
                    {address?.area}, {address?.postalCode}
                  </p>
                  {address?.city && <p>{address?.city}</p>}
                  {address?.county && <p>{address?.county}</p>}

                  {address?.country && <p>{address?.country}</p>}
                  {address?.phone && <p>{address?.phone}</p>}
                  {address?.secondaryPhone && <p>{address?.secondaryPhone}</p>}
                </div>
              </div>
            </div>
            <div className="bg-muted/50 space-y-6 rounded-md p-2">
              <div className="flex gap-4">
                <div className="bg-muted flex size-10 rounded-md">
                  <ShoppingCart className="m-auto size-6" />
                </div>
                <div>
                  <h3 className="text-foreground font-medium">Shipping Address</h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Where your order will be delivered
                  </p>
                </div>
                <div className="ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => stepper.navigation.goTo('address')}
                  >
                    Edit
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium capitalize">
                  {address?.title} {address?.firstName} {address?.lastName}
                </p>
                <div className="text-muted-foreground text-sm">
                  <p>{address?.line1},</p>
                  {address?.line2 && <p>{address?.line2},</p>}
                  <p>
                    {address?.area}, {address?.postalCode}
                  </p>
                  {address?.city && <p>{address?.city}</p>}
                  {address?.county && <p>{address?.county}</p>}

                  {address?.country && <p>{address?.country}</p>}
                  {address?.phone && <p>{address?.phone}</p>}
                  {address?.secondaryPhone && <p>{address?.secondaryPhone}</p>}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Stepper.Content>
  );
}

type CartItemProps = {
  item: CartItem;
};

function CartItem({ item }: CartItemProps) {
  const {
    queryResult: { cart, isQueryPending },
    updateCartItemQuantityMutation: {
      mutate: updateCartItemQuantity,
      isPending: isUpdatingCartItem,
    },
    removeItemFromCartMutation: {
      mutate: removeItemFromCart,
      isPending: isRemovingCartItem,
    },
    deleteCartMutation: { mutate: deleteCart, isPending: isDeletingCart },
  } = useCartMutations();

  const cartItem = cart?.items.find((cartItem) => cartItem.id === item.id);

  const isLastItem = cart?.items.length === 1;

  const handleIncrement = () => {
    updateCartItemQuantity({
      ...item,
      quantity: item.quantity + 1,
    });
  };

  const handleDecrement = () => {
    updateCartItemQuantity({
      ...item,
      quantity: item.quantity - 1,
    });
  };

  const handleRemove = () => {
    if (!cartItem?.id) return;

    removeItemFromCart({
      item: cartItem?.id,
    });
  };

  const handleDelete = () => {
    deleteCart();
  };

  const isPending = isUpdatingCartItem || isRemovingCartItem || isDeletingCart;

  return (
    <div key={item.id} className="flex items-start gap-2">
      <div className="bg-muted relative flex size-16 items-center justify-center rounded-md"></div>
      <div>
        <h3 className="max-w-xs text-sm font-medium text-pretty">{item.product.title}</h3>
        <p className="text-muted-foreground text-sm">{item.variant}</p>
        <p className="text-muted-foreground mt-1 text-xs">{item.stock} in stock</p>
      </div>
      <div className="ml-auto space-y-2">
        <div className="flex items-center justify-end gap-1 text-right text-sm font-medium">
          <span className="text-muted-foreground text-xs">Ksh</span>
          <span>{formatWithCommas(item.price)}</span>
        </div>

        <ButtonGroup>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={
              isLastItem
                ? handleDelete
                : cartItem?.quantity === 1
                  ? handleRemove
                  : handleDecrement
            }
            disabled={isPending}
          >
            {cartItem?.quantity === 1 ? (
              <>
                <Trash aria-hidden="true" />
                <span className="sr-only">Decrease quantity</span>
              </>
            ) : (
              <>
                <Minus aria-hidden="true" />
                <span className="sr-only">Decrease quantity</span>
              </>
            )}
          </Button>
          <ButtonGroupText className="min-w-6.5">
            {isPending && <Spinner aria-label="Updating quantity" />}
            {!isPending && cartItem?.quantity}
          </ButtonGroupText>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleIncrement}
            disabled={isPending}
          >
            <Plus aria-hidden="true" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
