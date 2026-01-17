import { Cart, CartItem } from '@/schemas/cart';
import { atom } from 'jotai';

const cartHydratedAtom = atom(false);

const cartAtom = atom<Cart | null>(null);

const cartItemsAtom = atom(
  (get) => {
    const cart = get(cartAtom);
    return cart ? cart.items : [];
  },
  (get, set, next: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
    const cart = get(cartAtom);
    if (!cart) {
      set(cartAtom, {
        id: 'optimistic-cart-id',
        items: typeof next === 'function' ? next([]) : next,
      });
      return;
    }

    const prevItems = cart.items;
    const nextValue = typeof next === 'function' ? next(prevItems) : next;

    set(cartAtom, { ...cart, items: nextValue });
  },
);

const totalCartItemsAtom = atom(
  (get) => get(cartAtom)?.items.reduce((total, item) => total + item.quantity, 0) || 0,
);

export { cartAtom, cartHydratedAtom, cartItemsAtom, totalCartItemsAtom };
