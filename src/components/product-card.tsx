import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Product } from "@/types"

import { ImageOff } from "lucide-react"
import Link from "next/link"
import React from "react"
import { ImageWithRetry } from "./image-with-retry"
import { ProductLine } from "./product-line"
import { Separator } from "./ui/separator"
import { Skeleton } from "./ui/skeleton"

type ProductCardProps = React.ComponentProps<typeof Card> & {
  product: Product
  userId: string | null
  href?: string
}

//TODO: fix mobile view

export function ProductCard({
  product: { id, slug, title, origin, image, productLines },
  href = `/products/${slug}`,
  userId,
}: ProductCardProps) {
  return (
    <Card
      id={slug}
      className="w-full border border-gray-200 bg-white py-0 pb-6 shadow-none"
    >
      <CardHeader className="bg-muted border-b border-gray-200 pt-6 pb-4">
        <div className="space-y-2">
          <CardTitle className="text-xl tracking-tight text-pretty">
            <Link
              href={href}
              className="hover:underline hover:underline-offset-4"
            >
              {title}
            </Link>
          </CardTitle>
          <CardDescription>Country of Origin: {origin}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="relative grid grid-cols-1 content-start items-start gap-8 lg:grid-cols-5">
          <div className="flex flex-col items-center justify-center gap-6 md:sticky md:top-12 lg:col-span-2">
            <div className="relative flex aspect-square w-full max-w-87.5 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white">
              {image ? (
                <ImageWithRetry
                  src={image}
                  alt={title}
                  fill
                  className="m-auto max-h-11/12 max-w-11/12 object-contain"
                  sizes="(max-width: 768px) 100vw, 350px"
                />
              ) : (
                <ImageOff
                  className="text-muted m-auto size-1/2"
                  aria-label="Image not available"
                />
              )}
            </div>
          </div>

          <div className="bg-background z-2 space-y-4 lg:col-span-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Choose Options</h3>
              <span className="border-gray-300 text-xs text-gray-600">
                {productLines.length} options
              </span>
            </div>

            <div className="space-y-3">
              {productLines.map((line, index) => (
                <React.Fragment key={line.id}>
                  <ProductLine
                    product={{ id, slug, title, image }}
                    line={line}
                    userId={userId}
                  />
                  {index < productLines.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex grow flex-col gap-4">
      <div className="grid gap-2 py-4 pb-4 md:pt-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="relative flex w-full flex-col gap-4 md:flex-row">
        <Skeleton className="aspect-square w-full md:max-w-80" />
        <div className="relative w-full">
          <div className="flex items-center justify-between">
            <Skeleton className="mb-4 h-4 w-2/5" />
            <Skeleton className="mb-4 h-4 w-1/6" />
          </div>
          <div className="grid gap-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-5/6" />
            <Skeleton className="h-14 w-4/6" />
            <Skeleton className="h-14 w-3/6" />
          </div>
        </div>
      </div>
    </div>
  )
}
