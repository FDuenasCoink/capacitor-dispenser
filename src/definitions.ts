/// <reference types="@capacitor/cli" />

import type { PluginListenerHandle } from "@capacitor/core";

declare module '@capacitor/cli' {
  export interface PluginsConfig {
    Dispenser?: {
      maxInitAttempts?: number;
      longTime?: number;
      shortTime?: number;
      maximumPorts?: number;
      logLevel?: number;
    }
  }
}

export interface ResponseStatus {
  statusCode: number;
  message: string;
}

export interface DeviceStatus {
  version: string;
  device: number;
  errorType: number;
  errorCode: number;
  message: string;
  aditionalInfo: string;
  priority: number;
  date: string;
}

export interface DispenserFlags {
  /**
   * tarjeta atorada?
   */
  cardStuck: boolean;
  /**
   * Caja de reciclaje llena?
   */
  recyclingBoxFull: boolean;
  /**
   * Hay una tarjeta en puerta
   */
  cardInGate: boolean;
  /**
   * Hay tarjetas en el dispensador
   */
  cardsInDispenser: boolean;
  /**
   * El dispensador esta lleno
   */
  dispenserFull: boolean;
}

export interface DispenseEvent {
  error?: { code: number, message: string };
  data: ResponseStatus;
}

export interface DispenserPlugin {
  /**
   * Function to connect the device.
   */
  connect(): Promise<ResponseStatus>;
  /**
   * Function use to test the device.
   */
  checkDevice(): Promise<ResponseStatus>;
  /**
   * Check device status.
   */
  testStatus(): Promise<DeviceStatus>;
  /**
   * Setup Azkoyen connection.
   */
  init(): Promise<void>;
  /**
   * Funtion to start the process of dispense a card.
   */
  dispenseCard(): Promise<ResponseStatus>;
  /**
   * Funtion to recicle a card in the dispenser.
   */
  recycleCard(): Promise<ResponseStatus>;
  /**
   * Funtion to end the dispense card process and recycle card if needed.
   */
  endProcess(): Promise<ResponseStatus>;
  /**
   * Funtion to get all the dispenser flags.
   */
  getDispenserFlags(): Promise<DispenserFlags>;
  /**
   * Listens for card dispensed.
   */
  addListener(eventName: 'dispense', listenerFunc: (event: DispenseEvent) => void): Promise<PluginListenerHandle> & PluginListenerHandle | string;
  /**
   * Removes all listeners
   */
  removeAllListeners(): Promise<void>;
}

export interface DispenserPluginElectron extends DispenserPlugin {
  removeListener?(listenerId: string): void & Promise<void>;
  removeAllListeners(type?: string): void & Promise<void>;
}