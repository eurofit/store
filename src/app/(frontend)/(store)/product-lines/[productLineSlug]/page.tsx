import { getProductLineBySlug } from '@/actions/product-lines/get-product-line-by-slug';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type ProductPageProps = {
  params: Promise<{
    productLineSlug: string;
  }>;
};

export async function generateMetadata({
  params: paramsPromise,
}: ProductPageProps): Promise<Metadata> {
  const { productLineSlug: slug } = await paramsPromise;

  const productLine = await getProductLineBySlug({ slug });

  if (!productLine) {
    notFound();
  }

  if ('errors' in productLine || 'properties' in productLine) {
    throw new Error('Something went wrong!');
  }

  return {
    title: {
      absolute: productLine.title,
    },
  };
}

export default async function ProductLinePage({ params }: ProductPageProps) {
  const { productLineSlug: slug } = await params;

  const [productLine] = await Promise.all([getProductLineBySlug({ slug })]);

  if (!productLine) notFound();

  if ('errors' in productLine || 'properties' in productLine) {
    throw new Error('Something went wrong!');
  }

  return (
    <>
      <div className="space-y-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Variations</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{productLine.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <pre>{JSON.stringify(productLine, null, 2)}</pre>
      </div>
    </>
  );
}
