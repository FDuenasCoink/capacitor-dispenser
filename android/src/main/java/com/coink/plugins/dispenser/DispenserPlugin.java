package com.coink.plugins.dispenser;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Dispenser")
public class DispenserPlugin extends Plugin implements Notifier {

    private static final String DISPENSE_EVENT = "dispense";

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

    @PluginMethod()
    public void dispenseCard(PluginCall call) {
        try {
            DispenserResponse response = implementation.dispenseCard(this);
            dispenseCall = call;
            call.setKeepAlive(true);
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
            removeAllListeners(dispenseCall);
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
            removeAllListeners(dispenseCall);
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
        JSObject data = new JSObject();
        data.put("message", event.getMessage());
        data.put("statusCode", event.getStatusCode());
        JSObject dataEvent = new JSObject();
        dataEvent.put("data", dataEvent);
        notifyListeners(DISPENSE_EVENT, dataEvent);
        if (dispenseCall != null) {
            removeAllListeners(dispenseCall);
            dispenseCall.release(bridge);
            dispenseCall = null;
        }
    }

    @Override
    public void onDispenseError(DispenserException error) {
        JSObject errorData = new JSObject();
        errorData.put("code", error.getCode());
        errorData.put("message", error.getMessage());
        JSObject dataEvent = new JSObject();
        dataEvent.put("error", errorData);
        notifyListeners(DISPENSE_EVENT, dataEvent);
        if (dispenseCall != null) {
            removeAllListeners(dispenseCall);
            dispenseCall.release(bridge);
            dispenseCall = null;
        }
    }

}