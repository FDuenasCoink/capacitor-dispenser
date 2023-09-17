import type { DispenseCallback } from '../../definitions';

import { Card } from './Card';
import { Controller } from './Controller';

export class Dispenser {
  private card = new Card();
  private controller = new Controller();

  init() {
    this.card.init();
    this.controller.init();
  }

  dispenseCard(callback?: DispenseCallback) {
    this.card.dispense(() => {
      callback?.({
        statusCode: 200,
        message: 'web simulated response',
        completed: true,
      });
    });
  }

  recycleCard() {
    this.card.recycle();
  }

  getDispenserFlags() {
    return this.controller.getDispenserFlags();
  }

}
