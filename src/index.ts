import { registerPlugin } from '@capacitor/core';

import type { DispenserPlugin } from './definitions';

const Dispenser = registerPlugin<DispenserPlugin>('Dispenser', {
  web: () => import('./web').then(m => new m.DispenserWeb()),
});

export * from './definitions';
export { Dispenser };
