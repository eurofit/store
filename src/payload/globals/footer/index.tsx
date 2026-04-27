import { GlobalConfig } from 'payload';

export const footer: GlobalConfig = {
  slug: 'footer',
  fields: [
    {
      name: 'tagline',
      label: 'Tagline',
      type: 'text',
      required: true,
    },
    {
      name: 'nav',
      label: 'Navigation',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
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
      required: true,
      //   minRows: 4,
    },
  ],
};
