'use client';

import { CartItem } from '@/schemas/cart';
import { type ProductLine as ProductLineType } from '@/types';
import * as React from 'react';
import { ProductLine } from './product-line';
import { Separator } from './ui/separator';

type ProductLinesListProps = {
  product: CartItem['product'];
  productLines: ProductLineType[];
  userId?: string | null;
};

export function ProductLinesList({ product, productLines, userId }: ProductLinesListProps) {
  return (
    <div className="space-y-3">
      {productLines.map((line, index) => (
        <React.Fragment key={line.id}>
          <ProductLine product={product} line={line} userId={userId} />
          {index < productLines.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </div>
  );
}
