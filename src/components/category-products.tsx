import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getProductsByCategory } from '@/actions/categories/get-products-by-category';
import { EmptyProducts } from './empty-products';
import PaginatedCategoryProducts from './paginated-category-products';
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

const PRODUCTS_PER_PAGE = 20;
const DEFAULT_PAGE = 1;

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

  const { products, totalProducts } = await getProductsByCategory({
    slug,
    page: DEFAULT_PAGE,
    limit: page > 1 ? PRODUCTS_PER_PAGE * page : PRODUCTS_PER_PAGE,
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
          {totalProducts} Product{totalProducts !== 1 ? 's' : ''}
        </span>
      </div>
      <PaginatedCategoryProducts
        key={[totalProducts, brand, sort, size, flavourColour].join('-')}
        slug={slug}
        initialProducts={products}
        totalProducts={totalProducts}
        userId={user?.id ?? null}
      />
    </div>
  );
}
