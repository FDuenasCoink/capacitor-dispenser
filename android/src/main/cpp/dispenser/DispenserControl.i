%module DispenserControl
%include "std_string.i"
%include "Dispenser.hpp"
%include "StateMachine.hpp"
%include "DispenserControl.hpp"
%{
#include "Dispenser.hpp"
#include "StateMachine.hpp"
#include "DispenserControl.hpp"
using namespace DispenserControl;
using namespace StateMachine;
using namespace Dispenser;
%}