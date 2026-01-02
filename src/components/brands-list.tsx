'use client';

import { getBrands } from '@/actions/brands/get-brands';
import { useInView } from '@/hooks/use-in-view';
import { useIsMobile } from '@/hooks/use-mobile';
import { Brand } from '@/types';
import { uniqBy } from 'lodash-es';
import { CheckCircle, CircleX } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { BrandCard, BrandsSkeleton } from './brand-card';

type BrandListProps = {
  initialBrands?: Brand[];
  totalBrands: number;
  pathname?: string;
} & React.ComponentProps<'section'>;

const PAGE_LIMIT = 25;

export function BrandList({
  initialBrands = [],
  totalBrands,
  pathname: href = '/brands',
  ...props
}: BrandListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const [brands, setBrands] = React.useState<Brand[]>(initialBrands);

  const [error, setError] = React.useState('');

  const loadingRef = React.useRef(false);
  const loaderRef = React.useRef<HTMLDivElement>(null!);
  const isLoaderInView = useInView(loaderRef);

  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (!isLoaderInView || loadingRef.current || brands.length >= totalBrands) return;

    loadingRef.current = true;

    getBrands({ page: page + 1, limit: PAGE_LIMIT })
      .then(({ brands: newBrands, page: currentPage }) => {
        if (newBrands.length === 0) {
          return;
        }

        setBrands((prev) => uniqBy([...prev, ...newBrands], 'id'));

        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(currentPage));
        router.replace(`${href}?${params.toString()}`, { scroll: false });
      })

      .catch(() => {
        setError('Oops! Something went wrong!');
      })
      .finally(() => loadingRef.current && (loadingRef.current = false));
  }, [
    isLoaderInView,
    loaderRef,
    brands,
    totalBrands,
    page,
    pathname,
    router,
    searchParams,
  ]);

  return (
    <section {...props}>
      {/* --- LIST ---  */}
      <ul
        className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10 lg:grid-cols-4 xl:grid-cols-5"
        role="list"
        aria-label="Brands available for purchase"
      >
        {brands.map((brand, index) => (
          <li key={brand.id}>
            <BrandCard {...brand} index={index} href={`${href}/${brand.slug}`} />
          </li>
        ))}
      </ul>

      {/* --- LOADER / END STATE --- */}
      {error && !loadingRef.current && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-10 flex items-center justify-center gap-2"
        >
          <CircleX className="text-destructive" />
          <span>{error}</span>
        </div>
      )}

      {brands.length < totalBrands && (
        <BrandsSkeleton ref={loaderRef} length={isMobile ? 1 : 5} className="mt-10" />
      )}

      {brands.length == totalBrands && (
        <div aria-live="polite" className="mt-10 flex items-center justify-center gap-2">
          <CheckCircle className="text-green-600" />
          <span>That is it! You have seen all {brands.length} brands.</span>
        </div>
      )}

      {/* --- SEO NAV (hidden but crawlable) --- */}
      <nav
        className="h-px overflow-hidden text-[1px] opacity-5"
        aria-label="Pagination navigation for brands"
      >
        {page > 1 && (
          <a href={`${href}?page=${page - 1}`} rel="prev">
            Previous
          </a>
        )}
        {brands.length < totalBrands && (
          <a href={`${href}?page=${page + 1}`} rel="next">
            Next
          </a>
        )}
      </nav>
    </section>
  );
}
