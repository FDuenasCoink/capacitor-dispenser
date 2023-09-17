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
* [`dispenseCard(...)`](#dispensecard)
* [`recycleCard()`](#recyclecard)
* [`endProcess()`](#endprocess)
* [`getDispenserFlags()`](#getdispenserflags)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

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


### dispenseCard(...)

```typescript
dispenseCard(callback: DispenseCallback) => Promise<CallbackID>
```

Funtion to start the process of dispense a card.

| Param          | Type                                                          |
| -------------- | ------------------------------------------------------------- |
| **`callback`** | <code><a href="#dispensecallback">DispenseCallback</a></code> |

**Returns:** <code>Promise&lt;string&gt;</code>

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


#### DispenseData

| Prop            | Type                 |
| --------------- | -------------------- |
| **`completed`** | <code>boolean</code> |


#### DispenserFlags

| Prop                   | Type                 | Description                    |
| ---------------------- | -------------------- | ------------------------------ |
| **`cardStuck`**        | <code>boolean</code> | tarjeta atorada?               |
| **`recyclingBoxFull`** | <code>boolean</code> | Caja de reciclaje llena?       |
| **`cardInGate`**       | <code>boolean</code> | Hay una tarjeta en puerta      |
| **`cardsInDispenser`** | <code>boolean</code> | Hay tarjetas en el dispensador |
| **`dispenserFull`**    | <code>boolean</code> | El dispensador esta lleno      |


### Type Aliases


#### DispenseCallback

<code>(data: <a href="#dispensedata">DispenseData</a>, err?: any): void</code>


#### CallbackID

<code>string</code>

</docgen-api>
