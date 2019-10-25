
//---------------
// button control
//---------------
const int  buttonPin = 2;
int buttonState = 0;
int lastButtonState = 0;
const byte buttonMes = 0;

//------------
// flash light
//------------
int lightPin = 3;
byte lightMes;

void setup() {
  pinMode(buttonPin, INPUT);
  pinMode(lightPin, OUTPUT);
  Serial.begin(9600);
}


void loop() {
  buttonState = digitalRead(buttonPin);
  if (buttonState != lastButtonState) {
    if (buttonState == HIGH) {
      digitalWrite(lightPin, HIGH);
      delay(1000);
      Serial.write(buttonMes);
    } 
    delay(50);
  }
  lastButtonState = buttonState;
  
  if(Serial.available()){
    lightMes = Serial.read();
    if(lightMes==255){
      digitalWrite(lightPin, LOW);
    }
  }
}
