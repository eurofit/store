import { updateTag } from 'next/cache';
import { GlobalAfterChangeHook } from 'payload';

export const revalidateNavTag: GlobalAfterChangeHook = ({ doc }) => {
  updateTag('nav');
  return doc;
};
