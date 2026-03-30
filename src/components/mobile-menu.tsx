import { getNav } from '@/actions/get-nav';
import { Menu } from 'lucide-react';
import { MobileMenuClient } from './mobile-menu.client';
import { Button } from './ui/button';

export async function MenuSheet() {
  const nav = await getNav();

  return <MobileMenuClient items={nav} />;
}

export function MenuSheetSkeleton() {
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      className="animate-pulse md:hidden"
      disabled
      aria-label="Loading menu"
    >
      <span className="sr-only">Mobile menu</span>
      <Menu className="size-5.5" aria-hidden="true" />
    </Button>
  );
}
