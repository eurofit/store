import { Block } from 'payload';

export const form: Block = {
  slug: 'form',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
  ],
};
