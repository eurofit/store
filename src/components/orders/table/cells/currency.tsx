'use client';

import { Order } from '@/types';
import { CellContext } from '@tanstack/react-table';

type CurrencyCellProps = CellContext<Order, unknown>;

export function CurrencyCell({ getValue }: CurrencyCellProps) {
  const value = getValue<number>();

  const total = new Intl.NumberFormat('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'KES',
  }).format(value);

  return <p className="tabular-nums">{total}</p>;
}
