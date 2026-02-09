'use client';

import { Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';

export const BrandSearchDynamic = dynamic(
  () => import('./brand-search').then((mod) => mod.BrandSearch),
  {
    loading: () => (
      <div className="relative w-full max-w-md">
        <InputGroup className="bg-background">
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            placeholder="Search brands…"
            autoComplete="off"
            disabled
          />
        </InputGroup>
      </div>
    ),
    ssr: false,
  },
);
