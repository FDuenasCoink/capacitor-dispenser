import type { IDispenser, UnsubscribeFunc } from '@fduenascoink/oink-addons';
import { Dispenser as DispenserAddon } from '@fduenascoink/oink-addons';

import type { DeviceStatus, DispenseCallback, DispenserFlags, DispenserPlugin, ResponseStatus } from '../../src/definitions';

import { PluginError, getCapacitorElectronConfig } from './utils';

export class Dispenser implements DispenserPlugin {
  private dispenser: IDispenser;
  private unsubscribeFn?: UnsubscribeFunc;

  constructor() {
    const config = getCapacitorElectronConfig('Dispenser');
    this.dispenser = new DispenserAddon({
      maxInitAttempts: config.maxInitAttempts ?? 4,
      longTime: config.longTime ?? 3,
      shortTime: config.shortTime ?? 0,
      maximumPorts: config.maximumPorts ?? 10,
      logLevel: config.logLevel ?? 1,
      logPath: 'logs/dispenser.log',
    });
  }

  async init(): Promise<void> {
    await this.connect();
    await this.checkDevice();
  }

  async connect(): Promise<ResponseStatus> {
    const response = this.dispenser.connect();
    const status = response.statusCode;
    const errors = [404, 501, 502, 503];
    if (errors.includes(status)) {
      throw new PluginError(response.message, response.statusCode);
    }
    return response;
  }

  async checkDevice(): Promise<ResponseStatus> {
    const response = this.dispenser.checkDevice();
    const status = response.statusCode;
    const succesCodes = [201, 202, 506];
    if (!succesCodes.includes(status)) {
      throw new PluginError(response.message, response.statusCode);
    }
    return response;
  }

  async dispenseCard(callback: DispenseCallback): Promise<string> {
    this.unsubscribeFn?.();
    let response = this.dispenser.dispenseCard();
    let status = response.statusCode;
    
    if (status === 301) {
      await this.recycleCard();
      response =  this.dispenser.dispenseCard();
      status = response.statusCode;
    }

    const succesCodes = [203, 304, 305];
    if (!succesCodes.includes(status)) {
      await this.endProcess();
      throw new PluginError(response.message, response.statusCode);
    }
    callback(response);
    this.unsubscribeFn = this.dispenser.onDispense((dispenseEvent) => {
      const status = dispenseEvent.statusCode;
      if (status === 301) return;
      const succesCodes = [201, 202, 506];
      if (succesCodes.includes(status)) {
        const event = { ...dispenseEvent, completed: true };
        callback(event);
      } else {
        const error = new PluginError(dispenseEvent.message, dispenseEvent.statusCode);
        callback(null, error);
      }
      this.unsubscribeFn?.();
    });
    return '';
  }

  async recycleCard(): Promise<ResponseStatus> {
    this.unsubscribeFn?.();
    const response = this.dispenser.recycleCard();
    const status = response.statusCode;
    if (status !== 204 && status !== 515) {
      throw new PluginError(response.message, response.statusCode);
    }
    return response;
  }

  async endProcess(): Promise<ResponseStatus> {
    this.unsubscribeFn?.();
    let response = this.dispenser.endProcess();
    let status = response.statusCode;

    if (status === 301) {
      await this.recycleCard();
      response = this.dispenser.endProcess();
      status = response.statusCode;
    }

    const errors = [404, 501, 502, 503, 507];
    if (errors.includes(status)) {
      throw new PluginError(response.message, response.statusCode);
    }
    return response;
  }

  async getDispenserFlags(): Promise<DispenserFlags> {
    const flags = this.dispenser.getDispenserFlags();
    return {
      cardStuck: flags.cardInG,
      recyclingBoxFull: flags.recyclingBoxF,
      cardInGate: flags.cardInG,
      cardsInDispenser: flags.cardsInD,
      dispenserFull: flags.dispenserF,
    };
  }

  async testStatus(): Promise<DeviceStatus> {
    const status = this.dispenser.testStatus();
    return {
      ...status,
      date: new Date().toISOString(),
    }
  }

}