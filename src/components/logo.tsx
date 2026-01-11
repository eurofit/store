import { site } from "@/constants/site"
import { cn } from "@/utils/cn"
import { cva, VariantProps } from "class-variance-authority"
import Link from "next/link"
import React from "react"

const logoVariants = cva("font-montserrat no-underline! uppercase not-italic", {
  variants: {
    variant: {
      default: "text-2xl font-black",
      inline: "inline text-base font-medium",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

type LogoProps = {
  rootClass?: string
  as?: Extract<React.ElementType, "h1" | "span">
} & VariantProps<typeof logoVariants> &
  React.HTMLAttributes<HTMLDivElement>

export function Logo({ variant, rootClass, className, as = "h1" }: LogoProps) {
  const Comp = as
  return (
    <Link href="/" aria-label={site.name} className={cn(rootClass)}>
      <Comp className={logoVariants({ variant, className })}>
        <span>Euro</span>
        <span className="text-red-500">fit</span>
      </Comp>
    </Link>
  )
}
