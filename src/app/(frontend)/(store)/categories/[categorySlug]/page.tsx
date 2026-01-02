import { getCategory } from '@/actions/categories/get-category';
import { getTotalProductsByCategory } from '@/actions/categories/get-products-by-category';
import { getCategoryFilters } from '@/actions/get-category-filters';
import { CategoryProducts } from '@/components/category-products';
import { ProductCardSkeleton } from '@/components/product-card';
import { FilterSkeleton } from '@/components/product-filters';
import { ProductFilters } from '@/components/products-filters';
import { site } from '@/constants/site';
import { SearchParams } from '@/types';
import { castArray } from 'lodash-es';
import { Metadata } from 'next';
import * as React from 'react';

type CategoryPageProps = {
  params: Promise<{
    categorySlug: string;
  }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;

  const [category, totalCategoryProducts] = await Promise.all([
    getCategory({ slug: categorySlug }),
    getTotalProductsByCategory(categorySlug),
  ]);

  return {
    title: { absolute: `Buy ${category.title} Products from ${site.name}` },
    description: `Shop over ${totalCategoryProducts} authentic ${category.title} products at ${site.name}. Fresh stock, fast delivery and trusted quality. Order today while stock lasts.`,
    alternates: {
      canonical: `${site.url}/categories/${categorySlug}`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const categorySlug = params.then((p) => p.categorySlug);

  const formattedSearchParams = searchParams.then((sp) => {
    return {
      page: typeof sp.page === 'string' ? Math.max(1, Number(sp.page)) : 1,
      sort: Array.isArray(sp.sort) ? sp.sort[0] : (sp.sort ?? 'asc'),
      brand: castArray(sp.category ?? []),
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
        <ProductFilters getFilters={() => getCategoryFilters(categorySlug)} />
      </React.Suspense>

      {/* MAIN CONTENT   */}
      <main className="grow">
        <React.Suspense fallback={<ProductCardSkeleton />}>
          <CategoryProducts slug={categorySlug} searchParams={formattedSearchParams} />
        </React.Suspense>
      </main>
    </div>
  );
}
