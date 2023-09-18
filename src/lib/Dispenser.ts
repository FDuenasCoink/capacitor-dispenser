import type { DispenseEvent } from '../definitions';

import { Card } from './Card';
import { Controller } from './Controller';

export class Dispenser {
  private card = new Card();
  private controller = new Controller();

  init() {
    this.card.init();
    this.controller.init();
  }

  dispenseCard(callback?: (event: DispenseEvent) => void) {
    this.card.dispense(() => {
      const data = {
        statusCode: 200,
        message: 'web simulated response',
      }
      callback?.({ data });
    });
  }

  recycleCard() {
    this.card.recycle();
  }

  getDispenserFlags() {
    return this.controller.getDispenserFlags();
  }

}
