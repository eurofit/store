import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Brand } from '@/types';
import * as React from 'react';

type BrandsSelectProps = React.ComponentProps<typeof Select> & {
  brands: Brand[];
};
export function BrandsSelect({ brands, ...props }: BrandsSelectProps) {
  return (
    <Select {...props}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a brand" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Brands</SelectLabel>
          {brands.map((brand) => (
            <SelectItem key={brand.slug} value={brand.slug}>
              {brand.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
