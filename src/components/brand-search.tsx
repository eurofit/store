"use client"

import { searchBrand as searchBrandAction } from "@/actions/search-brand"
import { useToggle } from "@/hooks/use-toggle"
import { cn } from "@/utils/cn"
import { useMutation } from "@tanstack/react-query"
import { ImageOff, Search } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { useClickAway } from "react-use"
import { useDebouncedCallback } from "use-debounce"
import { ImageWithRetry } from "./image-with-retry"
import { buttonVariants } from "./ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { Spinner } from "./ui/spinner"

export function BrandSearch() {
  const ref = React.useRef<HTMLDivElement>(null!)
  const { value: open, setOn, setOff } = useToggle()

  const {
    mutate: searchBrand,
    data,
    isPending: isSearching,
  } = useMutation({
    mutationKey: ["brands-search"],
    mutationFn: searchBrandAction,
  })

  const debouncedSearch = useDebouncedCallback(searchBrand, 300)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value

    debouncedSearch.cancel()

    if (query.trim() === "") {
      return
    }

    debouncedSearch(query)
  }

  const isResult = data && data.brands.length > 0

  useClickAway(ref, setOff)

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <InputGroup className=" bg-background">
        <InputGroupAddon>
          {isSearching ? <Spinner /> : <Search />}
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          placeholder="Search brands"
          autoComplete="off"
          onFocus={setOn}
          onBlur={setOff}
          onChange={handleChange}
        />
      </InputGroup>
      {open && isResult && (
        <div
          data-open={open}
          className="bg-popover p-4 data-open:animate-in data-[open=false]:zoom-out-95 data-[state=false]:fade-out-0 data-[open=false]:animate-out text-popover-foreground absolute top-full right-0 left-0 z-9999 mt-2 overflow-hidden overscroll-contain rounded-md border shadow-lg"
        >
          {data?.brands.map(({ id, title, slug, image }) => (
            <Link
              key={id}
              href={`/brands/${slug}`}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-auto w-full justify-start items-center p-3"
              )}
            >
              <div className="flex w-full items-center gap-3">
                <div className="relative mt-0.5 flex size-9 items-center justify-center rounded-md shadow">
                  {image ? (
                    <ImageWithRetry
                      src={image}
                      alt={title}
                      height={64}
                      width={64}
                      className="m-auto max-h-11/12 object-contain"
                      priority
                      loading="eager"
                    />
                  ) : (
                    <ImageOff className="text-muted-foreground/50 size-3/5" />
                  )}
                </div>
                <div className="flex-1 text-left whitespace-break-spaces">
                  <p className="text-sm font-medium text-pretty">{title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
