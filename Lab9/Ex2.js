// https://dport96.github.io/ITM352/morea/090.algorithms/RobotSim/RobotSim.html

// pseudo code
// repeat forever {
//    step
//    if not step then {
//        turn right
//        step
//    }
// }

while(true) {
    step =
    controller.move(); {
    if(!step) {
        controller.rotate();
        controller.move();
        }
    }
}