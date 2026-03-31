'use client';

import * as React from 'react';

type CountdownProps = {
  end: string;
};

export function useCountdown({ end }: CountdownProps) {
  const [timeLeft, setTimeLeft] = React.useState(new Date(end).getTime() - Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const endDate = new Date(end).getTime();
      setTimeLeft(endDate - now);
    }, 1000);
    return () => clearInterval(interval);
  }, [end]);

  return timeLeft;
}
