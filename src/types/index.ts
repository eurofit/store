// =======================
// nextjs
// =======================

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

// =======================
// PRODUCTS & BRANDS
// =======================

// TODO: move these to schema

export type Brand = {
  id: string;
  slug: string;
  title: string;
  image?: string | null;
  updatedAt?: string;
};

export type ProductLine = {
  id: string;
  sku: string;
  slug: string;
  title: string;
  stock: number;
  price: number | null;
  variant?: string | null;
  isBackorder: boolean;
  isOutOfStock: boolean;
  isLowStock: boolean;
  isNotifyRequested: boolean;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  origin?: string | null;
  image?: string | null;
  productLines: ProductLine[];
};

export type Category = {
  id: string;
  slug: string;
  title: string;
};

// =======================
// ORDERS
// =======================

export type Order = {
  id: number;
  createdAt: string;
  total?: number | null;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
};

// =======================
// FILTERS
// =======================

export type FilterItem = {
  slug: string;
  title: string;
  count: number;
};

export type FilterGroup = {
  key: string;
  title: string;
  items: FilterItem[];
};
