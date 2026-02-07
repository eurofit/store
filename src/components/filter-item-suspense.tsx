import React, { Suspense } from 'react';
import { FilterItem } from './filter-item';

type FilterItemProps = React.ComponentProps<'div'> & {
  queryKey: string;
  item: {
    slug: string;
    title: string;
    count: number;
  };
};

function FilterItemFallback({ item }: { item: FilterItemProps['item'] }) {
  return (
    <div className="group flex items-start gap-2">
      <div className="h-4 w-4 animate-pulse rounded bg-muted" />
      <span className="text-sm text-muted-foreground">
        {item.title}&nbsp;({item.count})
      </span>
    </div>
  );
}

export function FilterItemSuspense(props: FilterItemProps) {
  return (
    <Suspense fallback={<FilterItemFallback item={props.item} />}>
      <FilterItem {...props} />
    </Suspense>
  );
}
