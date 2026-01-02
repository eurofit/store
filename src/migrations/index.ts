import * as migration_20251223_160731 from './20251223_160731';
import * as migration_20251224_144716 from './20251224_144716';
import * as migration_20251226_194905 from './20251226_194905';

export const migrations = [
  {
    up: migration_20251223_160731.up,
    down: migration_20251223_160731.down,
    name: '20251223_160731',
  },
  {
    up: migration_20251224_144716.up,
    down: migration_20251224_144716.down,
    name: '20251224_144716',
  },
  {
    up: migration_20251226_194905.up,
    down: migration_20251226_194905.down,
    name: '20251226_194905',
  },
];
