'use client';

import dynamic from 'next/dynamic';

export const SearchSheetDynamic = dynamic(
  () => import('./search-sheet').then((mod) => ({ default: mod.SearchSheet })),
  {
    ssr: false,
  },
);
