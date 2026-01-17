import * as React from "react"
import { Metadata } from "next"
import Image from "next/image"
import { getAllBrands } from "@/actions/brands/get-brands"
import { site } from "@/constants/site"

import { getBrandsJsonLd } from "@/utils/brand/get-brand-list-jsonld"
import { BrandsSkeleton } from "@/components/brand-card"
import { BrandSearch } from "@/components/brand-search"
import { Brands } from "@/components/brands"
import { JsonLd } from "@/components/json-ld"
import { TotalBrands } from "@/components/total-brands"

export const metadata: Metadata = {
  title: "Shop by Brand",
  description: "Explore our wide range of brands and find your favorites.",
  alternates: {
    canonical: site.url + "/brands",
  },
}

type BrandsPageProps = {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function BrandsPage({
  searchParams: searchParamsPromise,
}: BrandsPageProps) {
  const page = searchParamsPromise.then((params) => Number(params.page) || 1)

  const { brands } = await getAllBrands()

  // --- JSON LD'S ---
  const jsonLds = getBrandsJsonLd({
    brands,
  })

  return (
    <main className="space-y-8 md:space-y-14">
      <JsonLd jsonLd={jsonLds} />

      <div className="flex h-[35vh] relative">
        <img
          src="/bg-3.png"
          alt="Athlete"
          className="object-contain hidden md:inline md:clip-left h-full w-auto"
        />

        <div className="relative h-full max-md:p-6 md:-ml-24 md:pl-24 md:before:content-['']  md:before:absolute md:before:inset-0 md:before:backdrop-blur-lg md:*:relative *:z-1 md:clip-right md:bg-[url('/bg.png')] md:bg-bottom md:bg-cover z-2 grow flex flex-col gap-6 justify-center items-center">
          <hgroup className="text-center space-y-2">
            <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
              Shop By Brand
            </span>
            <h1
              id="brand-list-heading"
              className="scroll-m-20 text-2xl font-bold tracking-tight text-pretty lg:text-3xl"
            >
              Discover{" "}
              <React.Suspense fallback={<span>...</span>}>
                <TotalBrands />
              </React.Suspense>
              + top sports nutrition brands.
            </h1>
            <p className="text-muted-foreground text-pretty">
              Authentic Global Brands Available at Wholesale & Retail Prices in
              Kenya.
            </p>
          </hgroup>
          <BrandSearch />
        </div>
      </div>

      <React.Suspense fallback={<BrandsSkeleton />}>
        <Brands page={page} />
      </React.Suspense>
    </main>
  )
}
