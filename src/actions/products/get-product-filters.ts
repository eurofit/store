"use server"

import payloadConfig from "@/payload.config"
import { FilterGroup, FilterItem } from "@/types"
import { flatMap, groupBy, sortBy, uniqBy } from "lodash-es"
import { getPayload } from "payload"

export async function getProductsFilters(): Promise<FilterGroup[]> {
  const payload = await getPayload({ config: payloadConfig })

  const { docs: products, totalDocs: totalProducs } = await payload.find({
    collection: "products",
    select: {
      brand: true,
      categories: true,
      productLines: true,
    },
    populate: {
      brands: {
        slug: true,
        title: true,
      },
      categories: {
        slug: true,
        title: true,
      },
      "product-lines": {
        size: true,
        flavorColor: true,
        category: true,
      },
    },
    joins: {
      productLines: {
        limit: 0,
      },
    },
    limit: 0,
  })

  if (totalProducs === 0) return []

  // -------------------------
  // Brands
  // -------------------------
  const brands = products
    .map((p) => p.brand)
    .filter((b) => typeof b === "object" && "slug" in b && "title" in b)
  const groupedBrands = groupBy(brands, (b) => b.slug)
  const brandItems: FilterItem[] = sortBy(
    Object.entries(groupedBrands).map(([rawSlug, entries]) => ({
      slug: encodeURIComponent(rawSlug),
      title: entries[0].title,
      count: entries.length,
    })),
    (it) => it.title
  )

  // -------------------------
  // Categories
  // For each product: extract valid categories, dedupe them by slug (so a product contributes once per category).
  // Then flatten across products, group by slug and count products per slug.
  // -------------------------
  const perProductUniqueCategories = products.map((p) =>
    uniqBy(
      (p.categories ?? [])
        .filter((c) => typeof c === "object" && "slug" in c && "title" in c)
        .map(({ slug, title }) => ({ slug, title })),
      "slug"
    )
  )

  const flatCategories = flatMap(perProductUniqueCategories)

  const groupedCategories = groupBy(flatCategories, (c) => c.slug)

  const categoryItems: FilterItem[] = sortBy(
    Object.entries(groupedCategories).map(([slug, entries]) => ({
      slug,
      title: entries[0].title,
      count: entries.length,
    })),
    (it) => it.title
  )

  // -------------------------
  // Sizes and Flavor/Color from product-lines
  // For each product: extract product-lines, map to size/flavor, dedupe per product,
  // then flatten across products, group by slug and count.
  // -------------------------
  const perProductPLs = products.map((p) =>
    (p.productLines?.docs ?? [])
      .filter((pl) => typeof pl === "object")
      .map((pl) => ({
        size: pl.size ? String(pl.size) : "",
        flavor: pl.flavorColor ? String(pl.flavorColor) : "",
        category: pl.category ? String(pl.category) : "",
      }))
      .filter((pl) => pl.size || pl.flavor)
  )

  // Per product unique sizes (dedupe size within single product)
  const perProductUniqueSizes = perProductPLs.map((pls) =>
    uniqBy(
      pls
        .filter((pl) => pl.size)
        .map((pl) => ({ slug: String(pl.size), title: String(pl.size) })),
      "slug"
    )
  )

  const flatSizes = flatMap(perProductUniqueSizes)
  const groupedSizes = groupBy(flatSizes, (s) => s.slug)
  const sizeItems: FilterItem[] = sortBy(
    Object.entries(groupedSizes).map(([rawSlug, entries]) => ({
      slug: encodeURIComponent(rawSlug),
      title: entries[0].title,
      count: entries.length,
    })),
    (it) => it.title
  )

  // Per product unique flavors (dedupe flavor within single product)
  const perProductUniqueFlavors = perProductPLs.map((pls) =>
    uniqBy(
      pls
        .filter((pl) => pl.flavor)
        .map((pl) => ({ slug: String(pl.flavor), title: String(pl.flavor) })),
      "slug"
    )
  )

  const flatFlavors = flatMap(perProductUniqueFlavors)
  const groupedFlavors = groupBy(flatFlavors, (f) => f.slug)
  const flavorItems: FilterItem[] = sortBy(
    Object.entries(groupedFlavors).map(([rawSlug, entries]) => ({
      slug: encodeURIComponent(rawSlug),
      title: entries[0].title,
      count: entries.length,
    })),
    (it) => it.title
  )

  const filters: FilterGroup[] = [
    { key: "brand", title: "Brands", items: brandItems },
    { key: "category", title: "Categories", items: categoryItems },
    { key: "size", title: "Sizes", items: sizeItems },
    { key: "flavour-colour", title: "Flavour / Colour", items: flavorItems },
  ]

  return filters.filter((fg) => fg.items.length > 0)
}
