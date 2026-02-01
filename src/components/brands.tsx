import { getBrands } from '@/actions/brands/get-brands';
import { BrandList } from './brands-list';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from './ui/empty';

type BrandsProps = {
  page: number;
};

const BRANDS_LIMIT = 35;

export async function Brands({ page }: BrandsProps) {
  const initialData = await getBrands({
    page,
    limit: BRANDS_LIMIT,
  });

  if (!initialData.totalBrands) {
    return <EmptyBrands />;
  }

  return <BrandList initialData={initialData} totalBrands={initialData.totalBrands} />;
}

function EmptyBrands() {
  return (
    <Empty className="m-auto flex h-fit w-fit border border-dashed">
      <EmptyHeader>
        <EmptyTitle>Empty Brands</EmptyTitle>
        <EmptyDescription>
          We are currently fixing a technical issue where our available brands are not
          showing.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
