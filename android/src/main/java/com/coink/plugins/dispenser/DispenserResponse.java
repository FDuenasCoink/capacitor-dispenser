package com.coink.plugins.dispenser;

import com.getcapacitor.JSObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import hardware.dispenser.Flags_t;
import hardware.dispenser.Response_t;
import hardware.dispenser.TestStatus_t;

public class DispenserResponse extends JSObject {

  private final String message;
  private final int statusCode;

  public DispenserResponse(Response_t response) {
    super();
    String message = response.getMessage();
    int statusCode = response.getStatusCode();
    this.message = message;
    this.statusCode = statusCode;
    put("message", message);
    put("statusCode", statusCode);
  }

  public DispenserResponse(TestStatus_t status) {
    super();
    Date now = Calendar.getInstance().getTime();
    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
    String date = df.format(now);

    this.message = status.getMessage();
    this.statusCode = status.getErrorCode();

    put("version", status.getVersion());
    put("device", status.getDevice());
    put("errorType", status.getErrorType());
    put("errorCode", status.getErrorCode());
    put("message", status.getMessage());
    put("aditionalInfo", status.getAditionalInfo());
    put("priority", status.getPriority());
    put("date", date);
  }

  public DispenserResponse(Flags_t flags) {
    message = "";
    statusCode = 0;

    boolean cardStuck = flags.getRFICCardInG();
    boolean recyclingBoxFull = flags.getRecyclingBoxF();
    boolean cardInGate = flags.getCardInG();
    boolean cardsInDispenser = flags.getCardsInD();
    boolean dispenserFull = flags.getDispenserF();

    put("cardStuck", cardStuck);
    put("recyclingBoxFull", recyclingBoxFull);
    put("cardInGate", cardInGate);
    put("cardsInDispenser", cardsInDispenser);
    put("dispenserFull", dispenserFull);
  }

  public String getMessage() {
    return message;
  }

  public int getStatusCode() {
    return statusCode;
  }
}
