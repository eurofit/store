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
import { ProductFilterGroupVirtualizedList } from './products-filter-group-list';

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
              <ProductFilterGroupVirtualizedList queryKey={key} items={items} />
            </ProductFilterGroup>
          );
        })}
      </ProductFilterContent>
    </ProductFilter>
  );
}
