'use client';

import { updateAddress as updateAddressAction } from '@/actions/address';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { titles } from '@/constants/titles';
import { Address, addressSchema, AddressWithId } from '@/schemas/address';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { stepper } from './stepper/steps';

const { useStepper } = stepper;

type UpdateAddressFormProps = {
  address: AddressWithId;
  onClose: () => void;
  onPending: (isPending: boolean) => void;
};

export function UpdateAddressForm({
  address,
  onClose,
  onPending,
}: UpdateAddressFormProps) {
  const stepper = useStepper();
  const { mutate: updateAddress, isPending: isUpdatingAddress } = useMutation({
    mutationKey: ['update-address'],
    mutationFn: updateAddressAction,
    onMutate: () => {
      onPending(true);
      stepper.metadata.set('address', { isUpdatingAddress: true });
    },
    onSuccess: (data) => {
      toast.success('Address updated successfully!');
      stepper.metadata.set('address', data);
      onClose();
    },
    onError: () => {
      toast.error('Failed to update address. Please try again.');
    },
    onSettled: () => {
      onPending(false);
    },
  });

  const form = useForm<Address>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      ...address,
    },
  });

  const firstName = form.watch('firstName');

  function onSubmit(values: Address) {
    updateAddress({
      ...values,
      id: address.id,
    });
  }
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full justify-between gap-8"
    >
      <FieldGroup>
        <FieldSet>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <div className="grid gap-2 md:grid-cols-2">
                  <Controller
                    control={form.control}
                    name="title"
                    render={({ field: { onChange, onBlur, ...field }, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                        <Select {...field} onValueChange={onChange}>
                          <SelectTrigger
                            id={field.name}
                            onBlur={onBlur}
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Please select a title" />
                          </SelectTrigger>
                          <SelectContent>
                            {titles.map((title) => (
                              <SelectItem key={title.value} value={title.value}>
                                {title.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="firstName"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                        <Input
                          id={field.name}
                          {...field}
                          aria-invalid={fieldState.invalid}
                          autoComplete="given-name"
                        />

                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="lastName"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                        <Input
                          id={field.name}
                          {...field}
                          aria-invalid={fieldState.invalid}
                          autoComplete="family-name"
                        />

                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="phone"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Telephone</FieldLabel>
                        <Input
                          id={field.name}
                          {...field}
                          aria-invalid={fieldState.invalid}
                          autoComplete="tel"
                        />

                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="line1"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Address Line 1</FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        // placeholder="6th Street, 6th Street Tower"
                        aria-invalid={fieldState.invalid}
                        autoComplete="shipping address-line1"
                      />
                      <FieldDescription>
                        Primary address details, e.g: Street name, building name / Estate
                        name
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="line2"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Address Line 2</FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        // placeholder="Unit 111, 1st Floor"
                        aria-invalid={fieldState.invalid}
                        autoComplete="shipping address-line2"
                      />
                      <FieldDescription>
                        Additional address details, e.g., unit, floor / Gate, house no
                        etc.
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="area"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Area</FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        placeholder="Eg: Eastleigh, Westlands, Kahawa West, Utawala Nyali, Rongai, etc."
                        aria-invalid={fieldState.invalid}
                        autoCapitalize="on"
                        autoComplete="shipping address-level2"
                      />

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="landmark"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Landmark</FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        placeholder="Eg: Opposite Quickmart, Near BBS mall, etc."
                        aria-invalid={fieldState.invalid}
                        autoCapitalize="on"
                        autoComplete="shipping address-level2"
                      />
                      <FieldDescription>
                        Any famous location your address is near to.
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Controller
                    control={form.control}
                    name="postalCode"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Postal Code</FieldLabel>
                        <Input
                          id={field.name}
                          {...field}
                          //   placeholder="Eg: 00610"
                          aria-invalid={fieldState.invalid}
                          autoComplete="shipping postal-code"
                        />

                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />{' '}
                  <Controller
                    control={form.control}
                    name="city"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>City / Town</FieldLabel>
                        <Input
                          id={field.name}
                          {...field}
                          //   placeholder="Eg: Nairobi, Mombasa, etc."
                          aria-invalid={fieldState.invalid}
                          autoCapitalize="on"
                          autoComplete="shipping address-level2"
                        />

                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="county"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>County</FieldLabel>
                        <Input
                          id={field.name}
                          {...field}
                          //   placeholder="Eg: Nairobi, Mombasa, etc."
                          aria-invalid={fieldState.invalid}
                          autoCapitalize="on"
                          autoComplete="shipping address-level1"
                        />

                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="country"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Country</FieldLabel>
                        <Input
                          id={field.name}
                          {...field}
                          //   placeholder="Eg: Nairobi, Mombasa, etc."
                          aria-invalid={fieldState.invalid}
                          autoCapitalize="on"
                          autoComplete="shipping country-name"
                          disabled
                        />

                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend>Other Details</FieldLegend>
          <FieldDescription>Additional details for your delivery.</FieldDescription>
          <FieldGroup>
            <Controller
              control={form.control}
              name="label"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Label</FieldLabel>
                  <Input id={field.name} {...field} aria-invalid={fieldState.invalid} />
                  <FieldDescription>
                    Short name to identify this address. Eg: Home, Work, Shop, Warehouse,
                    Cargo.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="note"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Delivery Note</FieldLabel>
                  <Textarea
                    id={field.name}
                    {...field}
                    placeholder="Any special  instructions for delivery."
                    aria-invalid={fieldState.invalid}
                    className="resize-none"
                    rows={5}
                  />
                  <FieldDescription>
                    Eg: &quot;Call when you arrive&quot;,{' '}
                    {firstName && <span>&quot;Ask for {firstName}&quot;</span>}
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="isDefault"
              render={({ field: { onChange, value, ...field }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="hover:bg-accent/50 has-aria-invalid:border-destructive/70 flex items-start gap-3 rounded-lg border p-3 has-disabled:cursor-not-allowed"
                  >
                    <Checkbox
                      id={field.name}
                      {...field}
                      checked={value}
                      onCheckedChange={onChange}
                      aria-invalid={fieldState.invalid}
                    />
                    <div className="grid gap-1.5 font-normal">
                      <p className="text-sm leading-none font-medium">
                        Set as default address
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Use this address as your default for future orders.
                      </p>
                    </div>
                  </FieldLabel>
                  {false && (
                    <FieldDescription>
                      If there is no default address, this will be set as default
                      automatically.
                    </FieldDescription>
                  )}

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal" className="flex justify-end">
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" className="ml-auto" disabled={isUpdatingAddress}>
              {isUpdatingAddress && <Spinner />}
              {isUpdatingAddress ? 'Updating Address...' : 'Update Address'}
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
