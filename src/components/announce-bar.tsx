'use client';

import { ComponentPropsWithoutRef } from 'react';

type AnnounceBarProps = {} & ComponentPropsWithoutRef<'div'>;

export function AnnounceBar({ className }: AnnounceBarProps) {
  return (
    <div className="bg-foreground text-background flex h-7 items-center justify-center px-6">
      <p className="text-sm capitalize">Note: This Site is under construction.</p>
    </div>
  );
}
