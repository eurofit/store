import { Cart } from '@/payload/types';
import { ArrayFieldClient, DefaultServerCellComponentProps } from 'payload';

type TotalItemsCellProps = DefaultServerCellComponentProps<
  ArrayFieldClient,
  Cart['items']
>;

export function TotalItemsCell({ cellData }: TotalItemsCellProps) {
  const totalItems = cellData.reduce((total, item) => total + item.quantity, 0);
  return <span>{totalItems}</span>;
}
