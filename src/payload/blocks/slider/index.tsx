import { Block } from 'payload';

export const slider: Block = {
  slug: 'slider',
  interfaceName: 'SliderBlock',
  fields: [
    {
      name: 'slides',
      type: 'array',
      fields: [
        {
          name: 'images',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'isDefault',
              label: 'Default',
              type: 'checkbox',
              defaultValue: false,
              required: true,
            },
            {
              name: 'isMobile',
              label: 'Mobile',
              type: 'checkbox',
              defaultValue: false,
              required: true,
            },
          ],
          required: true,
        },
        {
          name: 'link',
          type: 'text',
        },
      ],
      required: true,
    },
    {
      type: 'group',
      label: 'Config',
      fields: [
        {
          name: 'showArrows',
          label: 'Show Arrows',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'showDots',
          label: 'Show Dots',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
};
