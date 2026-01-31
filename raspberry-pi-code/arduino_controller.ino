/*
 * StoryRover Arduino Motor Controller
 * Receives commands from Raspberry Pi via Serial
 * Controls motors to navigate to different zones
 */

// Motor pin definitions (adjust based on your motor shield)
const int MOTOR_LEFT_FWD = 9;
const int MOTOR_LEFT_BWD = 10;
const int MOTOR_RIGHT_FWD = 11;
const int MOTOR_RIGHT_BWD = 12;

// Speed settings (0-255)
const int SPEED_NORMAL = 150;
const int SPEED_TURN = 120;

// Timing calibration (milliseconds) - ADJUST THESE FOR YOUR ROBOT
const int TIME_FORWARD_SHORT = 1000;  // 1 second forward
const int TIME_FORWARD_LONG = 2000;   // 2 seconds forward
const int TIME_TURN_90 = 600;         // Time to turn 90 degrees

String command = "";

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  
  // Set motor pins as outputs
  pinMode(MOTOR_LEFT_FWD, OUTPUT);
  pinMode(MOTOR_LEFT_BWD, OUTPUT);
  pinMode(MOTOR_RIGHT_FWD, OUTPUT);
  pinMode(MOTOR_RIGHT_BWD, OUTPUT);
  
  // Start with motors off
  stopMotors();
  
  Serial.println("StoryRover Arduino Ready!");
}

void loop() {
  // Check for incoming commands
  if (Serial.available() > 0) {
    char c = Serial.read();
    
    if (c == '<') {
      command = "";  // Start new command
    } else if (c == '>') {
      // Command complete, execute it
      executeCommand(command);
      command = "";
    } else if (c == '\n' || c == '\r') {
      // Ignore newlines
    } else {
      command += c;
    }
  }
}

void executeCommand(String cmd) {
  Serial.print("Executing: ");
  Serial.println(cmd);
  
  if (cmd == "RED") {
    moveToRed();
  } else if (cmd == "BLUE") {
    moveToBlue();
  } else if (cmd == "YELLOW") {
    moveToYellow();
  } else if (cmd == "CENTER") {
    moveToCenter();
  } else {
    Serial.println("Unknown command!");
  }
  
  // Always stop motors after movement
  stopMotors();
  Serial.println("Movement complete");
}

// Movement functions - CUSTOMIZE THESE FOR YOUR FLOOR LAYOUT

void moveToRed() {
  // RED ZONE (Spend) - Example: Turn left, move forward
  Serial.println("Moving to RED zone (Spend)...");
  
  turnLeft();
  delay(100);
  moveForward(TIME_FORWARD_SHORT);
  delay(100);
}

void moveToBlue() {
  // BLUE ZONE (Save) - Example: Move straight forward
  Serial.println("Moving to BLUE zone (Save)...");
  
  moveForward(TIME_FORWARD_LONG);
  delay(100);
}

void moveToYellow() {
  // YELLOW ZONE (Invest) - Example: Turn right, move forward
  Serial.println("Moving to YELLOW zone (Invest)...");
  
  turnRight();
  delay(100);
  moveForward(TIME_FORWARD_SHORT);
  delay(100);
}

void moveToCenter() {
  // Return to center position
  Serial.println("Returning to CENTER...");
  
  // Turn around
  turnLeft();
  turnLeft();
  delay(100);
  
  // Move back
  moveForward(TIME_FORWARD_SHORT);
  delay(100);
  
  // Face forward again
  turnLeft();
  turnLeft();
}

// Basic movement primitives

void moveForward(int duration) {
  Serial.println("Moving forward");
  
  // Left motor forward
  analogWrite(MOTOR_LEFT_FWD, SPEED_NORMAL);
  analogWrite(MOTOR_LEFT_BWD, 0);
  
  // Right motor forward
  analogWrite(MOTOR_RIGHT_FWD, SPEED_NORMAL);
  analogWrite(MOTOR_RIGHT_BWD, 0);
  
  delay(duration);
  stopMotors();
}

void moveBackward(int duration) {
  Serial.println("Moving backward");
  
  // Left motor backward
  analogWrite(MOTOR_LEFT_FWD, 0);
  analogWrite(MOTOR_LEFT_BWD, SPEED_NORMAL);
  
  // Right motor backward
  analogWrite(MOTOR_RIGHT_FWD, 0);
  analogWrite(MOTOR_RIGHT_BWD, SPEED_NORMAL);
  
  delay(duration);
  stopMotors();
}

void turnLeft() {
  Serial.println("Turning left");
  
  // Left motor backward
  analogWrite(MOTOR_LEFT_FWD, 0);
  analogWrite(MOTOR_LEFT_BWD, SPEED_TURN);
  
  // Right motor forward
  analogWrite(MOTOR_RIGHT_FWD, SPEED_TURN);
  analogWrite(MOTOR_RIGHT_BWD, 0);
  
  delay(TIME_TURN_90);
  stopMotors();
}

void turnRight() {
  Serial.println("Turning right");
  
  // Left motor forward
  analogWrite(MOTOR_LEFT_FWD, SPEED_TURN);
  analogWrite(MOTOR_LEFT_BWD, 0);
  
  // Right motor backward
  analogWrite(MOTOR_RIGHT_FWD, 0);
  analogWrite(MOTOR_RIGHT_BWD, SPEED_TURN);
  
  delay(TIME_TURN_90);
  stopMotors();
}

void stopMotors() {
  analogWrite(MOTOR_LEFT_FWD, 0);
  analogWrite(MOTOR_LEFT_BWD, 0);
  analogWrite(MOTOR_RIGHT_FWD, 0);
  analogWrite(MOTOR_RIGHT_BWD, 0);
}
