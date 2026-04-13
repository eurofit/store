import { Logo } from '@/components/logo';
import { Nav, NavSkeleton } from '@/components/nav';
import { SearchBar, SearchBarSkeleton } from '@/components/searchbar';
import * as React from 'react';
import { UserButton, UserButtonSkeleton } from './auth/user-button';
import { CartDynamic } from './cart/cart-dynamic';
import { MenuSheet, MenuSheetSkeleton } from './mobile-menu';
import { SearchSheetDynamic } from './search-sheet-dynamic';

export function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 h-30 space-y-2 gap-x-6 border-b p-4 pb-3 md:h-16 md:px-6">
      <div className="relative flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <React.Suspense fallback={<MenuSheetSkeleton />}>
            <MenuSheet />
          </React.Suspense>
          <Logo />
        </div>
        <React.Suspense fallback={<NavSkeleton />}>
          <Nav />
        </React.Suspense>
        <div className="ml-auto flex flex-1 items-center justify-end gap-x-3">
          <React.Suspense fallback={<SearchBarSkeleton />}>
            <SearchBar />
          </React.Suspense>
          <React.Suspense fallback={<UserButtonSkeleton />}>
            <UserButton />
          </React.Suspense>
          <CartDynamic />
        </div>
      </div>
      <SearchSheetDynamic />
    </header>
  );
}
