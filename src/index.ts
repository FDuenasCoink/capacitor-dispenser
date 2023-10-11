import { registerPlugin } from '@capacitor/core';

import type { DispenserPluginElectron } from './definitions';

const Dispenser = registerPlugin<DispenserPluginElectron>('Dispenser', {
  web: () => import('./web').then(m => new m.DispenserPluginWeb()),
  electron: () => (window as any).CapacitorCustomPlatform.plugins.Dispenser,
});

export * from './definitions';
export { Dispenser }
