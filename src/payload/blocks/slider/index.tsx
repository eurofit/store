import { Block } from 'payload';

export const slider: Block = {
  slug: 'slider',
  fields: [
    {
      name: 'slides',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
        },
      ],
      required: true,
    },
  ],
};
