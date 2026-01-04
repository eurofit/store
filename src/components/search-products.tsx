import { getCurrentUser } from "@/actions/auth/get-current-user"
import { searchProducts } from "@/actions/products/search-products"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { notFound } from "next/navigation"
import { ProductSort } from "./product-sort"

import { truncate } from "lodash-es"
import { ProductCard } from "./product-card"

type SearchProductsListProps = {
  searchParams: Promise<{
    q?: string
    page: number
    brand?: string[]
    category: string[]
    sort: string
    size: string[]
    flavourColour: string[]
  }>
}

const PRODUCTS_PER_PAGE = 15

const PRODUCT_SORT_OPTIONS = [
  { label: "Product Name: A-Z", value: "asc" },
  { label: "Product Name: Z-A", value: "desc" },
]

export async function SearchProducts({
  searchParams: searchParamsPromise,
}: SearchProductsListProps) {
  const [searchParams, user] = await Promise.all([
    searchParamsPromise,
    getCurrentUser(),
  ])

  const { q, page, brand, category, sort, size, flavourColour } = searchParams

  if (!q) {
    notFound()
  }

  const { products, totalProducts } = await searchProducts(q, {
    page,
    limit: PRODUCTS_PER_PAGE,
    sort,
    brand,
    category,
    size,
    flavourColour,
  })

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE)
  const hasNextPage = page < totalPages

  return (
    <div className="flex flex-col space-y-10">
      {totalProducts > 0 && (
        <hgroup>
          <span className="text-muted-foreground text-sm">
            Showing {totalProducts} products for
          </span>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            &quot;{truncate(q)}&quot;
          </h1>
        </hgroup>
      )}

      {totalProducts > 0 && (
        <div className="mb-6 flex min-h-8 items-center gap-6">
          <ProductSort
            className="ml-auto"
            options={PRODUCT_SORT_OPTIONS}
            defaultValue={sort == "asc" ? "asc" : "desc"}
          />
          <span className="text-sm lining-nums">
            {totalProducts} Product{totalProducts !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {totalProducts > 0 && (
        <section id="brand-products-list" className="grid gap-8 md:gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} userId={user?.id} />
          ))}
        </section>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={page ? `?page=${page - 1}` : undefined}
              />
            </PaginationItem>
            {Array()
              .fill(null)
              .map((_, index) => (
                <PaginationItem key={`page-${index + 1}`}>
                  <PaginationLink
                    href={`?page=${index + 1}`}
                    isActive={page === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            <PaginationItem>
              <PaginationNext
                href={hasNextPage ? `?page=${page + 1}` : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
