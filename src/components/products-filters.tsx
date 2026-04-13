import {
  FilterClearButton,
  FilterGroupClearButton,
} from '@/components/filter-clear-button';
import {
  ProductFilter,
  ProductFilterContent,
  ProductFilterGroup,
  ProductFilterGroupTitle,
  ProductFilterHeader,
  ProductFilterTitle,
} from '@/components/product-filters';
import { FilterGroup } from '@/types';
import { FunnelIcon } from 'lucide-react';
import { FilterItem } from './filter-item';
import { ScrollArea } from './ui/scroll-area';

type BrandFiltersProps = {
  getFilters: (...args: any) => Promise<FilterGroup[]>;
};
export async function ProductFilters({ getFilters }: BrandFiltersProps) {
  const filters = await getFilters();

  if (filters.length === 0) {
    return null;
  }

  return (
    <ProductFilter>
      <ProductFilterHeader>
        <ProductFilterTitle>
          <FunnelIcon aria-hidden="true" />
          <h2>Filter By</h2>
        </ProductFilterTitle>
        <FilterClearButton keys={['brand', 'category', 'size', 'flavour-colour']} />
      </ProductFilterHeader>
      <ProductFilterContent>
        {filters.map(({ key, title, items }) => {
          return (
            <ProductFilterGroup key={`filter-group-${key}`}>
              <ProductFilterHeader>
                <div className="flex items-center">
                  <ProductFilterGroupTitle>{title}</ProductFilterGroupTitle>
                  &nbsp;
                  <span className="text-muted-foreground font-variant-numeric-tabular-nums text-xs">
                    ({items.length})
                  </span>
                </div>
                <FilterGroupClearButton queryKey={key} />
              </ProductFilterHeader>
              <ScrollArea className="flex max-h-72 flex-col overflow-y-auto">
                <div className="space-y-2 pr-2">
                  {items.map((item) => (
                    <FilterItem key={item.slug} queryKey={key} item={item} />
                  ))}
                </div>
              </ScrollArea>
            </ProductFilterGroup>
          );
        })}
      </ProductFilterContent>
    </ProductFilter>
  );
}
