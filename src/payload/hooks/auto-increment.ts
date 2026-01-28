import type { CollectionBeforeChangeHook } from 'payload';

type Args = {
  field: string;
  defaultNumber?: number;
};
export function autoincrement({
  field,
  defaultNumber = 1000,
}: Args): CollectionBeforeChangeHook {
  return async ({ req, operation, collection, data }) => {
    if (operation !== 'create') return data;
    const highest = await req.payload.find({
      collection: collection.slug,
      limit: 1,
      sort: '-' + field,
    });
    const next = (parseInt((highest.docs[0] as any)?.[field]) || defaultNumber) + 1;
    return { ...data, [field]: next };
  };
}
