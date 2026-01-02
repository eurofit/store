import { updateTag } from 'next/cache';
import { CollectionAfterChangeHook } from 'payload';

export const revalidateCategoriesTag: CollectionAfterChangeHook = ({ doc }) => {
  updateTag('categories');
  updateTag(`categories:${doc.id}`);
};
