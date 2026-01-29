import { createBreadcrumbsField } from '@payloadcms/plugin-nested-docs';
import { CollectionConfig, slugField } from 'payload';

export const categories: CollectionConfig = {
  slug: 'categories',
  typescript: {
    interface: 'Category',
  },
  labels: {
    singular: 'Category',
    plural: 'Categories',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title'],
  },
  defaultSort: 'title',
  defaultPopulate: {
    title: true,
    slug: true,
  },
  fields: [
    slugField(),
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Category Name',
      admin: {
        description: 'Enter the name of the category.',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        {
          label: 'Product',
          value: 'product',
        },
        {
          label: 'Post',
          value: 'post',
        },
      ],
      hasMany: true,
      label: 'Category Type',
      defaultValue: 'product',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Provide a brief description of the category.',
      },
    },

    {
      name: 'srcUrl',
      type: 'text',
      label: 'Source URL',
      admin: {
        description: "This is the URL of the supplier's page for this category.",
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        description: 'Indicates whether the category is currently active.',
        position: 'sidebar',
      },
    },
    {
      name: 'products',
      type: 'join',
      collection: 'products',
      on: 'categories',
      defaultSort: 'title',
      defaultLimit: 0,
      hasMany: true,
    },

    createBreadcrumbsField('categories', {
      admin: {
        hidden: true,
      },
    }),
  ],
  hooks: {
    // afterChange: [revalidateCategoriesTag],
  },
};
