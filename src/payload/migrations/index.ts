import * as migration_20260131_144615 from './20260131_144615';
import * as migration_20260211_174638_add_events from './20260211_174638_add_events';

export const migrations = [
  {
    up: migration_20260131_144615.up,
    down: migration_20260131_144615.down,
    name: '20260131_144615',
  },
  {
    up: migration_20260211_174638_add_events.up,
    down: migration_20260211_174638_add_events.down,
    name: '20260211_174638_add_events'
  },
];
