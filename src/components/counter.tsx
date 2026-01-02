'use client';

import { cn } from '@/utils/cn';
import { ComponentProps, useEffect, useState } from 'react';

type CounterProps = {
  startDate: Date | string | number;
  endDate: Date | string | number;
  down?: boolean;
  onComplete?: () => void;
} & ComponentProps<'div'>;

export function Counter({
  startDate,
  endDate,
  down = true,
  onComplete,
  className,
}: CounterProps) {
  const [timeValues, setTimeValues] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isComplete, setIsComplete] = useState<boolean>(false);

  if (isComplete) return;

  useEffect(() => {
    // Convert inputs to timestamps
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    // Validate dates
    if (isNaN(start) || isNaN(end)) {
      console.error('Invalid date provided to SimpleCounter component');
      return;
    }

    const calculateTime = () => {
      const now = new Date().getTime();

      // Calculate time difference based on direction
      let difference: number;

      if (down) {
        // Counting down: time remaining until end date
        difference = end - now;
      } else {
        // Counting up: time elapsed since start date
        difference = now - start;

        // Cap at end date for count up
        if (now > end) {
          difference = end - start;
        }
      }

      // Check if counter is complete
      const isComplete = down ? difference <= 0 : now >= end;

      if (isComplete) {
        if (onComplete) {
          onComplete();
        }

        setIsComplete(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      // Calculate time units
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    // Initial calculation
    setTimeValues(calculateTime());

    // Update every second
    const timer = setInterval(() => {
      const updatedTime = calculateTime();
      setTimeValues(updatedTime);

      // Check if complete to clear interval
      const now = new Date().getTime();
      const isComplete = down ? end - now <= 0 : now >= end;

      if (isComplete) {
        clearInterval(timer);
      }
    }, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, [startDate, endDate, down, onComplete]);

  // Format number to always have two digits
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className={cn('', className)}>
      {timeValues.days > 0 && <span>{formatNumber(timeValues.days)}d : </span>}
      {timeValues.hours > 0 && <span>{formatNumber(timeValues.hours)}h : </span>}
      {timeValues.minutes > 0 && <span>{formatNumber(timeValues.minutes)}m : </span>}
      {timeValues.seconds > 0 && <span>{formatNumber(timeValues.seconds)}s</span>}
    </div>
  );
}
