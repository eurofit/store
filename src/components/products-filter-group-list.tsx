'use client';

import { FilterItem as TFilterItem } from '@/types';
import { FilterItem } from './filter-item';
import { ScrollArea } from './ui/scroll-area';

type VirtualizedProductFilterListProps = {
  queryKey: string;
  items: TFilterItem[];
};

export function ProductFilterGroupVirtualizedList({
  queryKey: key,
  items,
}: VirtualizedProductFilterListProps) {
  return (
    <ScrollArea className="h-72">
      <div className="space-y-2 pr-4">
        {items.map((item) => (
          <FilterItem key={item.slug} queryKey={key} item={item} />
        ))}
      </div>
    </ScrollArea>
  );
}
