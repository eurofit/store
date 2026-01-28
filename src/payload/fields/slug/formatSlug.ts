import { slugify } from '@/utils/slugify';
import type { FieldHook } from 'payload';

export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === 'string') {
      return slugify(value);
    }

    if (operation === 'create' || !data?.slug) {
      const fallbackData = data?.[fallback];

      if (fallbackData && typeof fallbackData === 'string') {
        return slugify(fallbackData);
      }
    }

    return value;
  };
