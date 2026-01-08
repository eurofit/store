"use server"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import config from "@/payload.config"
import { ProductLine } from "@/types"
import { uniqBy } from "lodash-es"
import { getPayload } from "payload"

export async function getProductBySlug(slug: string) {
  const [payload, user] = await Promise.all([
    getPayload({ config }),
    getCurrentUser(),
  ])

  const { docs } = await payload.find({
    collection: "products",
    where: {
      slug: { equals: slug },
    },
    select: {
      slug: true,
      title: true,
      origin: true,
      categories: true,
      nutritionalInformation: true,
      productInformation: true,
      srcImage: true,
      productLines: true,
      relatedProducts: true,
    },
    populate: {
      "product-lines": {
        sku: true,
        slug: true,
        title: true,
        variant: true,
        stock: true,
        srcStock: true,
        retailPrice: true,
        isBackorder: true,
        isLowStock: true,
        isOutOfStock: true,
        isNotifyRequested: true,
        category: true,
      },
    },
    joins: {
      productLines: {
        limit: 0,
        sort: "title",
        where: {
          active: {
            equals: true,
          },
        },
      },
    },
    context: {
      relatedProducts: true,
    },
    pagination: false,
    limit: 1,
  })

  if (!docs.length) return null

  const product = docs[0]
  const { srcImage, productLines, categories, ...p } = product

  const formattedCategories = uniqBy(
    (categories ?? [])
      .filter((c) => typeof c === "object" && "slug" in c && "title" in c)
      .map(({ slug, title }) => ({ slug, title })),
    "slug"
  )

  const formattedProductLines = (productLines.docs
    ?.filter((pl) => typeof pl === "object")
    .map((productLine) => {
      const { srcStock, retailPrice, ...pl } = productLine

      return {
        ...pl,
        stock: pl.stock || (srcStock ?? 0),
        price: retailPrice ?? null,
      }
    }) || []) as unknown as ProductLine[]

  return {
    ...p,
    categories: formattedCategories,
    image: srcImage || null,
    productLines: formattedProductLines,
  }
}
