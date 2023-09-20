import type { IDispenser, UnsubscribeFunc } from '@fduenascoink/oink-addons';
import { Dispenser as DispenserAddon } from '@fduenascoink/oink-addons';
import { app } from 'electron';
import { EventEmitter } from 'events';
import { join } from 'path';

import type { DeviceStatus, DispenserFlags, DispenserPlugin, ResponseStatus } from '../../src/definitions';

import { PluginError, getCapacitorElectronConfig } from './utils';

export class Dispenser extends EventEmitter implements DispenserPlugin {
  private static readonly DISPENSE_EVENT = 'dispense';
  private dispenser: IDispenser;
  private unsubscribeFn?: UnsubscribeFunc;

  constructor() {
    super();
    const config = getCapacitorElectronConfig('Dispenser');
    const logsPath = app.getPath('documents');
    this.dispenser = new DispenserAddon({
      maxInitAttempts: config.maxInitAttempts ?? 4,
      longTime: config.longTime ?? 3,
      shortTime: config.shortTime ?? 0,
      maximumPorts: config.maximumPorts ?? 10,
      logLevel: config.logLevel ?? 1,
      logPath: join(logsPath, 'oink-logs', 'dispenser.log'),
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

  async dispenseCard(): Promise<ResponseStatus> {
    await this.unsubscribe();
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

    this.unsubscribeFn = this.dispenser.onDispense(async (dispenseEvent) => {
      const status = dispenseEvent.statusCode;
      if (status === 301) return;
      const succesCodes = [201, 202, 506];
      if (succesCodes.includes(status)) {
        this.emit(Dispenser.DISPENSE_EVENT, { data: response });
      } else {
        const { statusCode: code, message } = dispenseEvent;
        const error = { code, message };
        this.emit(Dispenser.DISPENSE_EVENT, { error });
      }
      this.removeAllListeners(Dispenser.DISPENSE_EVENT);
      await this.unsubscribe();
    });

    return response;
  }

  async recycleCard(): Promise<ResponseStatus> {
    await this.unsubscribe();
    this.removeAllListeners();
    const response = this.dispenser.recycleCard();
    const status = response.statusCode;
    if (status !== 204 && status !== 515) {
      throw new PluginError(response.message, response.statusCode);
    }
    return response;
  }

  async endProcess(): Promise<ResponseStatus> {
    await this.unsubscribe();
    this.removeAllListeners();
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

  // @ts-ignore
  addListener(event: string | symbol, listener: (...args: any[]) => void): any {
    return super.addListener(event, listener);
  }

  // @ts-ignore
  removeAllListeners(event?: string | symbol): any {
    return super.removeAllListeners(event);
  }

  // @ts-ignore
  removeListener(event: string | symbol, listener: (...args: any[]) => void): any {
    return super.removeListener(event, listener);
  }

  private sleep() {
    return new Promise(resolve => setTimeout(resolve, 800));
  }

  private async unsubscribe() {
    if (!this.unsubscribeFn) return;
    this.unsubscribeFn?.();
    await this.sleep();
  }

}