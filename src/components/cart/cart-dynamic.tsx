'use client';

import dynamic from 'next/dynamic';
import { CartSkeleton } from './index';

export const CartDynamic = dynamic(() => import('./index').then((mod) => mod.Cart), {
  ssr: false,
  loading: () => <CartSkeleton />,
});
