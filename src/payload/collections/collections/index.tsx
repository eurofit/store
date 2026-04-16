import { CollectionConfig, slugField } from 'payload';

export const collections: CollectionConfig = {
  slug: 'collections',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    slugField(),
    {
      type: 'group',
      label: 'Header',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'href',
          label: 'Link URL',
          type: 'text',
        },
      ],
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: true,
      minRows: 1,
    },
    {
      name: 'styles',
      type: 'group',
      fields: [
        {
          name: 'headerBg',
          type: 'text',
        },
        {
          name: 'headerFg',
          type: 'text',
        },
        {
          name: 'contentBg',
          type: 'text',
        },
        {
          name: 'contentFg',
          type: 'text',
        },
      ],
    },
    {
      name: 'timer',
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
