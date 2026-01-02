"use client"

import { CurrentUser } from "@/actions/auth/get-current-user"
import { AddressRadioItem } from "@/components/address-radio-item"
import { Large, Muted } from "@/components/typography"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import { RadioGroup } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { useCart } from "@/hooks/use-cart"
import { useMounted } from "@/hooks/use-mounted"
import { useCheckout } from "@/hooks/useCheckout"
import { formatWithCommas } from "@/utils/format-with-commas"
import { zodResolver } from "@hookform/resolvers/zod"

import { uniqBy } from "lodash-es"
import { ChevronRight, Plus } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { CheckoutItem } from "./checkout-item"

const addressId = z.object({
  id: z.string().min(1, "Please select a delivery address."),
})

const couponSchema = z.object({
  code: z.string().optional(),
})

type CartContentProps = {
  user: CurrentUser
}

export function CartContent({ user }: CartContentProps) {
  const defaultAddress = user?.addresses?.find((address) => address.isDefault)
  const defaultAddressId = React.useRef(
    user?.addresses?.find((a) => a.isDefault)?.id ?? ""
  )
  const [isDisabled, setIsDisabled] = React.useState(false)
  const { mutate: checkout, isPending: isCheckoutPending } = useCheckout()

  const isMounted = useMounted()
  const {
    queryResult: { cart, isQueryPending },
  } = useCart()

  const totatCartItems = cart
    ? cart.items.reduce((total, item) => total + item.quantity, 0)
    : 0

  const couponForm = useForm<z.infer<typeof couponSchema>>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
    },
  })

  const addressForm = useForm<z.infer<typeof addressId>>({
    resolver: zodResolver(addressId),
    defaultValues: {
      id: defaultAddressId.current,
    },
  })

  if (!isMounted() || isQueryPending) {
    return <div>Loading cart items...</div>
  }

  const onCouponSubmit = () => {
    toast.promise(new Promise((_, reject) => setTimeout(reject, 2500)), {
      loading: "Applying coupon...",
      success: "Coupon applied successfully!",
      error: "Coupon is invalid or expired.",
    })

    couponForm.reset()
  }

  const handleCheckout = () => {
    if (!defaultAddress) {
      toast.error(
        "Please select a delivery address before proceeding to payment."
      )
      return
    }

    checkout({
      items:
        cart?.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          snapshot: {
            price: item.price,
            title: item.title,
          },
        })) ?? [],
      addressId: addressForm.getValues("id"),
    })
  }

  return (
    <div className="relative mt-6 flex flex-col max-md:gap-20 md:flex-row">
      <div className="grow space-y-10 md:max-w-3/5">
        <Item
          variant="muted"
          className="flex-col items-start gap-2 md:flex-row md:items-center"
        >
          <ItemContent>
            <ItemTitle>Hold on!</ItemTitle>
            <ItemDescription>
              Add $130.04 more for free shipping
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <span>$369.96 / $500.00</span>
          </ItemActions>
          <Progress value={(369.96 / 500) * 100} max={100} className="mt-2" />
        </Item>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg leading-normal">
              Checkout Items
            </CardTitle>
            <CardDescription>
              {totatCartItems} items in your bag
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cart && cart.items.length > 0 && (
              <div className="scrollbar flex grow flex-col overflow-y-auto">
                {uniqBy(cart.items, "id").map((item, itemIndex) => (
                  <React.Fragment key={item.id}>
                    {itemIndex > 0 && itemIndex < cart.items.length && (
                      <Separator className="my-6" />
                    )}
                    <CheckoutItem
                      key={item.id}
                      item={item}
                      index={itemIndex}
                      onPending={setIsDisabled}
                    />
                  </React.Fragment>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery address</CardTitle>
            <CardDescription>
              Select or add a new delivery address for your order.
            </CardDescription>
            <CardAction>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/checkout/addresses/create">
                  <Plus />
                  Add New Address
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {!user?.addresses ||
              (user.addresses.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No saved addresses found.
                  <Button variant="link">
                    <Link href="/checkout/addresses/create">
                      Please add a new address during checkout.
                    </Link>
                  </Button>
                </p>
              ))}
            {user?.addresses && (
              <form>
                <FieldGroup>
                  <Controller
                    control={addressForm.control}
                    name="id"
                    render={({ field, fieldState }) => (
                      <Field>
                        <RadioGroup
                          {...field}
                          onValueChange={field.onChange}
                          className="grid md:grid-cols-2"
                          data-invalid={fieldState.invalid}
                        >
                          {user.addresses?.map((address) => (
                            <FieldLabel key={address.id} htmlFor={address.id}>
                              <AddressRadioItem
                                id={address.id}
                                value={address.id}
                                address={address}
                                aria-invalid={fieldState.invalid}
                              />
                            </FieldLabel>
                          ))}
                        </RadioGroup>
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="relative grow md:max-w-2/5">
        <Card className="sticky top-22 mx-auto w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-lg leading-normal">
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              className="w-full"
              onSubmit={couponForm.handleSubmit(onCouponSubmit)}
            >
              <Controller
                control={couponForm.control}
                name="code"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        placeholder="Coupon code"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          type="submit"
                          disabled={
                            !field.value ||
                            (field.value && field.value.length < 3) ||
                            couponForm.formState.isSubmitting
                          }
                        >
                          Apply
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </form>
            <Separator />
            <dl className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <dt className="flex justify-between">Subtotal</dt>
                <dd className="flex items-center text-right lining-nums slashed-zero tabular-nums">
                  <span className="text-muted-foreground">Ksh</span>
                  &nbsp;
                  <p>
                    {formatWithCommas(
                      cart
                        ? cart.items.reduce(
                            (total, item) => total + item.price * item.quantity,
                            0
                          )
                        : 0
                    )}
                  </p>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex justify-between">Shipping</dt>
                <dd className="flex items-center text-right lining-nums slashed-zero tabular-nums">
                  <span className="text-muted-foreground">Ksh</span>
                  &nbsp;
                  <p>
                    {formatWithCommas(
                      cart
                        ? cart.items.reduce(
                            (total, item) => total + item.price * item.quantity,
                            0
                          )
                        : 0
                    )}
                  </p>
                </dd>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <dt className="flex justify-between">
                  <Large>Total</Large>
                </dt>
                <dd className="flex items-center text-right lining-nums slashed-zero tabular-nums">
                  <span className="text-muted-foreground">Ksh</span>
                  &nbsp;
                  <Large>
                    {formatWithCommas(
                      cart
                        ? cart.items.reduce(
                            (total, item) => total + item.price * item.quantity,
                            0
                          )
                        : 0
                    )}
                  </Large>
                </dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="w-full space-y-2">
              <Button
                className="w-full"
                size="lg"
                disabled={isDisabled || isCheckoutPending}
                onClick={handleCheckout}
              >
                {isCheckoutPending && <Spinner />}
                {isCheckoutPending
                  ? "Processing your order..."
                  : "Proceed to Payment"}
                <ChevronRight />
              </Button>
              <Muted className="text-center">
                Taxes calculated at checkout
              </Muted>
            </div>
            {/* <Separator className="my-4" />
            <div className="max-w-xs space-y-2 self-start text-sm">
              <div className="flex items-center gap-2">
                <Truck className="text-muted-foreground size-4" />
                <Muted>Free shipping on orders over Ksh 10,000</Muted>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCcw className="text-muted-foreground size-4" />
                <Muted>Free 14-day returns</Muted>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="text-muted-foreground size-4" />
                <Muted>Secure Checkout</Muted>
              </div>
            </div> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
