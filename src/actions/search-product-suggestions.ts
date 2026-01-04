"use server"

import { product_lines, products } from "@/payload-generated-schema"
import { buildPrefixTsQuery } from "@/utils/build-prefix-ts-query"
import payloadConfig from "@payload-config"
import { asc, eq, sql } from "@payloadcms/db-postgres/drizzle"
import { getPayload } from "payload"
import { z } from "zod"

export async function searchProductSuggestions(q: string) {
  const query = z.string().min(2).parse(q)
  const payload = await getPayload({ config: payloadConfig })

  // sleep 2 sec
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const tsQuery = buildPrefixTsQuery(query)
  if (!tsQuery) {
    return null
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

  const productsPromise = payload.db.drizzle
    .select({
      slug: products.slug,
      title: products.title,
      image: products.srcImage,
    })
    .from(products)
    .leftJoin(product_lines, eq(product_lines.product, products.id))
    .where(matchCondition)
    .groupBy(products.id)
    .limit(5)
    .orderBy(asc(products.title))

  const productsCountPromise = payload.db.drizzle
    .select({
      count: sql<number>`CAST (COUNT(DISTINCT ${products.id}) AS INTEGER)`,
    })
    .from(products)
    .leftJoin(product_lines, eq(product_lines.product, products.id))
    .where(matchCondition)

  const [matchedProducts, totalCountResult] = await Promise.all([
    productsPromise,
    productsCountPromise,
  ])

  const totalProducts = totalCountResult[0]?.count ?? 0

  return { products: matchedProducts, totalProducts, query: query }
}

export type SearchProductResult = Awaited<
  ReturnType<typeof searchProductSuggestions>
>
