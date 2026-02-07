import { getCurrentUser } from '@/actions/auth/get-current-user';

import { getProducts } from '@/actions/products/get-products';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import pluralize from 'pluralize-esm';
import { EmptyProducts } from './empty-products';
import { ProductCard } from './product-card';
import { ProductSortSuspense } from './product-sort-suspense';

type ProductsListProps = {
  searchParams: Promise<{
    page: number;
    brand: string[];
    category: string[];
    sort: string;
    size: string[];
    flavourColour: string[];
  }>;
};

const PRODUCTS_PER_PAGE = 15;

const PRODUCT_SORT_OPTIONS = [
  { label: 'Product Name: A-Z', value: 'asc' },
  { label: 'Product Name: Z-A', value: 'desc' },
];

export async function Products({ searchParams: searchParamsPromise }: ProductsListProps) {
  const [searchParams, user] = await Promise.all([searchParamsPromise, getCurrentUser()]);

  const { page, brand, category, sort, size, flavourColour } = searchParams;

  const { products, totalProducts, totalPages, hasNextPage } = await getProducts({
    page,
    limit: PRODUCTS_PER_PAGE,
    brand,
    category,
    sort,
    size,
    flavourColour,
  });

  if (totalProducts === 0) {
    return <EmptyProducts />;
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-6">
        <ProductSortSuspense
          className="ml-auto"
          options={PRODUCT_SORT_OPTIONS}
          defaultValue={sort == 'asc' ? 'asc' : 'desc'}
        />
        <span className="text-sm">
          {totalProducts} {pluralize('Product', totalProducts)} found
        </span>
      </div>
      <div className="space-y-10">
        <section id="brand-products-list" className="grid gap-8 md:gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} userId={user?.id} />
          ))}
        </section>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={page ? `?page=${page - 1}` : undefined} />
            </PaginationItem>
            {Array(totalPages)
              .fill(null)
              .map((_, index) => (
                <PaginationItem key={`page-${index + 1}`}>
                  <PaginationLink
                    href={`?page=${index + 1}`}
                    isActive={page === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            <PaginationItem>
              <PaginationNext href={hasNextPage ? `?page=${page + 1}` : undefined} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
