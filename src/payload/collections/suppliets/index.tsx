import { CollectionConfig } from 'payload';

export const suppliers: CollectionConfig = {
  slug: 'suppliers',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description: "The supplier's website URL.",
      },
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          admin: {
            description: "The supplier's contact phone number.",
          },
        },
        {
          name: 'whatsapp',
          type: 'text',
          admin: {
            description: "The supplier's Whatsapp contact number.",
          },
        },
      ],
    },
    {
      name: 'salesPerson',
      type: 'text',
      admin: {
        description: "The name of the supplier's sales contact person.",
      },
    },
  ],
};
