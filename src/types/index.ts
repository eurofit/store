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

// =======================
// PAYSTACK
// =======================
export type PastackFailedResponse = {
  status: false;
  message: string;
};

export type PaystackSuccessResponse = {
  status: true;
  message: string;
  data: {
    customer_code: string;
    [key: string]: any;
  };
};

export type PaystackResponse = PastackFailedResponse | PaystackSuccessResponse;

export type PaystackCustomer = {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  metadata?: Record<string, string | number | boolean>;
};
