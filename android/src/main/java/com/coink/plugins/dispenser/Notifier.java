package com.coink.plugins.dispenser;

public interface Notifier {
  void onDispenseCompleted(DispenserEvent event);
  void onDispenseError(DispenserException error);
}
