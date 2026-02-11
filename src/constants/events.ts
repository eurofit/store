export const EVENT_TYPES = [
  // brands
  {
    label: 'Brand Viewed',
    value: 'brand_viewed',
  },
  // products
  {
    label: 'Product Viewed',
    value: 'product_viewed',
  },
] as const;

export type EventType = (typeof EVENT_TYPES)[number]['value'];
