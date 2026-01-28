// 'use server';

// import { Brand } from '@/payload/types';
// import { updateTag } from 'next/cache';
// import { CollectionAfterChangeHook } from 'payload';

// export const revalidateBrandsTag: CollectionAfterChangeHook<Brand> = async ({ doc }) => {
//   updateTag('brands');
//   updateTag(`brands:${doc.id}`);
// };
