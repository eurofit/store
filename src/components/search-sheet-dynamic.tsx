'use client';

import dynamic from 'next/dynamic';
import { SearchSheetSkeleton } from './search-sheet';

export const SearchSheetDynamic = dynamic(
  () => import('./search-sheet').then((mod) => ({ default: mod.SearchSheet })),
  {
    ssr: false,
    loading: () => <SearchSheetSkeleton />,
  },
);
