import * as React from 'react';

import { Logo } from '@/components/logo';
import { Nav, NavSkeleton } from '@/components/nav';
import { SearchBar } from '@/components/searchbar';

import { UserButton, UserButtonSkeleton } from './auth/user-button';
import { Cart } from './cart/cart';
import { SearchSheet } from './search-sheet';

export function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 flex h-20 items-center justify-between gap-x-6 border-b px-6 md:h-16">
      <Logo />
      <React.Suspense fallback={<NavSkeleton />}>
        <Nav />
      </React.Suspense>
      <div className="ml-auto flex flex-1 items-center justify-end gap-x-3">
        <React.Suspense fallback={<div className="flex-1" />}>
          <SearchBar />
        </React.Suspense>

        <SearchSheet />

        <React.Suspense fallback={<UserButtonSkeleton />}>
          <UserButton />
        </React.Suspense>

        <Cart />

        {/* <Button className="md:hidden" variant="outline" size="icon">
          <Menu />
        </Button> */}
      </div>
    </header>
  );
}
