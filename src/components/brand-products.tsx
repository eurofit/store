import { getCurrentUser } from "@/actions/auth/get-current-user"

import { getProductsByBrand } from "@/actions/products/get-products-by-brand"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { pluralizeByCount } from "@/utils/pluralize"
import { EmptyProducts } from "./empty-products"
import { ProductCard } from "./product-card"
import { ProductSort } from "./product-sort"

type BrandProductsListProps = {
  slug: Promise<string>
  searchParams: Promise<{
    page: number
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

export async function BrandProducts({
  slug: slugPromise,
  searchParams: searchParamsPromise,
}: BrandProductsListProps) {
  const [slug, searchParams, user] = await Promise.all([
    slugPromise,
    searchParamsPromise,
    getCurrentUser(),
  ])

  const { page, category, sort, size, flavourColour } = searchParams

  const { products, totalProducts, totalPages, hasNextPage } =
    await getProductsByBrand({
      slug,
      page,
      limit: PRODUCTS_PER_PAGE,
      category,
      sort,
      size,
      flavourColour,
    })

  if (totalProducts === 0) {
    return <EmptyProducts />
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex  items-center  gap-6">
        <ProductSort
          className="ml-auto"
          options={PRODUCT_SORT_OPTIONS}
          defaultValue={sort == "asc" ? "asc" : "desc"}
        />
        <span className="text-sm">
          {totalProducts} {pluralizeByCount("Product", totalProducts)} found
        </span>
      </div>
      <div className="mb-10 space-y-10">
        <section id="brand-products-list" className="grid gap-8 md:gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} userId={user?.id} />
          ))}
        </section>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={page ? `?page=${page - 1}` : undefined}
              />
            </PaginationItem>
            {Array(totalPages)
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
      </div>
    </div>
  )
}
