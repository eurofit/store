import { titleCase } from '@/payload/hooks/title-case';
import { CollectionConfig, slugField } from 'payload';

export const pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'title',
      type: 'text',
      required: true,
      hooks: {
        beforeValidate: [titleCase],
      },
    },
    slugField(),
    {
      name: 'layout',
      label: 'Layout',
      type: 'blocks',
      blockReferences: ['slider', 'collection'],
      blocks: [],
      required: true,
    },
  ],
};
