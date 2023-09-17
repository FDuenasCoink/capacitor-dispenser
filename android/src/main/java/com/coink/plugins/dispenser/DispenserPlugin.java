package com.coink.plugins.dispenser;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Dispenser")
public class DispenserPlugin extends Plugin implements Notifier {

    private static final String ON_DISPENSE_COMPLETED = "dispenseCompleted";

    private Dispenser implementation;
    private PluginCall dispenseCall;

    @Override
    public void load() {
        super.load();
        implementation = new Dispenser(this);
    }

    @PluginMethod()
    public void connect(PluginCall call) {
        try {
            DispenserResponse response = implementation.connect();
            call.resolve(response);
        } catch (DispenserException e) {
            String message = e.getMessage();
            String code = e.getCode();
            call.reject(message, code);
        }
    }

    @PluginMethod()
    public void init(PluginCall call) {
        connect(call);
    }

    @PluginMethod()
    public void checkDevice(PluginCall call) {
        try {
            DispenserResponse response = implementation.checkDevice();
            call.resolve(response);
        } catch (DispenserException e) {
            String message = e.getMessage();
            String code = e.getCode();
            call.reject(message, code);
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    public void dispenseCard(PluginCall call) {
        call.setKeepAlive(true);
        dispenseCall = call;
        try {
            DispenserResponse response = implementation.dispenseCard(this);
            call.resolve(response);
        } catch (DispenserException e) {
            String message = e.getMessage();
            String code = e.getCode();
            call.reject(message, code);
        }
    }

    @PluginMethod()
    public void recycleCard(PluginCall call) {
        if (dispenseCall != null) {
            dispenseCall.release(bridge);
            dispenseCall = null;
        }
        try {
            DispenserResponse response = implementation.recycleCard();
            call.resolve(response);
        } catch (DispenserException e) {
            String message = e.getMessage();
            String code = e.getCode();
            call.reject(message, code);
        }
    }

    @PluginMethod()
    public void endProcess(PluginCall call) {
        if (dispenseCall != null) {
            dispenseCall.release(bridge);
            dispenseCall = null;
        }
        try {
            DispenserResponse response = implementation.endProcess();
            call.resolve(response);
        } catch (DispenserException e) {
            String message = e.getMessage();
            String code = e.getCode();
            call.reject(message, code);
        }
    }

    @PluginMethod()
    public void getDispenserFlags(PluginCall call) {
        DispenserResponse response = implementation.getDispenserFlags();
        call.resolve(response);
    }

    @PluginMethod()
    public void testStatus(PluginCall call) {
        DispenserResponse response = implementation.testStatus();
        call.resolve(response);
    }

    @Override
    public void onDispenseCompleted(DispenserEvent event) {
        if (dispenseCall != null) {
            dispenseCall.resolve(event);
        }
    }

    @Override
    public void onDispenseError(DispenserException error) {
        if (dispenseCall != null) {
            String message = error.getMessage();
            String code = error.getCode();
            dispenseCall.reject(message, code);
        }
    }

}