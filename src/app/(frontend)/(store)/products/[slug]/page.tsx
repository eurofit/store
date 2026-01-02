import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getProductBySlug } from '@/actions/products/get-product-by-slug';
import { ImageWithRetry } from '@/components/image-with-retry';
import { ProductLine } from '@/components/product-line';
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
import { Separator } from '@/components/ui/separator';
import { pluralizeByCount } from '@/utils/pluralize';
import { ChevronRight, ImageOff } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import * as React from 'react';
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
  const [{ slug }, user] = await Promise.all([params, getCurrentUser()]);

  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const { id, image, title, productLines, relatedProducts } = product;
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
        <div className="relative grow space-y-10">
          <Heading>{title}</Heading>
          <main>
            <div className="flex flex-col items-start gap-6 md:flex-row">
              <div className="relative flex aspect-square max-w-xs items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white md:basis-2/5">
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
              <div className="z-2 grow space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Choose Options</h3>
                  <Badge variant="outline">
                    {product.productLines.length}{' '}
                    {pluralizeByCount('option', product.productLines.length)}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {productLines.map((line, index) => (
                    <React.Fragment key={line.id}>
                      <ProductLine
                        product={{ id, slug, title, image }}
                        line={line}
                        userId={user?.id}
                      />
                      {index < product.productLines.length - 1 && <Separator />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>

        <aside className="basis-1/4 space-y-10 md:px-4">
          {relatedProducts.products && relatedProducts?.products.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Related Products</h3>
                {relatedProducts.total > 5 && (
                  <Link
                    href={'/products/' + slug + '/related'}
                    className="flex items-center gap-2 text-sm hover:underline hover:underline-offset-4"
                  >
                    See all
                    <ChevronRight className="size-4" />
                  </Link>
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
        </aside>
      </div>
    </div>
  );
}
