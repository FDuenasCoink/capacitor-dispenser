import { registerPlugin } from '@capacitor/core';
import { initialize } from "@ionic/core/components";
import { defineCustomElement  as defineCustomElementCheck } from "@ionic/core/components/ion-checkbox";
import { defineCustomElement as defineCustomElementItems } from "@ionic/core/components/ion-item";
import { defineCustomElement as defineCustomElementLabel } from "@ionic/core/components/ion-label";
import { defineCustomElement as defineCustomElementList } from "@ionic/core/components/ion-list";

import type { DispenserPlugin } from './definitions';

initialize();

defineCustomElementCheck();
defineCustomElementLabel();
defineCustomElementItems();
defineCustomElementList();

const Dispenser = registerPlugin<DispenserPlugin>('Dispenser', {
  web: () => import('./web').then(m => new m.DispenserPluginWeb()),
  electron: () => (window as any).CapacitorCustomPlatform.plugins.Dispenser,
});

export * from './definitions';
export { Dispenser }
