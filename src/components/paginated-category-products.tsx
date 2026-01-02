'use client';

import { getProductsByCategory } from '@/actions/categories/get-products-by-category';
import { useInView } from '@/hooks/use-in-view';
import { Product } from '@/types';
import { uniqBy } from 'lodash-es';
import { CheckCircle, CircleX } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { Loader } from './loader';
import { ProductCard } from './product-card';
import { Spinner } from './ui/spinner';

type PaginatedCategoryProductsProps = {
  slug: string;
  initialProducts?: Product[];
  totalProducts: number;
  userId: string | null;
  navHref?: string;
};

const PRODUCTS_PER_PAGE = 20;

export default function PaginatedCategoryProducts({
  slug,
  initialProducts = [],
  totalProducts,
  userId,
  navHref = `/categories/${slug}`,
}: PaginatedCategoryProductsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isPaginate = searchParams.has('page');

  const page = Math.max(1, Number(searchParams.get('page')) ?? 1);
  const sort = (searchParams.get('sort') as 'desc' | 'asc') || 'asc';
  const size = searchParams.getAll('size');
  const flavourColour = searchParams.getAll('flavour-colour');

  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [error, setError] = React.useState('');

  const loadingRef = React.useRef(false);
  const loaderRef = React.useRef<HTMLDivElement>(null!);

  const isLoaderInView = useInView(loaderRef);

  React.useEffect(() => {
    if (!isLoaderInView || loadingRef.current || products.length >= totalProducts) return;

    loadingRef.current = true;
    getProductsByCategory({
      slug,
      page: page + 1,
      limit: PRODUCTS_PER_PAGE,
      sort,
      size,
      flavourColour,
    })
      .then(({ products: newProducts, page: currentPage }) => {
        if (newProducts.length === 0) {
          return;
        }
        setProducts((prev) => uniqBy([...prev, ...newProducts], 'id'));

        // silently update the url
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(currentPage));

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      })
      .catch(() => {
        setError('Failed to load more products.');
      })
      .finally(() => {
        loadingRef.current = false;
      });
  }, [isLoaderInView]);

  return (
    <div className="mb-10">
      <section id="brand-products-list" className="grid gap-8 md:gap-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} userId={userId} />
        ))}
      </section>
      {error && !loadingRef.current && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-8 flex items-center justify-center gap-2"
        >
          <CircleX className="text-destructive" />
          <span>{error}</span>
        </div>
      )}
      {products.length < totalProducts && (
        <Loader ref={loaderRef} className="mt-4">
          <Spinner />
          Loading more products...
        </Loader>
      )}
      {products.length == totalProducts && isPaginate && (
        <div aria-live="polite" className="mt-10 flex items-center justify-center gap-2">
          <CheckCircle className="text-green-600" />
          <span>
            That is it! You have seen all {products.length} product
            {products.length > 1 ? 's' : ''}.
          </span>
        </div>
      )}

      {/* --- SEO NAV (hidden but crawlable) --- */}
      <nav className="sr-only" aria-label="Pagination navigation for brands">
        {page > 1 && (
          <a href={`${navHref}?page=${page - 1}&limit=20`} rel="prev">
            Previous
          </a>
        )}
        {products.length < totalProducts && (
          <a href={`${navHref}?page=${page + 1}&limit=20`} rel="next">
            Next
          </a>
        )}
      </nav>
    </div>
  );
}
