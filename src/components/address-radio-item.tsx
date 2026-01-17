import { AddressWithId } from '@/schemas/address';
import parsePhoneNumber from 'libphonenumber-js';
import React from 'react';
import { Badge } from './ui/badge';
import { RadioGroupItem } from './ui/radio-group';

type AddressRadioItemProps = {
  address: AddressWithId;
} & React.ComponentProps<typeof RadioGroupItem>;

export function AddressRadioItem({ address, value, ...props }: AddressRadioItemProps) {
  const phoneNumber = parsePhoneNumber(address.phone, 'KE');
  return (
    <div className="hover:bg-accent/50 has-aria-invalid:border-destructive/70 flex items-start gap-3 rounded-lg border p-3 transition-colors duration-200 has-disabled:cursor-not-allowed has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50">
      <RadioGroupItem value={value} {...props} />
      <div className="grid gap-1.5 font-normal">
        <div className="flex items-center gap-2">
          <p className="text-sm leading-none font-medium">
            {address.firstName} {address.lastName}
          </p>

          {address.isDefault && <Badge>Default</Badge>}
          {address.label && <Badge variant="secondary">{address.label}</Badge>}
        </div>
        <div>
          <p className="text-muted-foreground text-sm">{address.line1}</p>
          <p className="text-muted-foreground text-sm">
            {address.city}, {address.country}
          </p>
          <p className="text-muted-foreground text-sm">
            {phoneNumber?.formatInternational()}
          </p>
        </div>
      </div>
    </div>
  );
}
