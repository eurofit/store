'use client';

import * as React from 'react';

type SearchContentProps = React.ComponentProps<'div'> & {
  isOpen: boolean;
};

export function SearchContent({ isOpen, ...props }: SearchContentProps) {
  if (!isOpen) return null;
  return (
    <div
      data-open={isOpen}
      {...props}
      className="bg-popover data-open:animate-in data-[open=false]:zoom-out-95 data-[state=false]:fade-out-0 data-[open=false]:animate-out text-popover-foreground absolute top-full right-0 left-0 z-9999 mt-2 overflow-hidden overscroll-contain rounded-md border shadow-lg"
    />
  );
}
