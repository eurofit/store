'use client';

import { useCart } from '@/hooks/use-cart';
import { CartItem } from '@/schemas/cart';
import * as React from 'react';

type CheckoutContextProps = {
  totalItems: number;
  items: CartItem[];
  isCartQueryPending: boolean;
  isCartPending: boolean;
  onCartPending: (isPending: boolean) => void;
};

const CheckoutContext = React.createContext<CheckoutContextProps | null>(null);

export function useCheckout() {
  const context = React.useContext(CheckoutContext);

  if (!context) {
    throw new Error('useCheckout must be used within a <CheckoutProvider />');
  }

  return context;
}

type CheckoutProviderProps = {
  children: React.ReactNode;
};

export const CheckoutProvider = ({ children }: CheckoutProviderProps) => {
  const [isCartPending, setIsCartPending] = React.useState(false);
  const {
    queryResult: { cart, isQueryPending },
  } = useCart();

  const totalItems = React.useMemo(
    () => (cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0),
    [cart],
  );

  const items = React.useMemo(() => cart?.items ?? [], [cart]);

  return (
    <CheckoutContext.Provider
      value={{
        totalItems,
        items,
        isCartPending,
        isCartQueryPending: isQueryPending,
        onCartPending: setIsCartPending,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
