'use client';

import { useStockAlert } from '@/hooks/use-stock-alert';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';

type NotifyMeButtonProps = {
  productLineId: string;
  userId?: string | null;
  isNotifyRequested: boolean;
} & React.ComponentProps<typeof Button>;

export function NotifyMeButton({
  productLineId,
  userId,
  isNotifyRequested,
}: NotifyMeButtonProps) {
  const [isRequested, setIsRequested] = React.useState(isNotifyRequested);
  const { mutate: createStockAlert, isPending } = useStockAlert({
    onSuccess: (isRequested) => setIsRequested(isRequested),
  });

  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!userId) {
    const nextUrl = `${pathname}${searchParams ? `?${searchParams.toString()}` : ''}`;

    return (
      <Button variant="outline" asChild>
        <Link
          href={`/login?next=${nextUrl}`}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Notify Me
        </Link>
      </Button>
    );
  }

  const handleClick = () =>
    createStockAlert({
      userId,
      productLineId,
    });

  return (
    <Button
      variant={false ? 'default' : 'outline'}
      size="sm"
      draggable={false}
      className={cn('text-xs select-none', {
        'bg-green-600 text-white hover:bg-green-700': isRequested,
        'border-gray-300 text-gray-700 hover:bg-gray-50': !isRequested,
      })}
      onClick={handleClick}
      disabled={isRequested || isPending}
    >
      {isPending && <Spinner />}
      {!isPending && isRequested && 'Will be Notified'}
      {!isPending && !isRequested && 'Notify me'}
    </Button>
  );
}
