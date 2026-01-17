import { SafeUser } from '@/schemas/safe-user';
import { atom } from 'jotai';

const userAtom = atom<SafeUser | null>(null);

export { userAtom };
