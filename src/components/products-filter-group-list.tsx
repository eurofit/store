"use client"

import { FilterItem as TFilterItem } from "@/types"
import { FilterItem } from "./filter-item"
import { ScrollArea } from "./ui/scroll-area"

type VirtualizedProductFilterListProps = {
  key: string
  items: TFilterItem[]
}

export function ProductFilterGroupVirtualizedList({
  key,
  items,
}: VirtualizedProductFilterListProps) {
  return (
    <ScrollArea className="h-72">
      <div className="pr-4 space-y-2">
        {items.map((item) => (
          <FilterItem key={item.slug} queryKey={key} item={item} />
        ))}
      </div>
    </ScrollArea>
  )
}
