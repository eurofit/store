import { SafeUser } from '@/lib/schemas/safe-user';
import { atom } from 'jotai';

const userAtom = atom<SafeUser | null>(null);

export { userAtom };
