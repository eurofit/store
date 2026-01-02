import { addresses } from './addresses';
import { brands } from './brands';
import { carts } from './carts';
import { categories } from './categories';
import { inventory } from './inventory';
import { media } from './media';
import { orders } from './order';
import { orderStatus } from './order/order-status';
import { productLines } from './product-lines';
import { products } from './products';
import { StockAlerts } from './stock-alerts';
import { transactions } from './transactions';
import { users } from './users';

export const collections = [
  media,
  users,
  addresses,
  brands,
  products,
  productLines,
  categories,
  carts,
  orders,
  orderStatus,
  transactions,
  inventory,
  StockAlerts,
];
