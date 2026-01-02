'use client';

import { cartAtom, cartHydratedAtom } from '@/atoms/cart';
import { Cart } from '@/lib/schemas/cart';
import { useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';

type CartHydrateProps = {
  cart: Cart | null;
};

export function CartHydrate({ cart }: CartHydrateProps) {
  const setCartHydrated = useSetAtom(cartHydratedAtom);
  const setCart = useSetAtom(cartAtom);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    setCartHydrated(true);

    if (cart) {
      setCart(cart);
    }
  }, [cart, setCart]);

  return null;
}
