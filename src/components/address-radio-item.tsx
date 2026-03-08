import {
  deleteAddress as deleteAddressAction,
  setDefaultAddress as setDefaultAddressAction,
} from '@/actions/address';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddressId, AddressWithId } from '@/schemas/address';
import { useMutation } from '@tanstack/react-query';
import parsePhoneNumber from 'libphonenumber-js';
import { Check, Edit, MoreHorizontal, Trash } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { RadioGroupItem } from './ui/radio-group';

type AddressRadioItemProps = {
  address: AddressWithId;
  onSetAddress: (id: AddressId['id']) => void;
  onEditAddress: (id: AddressId['id']) => void;
} & React.ComponentProps<typeof RadioGroupItem>;

export function AddressRadioItem({
  address,
  value,
  onSetAddress,
  onEditAddress,
  ...props
}: AddressRadioItemProps) {
  const phoneNumber = parsePhoneNumber(address.phone, 'KE');

  const { mutateAsync: deleteAddress, isPending: isDeletingAddress } = useMutation({
    mutationKey: ['delete-address'],
    mutationFn: deleteAddressAction,
  });

  const { mutateAsync: setDefaultAddress, isPending: isSettingDefaultAddress } =
    useMutation({
      mutationKey: ['set-default-address'],
      mutationFn: setDefaultAddressAction,
      onSuccess: () => {
        onSetAddress(address.id);
      },
    });

  const handleDeleteAddress = () => {
    toast.promise(deleteAddress({ id: address.id }), {
      loading: 'Deleting address...',
      success: 'Address deleted successfully!',
      error: 'Failed to delete address. Please try again.',
    });
  };

  const handleSetDefaultAddress = () => {
    toast.promise(setDefaultAddress({ id: address.id }), {
      loading: 'Setting default address...',
      success: 'Address set as default successfully!',
      error: 'Failed to set address as default. Please try again.',
    });
  };
  return (
    <div className="hover:bg-accent/50 has-aria-invalid:border-destructive/70 flex w-full grow items-start gap-3 rounded-lg border p-3 transition-colors duration-200 has-disabled:cursor-not-allowed has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 md:max-w-xs">
      <RadioGroupItem value={value} {...props} />
      <div className="grid w-full gap-1.5 font-normal">
        <div className="flex w-full items-center gap-2">
          <p className="text-sm leading-none">
            {address.firstName} {address.lastName}
          </p>

          <div className="ml-auto flex items-center gap-2">
            {address.isDefault && (
              <Badge className="bg-green-50 text-green-700">Default</Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => onEditAddress(address.id)}>
                  <Edit />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSetDefaultAddress}
                  disabled={isSettingDefaultAddress}
                >
                  <Check />
                  Set as Default
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleDeleteAddress}
                  disabled={isDeletingAddress}
                >
                  <Trash />
                  Delete Address
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="text-muted-foreground text-sm">
          <p className="line-clamp-1">{address.line1}</p>
          <p className="line-clamp-1">
            {address.city}, {address.country}
          </p>
          <p className="line-clamp-1">{phoneNumber?.formatInternational()}</p>
        </div>
      </div>
    </div>
  );
}
