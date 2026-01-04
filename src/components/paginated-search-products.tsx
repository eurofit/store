"use client"

import { searchProducts } from "@/actions/products/search-products"
import { uniqBy } from "lodash-es"
import { CheckCircle, CircleX } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { Loader } from "./loader"
import { ProductCard } from "./product-card"
import { Spinner } from "./ui/spinner"

type PaginatedSearchProductsProps = {
  query: string
  initialData?: Awaited<ReturnType<typeof searchProducts>>
  totalProducts: number
  userId: string | null
}

const PRODUCTS_PER_PAGE = 20

export default function PaginatedSearchProducts({
  query,
  initialData: initialProducts = [],
  totalProducts,
  userId,
}: PaginatedSearchProductsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const page = Math.max(1, Number(searchParams.get("page")) ?? 1)
  const sort = (searchParams.get("sort") as "desc" | "asc") || "asc"
  const size = searchParams.getAll("size")
  const flavourColour = searchParams.getAll("flavour-colour")

  const { data, isError } = useQuery({
    queryKey: ["brand-products"],
    queryFn: async () =>
      getProductsByBrand({
        slug,
        page,
        limit: PRODUCTS_PER_PAGE,
        sort,
        size,
        flavourColour,
      }),
    initialData,
  })

  React.useEffect(() => {
    if (
      !isLoaderInView ||
      loadingRef.current ||
      products.length >= totalProducts
    )
      return

    loadingRef.current = true
    searchProducts(query, {
      page: page + 1,
      limit: PRODUCTS_PER_PAGE,
      sort,
      size,
      flavourColour,
    })
      .then(({ products: newProducts }) => {
        if (newProducts.length === 0) {
          return
        }
        setProducts((prev) => uniqBy([...prev, ...newProducts], "id"))

        // silently update the url
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", String(page + 1))

        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      })
      .catch(() => {
        setError("Failed to load more products.")
      })
      .finally(() => {
        loadingRef.current = false
      })
  }, [isLoaderInView])

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
        <div
          aria-live="polite"
          className="mt-10 flex items-center justify-center gap-2"
        >
          <CheckCircle className="text-green-600" />
          <span>
            That is it! You have seen all {products.length} product
            {products.length > 1 ? "s" : ""}.
          </span>
        </div>
      )}

      {/* --- SEO NAV (hidden but crawlable) --- */}
      <nav className="sr-only" aria-label="Pagination navigation for brands">
        {page > 1 && (
          <a href={`/search?q=${query}&page=${page - 1}`} rel="prev">
            Previous
          </a>
        )}
        {products.length < totalProducts && (
          <a href={`/search?q=${query}&page=${page + 1}`} rel="next">
            Next
          </a>
        )}
      </nav>
    </div>
  )
}
