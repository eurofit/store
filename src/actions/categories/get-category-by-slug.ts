"use server"

import {
  brands,
  categories,
  product_lines,
  products,
  products_rels,
  stock_alerts,
} from "@/payload-generated-schema"
import payloadConfig from "@/payload.config"
import { Brand, Product } from "@/types"
import { eq, sql } from "@payloadcms/db-postgres/drizzle"
import { getPayload } from "payload"

export async function getCategoryBySlug(slug: string, userId: string | null) {
  const config = await payloadConfig
  const payload = await getPayload({ config })

  const result = await payload.db.drizzle
    .select({
      category: sql<{
        title: string
        products: Product[]
      }>`
        jsonb_build_object(
          'title', ${categories.title},
          'products',
            COALESCE(
              jsonb_agg(
                jsonb_build_object(
                  'id', ${products.id},
                  'slug', ${products.slug},
                  'title', ${products.title},
                  'image', ${products.srcImage},
                  'origin', ${products.origin},

                  'productLines', COALESCE(
                    (
                      SELECT jsonb_agg(
                        jsonb_build_object(
                          'id', ${product_lines.id},
                          'sku', ${product_lines.sku},
                          'slug', ${product_lines.slug},
                          'title', ${product_lines.title},
                          'size', ${product_lines.size},
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
                              WHEN ${product_lines.stock} <= 0 AND COALESCE(${product_lines.srcStock}, 0) > 0 AND ${product_lines.srcStock} <= 5 THEN true
                              ELSE false
                            END,

                          'isBackordered',
                            CASE
                              WHEN ${product_lines.stock} <= 0 AND COALESCE(${product_lines.srcStock}, 0) > 0 THEN true
                              ELSE false
                            END,

                          'isNotifyRequested',
                            EXISTS(
                              SELECT 1
                              FROM ${stock_alerts}
                              WHERE ${stock_alerts.user} = ${userId}
                              AND ${stock_alerts.productLine} = ${product_lines.id}
                            )
                        ) ORDER BY ${product_lines.id}
                      )
                      FROM ${product_lines}
                      WHERE ${product_lines.product} = ${products.id}
                    ),
                    '[]'::jsonb
                  )
                ) ORDER BY ${products_rels.order}
              ) FILTER (WHERE ${products.id} IS NOT NULL),
              '[]'::jsonb
            )
        )
      `.as("data"),

      filters: sql<{
        brands: Brand[]
        sizes: string[]
      }>`
        jsonb_build_object(
          'brands',
            COALESCE(
              (
                SELECT jsonb_agg(DISTINCT jsonb_build_object(
                  'id', ${brands.id},
                  'slug', ${brands.slug},
                  'title', ${brands.title}
                ))
                FROM ${products_rels}
                JOIN ${products} ON ${products_rels.parent} = ${products.id}
                JOIN ${brands} ON ${products.brand} = ${brands.id}
                WHERE ${products_rels.categoriesID} = ${categories.id}
              ),
              '[]'::jsonb
            ),
          'sizes',
            COALESCE(
              (
                SELECT jsonb_agg(DISTINCT ${product_lines.size})
                FROM ${product_lines}
                JOIN ${products} ON ${product_lines.product} = ${products.id}
                JOIN ${products_rels} ON ${products_rels.parent} = ${products.id}
                WHERE ${products_rels.categoriesID} = ${categories.id}
                AND ${product_lines.size} IS NOT NULL
              ),
              '[]'::jsonb
            )
        )
      `.as("filters"),
    })
    .from(categories)
    .leftJoin(products_rels, eq(products_rels.categoriesID, categories.id))
    .leftJoin(products, eq(products.id, products_rels.parent))
    .where(eq(categories.slug, slug))
    .groupBy(categories.id)

  return result[0] ?? null
}
