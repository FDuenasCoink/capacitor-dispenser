import { WebPlugin } from "@capacitor/core";

import type { DeviceStatus, DispenserFlags, DispenserPlugin, ResponseStatus } from "./definitions";
import { Dispenser } from "./lib/Dispenser";
import { Logger } from "./lib/logger";

export class DispenserPluginWeb extends WebPlugin implements DispenserPlugin {
  private static readonly DISPENSE_EVENT = 'dispense';
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
      date: new Date().toISOString(),
    }
  }

  async init(): Promise<void> {
    this.logger.log('init device for web');
    this.dispenser.init();
  }

  async dispenseCard(): Promise<ResponseStatus> {
    this.logger.log('dispens card...');
    const response = {
      statusCode: 200,
      message: 'web simulation response',
    };
    this.dispenser.dispenseCard((event) => {
      this.notifyListeners(DispenserPluginWeb.DISPENSE_EVENT, event);
      this.removeAllListeners();
    });
    return response;
  }

  async recycleCard(): Promise<ResponseStatus> {
    this.removeAllListeners();
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
