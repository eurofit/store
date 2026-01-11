import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/utils/cn"
import * as React from "react"

function ProductFilter({ className, ...props }: React.ComponentProps<"aside">) {
  return (
    <aside
      {...props}
      className={cn("hidden h-full basis-1/5 space-y-6 md:block", className)}
    />
  )
}
function ProductFilterHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("flex items-center justify-between pb-4", className)}
    />
  )
}
function ProductFilterTitle({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <hgroup
      {...props}
      className={cn(
        "font-lg flex items-center gap-2 capitalize [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
    />
  )
}

function ProductFilterContent(props: React.ComponentProps<"nav">) {
  return <nav {...props} />
}

function ProductFilterGroup(props: React.ComponentProps<"section">) {
  return <section {...props} className={cn("not-last:mb-6")} />
}

function ProductFilterGroupHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("mb-5 flex items-center justify-between")} {...props} />
  )
}
function ProductFilterGroupTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("text-muted-foreground text-sm leading-none capitalize")}
      {...props}
    />
  )
}

function FilterGroupSkeleton() {
  return (
    <div>
      <Skeleton className="mb-4 h-4 w-1/3 rounded-sm" />
      <div className="grid gap-2">
        <div className="flex gap-2">
          <Skeleton className="size-3.5 rounded-sm" />
          <Skeleton className="h-4 w-5/6 rounded-sm" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="size-3.5 rounded-sm" />
          <Skeleton className="h-4 w-5/6 rounded-sm" />
        </div>
        <div className="relative flex w-full gap-2">
          <Skeleton className="size-3.5 rounded-sm" />
          <div className="relative grid w-full gap-2">
            <Skeleton className="h-4 w-9/10 rounded-sm" />
            <Skeleton className="h-4 w-7/10 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterSkeleton() {
  return (
    <div className={cn("hidden basis-1/5 flex-col gap-6 md:flex")}>
      <div className="relative flex w-full items-center justify-between">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-1/5" />
        <Skeleton />
      </div>
      <FilterGroupSkeleton />
      <FilterGroupSkeleton />
      <FilterGroupSkeleton />
    </div>
  )
}

export {
  FilterSkeleton,
  ProductFilter,
  ProductFilterContent,
  ProductFilterGroup,
  ProductFilterGroupHeader,
  ProductFilterGroupTitle,
  ProductFilterHeader,
  ProductFilterTitle,
}
