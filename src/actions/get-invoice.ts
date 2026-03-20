'use server';

import config from '@/payload/config';
import { Invoice, invoiceSchema } from '@/schemas/invoice';
import { getPayload } from 'payload';
import * as z from 'zod';

const inputSchema = z.object({
  orderId: z.number(),
});

type Input = z.infer<typeof inputSchema>;

export async function getInvoice(unsafeInput: Input): Promise<Invoice> {
  const { orderId } = inputSchema.parse(unsafeInput);

  const payload = await getPayload({ config });

  const { docs: orders } = await payload.find({
    collection: 'orders',
    where: {
      id: {
        equals: orderId,
      },
    },
    select: {
      customer: true,
      shippingAddress: true,
      createdAt: true,
      items: {
        productLine: true,
        quantity: true,
        snapshot: true,
      },
      paymentStatus: true,
      total: true,
    },
    populate: {
      users: {
        fullName: true,
        accountNumber: true,
      },
      addresses: {
        user: false,
        area: false,
        createdAt: false,
        updatedAt: false,
        note: false,
        landmark: false,
        label: false,
        secondaryPhone: false,
        isDefault: false,
      },
    },
    pagination: false,
    limit: 1,
  });

  const order = orders[0];

  const formattedOrder = {
    ...order,
    fao: typeof order.customer === 'object' ? order.customer.fullName : order.customer,
    account:
      typeof order.customer === 'object'
        ? order.customer.accountNumber.toString()
        : order.customer,
    shippingAddress:
      typeof order.shippingAddress === 'object' ? order.shippingAddress : null,
    items: order.items.map(({ snapshot, ...item }) => ({
      ...item,
      ...(typeof snapshot === 'object' ? snapshot : {}),
    })),
    id: order.id.toString(),
    date: order.createdAt,
    dueDate: order.createdAt,
    status: order.paymentStatus,
    total: order.total,
    subtotal: order.total,
    deliveryFee: 0.0,
    tax: 0.0,
  };

  return invoiceSchema.parse(formattedOrder);
}
