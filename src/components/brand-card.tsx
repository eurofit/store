import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Brand } from "@/types"
import { cn } from "@/utils/cn"
import { ImageOff } from "lucide-react"
import Link from "next/link"
import { ImageWithRetry } from "./image-with-retry"
import { Skeleton } from "./ui/skeleton"

type BrandCardProps = Brand & {
  index: number
}

export function BrandCard({ title, image, slug, index }: BrandCardProps) {
  return (
    <article
      aria-labelledby={slug}
      className="group hover:outline hover:outline-red-500 transition-color duration-300 relative overflow-hidden rounded-lg"
    >
      <AspectRatio ratio={4 / 3}>
        {image && (
          <ImageWithRetry
            src={image}
            alt={`${title} logo`}
            fill
            className="mx-auto object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 33vw, 20vw"
            loading={index > 4 ? "lazy" : "eager"}
            priority={index <= 4}
          />
        )}
        {!image && (
          <div
            role="img"
            aria-label={`${title} logo not available`}
            className="bg-muted flex h-full w-full items-center justify-center"
          >
            <ImageOff className="text-muted-foreground h-8 w-8" />
          </div>
        )}
      </AspectRatio>
      <div className="from-primary to-primary/90 text-primary-foreground flex-1 rounded-b-lg bg-linear-to-r py-4">
        <h2 id={slug} className="font-heading text-center font-bold uppercase">
          {title}
        </h2>
      </div>
      <Link
        title={`Shop ${title} products`}
        aria-label={`View products from ${title}`}
        href={`/brands/${slug}`}
        className="absolute inset-0"
      />
    </article>
  )
}

export function BrandSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-square max-w-xs" />
    </div>
  )
}

type BrandsSkeletonProps = React.ComponentPropsWithRef<"div"> & {
  length?: number
}

export function BrandsSkeleton({
  length = 10,
  className,
  ...props
}: BrandsSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10 lg:grid-cols-4 xl:grid-cols-5",
        className
      )}
      {...props}
    >
      {Array.from({ length }).map((_, i) => (
        <BrandSkeleton key={`brand-skeleton-${i}`} />
      ))}
    </div>
  )
}
