// --- PIN DEFINITIONS ---
const int AIN1 = 2;
const int AIN2 = 3;
const int PWMA = 6; 

const int BIN1 = 4;
const int BIN2 = 5;
const int PWMB = 9; 

// Speed (0 - 255)
// If the robot curves to one side, lower the speed of the FASTER motor slightly
// Example: int speedA = 200; int speedB = 180;
int speedA = 90;
int speedB = 100;

void setup() {
  pinMode(AIN1, OUTPUT);
  pinMode(AIN2, OUTPUT);
  pinMode(PWMA, OUTPUT);
  pinMode(BIN1, OUTPUT);
  pinMode(BIN2, OUTPUT);
  pinMode(PWMB, OUTPUT);
  
  // Wait 2 seconds so you can put the robot on the floor
  delay(2000);
}

void loop() {
  moveForward();
}

void moveForward() {
  // Motor A Forward
  digitalWrite(AIN1, HIGH);
  digitalWrite(AIN2, LOW);
  analogWrite(PWMA, speedA);

  // Motor B Forward
  digitalWrite(BIN1, HIGH);
  digitalWrite(BIN2, LOW);
  analogWrite(PWMB, speedB);
}

void stopMotors() {
  digitalWrite(AIN1, LOW);
  digitalWrite(AIN2, LOW);
  analogWrite(PWMA, 0);
  
  digitalWrite(BIN1, LOW);
  digitalWrite(BIN2, LOW);
  analogWrite(PWMB, 0);
}



// proposed claude code
// --- PIN DEFINITIONS --- (KEEP AS-IS)
// const int AIN1 = 2;
// const int AIN2 = 3;
// const int PWMA = 6; 

// const int BIN1 = 4;
// const int BIN2 = 5;
// const int PWMB = 9; 

// int speedA = 90;
// int speedB = 100;

// // ADD THIS: Command buffer
// String command = "";

// void setup() {
//   // ADD THIS LINE: Enable serial communication
//   Serial.begin(9600);
  
//   pinMode(AIN1, OUTPUT);
//   pinMode(AIN2, OUTPUT);
//   pinMode(PWMA, OUTPUT);
//   pinMode(BIN1, OUTPUT);
//   pinMode(BIN2, OUTPUT);
//   pinMode(PWMB, OUTPUT);
  
//   // CHANGE THIS: Don't auto-start, wait for commands
//   stopMotors();
//   Serial.println("Arduino Ready!");
// }

// void loop() {
//   // REPLACE YOUR LOOP WITH THIS: Listen for commands
//   if (Serial.available() > 0) {
//     char c = Serial.read();
    
//     if (c == '<') {
//       command = "";
//     } 
//     else if (c == '>') {
//       executeCommand(command);
//       command = "";
//     } 
//     else if (c != '\n' && c != '\r') {
//       command += c;
//     }
//   }
// }

// void executeCommand(String cmd) {
//   Serial.print("Command: ");
//   Serial.println(cmd);
  
//   if (cmd == "RED") {
//     // Your friend's code here
//     // Example: Turn left, forward, then return
//     // They already tested this!
//   } 
//   else if (cmd == "BLUE") {
//     // Your friend's code here
//     // Example: Forward, then return
//   } 
//   else if (cmd == "YELLOW") {
//     // Your friend's code here  
//     // Example: Turn right, forward, then return
//   }
//   else if (cmd == "CENTER") {
//     // Already at center
//     Serial.println("At center");
//   }
// }

// void moveForward() {
//   digitalWrite(AIN1, HIGH);
//   digitalWrite(AIN2, LOW);
//   analogWrite(PWMA, speedA);

//   digitalWrite(BIN1, HIGH);
//   digitalWrite(BIN2, LOW);
//   analogWrite(PWMB, speedB);
// }

// void stopMotors() {
//   digitalWrite(AIN1, LOW);
//   digitalWrite(AIN2, LOW);
//   analogWrite(PWMA, 0);
  
//   digitalWrite(BIN1, LOW);
//   digitalWrite(BIN2, LOW);
//   analogWrite(PWMB, 0);
// }
