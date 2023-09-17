package com.coink.plugins.dispenser;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginConfig;

import java.util.Arrays;
import java.util.List;

import hardware.dispenser.DispenserControlClass;
import hardware.dispenser.Flags_t;
import hardware.dispenser.Response_t;
import hardware.dispenser.TestStatus_t;

public class Dispenser implements Runnable {

    static {
        System.loadLibrary("Dispenser_Wrapper");
    }

    private static final String LOG_FILE = "Dispenser.log";

    private final DispenserControlClass dispenser = new DispenserControlClass();
    private final CustomThread thread = new CustomThread(this);
    private Notifier notifier;

    public Dispenser(Plugin plugin) {
        PluginConfig config = plugin.getConfig();

        int maxInitAttempts = config.getInt("maxInitAttempts", 4);
        int longTime = config.getInt("longTime", 3);
        int shortTime = config.getInt("shortTime", 0);
        int maximumPorts = config.getInt("maximumPorts", 10);
        int logLevel = config.getInt("logLevel", 1);

        String packagePath = plugin.getActivity().getApplicationContext().getFilesDir().getAbsolutePath();
        String logPath = packagePath + "/" + LOG_FILE;

        dispenser.setMaxInitAttempts(maxInitAttempts);
        dispenser.setLongTime(longTime);
        dispenser.setShortTime(shortTime);
        dispenser.setMaximumPorts(maximumPorts);
        dispenser.setLogLvl(logLevel);
        dispenser.setPath(logPath);

        dispenser.InitLog();
    }

    public DispenserResponse connect() throws DispenserException {
        thread.pause();
        Response_t response = dispenser.Connect();
        thread.resume();
        int status = response.getStatusCode();
        List<Integer> errors = Arrays.asList(404, 501, 502, 503);
        if (errors.contains(status)) {
            throw new DispenserException(response);
        }
        return new DispenserResponse(response);
    }

    public DispenserResponse checkDevice() throws DispenserException {
        Response_t response = dispenser.CheckDevice();
        int status = response.getStatusCode();
        List<Integer> successCode = Arrays.asList(201, 202, 506);
        if (!successCode.contains(status)) {
            throw new DispenserException(response);
        }
        return new DispenserResponse(response);
    }

    public DispenserResponse dispenseCard(Notifier notifier) throws DispenserException {
        thread.stop();

        Response_t response = dispenser.DispenseCard();
        int status = response.getStatusCode();

        if (status == 301) {
            recycleCard();
            response = dispenser.DispenseCard();
            status = response.getStatusCode();
        }

        List<Integer> successCodes = Arrays.asList(203, 304, 305);
        if (!successCodes.contains(status)) {
            this.endProcess();
            throw new DispenserException(response);
        }

        this.notifier = notifier;
        thread.start();
        return new DispenserResponse(response);
    }

    public DispenserResponse recycleCard() throws DispenserException {
        thread.stop();
        Response_t response = dispenser.RecycleCard();
        int status = response.getStatusCode();
        if (status != 204 && status != 515) {
            throw new DispenserException(response);
        }
        return new DispenserResponse(response);
    }

    public DispenserResponse endProcess() throws DispenserException {
        thread.stop();
        this.notifier = null;

        Response_t response = dispenser.EndProcess();
        int status = response.getStatusCode();

        if (status == 301) {
            recycleCard();
            response = dispenser.EndProcess();
            status = response.getStatusCode();
        }

        List<Integer> errors = Arrays.asList(404, 501, 502, 503, 507);
        if (errors.contains(status)) {
            throw new DispenserException(response);
        }

        return new DispenserResponse(response);
    }

    public DispenserResponse getDispenserFlags() {
        thread.pause();
        Flags_t flags = dispenser.GetDispenserFlags();
        thread.resume();
        return new DispenserResponse(flags);
    }

    public DispenserResponse testStatus() {
        thread.pause();
        TestStatus_t status = dispenser.TestStatus();
        thread.resume();
        return new DispenserResponse(status);
    }

    @Override
    public void run() {
        Response_t response = dispenser.CheckDevice();
        int status = response.getStatusCode();
        if (status == 301) return;
        if (status == 201 || status == 202 || status == 506) {
            DispenserEvent event = DispenserEvent.completed(response);
            this.notifier.onDispenseCompleted(event);
            thread.breakProcess();
            return;
        }
        DispenserException error =  new DispenserException(response);
        this.notifier.onDispenseError(error);
        thread.breakProcess();
    }
}
