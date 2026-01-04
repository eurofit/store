import { getBrands } from "@/actions/brands/get-brands"
import { BrandList } from "./brands-list"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./ui/empty"

type BrandsProps = {
  page: Promise<number>
}

const PAGE_LIMIT = 25

export async function Brands({ page: pagePromise }: BrandsProps) {
  const page = await pagePromise

  const initialData = await getBrands({
    page,
    limit: PAGE_LIMIT,
  })

  if (!initialData.totalDocs) {
    return <EmptyBrands />
  }

  return (
    <BrandList initialData={initialData} totalBrands={initialData.totalDocs} />
  )
}

function EmptyBrands() {
  return (
    <Empty className="m-auto flex h-fit w-fit border border-dashed">
      <EmptyHeader>
        <EmptyTitle>Empty Brands</EmptyTitle>
        <EmptyDescription>
          We are currently fixing a technical issue where our available brands
          are not showing.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
