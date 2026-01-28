'use client';

import { getProductLineById } from '@/actions/product-lines/get-productline-by-id';
import { Cart } from '@/payload/types';
import { useRowLabel } from '@payloadcms/ui';
import * as React from 'react';

export const RowLabel: React.FC = () => {
  const { data } = useRowLabel<Cart['items'][number]>();
  const [title, setTitle] = React.useState<string>('Loading...');

  React.useEffect(() => {
    const productLineId =
      typeof data.productLine === 'string' ? data.productLine : data.productLine?.id;

    if (productLineId) {
      getProductLineById(productLineId).then((pl) => {
        setTitle(pl.title);
      });
    }
  }, [data.productLine]);

  return (
    <div>
      {data.quantity} X {title}
    </div>
  );
};
