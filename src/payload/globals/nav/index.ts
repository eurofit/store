import { GlobalConfig } from 'payload';
import { revalidateNavTag } from './hooks/revalidate-nav-tag';

export const nav: GlobalConfig = {
  slug: 'nav',
  fields: [
    {
      name: 'items',
      label: 'Menu Items',
      type: 'array',
      required: true,
      admin: {
        components: {
          RowLabel: '@/payload/globals/nav/row-label#RowLabel',
        },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    // afterChange: [revalidateNavTag],
  },
};
