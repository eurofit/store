import { site } from "@/constants/site"
import { cn } from "@/utils/cn"
import { cva, VariantProps } from "class-variance-authority"
import Link from "next/link"
import React from "react"

const logoVariants = cva("font-montserrat uppercase not-italic", {
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
  isHeading?: boolean
  rootClass?: string
} & VariantProps<typeof logoVariants> &
  React.HTMLAttributes<HTMLDivElement>

export function Logo({
  isHeading = false,
  variant,
  rootClass,
  className,
}: LogoProps) {
  const Comp = !!isHeading ? "h1" : "span"
  return (
    <Link href="/" aria-label={site.name} className={cn(rootClass)}>
      <Comp className={logoVariants({ variant, className })}>
        <span>Euro</span>
        <span className="text-red-500">fit</span>
      </Comp>
    </Link>
  )
}
