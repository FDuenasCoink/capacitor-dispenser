package com.coink.plugins.dispenser;

import com.getcapacitor.JSObject;

import hardware.dispenser.Response_t;

public class DispenserEvent extends JSObject {
  private String message;
  private int statusCode;

  private DispenserEvent(Response_t response) {
    super();
    String message = response.getMessage();
    int code = response.getStatusCode();
    JSObject error = new JSObject();
    error.put("message", message);
    error.put("code", code);
    put("error", error);
    put("completed", false);
    this.message = message;
    this.statusCode = code;
  }

  private DispenserEvent(String message, int statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    put("message", message);
    put("statusCode", statusCode);
    put("completed", true);
  }

  public static DispenserEvent completed(Response_t response) {
    String message = response.getMessage();
    int statusCode = response.getStatusCode();
    return new DispenserEvent(message, statusCode);
  }

  public static DispenserEvent error(Response_t response) {
    return new DispenserEvent(response);
  }

  public String getMessage() {
    return message;
  }

  public int getStatusCode() {
    return statusCode;
  }
}
