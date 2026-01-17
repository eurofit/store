import {
  addItemToCart,
  createCartWithItem,
  deleteCart,
  getCart,
  removeItemFromCart,
  updateCartItemQuantity,
} from '@/actions/cart';
import { Cart, CartItem } from '@/schemas/cart';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCart() {
  const query = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });

  const { data: cartQueryData, isPending: isQueryPending, ...queryRest } = query;

  const createCartWithItemMutation = useMutation({
    mutationFn: async ({ id, quantity, price }: CartItem) =>
      await createCartWithItem({
        item: id,
        quantity,
        price,
      }),
    onMutate: async (item, context) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await context.client.cancelQueries({ queryKey: ['cart'] });

      // Snapshot the previous cart value
      const previousCart = context.client.getQueryData<Cart>(['cart']);

      context.client.setQueryData<Cart>(['cart'], (old) => {
        if (!old)
          return {
            id: 'optimistic',
            items: [item],
          };

        return { ...old, items: [...old.items, item] };
      });

      // Return a result with the snapshotted value
      return { previousCart };
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (_err, _newTodo, onMutateResult, context) => {
      context.client.setQueryData(['cart'], onMutateResult?.previousCart);
      toast.error('Failed to create cart');
    },
    onSuccess: () => {
      toast.success('Cart created');
    },
    // Always refetch after error or success:
    onSettled: (_data, _error, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: ['cart'] }),
  });

  const addItemToCartMutation = useMutation({
    mutationFn: async ({ id, quantity, price }: CartItem) =>
      await addItemToCart({
        item: id,
        quantity,
        price,
      }),
    onMutate: async (item, context) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await context.client.cancelQueries({ queryKey: ['cart'] });

      // Snapshot the previous cart value
      const previousCart = context.client.getQueryData<Cart>(['cart']);

      context.client.setQueryData<Cart>(['cart'], (old) => {
        if (!old)
          return {
            id: 'optimistic',
            items: [item],
          };

        return { ...old, items: [...old.items, item] };
      });

      // Return a result with the snapshotted value
      return { previousCart };
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (_err, _newTodo, onMutateResult, context) => {
      context.client.setQueryData(['cart'], onMutateResult?.previousCart);

      toast.error('Failed to update cart');
    },
    onSuccess: () => {
      toast.success('Cart updated');
    },
    // Always refetch after error or success:
    onSettled: (_data, _error, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: ['cart'] }),
  });

  const updateCartItemQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity, price }: CartItem) =>
      await updateCartItemQuantity({
        item: id,
        quantity,
        price,
      }),
    onMutate: async (item, context) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await context.client.cancelQueries({ queryKey: ['cart'] });

      // Snapshot the previous cart value
      const previousCart = context.client.getQueryData<Cart>(['cart']);

      context.client.setQueryData<Cart>(['cart'], (old) => {
        if (!old)
          return {
            id: 'optimistic',
            items: [item],
          };

        return {
          ...old,
          items: old.items.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: item.quantity } : cartItem,
          ),
        };
      });

      // Return a result with the snapshotted value
      return { previousCart };
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (_err, _newTodo, onMutateResult, context) => {
      context.client.setQueryData(['cart'], onMutateResult?.previousCart);

      toast.error('Failed to update cart qty');
    },
    onSuccess: (_data, item) => {
      toast.success(`Cart updated qty: ${item.quantity}`);
    },
    // Always refetch after error or success:
    onSettled: (_data, _error, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: ['cart'] }),
  });

  const removeItemFromCartMutation = useMutation({
    mutationFn: removeItemFromCart,
    onMutate: async ({ item }, context) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await context.client.cancelQueries({ queryKey: ['cart'] });

      // Snapshot the previous cart value
      const previousCart = context.client.getQueryData<Cart>(['cart']);

      context.client.setQueryData<Cart>(['cart'], (old) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items.filter((cartItem) => cartItem.id !== item),
        };
      });

      // Return a result with the snapshotted value
      return { previousCart };
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (_err, _newTodo, onMutateResult, context) => {
      context.client.setQueryData(['cart'], onMutateResult?.previousCart);

      toast.error('Failed to remove item from cart');
    },
    onSuccess: () => {
      toast.success(`Removed item from cart`);
    },
    // Always refetch after error or success:
    onSettled: (_data, _error, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: ['cart'] }),
  });

  const deleteCartMutation = useMutation({
    mutationFn: deleteCart,
    onMutate: async (_, context) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await context.client.cancelQueries({ queryKey: ['cart'] });

      // Snapshot the previous cart value
      const previousCart = context.client.getQueryData<Cart>(['cart']);

      // Optimistically remove the cart
      context.client.setQueryData<Cart | null>(['cart'], null);

      // Return a result with the snapshotted value
      return { previousCart };
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (_err, _newTodo, onMutateResult, context) => {
      context.client.setQueryData(['cart'], onMutateResult?.previousCart);

      toast.error('Failed to delete the cart');
    },
    onSuccess: () => {
      toast.success(`Deleted the cart`);
    },
    // Always refetch after error or success:
    onSettled: (_data, _error, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: ['cart'] }),
  });

  return {
    queryResult: {
      cart: cartQueryData ?? null,
      isQueryPending,
      ...queryRest,
    },
    createCartWithItemMutation,
    addItemToCartMutation,
    updateCartItemQuantityMutation,
    removeItemFromCartMutation,
    deleteCartMutation,
  };
}
