import { getBrands } from '@/actions/brands/get-brands';
import { getTotalBrands } from '@/actions/brands/get-total-brands';
import { BrandsSkeleton } from '@/components/brand-card';
import { BrandSearchDynamic } from '@/components/brand-search-dynamic';
import { Brands } from '@/components/brands';
import { JsonLd } from '@/components/json-ld';
import { TotalBrands } from '@/components/total-brands';
import { site } from '@/constants/site';
import { getBrandListJsonLd } from '@/utils/brand/get-brand-list-jsonld';
import { Metadata } from 'next';
import Image from 'next/image';
import * as React from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const totalBrands = await getTotalBrands();
  return {
    title: 'Shop Trusted Sports Nutrition Brands in Kenya',
    description: `Browse ${totalBrands}+ authentic global sports nutrition brands. Verified supplements, fair prices, and fast delivery anywhere in Kenya.`,
    alternates: {
      canonical: site.url + '/brands',
    },
  };
}

const BRANDS_LIMIT = 35;

type BrandsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function BrandsPage({
  searchParams: searchParamsPromise,
}: BrandsPageProps) {
  const searchParams = await searchParamsPromise;
  const page = Number(searchParams.page) || 1;

  const {
    brands,
    totalBrands,
    pagingCounter,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
  } = await getBrands({ page, limit: BRANDS_LIMIT });

  // --- JSON LD'S ---
  const jsonLds = getBrandListJsonLd({
    brands,
    totalBrands,
    page,
    pagingCounter,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
  });

  return (
    <main className="space-y-8 md:space-y-14">
      <JsonLd jsonLd={jsonLds} />

      <div className="flex h-[35vh] overflow-visible">
        <Image
          src="/bg-3.png"
          alt="Athlete"
          width={900}
          height={900}
          className="hidden h-full w-auto object-contain md:inline"
          priority
          loading="eager"
        />

        <div className="relative flex h-full grow flex-col items-center justify-center gap-6 max-md:p-6 md:bg-[url('/bg.png')] md:bg-cover md:bg-bottom md:before:absolute md:before:inset-0 md:before:backdrop-blur-md md:before:content-[''] md:after:absolute md:after:left-0 md:after:h-full md:after:w-2 md:after:-translate-x-1/2 md:after:backdrop-blur-xl md:after:content-['']">
          <hgroup className="relative space-y-2 text-center">
            <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
              Shop By Brand
            </span>
            <h1
              id="brand-list-heading"
              className="scroll-m-20 text-2xl font-bold tracking-tight text-pretty lg:text-3xl"
            >
              Shop Over{' '}
              <React.Suspense fallback={<span>...</span>}>
                <TotalBrands />
              </React.Suspense>{' '}
              Trusted Sports Nutrition Brands
            </h1>
            <p className="text-muted-foreground text-pretty capitalize">
              All your favorite global supplement brands — 100% authentic, available
              locally in Kenya.
            </p>
          </hgroup>
          <BrandSearchDynamic />
        </div>
      </div>

      <React.Suspense fallback={<BrandsSkeleton />}>
        <Brands page={page} />
      </React.Suspense>
    </main>
  );
}
