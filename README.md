# capacitor-dispenser

Plugin to control the card dispenser from capacitor

## Install

```bash
npm install capacitor-dispenser
npx cap sync
```

## API

<docgen-index>

* [`connect()`](#connect)
* [`checkDevice()`](#checkdevice)
* [`testStatus()`](#teststatus)
* [`init()`](#init)
* [`dispenseCard()`](#dispensecard)
* [`recycleCard()`](#recyclecard)
* [`endProcess()`](#endprocess)
* [`getDispenserFlags()`](#getdispenserflags)
* [`addListener('dispense', ...)`](#addlistenerdispense)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### connect()

```typescript
connect() => Promise<ResponseStatus>
```

Function to connect the device.

**Returns:** <code>Promise&lt;<a href="#responsestatus">ResponseStatus</a>&gt;</code>

--------------------


### checkDevice()

```typescript
checkDevice() => Promise<ResponseStatus>
```

Function use to test the device.

**Returns:** <code>Promise&lt;<a href="#responsestatus">ResponseStatus</a>&gt;</code>

--------------------


### testStatus()

```typescript
testStatus() => Promise<DeviceStatus>
```

Check device status.

**Returns:** <code>Promise&lt;<a href="#devicestatus">DeviceStatus</a>&gt;</code>

--------------------


### init()

```typescript
init() => Promise<void>
```

Setup Azkoyen connection.

--------------------


### dispenseCard()

```typescript
dispenseCard() => Promise<ResponseStatus>
```

Funtion to start the process of dispense a card.

**Returns:** <code>Promise&lt;<a href="#responsestatus">ResponseStatus</a>&gt;</code>

--------------------


### recycleCard()

```typescript
recycleCard() => Promise<ResponseStatus>
```

Funtion to recicle a card in the dispenser.

**Returns:** <code>Promise&lt;<a href="#responsestatus">ResponseStatus</a>&gt;</code>

--------------------


### endProcess()

```typescript
endProcess() => Promise<ResponseStatus>
```

Funtion to end the dispense card process and recycle card if needed.

**Returns:** <code>Promise&lt;<a href="#responsestatus">ResponseStatus</a>&gt;</code>

--------------------


### getDispenserFlags()

```typescript
getDispenserFlags() => Promise<DispenserFlags>
```

Funtion to get all the dispenser flags.

**Returns:** <code>Promise&lt;<a href="#dispenserflags">DispenserFlags</a>&gt;</code>

--------------------


### addListener('dispense', ...)

```typescript
addListener(eventName: 'dispense', listenerFunc: (event: DispenseEvent) => void) => Promise<PluginListenerHandle> & PluginListenerHandle
```

Listens for card dispensed.

| Param              | Type                                                                        |
| ------------------ | --------------------------------------------------------------------------- |
| **`eventName`**    | <code>'dispense'</code>                                                     |
| **`listenerFunc`** | <code>(event: <a href="#dispenseevent">DispenseEvent</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### Interfaces


#### ResponseStatus

| Prop             | Type                |
| ---------------- | ------------------- |
| **`statusCode`** | <code>number</code> |
| **`message`**    | <code>string</code> |


#### DeviceStatus

| Prop                | Type                |
| ------------------- | ------------------- |
| **`version`**       | <code>string</code> |
| **`device`**        | <code>number</code> |
| **`errorType`**     | <code>number</code> |
| **`errorCode`**     | <code>number</code> |
| **`message`**       | <code>string</code> |
| **`aditionalInfo`** | <code>string</code> |
| **`priority`**      | <code>number</code> |
| **`date`**          | <code>string</code> |


#### DispenserFlags

| Prop                   | Type                 | Description                    |
| ---------------------- | -------------------- | ------------------------------ |
| **`cardStuck`**        | <code>boolean</code> | tarjeta atorada?               |
| **`recyclingBoxFull`** | <code>boolean</code> | Caja de reciclaje llena?       |
| **`cardInGate`**       | <code>boolean</code> | Hay una tarjeta en puerta      |
| **`cardsInDispenser`** | <code>boolean</code> | Hay tarjetas en el dispensador |
| **`dispenserFull`**    | <code>boolean</code> | El dispensador esta lleno      |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### DispenseEvent

| Prop        | Type                                                      |
| ----------- | --------------------------------------------------------- |
| **`error`** | <code>{ code: number; message: string; }</code>           |
| **`data`**  | <code><a href="#responsestatus">ResponseStatus</a></code> |

</docgen-api>
