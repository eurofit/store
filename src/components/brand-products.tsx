import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getProductsByBrand } from '@/actions/products/get-products-by-brand';
import { EmptyProducts } from './empty-products';
import PaginatedBrandProducts from './paginated-brand-products';
import { ProductSort } from './product-sort';

type BrandProductsListProps = {
  slug: Promise<string>;
  pathname?: string;
  searchParams: Promise<{
    page: number;
    category: string[];
    sort: string;
    size: string[];
    flavourColour: string[];
  }>;
};

const PRODUCTS_PER_PAGE = 20;
const DEFAULT_PAGE = 1;

const PRODUCT_SORT_OPTIONS = [
  { label: 'Product Name: A-Z', value: 'asc' },
  { label: 'Product Name: Z-A', value: 'desc' },
];

export async function BrandProducts({
  slug: slugPromise,
  pathname = '/brands',
  searchParams: searchParamsPromise,
}: BrandProductsListProps) {
  const [slug, searchParams, user] = await Promise.all([
    slugPromise,
    searchParamsPromise,
    getCurrentUser(),
  ]);

  const { page, category, sort, size, flavourColour } = searchParams;

  const { products, totalProducts } = await getProductsByBrand({
    slug,
    page: DEFAULT_PAGE,
    limit: page > 1 ? PRODUCTS_PER_PAGE * page : PRODUCTS_PER_PAGE,
    category,
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
          {totalProducts} Product{totalProducts !== 1 ? 's' : ''}
        </span>
      </div>
      <PaginatedBrandProducts
        key={[totalProducts, category, sort, size, flavourColour].join('-')}
        slug={slug}
        initialProducts={products}
        totalProducts={totalProducts}
        userId={user?.id ?? null}
        pathname={`${pathname}/${slug}`}
      />
    </div>
  );
}
