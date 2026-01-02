'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/utils/cn';

type ProductLine = {
  id: string;
  slug: string;
  sku: string;
  title: string;
  size: string;
  variant: string;
  supplierPrice: number;
  weight: number | null;
  barcode: string;
};

type Category = {
  id: string;
  slug: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  productLines: ProductLine[];
  categories: Category[];
};

type Brand = {
  id: string;
  name: string;
  products: Product[];
};

const ProductGrid = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    products: ProductLine[];
    loading?: boolean;
  }
>(({ className, products, loading = false, ...props }, ref) => {
  if (loading) {
    return (
      <div
        ref={ref}
        className={cn(
          'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
          className,
        )}
        {...props}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        ref={ref}
        className={cn('flex min-h-[400px] items-center justify-center', className)}
        {...props}
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}
      {...props}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
});
ProductGrid.displayName = 'ProductGrid';

const ProductCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    product: ProductLine;
  }
>(({ className, product, ...props }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn('group overflow-hidden transition-shadow hover:shadow-lg', className)}
      {...props}
    >
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden">
          <Image
            src="/placeholder.svg?height=300&width=300"
            alt={product.title}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="leading-tight font-semibold">{product.title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {product.size}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {product.variant}
            </Badge>
          </div>
          <p className="text-lg font-bold">£{product.supplierPrice.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/products/${product.slug}`}>View Product</Link>
        </Button>
      </CardFooter>
    </Card>
  );
});
ProductCard.displayName = 'ProductCard';

const ProductCardSkeleton = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn('overflow-hidden', className)} {...props}>
        <CardHeader className="p-0">
          <div className="bg-muted aspect-square animate-pulse" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="bg-muted h-4 animate-pulse rounded" />
            <div className="flex gap-2">
              <div className="bg-muted h-5 w-12 animate-pulse rounded" />
              <div className="bg-muted h-5 w-16 animate-pulse rounded" />
            </div>
            <div className="bg-muted h-6 w-20 animate-pulse rounded" />
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="bg-muted h-10 w-full animate-pulse rounded" />
        </CardFooter>
      </Card>
    );
  },
);
ProductCardSkeleton.displayName = 'ProductCardSkeleton';

const ProductGridHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    title?: string;
    description?: React.ReactNode;
    count?: number;
    loading?: boolean;
  }
>(({ className, title, description, count, loading = false, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      <div className="flex items-center justify-between">
        <div>
          {title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}
          {description && (
            <div className="text-muted-foreground max-w-3xl text-pretty">
              {description}
            </div>
          )}
        </div>
        {count !== undefined && (
          <p className={cn('text-muted-foreground text-sm', loading && 'opacity-70')}>
            {count} {count === 1 ? 'product' : 'products'}
          </p>
        )}
      </div>
    </div>
  );
});
ProductGridHeader.displayName = 'ProductGridHeader';

export { ProductCard, ProductCardSkeleton, ProductGrid, ProductGridHeader };
