'use client';

import { Badge } from '@/components/ui/badge';
import { orderStatus } from '@/constants/orders';
import { Order } from '@/types';
import { cn } from '@/utils/cn';
import { CellContext } from '@tanstack/react-table';

type StatusCellProps = CellContext<Order, unknown>;

export function StatusCell({ getValue }: StatusCellProps) {
  const value = getValue<
    'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  >();

  const status = orderStatus.find((status) => status.value === value);

  return (
    <Badge variant="outline" className={cn(status?.color.bg, status?.color.text)}>
      {status?.label}
    </Badge>
  );
}
