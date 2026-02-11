import { EVENT_TYPES } from '@/constants/events';
import { CollectionConfig } from 'payload';

export const events: CollectionConfig = {
  slug: 'events',
  typescript: {
    interface: 'Event',
  },
  labels: {
    singular: 'Event',
    plural: 'Events',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [...EVENT_TYPES],
      required: true,
    },
    {
      name: 'time',
      type: 'date',
      required: true,
      index: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      index: true,
    },
    {
      name: 'session',
      type: 'text',
      required: true,
    },

    // brands
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      hasMany: false,
    },
    // categories
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
    },
    // products
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      hasMany: false,
    },
    // product lines
    {
      name: 'productLine',
      type: 'relationship',
      relationTo: 'product-lines',
      hasMany: false,
    },
    // extra
    {
      name: 'quantity',
      type: 'number',
    },
    {
      name: 'price',
      type: 'number',
    },

    {
      name: 'source',
      type: 'text',
    },
    {
      name: 'device',
      type: 'text',
    },
    {
      name: 'geoCountry',
      type: 'text',
    },
    {
      name: 'geoCity',
      type: 'text',
    },
  ],
  timestamps: false,
};
