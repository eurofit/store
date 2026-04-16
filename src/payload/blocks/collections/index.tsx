import { Block } from 'payload';

export const collections: Block = {
  slug: 'collection',
  interfaceName: 'CollectionBlock',
  fields: [
    {
      name: 'collection',
      type: 'relationship',
      relationTo: 'collections',
      hasMany: false,
      required: true,
    },
  ],
};
