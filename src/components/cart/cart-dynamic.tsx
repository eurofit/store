'use client';

import dynamic from 'next/dynamic';

export const CartDynamic = dynamic(() => import('./index').then((mod) => ({ default: mod.Cart })), {
  ssr: false,
});
