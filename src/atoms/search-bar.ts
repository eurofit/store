import { STORAGE_KEYS } from '@/constants/keys';
import { atomWithStorage } from 'jotai/utils';

export const recentSearchesAtom = atomWithStorage<string[] | undefined>(
  STORAGE_KEYS.RECENT_SEARCHES,
  undefined,
);
