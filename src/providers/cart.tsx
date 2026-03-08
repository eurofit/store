'use client';

import { CartResponse } from '@/actions/cart';
import { CartItem } from '@/schemas/cart';
import * as React from 'react';

type CartContextProps = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isEmpty: boolean;
};

const CartContext = React.createContext<CartContextProps | null>(null);

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

type CartProviderProps = {
  cart: CartResponse;
};

export function CartProvider({
  children,
  cart,
}: React.PropsWithChildren<CartProviderProps>) {
  const totalItems = React.useMemo(
    () => (cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0),
    [cart],
  );

  const totalPrice = React.useMemo(
    () =>
      cart
        ? cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
        : 0,
    [cart],
  );

  const items = React.useMemo(() => cart?.items ?? [], [cart]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        isEmpty: totalItems === 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
