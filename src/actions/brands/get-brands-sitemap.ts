import { site } from "@/constants/site"
import payloadConfig from "@/payload.config"
import { MetadataRoute } from "next"
import { getPayload } from "payload"

export async function getBrandsSitemap(): Promise<MetadataRoute.Sitemap> {
  const config = await payloadConfig
  const payload = await getPayload({
    config,
  })

  // select active brands with atleast one product.
  const { docs: brandsWithProducts } = await payload.find({
    collection: "brands",
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
      srcImage: true,
      updatedAt: true,
    },
    sort: "slug",
    limit: 0,
  })

  return brandsWithProducts.map(({ slug, srcImage: image, updatedAt }) => ({
    url: `${site.url}/brands/${slug}`,
    lastModified: updatedAt,
    images: typeof image === "string" ? [image] : [],
  }))
}
