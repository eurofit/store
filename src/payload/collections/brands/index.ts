import { titleCase } from '@/payload/hooks/title-case';
import type { CollectionConfig } from 'payload';
import { slugField } from 'payload';

export const brands: CollectionConfig = {
  slug: 'brands',
  typescript: {
    interface: 'Brand',
  },
  labels: {
    singular: 'Brand',
    plural: 'Brands',
  },
  admin: {
    description: 'Manage brands associated with products in the store.',
    useAsTitle: 'title',
    listSearchableFields: ['id', 'title', 'slug'],
    defaultColumns: ['srcImage', 'title'],
  },
  defaultPopulate: {
    slug: true,
    title: true,
    srcImage: true,
  },
  defaultSort: 'title',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Brand Name',
      required: true,
      unique: true,
      admin: {
        description: 'The name of the brand, used for display and identification.',
      },
      index: true,
      hooks: {
        beforeValidate: [titleCase],
      },
    },
    slugField(),

    {
      name: 'srcImage',
      type: 'text',
      label: 'Brand Image From the Source',
      admin: {
        components: {
          Cell: {
            path: '@/payload/fields/image-cell#ImageCell',
          },
        },
        description:
          'The main image like logo of the brand. This is used as the primary image for the brand. If you have specified the image, this will be used as a fallback.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Brand Logo',
      admin: {
        description:
          'The logo of the brand. If you have specified the srcImage, this will be used first and the srcImage will be used as a fallback.',
      },
    },
    {
      name: 'srcUrl',
      type: 'text',
      label: 'Brand URL',
      admin: {
        description: 'The URL of the brand in providers website',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      required: true,
    },
    {
      name: 'products',
      type: 'join',
      collection: 'products',
      on: 'brand',
      label: 'Products',
      admin: {
        allowCreate: true,
      },
    },
  ],
  hooks: {
    // afterChange: [revalidateBrandsTag],
  },
};
