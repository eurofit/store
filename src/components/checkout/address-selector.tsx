'use client';

import { AddressRadioItem } from '@/components/address-radio-item';
import { stepper } from '@/components/checkout/stepper/steps';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { RadioGroup } from '@/components/ui/radio-group';
import { AddressId, addressIdSchema, AddressWithId } from '@/schemas/address';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const { useStepper } = stepper;

type AddressSelectorProps = {
  addresses: AddressWithId[];
  onEditAddress: (id: AddressId['id']) => void;
};

export function AddressSelector({ addresses, onEditAddress }: AddressSelectorProps) {
  const stepper = useStepper();

  const addressForm = useForm<AddressId>({
    resolver: zodResolver(addressIdSchema),
    defaultValues: {
      id: addresses[0]?.id ?? '',
    },
  });

  function handleAddressSelect({ id }: AddressId) {
    const address = addresses.find((address) => address?.id === id);
    if (!address) {
      toast.error('Address not found');
      return;
    }
    stepper.metadata.set('address', address);
    stepper.navigation.next();
  }

  return (
    <form onSubmit={addressForm.handleSubmit(handleAddressSelect)}>
      <FieldGroup>
        <Controller
          control={addressForm.control}
          name="id"
          render={({ field, fieldState }) => (
            <Field>
              <RadioGroup
                {...field}
                onValueChange={field.onChange}
                data-invalid={fieldState.invalid}
                defaultValue={addresses[0].id}
                className="grid gap-2 md:grid-cols-2"
              >
                {addresses.map((address) => (
                  <FieldLabel key={address.id}>
                    <AddressRadioItem
                      id={address.id}
                      value={address.id}
                      address={address}
                      onSetAddress={(val) => addressForm.setValue('id', val)}
                      aria-invalid={fieldState.invalid}
                      onEditAddress={onEditAddress}
                    />
                  </FieldLabel>
                ))}
              </RadioGroup>
            </Field>
          )}
        />
        <Field orientation="horizontal">
          <Button type="submit" className="ml-auto">
            Next: Review
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
