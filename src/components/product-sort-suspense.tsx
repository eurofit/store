import { Suspense } from 'react';
import { ProductSort } from './product-sort';

type Option = {
  label: string;
  value: string;
};

type ProductSortSuspenseProps = {
  className?: string;
  defaultValue?: string;
  options: Option[];
};

function ProductSortFallback({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="h-9 w-45 animate-pulse rounded-md bg-muted" />
    </div>
  );
}

export function ProductSortSuspense(props: ProductSortSuspenseProps) {
  return (
    <Suspense fallback={<ProductSortFallback className={props.className} />}>
      <ProductSort {...props} />
    </Suspense>
  );
}
