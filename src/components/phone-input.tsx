'use client';

import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import PhoneNumberInput, {
  getCountryCallingCode,
  type Country,
  type FlagProps,
  type Value,
} from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/utils/cn';

/* -------------------------------- */
/* Types */
/* -------------------------------- */

type PhoneInputProps = Omit<React.ComponentProps<typeof PhoneNumberInput>, 'onChange'> & {
  ref?: React.Ref<React.ComponentRef<typeof PhoneNumberInput>>;
  onChange?: (value: Value) => void;
};

/* -------------------------------- */
/* Phone Input*/
/* -------------------------------- */

export function PhoneInput({
  className,
  onChange,
  value,
  ref,
  ...props
}: PhoneInputProps) {
  return (
    <PhoneNumberInput
      ref={ref}
      className={cn('flex', className)}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={InputComponent}
      smartCaret={false}
      value={value ?? undefined}
      onChange={(value) => onChange?.(value ?? ('' as Value))}
      {...props}
    />
  );
}

/* -------------------------------- */
/* Input Component */
/* -------------------------------- */

function InputComponent({
  className,
  ...props
}: React.ComponentProps<'input'> & {
  ref?: React.Ref<HTMLInputElement>;
}) {
  return <Input className={cn('rounded-s-none rounded-e-lg', className)} {...props} />;
}

/* -------------------------------- */
/* Country Select */
/* -------------------------------- */

type CountryEntry = {
  label: string;
  value: Country | undefined;
};

type CountrySelectProps = {
  disabled?: boolean;
  value: Country;
  options: CountryEntry[];
  onChange: (country: Country) => void;
};

function CountrySelect({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover
      open={isOpen}
      modal
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) setSearchValue('');
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex gap-1 rounded-s-lg rounded-e-none border-r-0 px-3 focus:z-10"
          disabled={disabled}
        >
          <FlagComponent country={selectedCountry} countryName={selectedCountry} />
          <ChevronsUpDown
            className={cn('-mr-2 size-4 opacity-50', disabled && 'hidden')}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            value={searchValue}
            onValueChange={(value) => {
              setSearchValue(value);

              requestAnimationFrame(() => {
                const viewport = scrollAreaRef.current?.querySelector(
                  '[data-radix-scroll-area-viewport]',
                );
                if (viewport) {
                  (viewport as HTMLElement).scrollTop = 0;
                }
              });
            }}
            placeholder="Search country..."
          />

          <CommandList>
            <ScrollArea ref={scrollAreaRef} className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>

              <CommandGroup>
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={selectedCountry}
                      onChange={onChange}
                      onSelectComplete={() => setIsOpen(false)}
                    />
                  ) : null,
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/* -------------------------------- */
/* Country Option */
/* -------------------------------- */

interface CountrySelectOptionProps extends FlagProps {
  selectedCountry: Country;
  onChange: (country: Country) => void;
  onSelectComplete: () => void;
}

function CountrySelectOption({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete,
}: CountrySelectOptionProps) {
  const handleSelect = () => {
    onChange(country);
    onSelectComplete();
  };

  return (
    <CommandItem className="gap-2" onSelect={handleSelect}>
      <FlagComponent country={country} countryName={countryName} />

      <span className="flex-1 text-sm">{countryName}</span>

      <span className="text-foreground/50 text-sm">
        +{getCountryCallingCode(country)}
      </span>

      <CheckIcon
        className={cn(
          'ml-auto size-4',
          country === selectedCountry ? 'opacity-100' : 'opacity-0',
        )}
      />
    </CommandItem>
  );
}

/* -------------------------------- */
/* Flag Component */
/* -------------------------------- */

function FlagComponent({ country, countryName }: FlagProps) {
  const Flag = flags[country];

  return (
    <span className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
}
