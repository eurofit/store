import { site } from '@/constants/site';
import { Metadata } from 'next';

type BrandProductPageProps = {
  params: Promise<{
    brandSlug: string;
    productSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: BrandProductPageProps): Promise<Metadata> {
  const { productSlug } = await params;
  return {
    title: 'Brand Product Page',
    description: 'This is the brand product page',
    alternates: {
      canonical: site.url + `/products/${productSlug}`,
    },
  };
}

export default async function BrandProductPage({
  params: paramsPromise,
}: BrandProductPageProps) {
  const { productSlug } = await paramsPromise;
  return <div> {productSlug} </div>;
}
