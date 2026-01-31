// ==========================================
//      ROBOT MOTOR CONTROLLER (SMART)
// ==========================================

// --- PIN DEFINITIONS ---
// Left Motor (A)
const int AIN1 = 2;
const int AIN2 = 3;
const int PWMA = 6; 

// Right Motor (B)
const int BIN1 = 4;
const int BIN2 = 5;
const int PWMB = 9; 

// --- CALIBRATION SETTINGS (TUNE THESE!) ---
// Use the speeds that made your robot go straight
int speedA = 84; // Left Motor Speed (0-255)
int speedB = 100; // Right Motor Speed (Adjust this if curving)

// Time to drive to a zone (in milliseconds)
// 1000 = 1 second. Measure your floor distance!
const int TIME_DRIVE = 1500; 
const int TIME_TURN_90 = 600; // How long to turn 90 degrees
const int TIME_WAIT = 3000;   // How long to stay in the zone

// --- SYSTEM VARIABLES ---
String command = "";
boolean isMoving = false;

void setup() {
  Serial.begin(9600);
  
  pinMode(AIN1, OUTPUT);
  pinMode(AIN2, OUTPUT);
  pinMode(PWMA, OUTPUT);
  pinMode(BIN1, OUTPUT);
  pinMode(BIN2, OUTPUT);
  pinMode(PWMB, OUTPUT);
  
  stopMotors();
  Serial.println("Arduino Ready! Waiting for <COMMAND>...");
}

void loop() {
  // Listen for commands like "<RED>" or "<BLUE>"
  while (Serial.available() > 0) {
    char c = Serial.read();
    
    if (c == '<') {
      command = ""; // Start of new command
    } 
    else if (c == '>') {
      executeCommand(command); // End of command -> Run it!
      command = "";
    } 
    else if (c != '\n' && c != '\r') {
      command += c; // Build the string
    }
  }
}

// --- THE ZONE LOGIC (RECIPES) ---
void executeCommand(String cmd) {
  Serial.print("Executing: ");
  Serial.println(cmd);
  
  if (cmd == "RED") {
    // SCENARIO: SPEND (Turn Left, Drive, Wait, Return)
    turnLeft();
    delay(TIME_TURN_90);
    
    moveForward();
    delay(TIME_DRIVE);
    
    stopMotors();
    delay(TIME_WAIT); // Wait for audio to play
    
    // RETURN HOME
    moveBackward();
    delay(TIME_DRIVE);
    
    turnRight(); // Undo the Left Turn
    delay(TIME_TURN_90);
    
    stopMotors();
  } 
  
  else if (cmd == "YELLOW") {
    // SCENARIO: INVEST (Turn Right, Drive, Wait, Return)
    turnRight();
    delay(TIME_TURN_90);
    
    moveForward();
    delay(TIME_DRIVE);
    
    stopMotors();
    delay(TIME_WAIT);
    
    // RETURN HOME
    moveBackward();
    delay(TIME_DRIVE);
    
    turnLeft(); // Undo the Right turn
    delay(TIME_TURN_90);
    
    stopMotors();
  } 
  
  else if (cmd == "BLUE") {
    // SCENARIO: SAVE (Straight, Wait, Return)
    moveForward();
    delay(TIME_DRIVE);
    
    stopMotors();
    delay(TIME_WAIT);
    
    // RETURN HOME
    moveBackward();
    delay(TIME_DRIVE);
    
    stopMotors();
  }
  
  else if (cmd == "STOP") {
    stopMotors();
  }
  
  Serial.println("Action Complete. Back at Home.");
}

// --- MUSCLE FUNCTIONS (The primitive moves) ---

void moveForward() {
  digitalWrite(AIN1, HIGH); digitalWrite(AIN2, LOW);
  analogWrite(PWMA, speedA);
  
  digitalWrite(BIN1, HIGH); digitalWrite(BIN2, LOW);
  analogWrite(PWMB, speedB);
}

void moveBackward() {
  digitalWrite(AIN1, LOW); digitalWrite(AIN2, HIGH);
  analogWrite(PWMA, speedA);
  
  digitalWrite(BIN1, LOW); digitalWrite(BIN2, HIGH);
  analogWrite(PWMB, speedB);
}

void turnLeft() {
  // Left motor BACK, Right motor FORWARD (Spin in place)
  digitalWrite(AIN1, LOW); digitalWrite(AIN2, HIGH);
  analogWrite(PWMA, speedA);
  
  digitalWrite(BIN1, HIGH); digitalWrite(BIN2, LOW);
  analogWrite(PWMB, speedB);
}

void turnRight() {
  // Left motor FORWARD, Right motor BACK
  digitalWrite(AIN1, HIGH); digitalWrite(AIN2, LOW);
  analogWrite(PWMA, speedA);
  
  digitalWrite(BIN1, LOW); digitalWrite(BIN2, HIGH);
  analogWrite(PWMB, speedB);
}

void stopMotors() {
  digitalWrite(AIN1, LOW); digitalWrite(AIN2, LOW);
  analogWrite(PWMA, 0);
  
  digitalWrite(BIN1, LOW); digitalWrite(BIN2, LOW);
  analogWrite(PWMB, 0);
}