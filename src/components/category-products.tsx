import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getProductsByCategory } from '@/actions/categories/get-products-by-category';
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
import { ProductSort } from './product-sort';

type CategoryProductsListProps = {
  slug: Promise<string>;
  searchParams: Promise<{
    page: number;
    brand: string[];
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

export async function CategoryProducts({
  slug: slugPromise,
  searchParams: searchParamsPromise,
}: CategoryProductsListProps) {
  const [slug, searchParams, user] = await Promise.all([
    slugPromise,
    searchParamsPromise,
    getCurrentUser(),
  ]);

  const { page, brand, sort, size, flavourColour } = searchParams;

  const { products, totalProducts, totalPages, hasNextPage, hasPrevPage } =
    await getProductsByCategory({
      slug,
      page,
      limit: PRODUCTS_PER_PAGE,
      brand,
      sort,
      size,
      flavourColour,
    });

  if (!totalProducts) {
    return <EmptyProducts />;
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex min-h-8 items-center gap-6">
        <ProductSort
          className="ml-auto"
          options={PRODUCT_SORT_OPTIONS}
          defaultValue={sort == 'asc' ? 'asc' : 'desc'}
        />
        <span className="text-sm">
          {totalProducts} {pluralize('Product', totalProducts)} found
        </span>
      </div>

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
                <PaginationLink href={`?page=${index + 1}`} isActive={page === index + 1}>
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
  );
}
