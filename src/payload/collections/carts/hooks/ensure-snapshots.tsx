import { Cart, ProductLine } from '@/payload/types';
import { CollectionBeforeChangeHook } from 'payload';

export const ensureSnapshots: CollectionBeforeChangeHook<Cart> = async ({
  data,
  originalDoc,
  req: { payload },
}) => {
  const areItemsChanged =
    JSON.stringify(data.items) !== JSON.stringify(originalDoc?.items);

  if (!areItemsChanged) return data;

  const items = data.items;
  const unPopulatedItemIds = items
    ?.map((i) => i.productLine)
    .filter((i) => typeof i === 'string');
  let productLines: ProductLine[];

  if (unPopulatedItemIds && unPopulatedItemIds.length > 0) {
    const productLinesPromises = unPopulatedItemIds.map((id) =>
      payload.findByID({
        collection: 'product-lines',
        id,
        depth: 2,
      }),
    );

    productLines = await Promise.all(productLinesPromises);
  }

  const newItems = items?.map((i) => {
    const hasSnapshot =
      !!i.snapshot &&
      !!i.snapshot.inventoryStock &&
      !!i.snapshot.retailPrice &&
      !!i.snapshot.virtualStock;

    if (hasSnapshot) {
      return i;
    }

    const productLine = productLines.find((pl) => pl.id === i.productLine);

    return {
      ...i,
      snapshot: {
        retailPrice: productLine?.retailPrice,
        inventoryStock: productLine?.inventoryStock,
        virtualStock: productLine?.srcStock,
      },
    };
  });

  return {
    ...data,
    items: newItems,
  };
};
