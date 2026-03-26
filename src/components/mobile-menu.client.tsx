'use client';

import { usePreventScroll } from '@/hooks/use-prevent-scroll';
import { useToggle } from '@/hooks/use-toggle';
import { Nav } from '@/payload/types';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

type MobileMenuClientProps = {
  items: Nav['items'];
};

export function MobileMenuClient({ items }: MobileMenuClientProps) {
  const { value: isOpen, toggle } = useToggle();

  usePreventScroll({ isDisabled: !isOpen });

  return (
    <>
      <Button
        variant="ghost"
        size="icon-lg"
        className="-mt-px animate-pulse md:hidden"
        onClick={toggle}
        aria-label="Toggle menu"
      >
        {isOpen && (
          <>
            <span className="sr-only">Close Mobile menu</span>
            <X className="size-5.5" aria-hidden="true" />
          </>
        )}
        {!isOpen && (
          <>
            <span className="sr-only">Open Mobile menu</span>
            <Menu className="size-5.5" aria-hidden="true" />
          </>
        )}
      </Button>

      {isOpen && (
        <div
          className="absolute top-20 h-[calc(100vh-5rem)] w-full bg-black/50 supports-backdrop-filter:backdrop-blur-xs md:hidden"
          onClick={toggle}
        >
          <div className="bg-popover text-popover-foreground p-4">
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.url}
                    className="block rounded px-4 py-2 hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
