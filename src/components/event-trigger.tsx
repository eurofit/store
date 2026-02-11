'use client';

import { createEvent, type EventInput } from '@/actions/events/create';
import { useEffect } from 'react';

type EventTriggerProps = {
  event: EventInput;
};

export function EventTrigger({ event }: EventTriggerProps) {
  useEffect(() => {
    createEvent(event);
  }, [event]);

  return null;
}
