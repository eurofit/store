import { ProductLine } from '@/payload/types';
import { FieldHook } from 'payload';

export const checkIfBackOrder: FieldHook<
  ProductLine,
  ProductLine['isBackorder'],
  ProductLine
> = ({ data }) => {
  if (data?.stock === undefined && data?.srcStock === undefined) {
    throw new Error(
      'Stock and SrcStock fields are required to determine back-ordered status.',
    );
  }
  return true;
};
