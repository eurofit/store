import { getBrand } from '@/actions/brands/get-brand';
import { Skeleton } from './ui/skeleton';

type BrandHeaderProps = {
  slug: Promise<string>;
};

export async function BrandHeader({ slug }: BrandHeaderProps) {
  const brand = await getBrand({ slug: await slug });

  return (
    <div>
      <div className="flex items-start gap-4">
        {/* TODO: add brand logo  */}

        <h1 className="text-balanced scroll-m-20 text-4xl font-extrabold tracking-tight">
          {brand.title}
        </h1>
      </div>
    </div>
  );
}

export function BrandHeaderSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-20 rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-62.5" />
        <Skeleton className="h-4 w-50" />
      </div>
    </div>
  );
}
