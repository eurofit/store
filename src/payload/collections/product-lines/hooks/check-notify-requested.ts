import { ProductLine } from '@/payload/types';
import { FieldHook } from 'payload';

export const checkIfNotfiyRequested: FieldHook<
  ProductLine,
  ProductLine['isNotifyRequested'],
  ProductLine
> = async ({ data, req }) => {
  const currentUserId = typeof req.user === 'string' ? req.user : req.user?.id;

  if (!currentUserId) return false;

  const { totalDocs } = await req.payload.count({
    collection: 'stock-alerts',
    where: {
      and: [
        {
          user: {
            equals: currentUserId,
          },
        },
        {
          productLine: {
            equals: data?.id,
          },
        },
      ],
    },
  });

  return totalDocs > 0;
};
