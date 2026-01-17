import { cartAtom } from '@/atoms/cart';
import { Cart, CartItem } from '@/schemas/cart';
import { useAtom } from 'jotai';
import * as React from 'react';

type CartActionTypes = 'ADD_ITEM' | 'REMOVE_ITEM' | 'UPDATE_ITEM_QUANTITY';

type CartOtimisticAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; itemId: string }
  | { type: 'UPDATE_ITEM_QUANTITY'; itemId: string; quantity: number };

const cartReducer = (cart: Cart | null, action: CartOtimisticAction) => {
  return cart;
};

export function useOptimisticCart() {
  const [cart, setCart] = useAtom(cartAtom);
  const [optimisticCart, dispatch] = React.useOptimistic(cart, cartReducer);

  return {
    optimisticCart,
    dispatch,
  };
}
