import { getTotalBrands } from '@/actions/brands/get-total-brands';
import { floorToNearest } from '@/utils/math';

export async function TotalBrands() {
  const totalBrands = await getTotalBrands();
  return <span>{floorToNearest(totalBrands, 10)}</span>;
}
