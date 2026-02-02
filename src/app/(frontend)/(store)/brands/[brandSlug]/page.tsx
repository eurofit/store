import { getBrand } from '@/actions/brands/get-brand';
import { getBrandFilters } from '@/actions/brands/get-brand-filters';
import { getTotalProductLinesByBrand } from '@/actions/products/get-products-by-brand';
import {
  BrandBreadcrumbs,
  BrandBreadcrumbsSkeleton,
} from '@/components/brand-breadcrumbs';
import { BrandHeader, BrandHeaderSkeleton } from '@/components/brand-header';
import { BrandProducts } from '@/components/brand-products';
import { ProductCardSkeleton } from '@/components/product-card';
import { FilterSkeleton } from '@/components/product-filters';
import { ProductFilters } from '@/components/products-filters';
import { site } from '@/constants/site';
import { SearchParams } from '@/types';
import { castArray } from 'lodash-es';
import { Metadata } from 'next';
import * as React from 'react';

type BrandPageProps = {
  params: Promise<{
    brandSlug: string;
  }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brandSlug } = await params;

  const [brand, totalBrandProductLines] = await Promise.all([
    getBrand({ slug: brandSlug }),
    getTotalProductLinesByBrand(brandSlug),
  ]);

  return {
    title: { absolute: `${brand.title} Online Store in Kenya` },
    description: `Shop over ${totalBrandProductLines} authentic ${brand.title} products at ${site.name}. Fresh stock, fast delivery and trusted quality. Order today while stock lasts.`,
    alternates: {
      canonical: `${site.url}/brands/${brandSlug}`,
    },
  };
}

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  const brandSlug = params.then((p) => p.brandSlug);

  const formattedSearchParams = searchParams.then((sp) => {
    return {
      page: typeof sp.page === 'string' ? Math.max(1, Number(sp.page)) : 1,
      title: Array.isArray(sp.title) ? sp.title[0] : (sp.title ?? 'asc'),
      category: castArray(sp.category ?? []),
      size: castArray(sp.size ?? []).map((s) => decodeURIComponent(s)),
      flavourColour: castArray(sp['flavour-colour'] ?? []).map((s) =>
        decodeURIComponent(s),
      ),
    };
  });

  return (
    <div className="space-y-10">
      <React.Suspense fallback={<BrandBreadcrumbsSkeleton />}>
        <BrandBreadcrumbs slug={brandSlug} />
      </React.Suspense>

      <div className="relative flex md:min-h-[calc(100vh-4rem)] md:gap-8 lg:gap-16">
        {/* SIDEBAR  */}
        <React.Suspense fallback={<FilterSkeleton />}>
          <ProductFilters getFilters={() => getBrandFilters(brandSlug)} />
        </React.Suspense>

        {/* MAIN CONTENT   */}
        <main className="grow space-y-10">
          <React.Suspense fallback={<BrandHeaderSkeleton />}>
            <BrandHeader slug={brandSlug} />
          </React.Suspense>
          <React.Suspense fallback={<ProductCardSkeleton />}>
            <BrandProducts slug={brandSlug} searchParams={formattedSearchParams} />
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}
