'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

type DatePickerProps = {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  formattedValue?: string;
};

export function DatePicker({
  value,
  defaultValue,
  formattedValue,
  onChange,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    onChange?.(date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-48 justify-between font-normal">
          {formattedValue
            ? formattedValue
            : value
              ? format(value, 'dd/MM/yyyy')
              : 'Select date'}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value ?? defaultValue}
          captionLayout="dropdown"
          onSelect={handleDateChange}
        />
      </PopoverContent>
    </Popover>
  );
}
