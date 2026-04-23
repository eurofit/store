import { addresses } from '@/payload/collections/addresses';
import { brands } from '@/payload/collections/brands';
import { carts } from '@/payload/collections/carts';
import { categories } from '@/payload/collections/categories';
import { collections as collectionsConfig } from '@/payload/collections/collections';
import { events } from '@/payload/collections/events';
import { inventory } from '@/payload/collections/inventory';
import { media } from '@/payload/collections/media';
import { orders } from '@/payload/collections/orders';
import { orderStatus } from '@/payload/collections/orders/order-status';
import { pages } from '@/payload/collections/pages';
import { productLines } from '@/payload/collections/product-lines';
import { products } from '@/payload/collections/products';
import { StockAlerts } from '@/payload/collections/stock-alerts';
import { transactions } from '@/payload/collections/transactions';
import { users } from '@/payload/collections/users';
import { discounts } from './discounts';

export const collections = [
  media,
  users,
  pages,
  addresses,
  brands,
  products,
  collectionsConfig,
  discounts,
  productLines,
  categories,
  carts,
  orders,
  orderStatus,
  transactions,
  inventory,
  StockAlerts,
  events,
];
