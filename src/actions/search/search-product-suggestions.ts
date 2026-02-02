'use server';

import payloadConfig from '@/payload/config';
import { product_lines, products } from '@/payload/generated-schema';
import { buildPrefixTsQuery } from '@/utils/build-prefix-ts-query';
import { asc, eq, sql } from '@payloadcms/db-postgres/drizzle';
import { getPayload } from 'payload';
import { z } from 'zod';

const inputSchema = z.object({
  query: z.string().min(2),
  limit: z.number().min(1).max(100).optional().default(5),
});

type Args = z.input<typeof inputSchema>;

export async function searchProductSuggestions(args: Args) {
  const { query, limit = 5 } = inputSchema.parse(args);

  const payload = await getPayload({ config: payloadConfig });

  const tsQuery = buildPrefixTsQuery(query);

  if (!tsQuery) {
    return null;
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
    `;

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
    .limit(limit)
    .orderBy(asc(products.title));

  const productsCountPromise = payload.db.drizzle
    .select({
      count: sql<number>`CAST (COUNT(DISTINCT ${products.id}) AS INTEGER)`,
    })
    .from(products)
    .leftJoin(product_lines, eq(product_lines.product, products.id))
    .where(matchCondition);

  const [matchedProducts, totalCountResult] = await Promise.all([
    productsPromise,
    productsCountPromise,
  ]);

  const totalProducts = totalCountResult[0]?.count ?? 0;

  return { products: matchedProducts, totalProducts, query: query };
}

export type SearchProductResult = Awaited<ReturnType<typeof searchProductSuggestions>>;
