import { CollectionConfig } from 'payload';

const DISCOUNT_TYPES = [
  {
    label: 'Amount',
    value: 'amount',
  },
  {
    label: 'Buy X Get Y',
    value: 'buy-x-get-y',
  },
];

const DISCOUNT_VALUE_TYPES = [
  {
    label: 'Fixed Amount',
    value: 'fixed',
  },
  {
    label: 'Percentage',
    value: 'percentage',
  },
];

const APPLIES_TO_OPTIONS = [
  {
    label: 'Products',
    value: 'products',
  },
  {
    label: 'Collections',
    value: 'collections',
  },
  {
    label: 'Categories',
    value: 'categories',
  },
];

export const discounts: CollectionConfig = {
  slug: 'discounts',
  fields: [
    {
      name: 'type',
      type: 'select',
      options: DISCOUNT_TYPES,
      required: true,
      defaultValue: 'amount',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'valueType',
          type: 'select',
          options: DISCOUNT_VALUE_TYPES,
          defaultValue: 'fixed',
          admin: {
            condition: (data) => data?.type === 'amount',
          },
        },
        {
          name: 'value',
          type: 'number',
          defaultValue: 0,
          admin: {
            condition: (data) => data?.type === 'amount',
          },
        },
      ],
    },
    {
      name: 'appliesTo',
      type: 'select',
      options: APPLIES_TO_OPTIONS,
      defaultValue: 'products',
      admin: {
        readOnly: true,
        condition: (data) => data?.type === 'buy-x-get-y',
      },
    },
    {
      name: 'productLines',
      type: 'relationship',
      relationTo: 'product-lines',
      hasMany: true,
      admin: {
        condition: (data) => data?.appliesTo === 'products' && data.type === 'amount',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      defaultValue: new Date().toISOString(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          minDate: new Date(),
        },
      },
    },
  ],
};
