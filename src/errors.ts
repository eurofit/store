// ===============================
// USER ERRORS
// ===============================

export class UserNotFoundError extends Error {
  code: string = 'USER_NOT_FOUND';
  constructor() {
    super('User not found');
  }
}

// ==============================
// PRODUCT ERRORS
// ==============================
export class ProductNotFoundError extends Error {
  code: string = 'PRODUCT_NOT_FOUND';
  constructor() {
    super('Product not found');
  }
}

// ==============================
// Cart Errors
// ==============================

export class CartNotFound extends Error {
  code: string = 'CART_NOT_FOUND';

  constructor() {
    super('Cart not found');
  }
}

export class CartProductNotFoundError extends Error {
  items: string[];
  code: string = 'CART_PRODUCT_NOT_FOUND';

  constructor(items: string[]) {
    super('Cart products not found');
    this.items = items;
  }
}

export class CartProductOutOfStockError extends Error {
  item: string;
  code: string = 'CART_PRODUCT_OUT_OF_STOCK';

  constructor(item: string) {
    super(`Cart product is out of stock`);
    this.item = item;
  }
}

export class CartInsufficientStockError extends Error {
  item: string;
  availableStock: number;
  code: string = 'CART_INSUFFICIENT_STOCK';

  constructor(item: string, availableStock: number) {
    super(`Cart item  has insufficient stock`);
    this.item = item;
    this.availableStock = availableStock;
  }
}

export class CartPriceMismatchError extends Error {
  item: string;
  expectedPrice: number;
  receivedPrice: number;
  code: string = 'CART_PRICE_MISMATCH';

  constructor(item: string, expectedPrice: number, receivedPrice: number) {
    super(`Cart item has a price mismatch`);
    this.item = item;
    this.expectedPrice = expectedPrice;
    this.receivedPrice = receivedPrice;
  }
}
