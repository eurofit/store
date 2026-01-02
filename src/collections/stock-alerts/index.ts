import { validateOutOfStock } from '@/collections/stock-alerts/hooks/validate-out-of-stock';
import { CollectionConfig } from 'payload';

export const StockAlerts: CollectionConfig = {
  slug: 'stock-alerts',
  typescript: {
    interface: 'StockAlert',
  },
  admin: {
    useAsTitle: 'user',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'productLine',
      type: 'relationship',
      relationTo: 'product-lines',
      required: true,
    },
    {
      name: 'notificationCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'lastNotifiedAt',
      type: 'date',
    },
  ],
  hooks: {
    beforeChange: [validateOutOfStock],
  },
  indexes: [
    {
      fields: ['user', 'productLine'],
      unique: true,
    },
  ],
};
