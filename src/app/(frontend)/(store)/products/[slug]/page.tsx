import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getProductBySlug } from '@/actions/products/get-product-by-slug';
import { ImageWithRetry } from '@/components/image-with-retry';
import { ProductLinesList } from '@/components/product-lines-list';
import { Heading } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ImageOff } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import pluralize from 'pluralize-esm';
import { titleCase } from 'title-case';

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params: paramsPromise,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await paramsPromise;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return {
    title: {
      absolute: titleCase(product.title),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const [product, user] = await Promise.all([getProductBySlug(slug), getCurrentUser()]);

  if (!product) notFound();

  const { id, image, title, productLines } = product;

  return (
    <div className="space-y-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex w-full flex-col items-start gap-16 md:flex-row">
        <div className="relative grow space-y-10 md:max-w-5xl">
          <Heading>{title}</Heading>
          <main className="flex flex-col items-start gap-6 md:flex-row">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white max-md:w-full md:max-w-xs md:basis-2/5">
              {image && (
                <ImageWithRetry
                  src={image}
                  alt={title + ' image'}
                  fill
                  className="m-auto max-h-11/12 max-w-11/12 object-contain"
                  sizes="(max-width: 768px) 100vw, 350px"
                />
              )}
              {!image && (
                <ImageOff
                  className="text-muted m-auto size-1/2"
                  aria-label="Image not available"
                />
              )}
            </div>
            <div className="z-2 w-full space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Choose Variants</h3>
                <Badge variant="outline">
                  {product.productLines.length}{' '}
                  {pluralize('option', product.productLines.length)}
                </Badge>
              </div>
              <ProductLinesList
                product={{ id, slug, title, image }}
                productLines={productLines}
                userId={user?.id}
              />
            </div>
          </main>
        </div>

        {/* <aside className="basis-1/4 space-y-10 md:px-4">
          {relatedProducts.products && relatedProducts?.products.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Similar Products</h3>
                {relatedProducts.total > 5 && (
                  <Button variant="link" size="sm" asChild>
                    <Link href={'/products' + '?' + categoryParams}>
                      See all
                      <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                )}
              </div>
              <ul className="space-y-2.5">
                {relatedProducts.products.map((rp) => (
                  <li key={rp.slug}>
                    <Link
                      href={'/products/' + rp.slug}
                      className="hover:bg-accent/50 flex items-center gap-3 rounded-md p-1"
                    >
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md border bg-white">
                        {rp.image ? (
                          <ImageWithRetry
                            src={rp.image}
                            alt={`${rp.title} image`}
                            fill
                            className="object-contain p-1"
                            sizes="48px"
                          />
                        ) : (
                          <ImageOff
                            className="text-muted-foreground m-auto size-1/2"
                            aria-label="Image not available"
                          />
                        )}
                      </div>

                      <h4 className="line-clamp-2 text-sm leading-tight">{rp.title}</h4>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside> */}
      </div>
    </div>
  );
}
