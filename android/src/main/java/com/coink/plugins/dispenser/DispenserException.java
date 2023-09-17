package com.coink.plugins.dispenser;

import hardware.dispenser.Response_t;

public class DispenserException extends Exception {

  private final String code;

  public DispenserException(Response_t response) {
    super(response.getMessage());
    this.code = Integer.toString(response.getStatusCode());
  }

  public String getCode() {
    return code;
  }

}
