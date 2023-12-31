/* ----------------------------------------------------------------------------
 * This file was automatically generated by SWIG (https://www.swig.org).
 * Version 4.1.1
 *
 * Do not make changes to this file unless you know what you are doing - modify
 * the SWIG interface file instead.
 * ----------------------------------------------------------------------------- */

package hardware.dispenser;

public class ErrorCodesRow_t {
  private transient long swigCPtr;
  protected transient boolean swigCMemOwn;

  protected ErrorCodesRow_t(long cPtr, boolean cMemoryOwn) {
    swigCMemOwn = cMemoryOwn;
    swigCPtr = cPtr;
  }

  protected static long getCPtr(ErrorCodesRow_t obj) {
    return (obj == null) ? 0 : obj.swigCPtr;
  }

  protected static long swigRelease(ErrorCodesRow_t obj) {
    long ptr = 0;
    if (obj != null) {
      if (!obj.swigCMemOwn)
        throw new RuntimeException("Cannot release ownership as memory is not owned");
      ptr = obj.swigCPtr;
      obj.swigCMemOwn = false;
      obj.delete();
    }
    return ptr;
  }

  @SuppressWarnings("deprecation")
  protected void finalize() {
    delete();
  }

  public synchronized void delete() {
    if (swigCPtr != 0) {
      if (swigCMemOwn) {
        swigCMemOwn = false;
        DispenserControlJNI.delete_ErrorCodesRow_t(swigCPtr);
      }
      swigCPtr = 0;
    }
  }

  public void setErrorCode(String value) {
    DispenserControlJNI.ErrorCodesRow_t_ErrorCode_set(swigCPtr, this, value);
  }

  public String getErrorCode() {
    return DispenserControlJNI.ErrorCodesRow_t_ErrorCode_get(swigCPtr, this);
  }

  public void setMessage(String value) {
    DispenserControlJNI.ErrorCodesRow_t_Message_set(swigCPtr, this, value);
  }

  public String getMessage() {
    return DispenserControlJNI.ErrorCodesRow_t_Message_get(swigCPtr, this);
  }

  public void setPriority(int value) {
    DispenserControlJNI.ErrorCodesRow_t_Priority_set(swigCPtr, this, value);
  }

  public int getPriority() {
    return DispenserControlJNI.ErrorCodesRow_t_Priority_get(swigCPtr, this);
  }

  public ErrorCodesRow_t() {
    this(DispenserControlJNI.new_ErrorCodesRow_t(), true);
  }

}
