import { getNav } from '@/actions/get-nav';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

export async function MenuSheet() {
  const nav = await getNav();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <span className="sr-only">Mobile menu</span>
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" style={{ overscrollBehavior: 'contain' }}>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="space-y-2 p-6">
          {nav.map(({ label, url }) => (
            <Link key={url} href={url} className="block py-2 text-lg font-medium">
              {label}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
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
