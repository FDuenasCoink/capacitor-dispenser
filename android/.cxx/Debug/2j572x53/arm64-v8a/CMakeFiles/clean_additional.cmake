# Additional clean files
cmake_minimum_required(VERSION 3.16)

if("${CONFIG}" STREQUAL "" OR "${CONFIG}" STREQUAL "Debug")
  file(REMOVE_RECURSE
  "/Users/coink/Desktop/projects/oink-hardware-plugins/capacitor-dispenser/android/src/main/java/hardware/dispenser/DispenserControl.java"
  "/Users/coink/Desktop/projects/oink-hardware-plugins/capacitor-dispenser/android/src/main/java/hardware/dispenser/DispenserControlJAVA_wrap.cxx"
  "/Users/coink/Desktop/projects/oink-hardware-plugins/capacitor-dispenser/android/src/main/java/hardware/dispenser/DispenserControlJNI.java"
  )
endif()
