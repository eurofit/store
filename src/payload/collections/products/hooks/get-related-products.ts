import { Product } from "@/payload/types"
import { CollectionAfterReadHook } from "payload"

export const getRelatedProducts: CollectionAfterReadHook<Product> = async ({
  req,
  doc,
  context,
}) => {
  if (!context.relatedProducts || context.hasRead) return doc

  if (!doc?.id) return doc

  // Avoid recursion
  if (doc.relatedProducts?.total) return doc

  const categoryIDs = (doc.categories ?? []).map((c) =>
    typeof c === "string" ? c : c.id
  )

  if (!categoryIDs.length) return doc

  const { docs, totalDocs } = await req.payload.find({
    collection: "products",
    limit: 5,
    where: {
      id: { not_equals: doc.id },
      active: { equals: true },
      categories: {
        in: categoryIDs,
      },
    },
    select: {
      slug: true,
      title: true,
      srcImage: true,
    },
    context: {
      hasRead: true,
    },
  })

  return {
    ...doc,
    relatedProducts: {
      products: docs.map((p) => {
        const { id, srcImage, ...rest } = p
        return {
          ...rest,
          image: srcImage,
        }
      }),
      total: totalDocs,
    },
  }
}
