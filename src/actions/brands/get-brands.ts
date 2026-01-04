"use server"

import payloadConfig from "@/payload.config"
import { getPayload } from "payload"
import { z } from "zod"

const options = z.object({
  page: z
    .number()
    .optional()
    .default(1)
    .pipe(z.transform((val) => Math.max(1, val))),
  limit: z
    .number()
    .optional()
    .default(25)
    .pipe(z.transform((val) => Math.max(1, val))),
})

type GetBrandsOptions = z.infer<typeof options>

export async function getBrands(opts: GetBrandsOptions) {
  const { page, limit } = options.parse(opts)

  const payload = await getPayload({ config: payloadConfig })
  const { docs: brands, ...r } = await payload.find({
    collection: "brands",
    page,
    limit,
    sort: "title",
    select: {
      id: true,
      slug: true,
      title: true,
      srcImage: true,
      updatedAt: true,
    },
  })

  return {
    brands: brands.map((b) => ({
      id: b.id,
      slug: b.slug,
      title: b.title,
      image: b.srcImage,
      updatedAt: b.updatedAt,
    })),
    ...r,
  }
}

export async function getAllBrands() {
  const config = await payloadConfig
  const payload = await getPayload({ config })

  const { docs: brands, ...r } = await payload.find({
    collection: "brands",
    select: {
      id: true,
      slug: true,
      title: true,
      srcImage: true,
      updatedAt: true,
    },
    sort: "title",
    limit: 0,
    pagination: false,
  })

  return {
    brands: brands.map((b) => ({
      id: b.id,
      slug: b.slug,
      title: b.title,
      image: b.srcImage,
      updatedAt: b.updatedAt,
    })),
    ...r,
  }
}
