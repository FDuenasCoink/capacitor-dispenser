import { WebPlugin } from "@capacitor/core";

import type { DeviceStatus, DispenseCallback, DispenserFlags, DispenserPlugin, ResponseStatus } from "./definitions";
import { Dispenser } from "./lib/Dispenser";
import { Logger } from "./lib/logger";

export class DispenserPluginWeb extends WebPlugin implements DispenserPlugin {
  private dispenser = new Dispenser();
  private logger = new Logger('DISPENSER');

  async connect(): Promise<ResponseStatus> {
    this.logger.log('connect device');
    return {
      statusCode: 200,
      message: 'web simulation response',
    }
  }

  async checkDevice(): Promise<ResponseStatus> {
    this.logger.log('check device');
    return {
      statusCode: 200,
      message: 'web simulation response',
    }
  }

  async testStatus(): Promise<DeviceStatus> {
    this.logger.log('tes status simulated');
    return {
      version: '1',
      device: 1,
      errorType: 0,
      errorCode: 0,
      message: "web simulated response",
      aditionalInfo: "",
      priority: 0,
      date: new Date().toString(),
    }
  }

  async init(): Promise<void> {
    this.logger.log('init device for web');
    this.dispenser.init();
  }

  async dispenseCard(callback: DispenseCallback): Promise<string> {
    this.logger.log('dispens card...');
    callback({ statusCode: 0, message: 'dispense card web',  completed: false });
    this.dispenser.dispenseCard((event) => {
      this.logger.log('card taken');
      callback(event);
    });
    return '';
  }

  async recycleCard(): Promise<ResponseStatus> {
    this.logger.log('recycle card');
    this.dispenser.recycleCard();
    return {
      statusCode: 200,
      message: 'web simulation response',
    }
  }

  async endProcess(): Promise<ResponseStatus> {
    this.logger.log('en process');
    return {
      statusCode: 200,
      message: 'web simulation response',
    }
  }

  async getDispenserFlags(): Promise<DispenserFlags> {
    this.logger.log('getting dispenser flags');
    return this.dispenser.getDispenserFlags();
  }
}
