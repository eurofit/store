import { FilterGroup } from '@/types';
import { FunnelIcon } from 'lucide-react';
import { FilterClearButton, FilterGroupClearButton } from './filter-clear-button';
import { FilterItem } from './filter-item';
import {
  ProductFilter,
  ProductFilterContent,
  ProductFilterGroup,
  ProductFilterGroupContent,
  ProductFilterGroupList,
  ProductFilterGroupListItem,
  ProductFilterGroupTitle,
  ProductFilterHeader,
  ProductFilterTitle,
} from './product-filters';

type BrandFiltersProps = {
  getFilters: (...args: any) => Promise<FilterGroup[]>;
};
export async function ProductFilters({ getFilters }: BrandFiltersProps) {
  const filters = await getFilters();

  return (
    <ProductFilter>
      <ProductFilterHeader>
        <ProductFilterTitle>
          <FunnelIcon />
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
                  <span className="text-muted-foreground text-xs lining-nums">
                    ({items.length})
                  </span>
                </div>
                <FilterGroupClearButton queryKey={key} />
              </ProductFilterHeader>
              <ProductFilterGroupContent>
                <ProductFilterGroupList>
                  {items.map((item) => (
                    <ProductFilterGroupListItem
                      key={`filter-group-${key}-item-${item.slug}`}
                    >
                      <FilterItem queryKey={key} {...item} />
                    </ProductFilterGroupListItem>
                  ))}
                </ProductFilterGroupList>
              </ProductFilterGroupContent>
            </ProductFilterGroup>
          );
        })}
      </ProductFilterContent>
    </ProductFilter>
  );
}
