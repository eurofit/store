import { Block } from 'payload';

export const form: Block = {
  slug: 'form',
  interfaceName: 'FormBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
  ],
};
