'use server';

import config from '@/payload/config';
import { getPayload } from 'payload';
import * as z from 'zod';

const schema = z.object({
  slug: z.string(),
});

type UnsafeArgs = z.infer<typeof schema>;

export async function getProductLineBySlug(unsafeInput: UnsafeArgs) {
  const validationRes = schema.safeParse(unsafeInput);

  if (!validationRes.success) {
    return z.treeifyError(validationRes.error);
  }

  const { slug } = validationRes.data;

  try {
    const payload = await getPayload({ config });

    const { docs: productLines } = await payload.find({
      collection: 'product-lines',
      where: {
        slug: {
          equals: slug,
        },
      },
      select: {
        slug: true,
        title: true,
        images: true,
        variant: true,
        size: true,
        sku: true,
        retailPrice: true,
        barcode: true,
        product: true,
        discounts: true,
      },
      populate: {
        discounts: {
          type: true,
          valueType: true,
          value: true,
          endDate: true,
        },
        products: {
          slug: true,
          title: true,
          srcImage: true,
          origin: true,
        },
      },
    });

    const productLine = productLines?.[0];

    return productLine
      ? {
          ...productLine,
          discounts:
            productLine.discounts?.docs?.filter((d) => typeof d === 'object') ?? [],
        }
      : null;
  } catch (error) {
    return {
      errors: ['Something went wrong!'],
    };
  }
}
