import { site } from '@/constants/site';
import payloadConfig from '@/payload.config';
import { Metadata } from 'next';
import { getPayload } from 'payload';

type BrandCategoriesPageProps = {
  params: Promise<{
    brandSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: BrandCategoriesPageProps): Promise<Metadata> {
  const { brandSlug } = await params;
  return {
    title: 'Brand Category Page',
    description: 'This is the brand category page',
    alternates: {
      canonical: `${site.url}/brands/${brandSlug}/categories/`,
    },
  };
}

export default async function BrandCategoriesPage({
  params: paramsPromise,
}: BrandCategoriesPageProps) {
  const { brandSlug } = await paramsPromise;

  const payload = await getPayload({ config: payloadConfig });

  const { docs } = await payload.find({
    collection: 'categories',
    where: {
      'products.brand.slug': {
        equals: brandSlug,
      },
      srcUrl: {
        exists: true,
      },
    },
    select: {
      slug: true,
      title: true,
    },
    depth: 0,
    limit: 0,
    pagination: false,
  });

  return (
    <div>
      <pre>{JSON.stringify(docs, null, 2)}</pre>
    </div>
  );
}
