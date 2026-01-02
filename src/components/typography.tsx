import { cn } from "@/utils/cn"
import { cva, VariantProps } from "class-variance-authority"
import * as React from "react"

/* -------------------------------------------------
 * Heading
 * -------------------------------------------------*/

export const headingVariants = cva("scroll-m-20 tracking-tight text-balance", {
  variants: {
    variant: {
      h1: "text-4xl font-extrabold",
      h2: "border-b pb-2 text-3xl font-semibold first:mt-0",
      h3: "text-2xl font-semibold",
      h4: "text-xl font-semibold",
    },
  },
  defaultVariants: {
    variant: "h1",
  },
})

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & {
    as?: "h1" | "h2" | "h3" | "h4"
  }

export function Heading({ as, variant, className, ...props }: HeadingProps) {
  const Comp = as ?? variant ?? "h1"

  return (
    <Comp className={cn(headingVariants({ variant }), className)} {...props} />
  )
}

// Text & Others
type TextProps = React.HTMLAttributes<HTMLElement>

export function Text({ className, ...props }: TextProps) {
  return <p className={cn("leading-7 not-first:mt-6", className)} {...props} />
}

export function Blockquote({ className, ...props }: TextProps) {
  return (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  )
}

export function Table({ className, ...props }: TextProps) {
  return (
    <div className={cn("my-6 w-full overflow-y-auto", className)} {...props} />
  )
}

export function List({ className, ...props }: TextProps) {
  return (
    <ul
      className={cn("my-6 ml-6 list-disc not-first:mt-2", className)}
      {...props}
    />
  )
}

export function InlineCode({ className, ...props }: TextProps) {
  return (
    <code
      className={cn(
        "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )}
      {...props}
    />
  )
}

export function Lead({ className, ...props }: TextProps) {
  return (
    <p
      className={cn("text-muted-foreground text-xl text-pretty", className)}
      {...props}
    />
  )
}

export function Large({ className, ...props }: TextProps) {
  return <div className={cn("text-lg font-semibold", className)} {...props} />
}

export function Small({ className, ...props }: TextProps) {
  return (
    <small
      className={cn("text-sm leading-none font-medium", className)}
      {...props}
    />
  )
}

export function Muted({ className, ...props }: TextProps) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)} {...props} />
  )
}
