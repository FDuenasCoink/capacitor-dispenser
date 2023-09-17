/// <reference types="@capacitor/cli" />

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

export type CallbackID = string;
export interface DispenseData extends ResponseStatus {
  completed?: boolean;
}
export type DispenseCallback = (data: DispenseData, err?: any) => void;

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
  dispenseCard(callback: DispenseCallback): Promise<CallbackID>;
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
}
