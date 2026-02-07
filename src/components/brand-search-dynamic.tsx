'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from './ui/skeleton';

const BrandSearchComponent = dynamic(
  () => import('./brand-search').then((mod) => ({ default: mod.BrandSearch })),
  {
    loading: () => (
      <div className="relative w-full max-w-md">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    ),
    ssr: false,
  },
);

export function BrandSearchDynamic() {
  return <BrandSearchComponent />;
}
