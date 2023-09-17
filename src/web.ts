import { WebPlugin } from '@capacitor/core';

import type { DispenserPlugin } from './definitions';

export class DispenserWeb extends WebPlugin implements DispenserPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
