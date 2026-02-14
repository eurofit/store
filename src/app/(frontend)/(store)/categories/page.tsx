import { CategoryCard } from '@/components/category-card';
import { JsonLd } from '@/components/json-ld';
import config from '@/payload/config';
import { getCategoriesJsonLd } from '@/utils/get-categories-json-ld';
import { Metadata } from 'next';
import { getPayload } from 'payload';

export const metadata: Metadata = {
  title: 'Shop Supplements by Category',
  description:
    'Browse Kenya’s largest selection of sports nutrition and health supplements. Shop by category including creatine, collagen, electrolytes, amino acids, and more. Retail & wholesale available.',
  alternates: {
    canonical: '/categories',
  },
};

export default async function CategoriesPage() {
  const payload = await getPayload({
    config,
  });

  const { docs: categories } = await payload.find({
    collection: 'categories',
    select: {
      title: true,
      slug: true,
      description: true,
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
  });

  return (
    <>
      <JsonLd jsonLd={getCategoriesJsonLd(categories)} />
      <main className="space-y-8 md:space-y-14">
        <hgroup className="mx-auto mb-8 max-w-md space-y-2 text-center text-pretty">
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            Shop Supplements by Category
          </h2>
          <p className="text-muted-foreground text-balance">
            Whether you&apos;re building muscle, improving endurance, or supporting your
            overall health, choose a category below and find exactly what your body needs.
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
    </>
  );
}
