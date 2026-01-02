'use client';

import { usePreventScroll } from '@/hooks/use-prevent-scroll';
import React from 'react';

type PreventScrollProps = React.PropsWithChildren<{}>;

export function PreventScroll({ children }: PreventScrollProps) {
  usePreventScroll();
  return children;
}
