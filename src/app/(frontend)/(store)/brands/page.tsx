import { getAllBrands } from '@/actions/brands/get-brands';
import { BrandsSkeleton } from '@/components/brand-card';
import { BrandSearch } from '@/components/brand-search';
import { Brands } from '@/components/brands';
import { JsonLd } from '@/components/json-ld';
import { TotalBrands } from '@/components/total-brands';
import { site } from '@/constants/site';
import { getBrandsJsonLd } from '@/utils/brand/get-brand-list-jsonld';
import { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'Shop by Brand',
  description: 'Explore our wide range of brands and find your favorites.',
  alternates: {
    canonical: site.url + '/brands',
  },
};

type BrandsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function BrandsPage({
  searchParams: searchParamsPromise,
}: BrandsPageProps) {
  const page = searchParamsPromise.then((params) => Number(params.page) || 1);

  const { brands } = await getAllBrands();

  // --- JSON LD'S ---
  const jsonLds = getBrandsJsonLd({
    brands,
  });

  return (
    <main className="space-y-8 md:space-y-14">
      <JsonLd jsonLd={jsonLds} />

      <div className="flex h-[35vh] overflow-visible">
        <img
          src="/bg-3.png"
          alt="Athlete"
          className="hidden h-full w-auto object-contain md:inline"
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
              Discover{' '}
              <React.Suspense fallback={<span>...</span>}>
                <TotalBrands />
              </React.Suspense>
              + top sports nutrition brands.
            </h1>
            <p className="text-muted-foreground text-pretty">
              Authentic Global Brands Available at Wholesale & Retail Prices in Kenya.
            </p>
          </hgroup>
          <BrandSearch />
        </div>
      </div>

      <React.Suspense fallback={<BrandsSkeleton />}>
        <Brands page={page} />
      </React.Suspense>
    </main>
  );
}
