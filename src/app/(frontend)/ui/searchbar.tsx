"use client"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Search, X } from "lucide-react"

export function Searchbar() {
  return (
    <div className="w-full space-y-6 max-w-sm">
      <InputGroup className="bg-background">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          name="q"
          autoComplete="off"
          placeholder="Search..."
        />
        <InputGroupAddon align="inline-end">
          <Button size="icon-sm" variant="ghost">
            <X />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
