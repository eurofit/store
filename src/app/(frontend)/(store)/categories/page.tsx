import { CategoryCard } from "@/components/category-card"
import config from "@/payload.config"
import { Metadata } from "next"
import { getPayload } from "payload"

export const metadata: Metadata = {
  title: "Shop by Category",
  description:
    "Explore our wide range of categories to find the products you love.",
  alternates: {
    canonical: "/categories",
  },
}

export default async function CategoriesPage() {
  const payloadConfig = await config
  const payload = await getPayload({
    config: payloadConfig,
  })

  const { docs: categories } = await payload.find({
    collection: "categories",
    select: {
      title: true,
      slug: true,
    },
    where: {
      srcUrl: {
        exists: true,
      },
      active: {
        equals: true,
      },
    },

    limit: 0,
    depth: 0,
  })

  return (
    <main>
      <hgroup className="mb-8 max-w-sm space-y-2 text-pretty">
        <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
        <p className="text-muted-foreground">
          Browse through our wide range of categories to find the products you
          love.
        </p>
      </hgroup>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <li key={category.slug}>
            <CategoryCard category={category} />
          </li>
        ))}
      </ul>
    </main>
  )
}
