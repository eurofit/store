import { site } from "@/constants/site"
import payloadConfig from "@/payload/config"
import { MetadataRoute } from "next"
import { getPayload } from "payload"

export async function getCategoriesSitemap(): Promise<MetadataRoute.Sitemap> {
  const config = await payloadConfig
  const payload = await getPayload({ config })

  // select active categories with at least one product
  const { docs: categoriesWithProducts } = await payload.find({
    collection: "categories",
    where: {
      and: [
        {
          active: {
            equals: true,
          },
        },
        {
          products: {
            exists: true,
          },
        },
      ],
    },
    select: {
      slug: true,
      image: true,
      updatedAt: true,
    },
    sort: "slug",
    limit: 0,
  })

  return categoriesWithProducts.map(({ slug, updatedAt }) => ({
    url: `${site.url}/categories/${slug}`,
    lastModified: updatedAt,
  }))
}
