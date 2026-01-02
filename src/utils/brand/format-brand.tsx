import { formatProducts } from '@/components/format-products';
import { Brand as PayloadBrand } from '@/payload-types';

type Brand = Pick<PayloadBrand, 'id' | 'slug' | 'srcImage' | 'title' | 'products'>;

export function formatBrand(brand: Brand) {
  return {
    ...brand,
    products: formatProducts(brand.products?.docs),
  };
}

export type FormattedBrand = ReturnType<typeof formatBrand>;
