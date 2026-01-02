import { getBrands } from '@/actions/brands/get-brands';
import { BrandList } from './brands-list';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from './ui/empty';

type BrandsProps = {
  page: Promise<number>;
  pathname?: string;
};

const DEFAULT_PAGE = 1;
const PAGE_LIMIT = 25;

export async function Brands({ page: pagePromise, pathname }: BrandsProps) {
  const page = await pagePromise;

  const { brands, totalDocs: totalBrands } = await getBrands({
    page: DEFAULT_PAGE,
    limit: page > 1 ? page * PAGE_LIMIT : PAGE_LIMIT,
  });

  if (!totalBrands) {
    return <EmptyBrands />;
  }

  return (
    <BrandList initialBrands={brands} totalBrands={totalBrands} pathname={pathname} />
  );
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
