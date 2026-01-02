"use client"

import { createAddress as createAddressAction } from "@/actions/address"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { titles } from "@/constants/titles"
import { Address, addressSchema } from "@/lib/schemas/address"
import { SafeUser } from "@/lib/schemas/safe-user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

type AddressFormProps = {
  user: Promise<SafeUser | null>
}

export function AddressForm({ user: userPromise }: AddressFormProps) {
  const user = React.use(userPromise)
  const {
    mutateAsync: createAddress,
    isPending: isCreatingAddress,
    isSuccess: isAddressCreated,
  } = useMutation({
    mutationFn: createAddressAction,
  })
  const router = useRouter()

  const isThereDefaultAddress =
    user?.addresses?.some((address) => address.isDefault) ?? false

  const form = useForm<Address>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      // Contact Information
      title: "mr",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phone: user?.phone ?? "",
      email: user?.email ?? "",
      // Address Details
      line1: "",
      line2: "",
      line3: "",
      postalCode: "",
      city: "",
      county: "",
      country: "Kenya",

      // Other Details
      label: "",
      note: "",
      isDefault: !isThereDefaultAddress,
    },
  })

  function onSubmit(values: Address) {
    toast.promise(createAddress(values), {
      loading: "Creating address...",
      success: "Address created successfully!",
      error: "Failed to create address. Please try again.",
    })
  }

  React.useEffect(() => {
    if (!isAddressCreated) return

    form.reset()

    router.push("/checkout")
  }, [isAddressCreated, form])

  return (
    <div className="relative flex items-center justify-center">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full justify-between gap-8"
      >
        <Card className="mx-auto max-w-xl grow">
          <CardHeader>
            <CardTitle>Add New Address</CardTitle>
          </CardHeader>

          <CardContent>
            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  <FieldSet>
                    <FieldLegend>Contact Information</FieldLegend>
                    <FieldDescription>
                      Please provide your contact information.
                    </FieldDescription>
                    <FieldGroup>
                      <Controller
                        control={form.control}
                        name="title"
                        render={({
                          field: { onChange, onBlur, ...field },
                          fieldState,
                        }) => {
                          const id = field.name + React.useId()
                          return (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor={id}>Title</FieldLabel>
                              <Select {...field} onValueChange={onChange}>
                                <SelectTrigger
                                  id={id}
                                  onBlur={onBlur}
                                  aria-invalid={fieldState.invalid}
                                >
                                  <SelectValue placeholder="Please select a title" />
                                </SelectTrigger>
                                <SelectContent>
                                  {titles.map((title) => (
                                    <SelectItem
                                      key={title.value}
                                      value={title.value}
                                    >
                                      {title.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )
                        }}
                      />
                      <div className="grid gap-2 md:grid-cols-2">
                        <Controller
                          control={form.control}
                          name="firstName"
                          render={({ field, fieldState }) => {
                            const id = field.name + React.useId()
                            return (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={id}>First Name</FieldLabel>
                                <Input
                                  id={id}
                                  {...field}
                                  aria-invalid={fieldState.invalid}
                                  autoComplete="given-name"
                                />

                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )
                          }}
                        />
                        <Controller
                          control={form.control}
                          name="lastName"
                          render={({ field, fieldState }) => {
                            const id = field.name + React.useId()
                            return (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={id}>Last Name</FieldLabel>
                                <Input
                                  id={id}
                                  {...field}
                                  aria-invalid={fieldState.invalid}
                                  autoComplete="family-name"
                                />

                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )
                          }}
                        />
                        <Controller
                          control={form.control}
                          name="email"
                          render={({ field, fieldState }) => {
                            const id = field.name + React.useId()
                            return (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={id}>Email</FieldLabel>
                                <Input
                                  id={id}
                                  {...field}
                                  aria-invalid={fieldState.invalid}
                                  autoComplete="email"
                                />

                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )
                          }}
                        />
                        <Controller
                          control={form.control}
                          name="phone"
                          render={({ field, fieldState }) => {
                            const id = field.name + React.useId()
                            return (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={id}>Telephone</FieldLabel>
                                <Input
                                  id={id}
                                  {...field}
                                  aria-invalid={fieldState.invalid}
                                  autoComplete="tel"
                                />

                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )
                          }}
                        />
                      </div>
                    </FieldGroup>
                  </FieldSet>

                  <FieldSet>
                    <FieldLegend>Address Details</FieldLegend>
                    <FieldDescription>
                      Please provide your address details.
                    </FieldDescription>
                    <FieldGroup>
                      <Controller
                        control={form.control}
                        name="line1"
                        render={({ field, fieldState }) => {
                          const id = field.name + React.useId()
                          return (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor={id}>
                                Address Line 1
                              </FieldLabel>
                              <Input
                                id={id}
                                {...field}
                                placeholder="6th Street, 6th Street Tower"
                                aria-invalid={fieldState.invalid}
                                autoComplete="shipping address-line1"
                              />
                              <FieldDescription>
                                Primary address details, e.g: Street name,
                                building name / Estate name
                              </FieldDescription>
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )
                        }}
                      />
                      <Controller
                        control={form.control}
                        name="line2"
                        render={({ field, fieldState }) => {
                          const id = field.name + React.useId()
                          return (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor={id}>
                                Address Line 2
                              </FieldLabel>
                              <Input
                                id={id}
                                {...field}
                                placeholder="Unit 111, 1st Floor"
                                aria-invalid={fieldState.invalid}
                                autoComplete="shipping address-line2"
                              />
                              <FieldDescription>
                                Additional address details, e.g., unit, floor /
                                Gate, house no etc.
                              </FieldDescription>
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )
                        }}
                      />
                      <Controller
                        control={form.control}
                        name="line3"
                        render={({ field, fieldState }) => {
                          const id = field.name + React.useId()
                          return (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor={id}>
                                Address Line 3
                              </FieldLabel>
                              <Input
                                id={id}
                                {...field}
                                placeholder="Unit 111, 1st Floor"
                                aria-invalid={fieldState.invalid}
                                autoComplete="shipping address-line3"
                              />

                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )
                        }}
                      />

                      <div className="grid gap-4 md:grid-cols-2">
                        <Controller
                          control={form.control}
                          name="postalCode"
                          render={({ field, fieldState }) => {
                            const id = field.name + React.useId()
                            return (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={id}>
                                  Postal Code
                                </FieldLabel>
                                <Input
                                  id={id}
                                  {...field}
                                  placeholder="Eg: 00100"
                                  aria-invalid={fieldState.invalid}
                                  autoComplete="shipping postal-code"
                                />

                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )
                          }}
                        />{" "}
                        <Controller
                          control={form.control}
                          name="city"
                          render={({ field, fieldState }) => {
                            const id = field.name + React.useId()
                            return (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={id}>
                                  City / Town
                                </FieldLabel>
                                <Input
                                  id={id}
                                  {...field}
                                  placeholder="Eg: Nairobi, Mombasa, etc."
                                  aria-invalid={fieldState.invalid}
                                  autoCapitalize="on"
                                  autoComplete="shipping address-level2"
                                />

                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )
                          }}
                        />
                        <Controller
                          control={form.control}
                          name="county"
                          render={({ field, fieldState }) => {
                            const id = field.name + React.useId()
                            return (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={id}>County</FieldLabel>
                                <Input
                                  id={id}
                                  {...field}
                                  placeholder="Eg: Nairobi, Mombasa, etc."
                                  aria-invalid={fieldState.invalid}
                                  autoCapitalize="on"
                                  autoComplete="shipping address-level1"
                                />

                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )
                          }}
                        />
                        <Controller
                          control={form.control}
                          name="country"
                          render={({ field, fieldState }) => {
                            const id = field.name + React.useId()
                            return (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={id}>Country</FieldLabel>
                                <Input
                                  id={id}
                                  {...field}
                                  placeholder="Eg: Nairobi, Mombasa, etc."
                                  aria-invalid={fieldState.invalid}
                                  autoCapitalize="on"
                                  autoComplete="shipping country-name"
                                />

                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )
                          }}
                        />
                      </div>
                    </FieldGroup>
                  </FieldSet>
                </FieldGroup>
              </FieldSet>
              <FieldSet>
                <FieldLegend>Other Details</FieldLegend>
                <FieldDescription>
                  Additional details for your delivery.
                </FieldDescription>
                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="label"
                    render={({ field, fieldState }) => {
                      const id = field.name + React.useId()
                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={id}>Label</FieldLabel>
                          <Input
                            id={id}
                            {...field}
                            placeholder="e.g., Home, Work, Warehouse, Cargo etc."
                            aria-invalid={fieldState.invalid}
                          />
                          <FieldDescription>
                            Short name to identify this address. Example: Home,
                            Work, Shop, Warehouse, Cargo.
                          </FieldDescription>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )
                    }}
                  />
                  <Controller
                    control={form.control}
                    name="note"
                    render={({ field, fieldState }) => {
                      const id = field.name + React.useId()
                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={id}>Delivery Note</FieldLabel>
                          <Textarea
                            id={id}
                            {...field}
                            placeholder="Any special  instructions for delivery."
                            aria-invalid={fieldState.invalid}
                            className="resize-none"
                            rows={5}
                          />
                          <FieldDescription>
                            Any special instructions for delivery. Eg: "Call
                            when you arrive"
                          </FieldDescription>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )
                    }}
                  />
                  <Controller
                    control={form.control}
                    name="isDefault"
                    render={({
                      field: { onChange, value, ...field },
                      fieldState,
                    }) => {
                      const id = field.name + React.useId()
                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor={id}
                            className="hover:bg-accent/50 has-aria-invalid:border-destructive/70 flex items-start gap-3 rounded-lg border p-3 has-disabled:cursor-not-allowed"
                          >
                            <Checkbox
                              id={id}
                              {...field}
                              checked={value}
                              onCheckedChange={onChange}
                              aria-invalid={fieldState.invalid}
                              disabled={!isThereDefaultAddress}
                            />
                            <div className="grid gap-1.5 font-normal">
                              <p className="text-sm leading-none font-medium">
                                Set as default address
                              </p>
                              <p className="text-muted-foreground text-sm">
                                Use this address as your default for future
                                orders.
                              </p>
                            </div>
                          </FieldLabel>
                          {!isThereDefaultAddress && (
                            <FieldDescription>
                              If there is no default address, this will be set
                              as default automatically.
                            </FieldDescription>
                          )}

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )
                    }}
                  />
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={isCreatingAddress}>
              {isCreatingAddress && <Spinner />}
              {isCreatingAddress ? "Saving Address..." : "Save Address"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
