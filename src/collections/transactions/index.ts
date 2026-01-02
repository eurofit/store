import { CollectionConfig } from 'payload';
import { markOrderPaid } from './hooks/mark-order-paid';

export const transactions: CollectionConfig = {
  slug: 'transactions',
  labels: {
    singular: 'Transaction',
    plural: 'Transactions',
  },
  typescript: {
    interface: 'Transaction',
  },
  fields: [
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'ref',
      type: 'text',
      required: true,
    },
    {
      name: 'provider',
      type: 'text',
      required: true,
    },
  ],
  hooks: {
    afterChange: [markOrderPaid],
  },
};
