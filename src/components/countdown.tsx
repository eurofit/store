'use client';

import { useCountdown } from '@/hooks/use-countdown';
import { useMounted } from '@/hooks/use-mounted';
import * as React from 'react';

type CountdownProps = {
  end: string;
  format?: string;
} & React.ComponentProps<'time'>;

export function Countdown({ end, ...props }: CountdownProps) {
  const timeLeft = useCountdown({ end });

  const totalSeconds = Math.max(0, Math.floor(timeLeft / 1000));

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // TODO: remove the server - clint hydration mismatch by rendering a placeholder on the server and the actual countdown on the client
  const isMounted = useMounted();

  if (!isMounted()) {
    return (
      <time dateTime={end} {...props}>
        --h : --m : --s
      </time>
    );
  }

  const time = `${days > 0 ? `${String(days).padStart(2, '0')}d : ` : ''}${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`;

  return (
    <time dateTime={end} {...props}>
      {time}
    </time>
  );
}
