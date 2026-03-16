import {
  getOrderConfirmationEmailHTML,
  getOrderConfirmationEmailText,
} from '@/emails/order-confirmation';
import { env } from '@/env.mjs';
import { Order, Transaction, User } from '@/payload/types';
import { sampleInvoice } from '@/pdf/invoice/data';
import { InvoiceDoc } from '@/pdf/invoice/doc';
import { orderItem, orderItemSnapShotSchema } from '@/schemas/order';
import { pdf } from '@react-pdf/renderer';
import { CollectionAfterChangeHook } from 'payload';
import QrCode from 'qrcode';
import * as z from 'zod';

export const sendOrderConfimationEmail: CollectionAfterChangeHook<Transaction> = async ({
  operation,
  req,
  doc: transaction,
  context,
}) => {
  if (operation !== 'create') {
    return;
  }
  const isOrderPopulated =
    typeof transaction.order === 'object' && transaction.order !== null;
  const orderId =
    typeof transaction.order === 'number' ? transaction.order : transaction.order.id;

  let order: Order;

  if (isOrderPopulated) {
    order = transaction.order as Order;
  } else if (context.order) {
    order = context.order as Order;
  } else {
    order = await req.payload.findByID({
      id: orderId,
      collection: 'orders',
      req,
    });
  }

  let customer: User;

  if (typeof order.customer === 'object' && order.customer !== null) {
    customer = order.customer as User;
  } else {
    customer = await req.payload.findByID({
      collection: 'users',
      id: order.customer,
      req,
    });
  }

  const items = order.items.map(({ snapshot, ...item }) => ({
    ...item,
    ...(typeof snapshot === 'object' ? snapshot : {}),
    id: typeof item.productLine === 'string' ? item.productLine : item.productLine.id,
  }));

  const itemSchema = orderItemSnapShotSchema.extend(
    orderItem.pick({ id: true, quantity: true }).shape,
  );

  const formattedItems = z.array(itemSchema).parse(items);

  const qr = await QrCode.toDataURL('https://g.page/r/CS7vpFfn8OgQEAE/review', {
    margin: 0,
  });

  const invoicePdf = pdf(<InvoiceDoc data={sampleInvoice} qrCode={qr} />).toString();

  req.payload.sendEmail({
    from: `EUROFIT <${env.SMTP_USERNAME}>`,
    to: customer.email,
    subject: 'Order Confirmation',
    text: getOrderConfirmationEmailText({
      customer: {
        name: customer.firstName,
      },
      order: {
        id: order.id.toString(),
        items: formattedItems.map((item) => ({
          quantity: item.quantity,
          price: item.price,
          variant: item.variant,
          product: {
            title: item.product.title,
            image: item.product.image,
          },
        })),
        total: order.total! + 300,
        subtotal: order.total!,
        deliveryFee: 350,
      },
    }),
    html: await getOrderConfirmationEmailHTML({
      customer: {
        name: customer.firstName,
      },
      order: {
        id: order.id.toString(),
        items: formattedItems.map((item) => ({
          quantity: item.quantity,
          price: item.price,
          variant: item.variant,
          product: {
            title: item.product.title,
            image: item.product.image,
          },
        })),
        total: order.total! + 300,
        subtotal: order.total!,
        deliveryFee: 350,
      },
    }),
    replyTo: env.SMTP_INFO_USERNAME,
    attachments: [
      {
        filename: `invoice-${order.id}.pdf`,
        content: invoicePdf,
        contentType: 'application/pdf',
      },
    ],
  });

  return transaction;
};
