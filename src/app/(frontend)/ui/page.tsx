'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useVirtualizer } from '@tanstack/react-virtual';
import * as React from 'react';

export default function Page() {
  const ref = React.useRef<HTMLDivElement>(null!);

  const items = Array(2000)
    .fill(0)
    .map((_, i) => `Item ${i + 1}`);

  // TanStack Virtual's hook returns functions React Compiler can't memoize safely.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => ref.current,
    estimateSize: () => 32,
    overscan: 10,
  });

  return (
    <div className="w-scr een relative flex min-h-screen items-center justify-center gap-10 bg-gray-700">
      <ScrollArea
        viewportRef={ref}
        className="relative h-96 w-64 overflow-auto border border-gray-300 bg-white"
      >
        <ul
          className="space-y-2 bg-red-300 p-4"
          style={{
            position: 'relative',
            height: virtualizer.getTotalSize(),
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const item = items[virtualRow.index]!;
            return (
              <div
                ref={virtualizer.measureElement}
                key={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                  borderBottom: '1px solid blue',
                }}
              >
                {item}
              </div>
            );
          })}
          {/* {items.map((item) => (
            <li
              key={item}
              className="bg-gray-200 h-8 rounded-md flex items-center justify-center text-black "
            >
              {item}
            </li>
          ))} */}
        </ul>
      </ScrollArea>
    </div>
  );
}
