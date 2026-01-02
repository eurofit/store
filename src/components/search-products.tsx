import { getCurrentUser } from '@/actions/auth/get-current-user';
import { searchProducts } from '@/actions/products/search-products';
import { notFound } from 'next/navigation';
import PaginatedSearchProducts from './paginated-search-products';
import { ProductSort } from './product-sort';

type SearchProductsListProps = {
  searchParams: Promise<{
    q?: string;
    page: number;
    brand?: string[];
    category: string[];
    sort: string;
    size: string[];
    flavourColour: string[];
  }>;
};

const PRODUCTS_PER_PAGE = 20;

const PRODUCT_SORT_OPTIONS = [
  { label: 'Product Name: A-Z', value: 'asc' },
  { label: 'Product Name: Z-A', value: 'desc' },
];

export async function SearchProducts({
  searchParams: searchParamsPromise,
}: SearchProductsListProps) {
  const [searchParams, user] = await Promise.all([searchParamsPromise, getCurrentUser()]);

  const { q, page, brand, category, sort, size, flavourColour } = searchParams;

  if (!q) {
    notFound();
  }

  const { products, totalProducts } = await searchProducts(q, {
    page,
    limit: page > 1 ? page * PRODUCTS_PER_PAGE : PRODUCTS_PER_PAGE,
    sort,
    brand,
    category,
    size,
    flavourColour,
  });

  return (
    <div className="flex flex-col">
      <hgroup className="mb-10">
        <span className="text-muted-foreground text-sm">
          Showing {totalProducts} products for
        </span>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
          &quot;{q}&quot;
        </h1>
      </hgroup>
      <div className="mb-6 flex min-h-8 items-center gap-6">
        <ProductSort
          className="ml-auto"
          options={PRODUCT_SORT_OPTIONS}
          defaultValue={sort == 'asc' ? 'asc' : 'desc'}
        />
        <span className="text-sm lining-nums">
          {totalProducts} Product{totalProducts !== 1 ? 's' : ''}
        </span>
      </div>
      {/* <pre>{JSON.stringify(products, null, 2)}</pre> */}
      <PaginatedSearchProducts
        key={[totalProducts, category, sort, size, flavourColour].join('-')}
        query={q}
        initialProducts={products}
        totalProducts={totalProducts}
        userId={user?.id ?? null}
      />
    </div>
  );
}
