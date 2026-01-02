import { site } from '@/constants/site';
import { Metadata } from 'next';

type BrandCategoryPageProps = {
  params: Promise<{
    brandSlug: string;
    categorySlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: BrandCategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  return {
    title: 'Brand Category Page',
    description: 'This is the brand category page',
    alternates: {
      canonical: `${site.url}/brands/categories/${categorySlug}`,
    },
  };
}

export default async function BrandCategoryPage({
  params: paramsPromise,
}: BrandCategoryPageProps) {
  const { categorySlug } = await paramsPromise;
  return <div> {categorySlug} </div>;
}
