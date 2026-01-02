import { cn } from '@/utils/cn';
import * as React from 'react';

type LoaderProps = React.ComponentPropsWithRef<'div'>;

export function Loader({ className, ref, children }: LoaderProps) {
  return (
    <div
      ref={ref}
      aria-live="polite"
      className={cn(
        'text-muted-foreground flex items-center justify-center gap-2 text-sm select-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
