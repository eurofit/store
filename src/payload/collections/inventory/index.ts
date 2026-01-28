import { CollectionConfig } from 'payload';
import { retailPriceField } from './fields/retail-price';

export const inventory: CollectionConfig = {
  slug: 'inventory',
  typescript: {
    interface: 'InventoryItem',
  },
  admin: {
    useAsTitle: 'title',
  },
  labels: {
    singular: 'Inventory Item',
    plural: 'Inventory',
  },
  fields: [
    {
      name: 'item',
      type: 'relationship',
      relationTo: 'product-lines',
      required: true,
      hasMany: false,
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        hidden: true,
        disableListColumn: true,
      },
      virtual: 'item.title',
    },
    retailPriceField,
    {
      name: 'stock',
      type: 'number',
      label: 'Stock',
      required: true,
      defaultValue: 0,
      min: 0,
      validate: (value?: number | null) => {
        if (value === undefined || value === null) {
          return 'Stock is required';
        }
        if (value < 0) {
          return 'Stock must be a positive number';
        }
        return true;
      },
      admin: {
        step: 1,
      },
    },
    {
      name: 'expiryDate',
      type: 'date',
      label: 'Expiry Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          minDate: new Date(),
        },
      },
    },
  ],
};
