import { orderStatus, paymentStatus } from '@/constants/orders';
import { autoincrement } from '@/payload/hooks/auto-increment';
import { CollectionConfig } from 'payload';
import { getOrderTotal } from './hooks/get-order-total';
import { getOrderStatus } from './hooks/status';
import { validateOrderItems } from './hooks/validate-order-items';

export const orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Order',
    plural: 'Orders',
  },
  typescript: {
    interface: 'Order',
  },
  fields: [
    {
      name: 'orderIdNumber',
      label: 'Order Id',
      type: 'number',
      required: true,
      admin: {
        hidden: true,
      },
      unique: true,
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'address',
      type: 'relationship',
      relationTo: 'addresses',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        components: {
          Cell: '../../fields/cart/total-items-cell#CartTotalItemsCell',
        },
      },
      fields: [
        {
          name: 'productLine',
          type: 'relationship',
          relationTo: 'product-lines',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'snapshot',
          type: 'json',
          required: true,
          admin: {
            description: 'Snapshot of the product line at the time of purchase',
            hidden: true,
          },
        },
      ],
    },
    {
      name: 'total',
      type: 'number',
      defaultValue: 0,
      virtual: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        afterRead: [getOrderTotal],
      },
    },
    {
      name: 'status',
      type: 'select',
      options: orderStatus,
      defaultValue: 'pending',
      required: true,
      virtual: true,
      admin: {
        hidden: true,
      },
      hooks: {
        afterRead: [getOrderStatus],
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      defaultValue: 'unpaid',
      options: paymentStatus,
    },
    {
      name: 'snapshot',
      type: 'json',
      required: true,
      admin: {
        description: 'Snapshot of the order at the time of purchase',
        hidden: true,
      },
    },
    {
      name: 'transactions',
      type: 'join',
      collection: 'transactions',
      on: 'order',
      hasMany: true,
    },
  ],
  hooks: {
    beforeChange: [validateOrderItems, autoincrement({ field: 'orderIdNumber' })],
  },
};
