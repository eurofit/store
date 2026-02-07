'use client';

import { XCircle } from 'lucide-react';

export function SearchResultError() {
  return (
    <div className="flex flex-col space-y-2 p-8 text-center">
      <div className="mx-auto flex items-center gap-2">
        <XCircle className="text-destructive size-4" />
        <p className="text-muted-foreground text-sm">Something went wrong</p>
      </div>
      <p className="text-muted-foreground mt-1 text-xs">
        An error occurred while searching. Please try again.
      </p>
    </div>
  );
}
