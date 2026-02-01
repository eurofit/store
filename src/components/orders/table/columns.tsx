import { Order } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { CurrencyCell } from './cells/currency';
import { DateCell } from './cells/date';
import { IdCell } from './cells/id';
import { StatusCell } from './cells/status';

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: 'Order ID',
    cell: IdCell,
  },
  {
    accessorKey: 'createdAt',
    header: 'Order Date',
    cell: DateCell,
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: CurrencyCell,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: StatusCell,
  },
];
