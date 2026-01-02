import { Cart } from '@/payload-types';
import { ArrayFieldClient, DefaultServerCellComponentProps } from 'payload';

type CartTotalItemsCellProps = DefaultServerCellComponentProps<
  ArrayFieldClient,
  Cart['items']
>;

export function CartTotalItemsCell({ cellData }: CartTotalItemsCellProps) {
  const totalItems = cellData.reduce((total, item) => total + item.quantity, 0);
  return <span>{totalItems}</span>;
}
