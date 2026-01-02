import { getAllBrands } from '@/actions/brands/get-brands';
import { BrandsSkeleton } from '@/components/brand-card';
import { Brands } from '@/components/brands';
import { JsonLd } from '@/components/json-ld';
import { TotalBrands } from '@/components/total-brands';
import { site } from '@/constants/site';
import { getBrandsJsonLd } from '@/utils/brand/get-brand-list-jsonld';
import { Metadata } from 'next';
import React from 'react';

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
    <main>
      <JsonLd jsonLd={jsonLds} />

      <hgroup className="mx-auto mb-10 max-w-3xl space-y-2 text-center">
        <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          Shop By Brand
        </span>
        <h1
          id="brand-list-heading"
          className="scroll-m-20 text-3xl font-bold tracking-tight text-pretty lg:text-4xl"
        >
          Discover{' '}
          <React.Suspense fallback={<span>...</span>}>
            <TotalBrands />
          </React.Suspense>
          + top sports nutrition brands at unbeatable trade prices from Kenya&apos;s
          leading sports nutrition supplier — EURO
          <span className="text-red-500">FIT</span>.
        </h1>
        <p className="text-muted-foreground text-pretty">
          We bring you the world&apos;s biggest sports nutrition brands—trusted by
          athletes and fitness lovers—at unbeatable wholesale & retail prices, directly
          available in Kenya from Eurofit, the nation&apos;s #1 sports supplements
          supplier.
        </p>
      </hgroup>

      <React.Suspense fallback={<BrandsSkeleton />}>
        <Brands page={page} />
      </React.Suspense>
    </main>
  );
}
