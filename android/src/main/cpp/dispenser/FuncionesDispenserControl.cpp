// 0. --------------- ESTRUCTURAS DE RESPUESTA --------------------//

struct Response_t{
    int StatusCode;
    std::string Message;
};

struct Flags_t{
    bool RFICCardInGate;
    bool RecyclingBoxFull;
    bool CardInGate;
    bool CardsInDispenser;
    bool DispenserFull;
};

struct TestStatus_t{
    std::string Version;
    int Device;
    int ErrorType; 
    int ErrorCode;
    std::string Message; 
    std::string AditionalInfo;
    int Priority; 
};

// 1. --------------- VARIABLES PARAMETRIZADAS --------------------//

Path = "logs/Dispenser.log"; // Ruta donde se guarda el log crado por Spdlog
LogLvl = 1;                  // Nivel de Log en Spdlog, donde 0 es el nivel que recopila mas informacion y 5 es el que menos recopila, 6 se puede colocar para apagar el log
MaximumPorts = 10;           // Maxima cantidad de puertos que se revisara para conectar el dispensador
MaxInitAttempts = 3;         // Maxima cantidad de intentos que se haran para iniciar el dispensador o para esperar por una respuesta
ShortTime = 0;               // Tiempo adicional en us que se debe esperar para recibir un mensaje (Para comandos que no requieren espera - INIT/GETSTATUS)
LongTime = 3;                // Tiempo adicional en s que se debe esperar para recibir un mensaje (Para comandos que requieren espera - DISPENSECARD/RETURNCARD)

// 2. --------------- DISPENSADOR F3 --------------------//

/**
 * @brief Funcion que corre los primeros estados de la maquina de estados y deja listo el dispositivo para las siguientes operaciones
 * @return Response_t Estructura que contiene un codigo de estado y un mensaje
 * @return 201 - Dispensador OK. Lleno de tarjetas disponibles
 * @return 202 - Dispensador OK. Con algunas tarjetas disponibles
 * @return 301 - Dispensador con tarjeta en puerta. Esperar para entregar al usuario o reciclar
 * @return 302 - Dispensador con caja de reciclaje llena. Lleno de tarjetas disponibles
 * @return 303 - Dispensador con caja de reciclaje llena. Con algunas tarjetas disponibles
 * @return 404 - DefaultError
 * @return 500 - Fallo con el dispensador. Codigo de fallo: [] - Mensaje de fallo: []
 * @return 501 - Fallo con el dispensador. Conectó, inicializó, pero no se pudo revisar
 * @return 502 - Fallo con el dispensador. Conectó, pero no se pudo inicializar
 * @return 503 - Fallo en la conexion con el dispensador, puerto no encontrado
 * @return 504 - Dispensador atascado. Se reviso exitosamente pero se detecto una tarjeta atascada
 * @return 505 - Dispensador con caja de reciclaje llena. No hay tarjetas disponibles
 * @return 506 - Dispensador sin tarjetas. Caja de reciclaje aun no está llena
*/
Response_t Connect();

/**
 * @brief Funcion que revisa el estado del Dispensador
 * @return Response_t Estructura que contiene un codigo de estado y un mensaje
 * @return 201 - Dispensador OK. Lleno de tarjetas disponibles
 * @return 202 - Dispensador OK. Con algunas tarjetas disponibles
 * @return 301 - Dispensador con tarjeta en puerta. Esperar para entregar al usuario o reciclar
 * @return 302 - Dispensador con caja de reciclaje llena. Lleno de tarjetas disponibles
 * @return 303 - Dispensador con caja de reciclaje llena. Con algunas tarjetas disponibles
 * @return 404 - DefaultError
 * @return 500 - Fallo con el dispensador. Codigo de fallo: [] - Mensaje de fallo: []
 * @return 504 - Dispensador atascado. Se reviso exitosamente pero se detecto una tarjeta atascada
 * @return 505 - Dispensador con caja de reciclaje llena. No hay tarjetas disponibles
 * @return 506 - Dispensador sin tarjetas. Caja de reciclaje aun no está llena
 * @return 507 - Fallo con el dispensador. No responde
*/
Response_t CheckDevice();

/**
 * @brief Funcion que dispensa una tarjeta
 * @return Response_t Estructura que contiene un codigo de estado y un mensaje

 * @brief 1. Con los siguientes codigos no se intenta dispensar la tarjeta
 
 * @return 301 - Dispensador con tarjeta en puerta. Esperar para entregar al usuario o reciclar 
 * @return 504 - Dispensador atascado. Se reviso exitosamente pero se detecto una tarjeta atascada 
 * @return 505 - Dispensador con caja de reciclaje llena. No hay tarjetas disponibles
 * @return 506 - Dispensador sin tarjetas. Caja de reciclaje aun no está llena
 * @return 507 - Fallo con el dispensador. No responde

 * @brief 2. Con los siguientes codigos se intenta dispensar la tarjeta 
 
 * @return 203 - Dispensador movio la tarjeta. Se dispensó y se detecto la tarjeta en puerta [La tarjeta fue entregada al cliente]
 * @return 304 - Dispensador movio la tarjeta. Se dispensó pero ya se retiro la tarjeta [La tarjeta fue entregada al cliente]
 * @return 305 - Dispensador movio la tarjeta. Hubieron errores de comunicación pero se detecto la tarjeta en puerta [La tarjeta fue entregada al cliente]
 * @return 500 - Fallo con el dispensador. Codigo de fallo: [] - Mensaje de fallo: [] ---> [La tarjeta NO fue entregada al cliente]
 * @return 508 - Dispensador atascado. Se dispensó, pero la tarjeta quedo atascada [La tarjeta NO fue entregada al cliente]
 * @return 509 - Fallo en el dispensador. No se pudo conocer el estado de la tarjeta [La tarjeta NO fue entregada al cliente]
 * @return 510 - Dispensador sin tarjetas. No se puede dispensar la tarjeta [La tarjeta NO fue entregada al cliente]
*/
Response_t DispenseCard();

/**
 * @brief Funcion que recicla una tarjeta en puerta
 * @return Response_t Estructura que contiene un codigo de estado y un mensaje

 * @brief 1. Con los siguientes codigos no se intenta reciclar la tarjeta

 * @return 500 - Fallo con el dispensador. Codigo de fallo: [] - Mensaje de fallo: []
 * @return 504 - Dispensador atascado. Se reviso exitosamente pero se detecto una tarjeta atascada
 * @return 507 - Fallo con el dispensador. No responde
 * @return 513 - No se detecto tarjeta en puerta y por ello no se intenta reciclar la tarjeta
 * @return 514 - Dispensador con caja de reciclaje llena. No se puede reciclar la tarjeta

 * @brief 2. Con los siguientes codigos se intenta reciclar la tarjeta

 * @return 204 - Dispensador recicló la tarjeta. Se movió exitosamente a la caja de reciclaje [La tarjeta fue reciclada]
 * @return 511 - Dispensador atascado. Se intento reciclar, pero la tarjeta quedo atascada [La tarjeta NO fue reciclada]
 * @return 512 - Dispensador con tarjeta en puerta. Se intento reciclar, pero la tarjeta sigue en la puerta [La tarjeta NO fue reciclada]
 * @return 515 - Hubo un error reciclando la tarjeta. Codigo de fallo: [] - Mensaje de fallo: [] ------> Si el error es A1,A2...hasta A9 - Si reciclo la tarjeta pero se lleno con esta ultima tarjeta, en otro caso no recicla la tarjeta
 * @return 516 - Fallo con el dispensador. Se intenta reciclar pero no se pudo conocer el estado de la tarjeta [La tarjeta NO fue reciclada]
*/
Response_t RecycleCard();

/**
 * @brief Funcion que establece la maquina de estados en ST_WAIT para poder dispensar la siguiente tarjeta
 * @return Response_t Estructura que contiene un codigo de estado y un mensaje
 * @return 201 - Dispensador OK. Lleno de tarjetas disponibles
 * @return 202 - Dispensador OK. Con algunas tarjetas disponibles
 * @return 301 - Dispensador con tarjeta en puerta. Esperar para entregar al usuario o reciclar
 * @return 302 - Dispensador con caja de reciclaje llena. Lleno de tarjetas disponibles
 * @return 303 - Dispensador con caja de reciclaje llena. Con algunas tarjetas disponibles
 * @return 404 - DefaultError
 * @return 500 - Fallo con el dispensador. Codigo de fallo: [] - Mensaje de fallo: []
 * @return 501 - Fallo con el dispensador. Conectó, inicializó, pero no se pudo revisar
 * @return 502 - Fallo con el dispensador. Conectó, pero no se pudo inicializar
 * @return 503 - Fallo en la conexion con el dispensador, puerto no encontrado
 * @return 504 - Dispensador atascado. Se reviso exitosamente pero se detecto una tarjeta atascada
 * @return 505 - Dispensador con caja de reciclaje llena. No hay tarjetas disponibles
 * @return 506 - Dispensador sin tarjetas. Caja de reciclaje aun no está llena
 * @return 507 - Fallo con el dispensador. No responde
*/
Response_t EndProcess();

/**
 * @brief Funcion que retorna el estado de las variables mas importantes del dispensador
 * @brief RFICCardInGate -> Indica si hay una tarjeta atorada en el dispensador
 * @brief RecyclingBoxFull -> Indica si la caja de reciclaje esta llena (Aproximadamente son 23 tarjetas o mas - true indica que la caja de reciclaje esta llena, false lo contrario)
 * @brief CardInGate -> Indica si se detecta una tarjeta en la puerta  (true indica que hay tarjeta en puerta, false indica lo contrario)
 * @brief CardsInDispenser -> Indica si hay tarjetas en el dispensador (Esta bandera cambia a true si hay 1 o mas tarjetas en el dispensador)
 * @brief DispenserFull -> Indica si el dispensador tiene tarjetas suficientes (Esta bandera cambia a true si hay 20 (aproximadamente) o mas tarjetas en el dispensador)
 * @return Flags_t Estructura que contiene las 5 banderas booleanas mas importantes del dispensador
*/
Flags_t GetDispenserFlags();

/**
    "Version":"1.0",
    "Device":"1",
    "ErrorType":"1",
    "ErrorCode":"10",
    "Message":"Null event",
    "Priority":"1",
    "AditionalInfo":"Previous error solved",
    "Date":"11/05/2013 11:55" [Se adiciona desde el front]

 * @brief Funcion que entrega el ultimo estado del dispensador
 * @return TestStatus_t Estructura que contiene la version del codigo, el numero de dispositivo, el ultimo tipo de error, el ultimo codigo de error, el ultimo mensaje de error, 
 * @return la prioridad del error y una informacion adicional
 * @return Posibles codigos y mensajes en el archivo "DataErrors.cpp"
*/
TestStatus_t TestStatus();

/*
// 3. --------------- PANTALLA DE MANTENIMIENTO--------------------//

Dispensador

1. Boton para revisar conexion  -> Connect()
2. Revisar estado del dispensador -> TestStatus() y luego GetDispenserFlags()
3. Dispensar tarjeta -> DispenseCard() -> EndProcess()
4. Reciclar tarjeta -> RecycleCard() -> EndProcess()

// 4. --------------- FLUJO DEL DISPENSADOR --------------------//

1. Dispensador no conectado

- La revision de rutina de cada minuto y la que se hace antes de mostrar las opciones al usuario deberian desactivar el dispensador de las opciones
- La maquina deberia enviar un correo al detectar que no esta conectado

2. Dispensador conectado

- La revision de rutina de cada minuto y la que se hace antes de mostrar las opciones al usuario deberian activar el dispensador en las opciones
- La maquina deberia enviar un correo al detectar que el dispensador esta fallando

    Paso 1.
    
    Para obtener los datos precisos del Dispensador hay que correr TestStatus()

    TestConnection (Estado:Bloqueado / Estado:Falla en comunicacion)
        Cambiar estado del Dispensador a desactivado
        Enviar correo al detectar que esta fallando
        Termina flujo del Dispensador
    TestConnection (Estado:OK)
        Continuar al paso 2

    Paso 2.

    Dispensar tarjeta (Estado:Falla leve)
        Mostrar mensaje en pantalla dependiendo de la falla
        Tipos de falla:
            Dispensador sin tarjetas
            Dispensador con tarjeta en puerta
        Desactivar dispensador
    Dispensar tarjeta (Estado:Falla grave)
        Tipos de falla:
            Dispensador con tarjeta bloqueada
            Dispensador no responde
            Dispensador con codigo de error especifico
        Desactivar dispensador
    Dispensar tarjeta (Estado:OK)
        Correr un contador que revise cuando hayan pasado X segundos para luego reciclar la tarjeta
        Si pasan los X segundos se debe revisar con CheckStatus si hay una tarjeta en puerta
        Si hay una tarjeta en puerta
            Continuar al paso 3
        Si no hay una tarjeta en puerta
            Continuar al paso 4

    Paso 3.

    Reciclar tarjeta (Estado:Falla leve)
        Mostrar mensaje en pantalla dependiendo de la falla
        Tipos de falla:
            Dispensador con caja de reciclaje llena
        Desactivar dispensador
    Reciclar tarjeta (Estado:Falla grave)
        Tipos de falla:
            Dispensador con tarjeta bloqueada
            Dispensador con tarjeta en puerta
            Dispensador no responde
            Dispensador con codigo de error especifico
        Desactivar dispensador
    Reciclar tarjeta (Estado:OK)
        Continuar al paso 4

    Paso 4.

    Finalizar proceso (Estado:Falla leve)
        Mostrar mensaje en pantalla dependiendo de la falla
        Tipos de falla:
            Dispensador con caja de reciclaje llena
            Dispensador sin tarjetas
        Desactivar dispensador
    Finalizar proceso (Estado:Falla grave)
        Tipos de falla:
            Dispensador con tarjeta bloqueada
            Dispensador con tarjeta en puerta
            Dispensador no responde
            Dispensador con codigo de error especifico
        Desactivar dispensador
    Finalizar proceso  (Estado:OK)
        Revisar dispensador con CheckDevice()
*/

