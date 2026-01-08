import { getProductsFilters } from "@/actions/products/get-product-filters"
import { ProductCardSkeleton } from "@/components/product-card"
import { FilterSkeleton } from "@/components/product-filters"
import { Products } from "@/components/products"
import { ProductFilters } from "@/components/products-filters"
import { site } from "@/constants/site"
import { SearchParams } from "@/types"
import { castArray } from "lodash-es"
import { Metadata } from "next"
import * as React from "react"

type ProductsPageProps = {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  title: { absolute: `Products Online Store in Kenya` },
  description: `Shop authentic products at ${site.name}. Fresh stock, fast delivery and trusted quality. Order today while stock lasts.`,
  alternates: {
    canonical: `${site.url}/products`,
  },
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const formattedSearchParams = searchParams.then((sp) => {
    return {
      page: typeof sp.page === "string" ? Math.max(1, Number(sp.page)) : 1,
      sort: Array.isArray(sp.sort) ? sp.sort[0] : (sp.sort ?? "asc"),
      brand: castArray(sp.brand ?? []),
      category: castArray(sp.category ?? []),
      size: castArray(sp.size ?? []).map((s) => decodeURIComponent(s)),
      flavourColour: castArray(sp["flavour-colour"] ?? []).map((s) =>
        decodeURIComponent(s)
      ),
    }
  })

  return (
    <div className="space-y-10">
      <div className="relative flex md:min-h-[calc(100vh-4rem)] md:gap-8 lg:gap-16">
        {/* SIDEBAR  */}
        <React.Suspense fallback={<FilterSkeleton />}>
          <ProductFilters getFilters={() => getProductsFilters()} />
        </React.Suspense>

        {/* MAIN CONTENT   */}
        <main className="grow space-y-10">
          <React.Suspense fallback={<ProductCardSkeleton />}>
            <Products searchParams={formattedSearchParams} />
          </React.Suspense>
        </main>
      </div>
    </div>
  )
}
