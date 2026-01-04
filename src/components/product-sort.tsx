"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/utils/cn"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"

type Option = {
  label: string
  value: string
}

type ProductSortProps = {
  className?: string
  defaultValue?: string
  options: Option[]
}

export function ProductSort({
  className,
  defaultValue,
  options,
}: ProductSortProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === "asc") {
      params.delete("sort")
    } else {
      params.set("sort", value)
    }

    params.sort()

    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select defaultValue={defaultValue} onValueChange={handleChange}>
      <SelectTrigger size="sm" className={cn("w-45", className)}>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort by</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
