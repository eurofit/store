'use client';

import { cn } from '@/utils/cn';
import RCountdown, { CountdownProps, zeroPad } from 'react-countdown';

export function Countdown({ date, className, ...props }: CountdownProps) {
  return (
    <RCountdown
      date={date}
      {...props}
      renderer={({ days, hours, minutes, seconds, completed }) => {
        const d = days > 0 ? `${zeroPad(days)}d : ` : '';
        const h = hours > 0 ? `${zeroPad(hours)}h : ` : '00h : ';
        const m = minutes > 0 ? `${zeroPad(minutes)}m : ` : '00m : ';
        const s = seconds > 0 ? `${zeroPad(seconds)}s` : '00s';

        const time = `${d}${h}${m}${s}`;

        return (
          <time
            dateTime={date.toString()}
            className={cn('inline w-44 font-bold tabular-nums', className)}
          >
            {time}
          </time>
        );
      }}
    />
  );
}
