"use server"

import config from "@/payload.config"
import { getPayload } from "payload"

export async function searchBrand(term: string) {
  const payload = await getPayload({ config })

  const { docs: brands, ...rest } = await payload.find({
    collection: "brands",
    where: {
      title: {
        like: term,
      },
    },
    select: {
      title: true,
      slug: true,
      srcImage: true,
    },
    limit: 10,
  })

  return {
    brands: brands.map(({ srcImage, ...b }) => ({
      ...b,
      image: srcImage,
    })),
    ...rest,
  }
}
