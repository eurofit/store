"use server"

import {
  brands,
  categories,
  product_lines,
  products,
  products_rels,
  stock_alerts,
} from "@/payload-generated-schema"
import type { Product, ProductLine } from "@/types"
import { buildPrefixTsQuery } from "@/utils/build-prefix-ts-query"
import payloadConfig from "@payload-config"
import { and, asc, desc, eq, or, sql } from "@payloadcms/db-postgres/drizzle"
import { castArray } from "lodash-es"
import { getPayload } from "payload"
import { z } from "zod"
import { getCurrentUser } from "../auth/get-current-user"

const DEFAULT_PRODUCTS_PER_PAGE = 20
const DEFAULT_PAGE = 1

const optionsSchema = z.object({
  page: z
    .number()
    .optional()
    .default(DEFAULT_PAGE)
    .pipe(z.transform((val) => Math.max(1, val))),
  limit: z
    .number()
    .optional()
    .default(DEFAULT_PRODUCTS_PER_PAGE)
    .pipe(z.transform((val) => Math.max(1, val))),
  sort: z.string().optional().nullable(),
  brand: z.array(z.string()).optional().nullable(),
  category: z.array(z.string()).optional().nullable(),
  size: z.array(z.string()).optional().nullable(),
  flavourColour: z.array(z.string()).optional().nullable(),
})

type SearchProductsOptions = z.infer<typeof optionsSchema>

export async function searchProducts(q: string, opts: SearchProductsOptions) {
  const query = z.string().optional().parse(q)

  if (!query) return { products: [] as Product[], totalProducts: 0 }

  const { page, limit, sort, brand, category, size, flavourColour } =
    optionsSchema.parse(opts)

  const [payload, user] = await Promise.all([
    getPayload({ config: payloadConfig }),
    getCurrentUser(),
  ])

  const tsQuery = buildPrefixTsQuery(query)
  if (!tsQuery) {
    // nothing useful to search for — return empty set
    return { products: [] as Product[], totalProducts: 0 }
  }

  // we pass the tsQuery as a bound parameter into to_tsquery('english', $1)
  const matchCondition = sql`
  (
    setweight(to_tsvector('english', coalesce(${products.title}, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(${products.slug}, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(${product_lines.title}, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(${product_lines.sku}, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(${product_lines.barcode}, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(${product_lines.srcProductCode}, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(${product_lines.flavorColor}, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(${product_lines.size}, '')), 'C')
    ) @@ to_tsquery('english', ${tsQuery})
    `

  // safe SQL fragment for 'isNotifyRequested'
  const notifySql = user?.id
    ? sql`EXISTS (
             SELECT 1
             FROM ${stock_alerts}
             WHERE ${stock_alerts.user} = ${user.id}
               AND ${stock_alerts.productLine} = ${product_lines.id}
           )`
    : sql`false`

  // --- NORMALIZE filter inputs (always arrays) ---
  const brandList = castArray(brand ?? [])
  const categoryList = castArray(category ?? [])
  const sizeList = castArray(size ?? [])
  const flavourColourList = castArray(flavourColour ?? [])

  // build ARRAY[...] SQL from a JS string array (safe param binding)
  const sqlArrayFromStrings = (arr: string[]) =>
    arr && arr.length
      ? sql`ARRAY[${sql.join(
          arr.map((v) => sql`${v}`),
          sql`,`
        )}]`
      : undefined

  // Build explicit SQL conditions that use = ANY(ARRAY[...]) so Postgres receives an actual array.
  // We avoid any helper that might expand into `IN ($n)` with a scalar param.
  const brandFilter =
    brandList.length > 0
      ? sql`${brands.slug} = ANY(${sqlArrayFromStrings(brandList)})`
      : undefined

  const sizeFilter =
    sizeList.length > 0
      ? sql`${product_lines.size} = ANY(${sqlArrayFromStrings(sizeList)})`
      : undefined

  const flavourColourFilter =
    flavourColourList.length > 0
      ? sql`${product_lines.flavorColor} = ANY(${sqlArrayFromStrings(flavourColourList)})`
      : undefined

  const categoryFilter =
    categoryList.length > 0
      ? sql`
        EXISTS (
          SELECT 1
          FROM ${products_rels}
          INNER JOIN ${categories} c ON ${products_rels.categoriesID} = c.id
          WHERE ${products_rels.parent} = ${products.id}
            AND c.slug = ANY(${sqlArrayFromStrings(categoryList)})
        )
      `
      : undefined

  // Only keep defined filters so we don't generate or(undefined, ...) in the where clause
  const appliedFilters = [
    brandFilter,
    sizeFilter,
    flavourColourFilter,
    categoryFilter,
  ].filter(Boolean)

  // build the main matched products query (no category join)
  const matchedProductsPromise = payload.db.drizzle
    .select({
      id: products.id,
      slug: products.slug,
      title: products.title,
      origin: products.origin,
      image: products.srcImage,
      productLines: sql<ProductLine[]>`
      COALESCE(
        jsonb_agg(
          jsonb_build_object(
            'id', ${product_lines.id},
            'slug', ${product_lines.slug},
            'variant', ${product_lines.variant},
            'price', ${product_lines.retailPrice},
            'stock',
              CASE
                WHEN ${product_lines.stock} > 0 THEN ${product_lines.stock}
                ELSE COALESCE(${product_lines.srcStock}, 0)
              END,

            'isOutOfStock',
              CASE
                WHEN ${product_lines.stock} > 0 THEN false
                WHEN COALESCE(${product_lines.srcStock}, 0) > 0 THEN false
                ELSE true
              END,

            'isLowStock',
              CASE
                WHEN ${product_lines.stock} > 0 AND ${product_lines.stock} <= 5 THEN true
                WHEN ${product_lines.stock} <= 0 AND ${product_lines.srcStock} > 0 AND ${product_lines.srcStock} <= 5 THEN true
                ELSE false
              END,

            'isBackordered',
              CASE
                WHEN ${product_lines.stock} <= 0 AND ${product_lines.srcStock} > 0 THEN true
                ELSE false
              END,
            'isNotifyRequested', ${notifySql}
          )
        ) FILTER (WHERE ${product_lines.id} IS NOT NULL), 
        '[]'::jsonb
      )`,
    })
    .from(products)
    .innerJoin(brands, eq(brands.id, products.brand))
    .innerJoin(product_lines, eq(product_lines.product, products.id))
    .where(and(matchCondition, or(...appliedFilters)))
    .groupBy(products.id)
    .orderBy(sort === "desc" ? desc(products.title) : asc(products.title))
    .limit(limit)
    .offset((page - 1) * limit)

  // count query (same filters; no category join in main query — use same EXISTS for category)
  const totalMatchedProductsPromise = payload.db.drizzle
    .select({ count: sql<number>`COUNT(DISTINCT ${products.id})` })
    .from(products)
    .innerJoin(brands, eq(brands.id, products.brand))
    .innerJoin(product_lines, eq(product_lines.product, products.id))
    .where(and(matchCondition, or(...appliedFilters)))
    .then((result) => result[0]?.count ?? 0)

  const [matchedProducts, totalMatchedProducts] = await Promise.all([
    matchedProductsPromise,
    totalMatchedProductsPromise,
  ])

  return {
    // results are unique per product due to GROUP BY products.id and no category join
    products: matchedProducts as Product[],
    totalProducts: totalMatchedProducts,
  }
}

export type SearchProductResult = Awaited<ReturnType<typeof searchProducts>>
