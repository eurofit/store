import { Discount } from '@/payload/types';
import { isFuture } from 'date-fns';

type Arg = {
  price: number;
} & Discount;

export function isDiscountValid(discount: Arg) {
  const isEndDateFuture = discount.endDate ? isFuture(discount.endDate) : null;

  return isEndDateFuture;
}
