// import { Cart } from '@/payload/types';
// import { QueryClient } from '@tanstack/react-query';
// import { updateTag } from 'next/cache';
// import { CollectionAfterChangeHook } from 'payload';

// export const revalidateCache: CollectionAfterChangeHook<Cart> = ({ doc }) => {
//   const queryClient = new QueryClient();

//   // nextjs cache invalidation

//   updateTag('cart');
//   updateTag(`cart:${doc.id}`);
//   updateTag(`cart:${doc.guestSessionId}`);

//   // react query cache invalidation
//   queryClient.invalidateQueries({
//     queryKey: ['cart', `cart:${doc.id}`, `cart:${doc.guestSessionId}`],
//   });

//   return doc;
// };
