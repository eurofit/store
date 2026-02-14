import { CategoryCard } from '@/components/category-card';
import config from '@/payload/config';
import { Metadata } from 'next';
import { getPayload } from 'payload';

export const metadata: Metadata = {
  title: 'Shop by Category',
  description: 'Explore our wide range of categories to find the products you love.',
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
    <main className="space-y-8 md:space-y-14">
      <hgroup className="mx-auto mb-8 max-w-sm space-y-2 text-center text-pretty">
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          Shop by Category
        </p>
        <h2 className="text-3xl font-bold tracking-tight">
          Find the Right Supplement for Your Goal
        </h2>
        <p className="text-muted-foreground text-lg">
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
  );
}
