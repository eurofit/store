import { getSearchProductFilters } from '@/actions/get-search-product-filters';
import { ProductCardSkeleton } from '@/components/product-card';
import { FilterSkeleton } from '@/components/product-filters';
import { ProductFilters } from '@/components/products-filters';
import { SearchProducts } from '@/components/search-products';
import { SearchParams } from '@/types';
import { castArray } from 'lodash-es';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import * as React from 'react';

type SearchPageProps = {
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;

  if (!q) notFound();

  return {
    title: 'Search Results for "' + q + '"',
  };
}

export default async function SeaerchPage({ searchParams }: SearchPageProps) {
  const formattedSearchParams = searchParams.then((sp) => {
    return {
      q: Array.isArray(sp.q) ? sp.q[0]?.trim() || '' : sp.q?.trim() || '',
      page: typeof sp.page === 'string' ? Math.max(1, Number(sp.page)) : 1,
      sort: Array.isArray(sp.sort) ? sp.sort[0] : (sp.sort ?? 'asc'),
      brand: castArray(sp.brand ?? []),
      category: castArray(sp.category ?? []),
      size: castArray(sp.size ?? []).map((s) => decodeURIComponent(s)),
      flavourColour: castArray(sp['flavour-colour'] ?? []).map((s) =>
        decodeURIComponent(s),
      ),
    };
  });

  return (
    <div className="relative flex md:min-h-[calc(100vh-4rem)] md:gap-8 lg:gap-16">
      {/* SIDEBAR  */}
      <React.Suspense fallback={<FilterSkeleton />}>
        <ProductFilters
          getFilters={() =>
            getSearchProductFilters(formattedSearchParams.then((sp) => sp.q))
          }
        />
      </React.Suspense>

      {/* MAIN CONTENT   */}
      <main className="grow">
        <React.Suspense fallback={<ProductCardSkeleton />}>
          <SearchProducts searchParams={formattedSearchParams} />
        </React.Suspense>
      </main>
    </div>
  );
}
