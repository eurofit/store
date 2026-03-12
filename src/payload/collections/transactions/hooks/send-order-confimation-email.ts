import { env } from '@/env.mjs';
import { Order, Transaction, User } from '@/payload/types';
import { CollectionAfterChangeHook } from 'payload';

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

  req.payload.sendEmail({
    from: `EUROFIT <${env.SMTP_USERNAME}>`,
    to: customer.email,
    subject: 'Order Confirmation',
    html: `<p>Dear ${customer.firstName},</p>
           <p>Thank you for your order! Your order number is ${order.id}.</p>
           <p>We will notify you once your order has been shipped.</p>
           <p>Best regards,<br/>The Eurofit Team</p>`,
    replyTo: env.SMTP_INFO_USERNAME,
  });

  return transaction;
};
