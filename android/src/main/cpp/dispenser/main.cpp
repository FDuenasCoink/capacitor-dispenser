/**
 * @file main.cpp
 * @author Oscar Pineda (o.pineda@coink.com)
 * @brief Archivo principal basico que llama a las funciones de DispenserControl
 * @version 1.1
 * @date 2023-06-01
 * 
 * @copyright Copyright (c) 2023
 * 
 */

//Complacion: g++ -o main main.cpp DispenserControl.cpp StateMachine.cpp Dispenser.cpp -I/home/coink/oink/piggybank/connect/coin/Azkoyen/spdlog/include/

#include <stdio.h>
#include <stdbool.h>
#include <iostream>

#include "DispenserControl.hpp"

using namespace DispenserControl;

int main() {

    printf("main() called.\r\n");

    DispenserControlClass DispenserControlObject;

    Response_t Respuesta;
    bool FlagContinue = false;
    Flags_t DispenserFlags;

    //Variables externas parametrizadas [Se deben asignar antes de iniciar el log y de conectar]
    DispenserControlObject.Path = "logs/Dispenser.log";
    DispenserControlObject.LogLvl = 0;
    DispenserControlObject.MaximumPorts = 10;
    DispenserControlObject.MaxInitAttempts = 4;
    DispenserControlObject.ShortTime = 0;
    DispenserControlObject.LongTime = 3;

    DispenserControlObject.InitLog();
    
    Respuesta = DispenserControlObject.Connect();
    std::cout<<"Connect retorna: "<<Respuesta.StatusCode<<" Y "<<Respuesta.Message<<std::endl;

    if ((Respuesta.StatusCode == 404) | ((Respuesta.StatusCode >= 500) & (Respuesta.StatusCode <= 503))){
        FlagContinue = false;
        Respuesta = DispenserControlObject.CheckDevice();
        std::cout<<"CheckDevice retorna: "<<Respuesta.StatusCode<<" Y "<<Respuesta.Message<<std::endl;
    }
    else {
        FlagContinue = true;
    }
    
    DispenserFlags = DispenserControlObject.GetDispenserFlags();
    std::cout<<"GetDispenserFlags retorna - Hay una tarjeta atorada: "<<DispenserFlags.RFICCardInG<<std::endl;
    std::cout<<"GetDispenserFlags retorna - Caja de reciclaje llena: "<<DispenserFlags.RecyclingBoxF<<std::endl;
    std::cout<<"GetDispenserFlags retorna - Hay una tarjeta en puerta: "<<DispenserFlags.CardInG<<std::endl;
    std::cout<<"GetDispenserFlags retorna - Hay tarjetas en el dispensador: "<<DispenserFlags.CardsInD<<std::endl;
    std::cout<<"GetDispenserFlags retorna - El dispensador esta lleno: "<<DispenserFlags.DispenserF<<std::endl;

    int Cycles = 1;

    std::cout<<"-------------------------------------------------------------------------------------------"<<std::endl;
    for (int i = 0; i < Cycles; i++){
        if (FlagContinue){
            Respuesta = DispenserControlObject.DispenseCard();
            std::cout<<"DispenseCard retorna: "<<Respuesta.StatusCode<<" Y "<<Respuesta.Message<<std::endl;

            if ((Respuesta.StatusCode == 203) | (Respuesta.StatusCode == 301) | (Respuesta.StatusCode == 305)){
                Respuesta = DispenserControlObject.RecycleCard();
                std::cout<<"RecycleCard retorna: "<<Respuesta.StatusCode<<" Y "<<Respuesta.Message<<std::endl;
            }

            Respuesta = DispenserControlObject.EndProcess();
            std::cout<<"EndProcess retorna: "<<Respuesta.StatusCode<<" Y "<<Respuesta.Message<<std::endl;
        }
    }
    std::cout<<"-------------------------------------------------------------------------------------------"<<std::endl;

    DispenserFlags = DispenserControlObject.GetDispenserFlags();
    std::cout<<"GetDispenserFlags retorna - Hay una tarjeta atorada: "<<DispenserFlags.RFICCardInG<<std::endl;
    std::cout<<"GetDispenserFlags retorna - Caja de reciclaje llena: "<<DispenserFlags.RecyclingBoxF<<std::endl;
    std::cout<<"GetDispenserFlags retorna - Hay una tarjeta en puerta: "<<DispenserFlags.CardInG<<std::endl;
    std::cout<<"GetDispenserFlags retorna - Hay tarjetas en el dispensador: "<<DispenserFlags.CardsInD<<std::endl;
    std::cout<<"GetDispenserFlags retorna - El dispensador esta lleno: "<<DispenserFlags.DispenserF<<std::endl;

    TestStatus_t Status = DispenserControlObject.TestStatus();
    std::cout<<"TestStatus retorna. Version: "      <<Status.Version      <<std::endl;
    std::cout<<"TestStatus retorna. Device: "       <<Status.Device       <<std::endl;
    std::cout<<"TestStatus retorna. ErrorType: "    <<Status.ErrorType    <<std::endl;
    std::cout<<"TestStatus retorna. ErrorCode: "    <<Status.ErrorCode    <<std::endl;
    std::cout<<"TestStatus retorna. Message: "      <<Status.Message      <<std::endl;
    std::cout<<"TestStatus retorna. AditionalInfo: "<<Status.AditionalInfo<<std::endl;
    std::cout<<"TestStatus retorna. Priority: "     <<Status.Priority     <<std::endl;

    
    return 0;
}