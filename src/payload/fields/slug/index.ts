import { deepMerge, type CheckboxField, type TextField } from 'payload';

import { formatSlugHook } from './formatSlug';

type Overrides = {
  slugOverrides?: Partial<TextField>;
  checkboxOverrides?: Partial<CheckboxField>;
};

type Slug = (fieldToUse?: string, overrides?: Overrides) => [TextField, CheckboxField];

export const slugField: Slug = (fieldToUse = 'title', overrides = {}) => {
  const { slugOverrides, checkboxOverrides } = overrides;

  const checkBoxField: CheckboxField = {
    name: 'slugLock',
    type: 'checkbox',
    defaultValue: true,
    admin: {
      hidden: true,
      position: 'sidebar',
    },
    required: true,
    label: 'Lock Slug',
    ...checkboxOverrides,
  };

  const baseSlugField: TextField = {
    name: 'slug',
    type: 'text',
    index: true,
    required: true,
    label: 'Slug',

    hooks: {
      // Kept this in for hook or API based updates
      beforeValidate: [formatSlugHook(fieldToUse)],
    },
    admin: {
      position: 'sidebar',

      components: {
        Field: {
          path: '@/fields/slug/slug#Slug',
          clientProps: {
            fieldToUse,
            checkboxFieldPath: checkBoxField.name,
          },
        },
      },
    },
  };

  const slugField = deepMerge(baseSlugField, slugOverrides ?? {});

  return [slugField, checkBoxField];
};
