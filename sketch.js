//-------
// canvas
//-------
const screenWidth = 2736;
const screenHeight = 1824;
const screenScale = 0.4;

//------
// video
//------
var video;
var snapshot = [];
var tempScale = 0;
var holoHead;
let videoWidth = 640;
let videoHeight = 480;

//--------------
// face tracking
//--------------
var ctracker;
var videoInput;
var positions = [];
var positionsOnPicture = [];
var head;
var initHeadSizeWidth = screenHeight * screenScale/4;
var initHeadSizeHeight = screenHeight * screenScale/4;

//-----------
// microphone
//-----------
let mic;
let micLevel;
let noiseSmoother;

//-------
// serial
//-------
var serial;
const port = "/dev/cu.usbmodem1432201";
const lightMes = 255;



function setup() {
  // canvas setup
  var cav = createCanvas(screenHeight * screenScale, screenHeight * screenScale);
  background(0);

  // video setup
  video = createCapture(VIDEO);
  video.size(videoWidth, videoHeight);
  video.hide();

  // setup tracker
  ctracker = new clm.tracker();
  ctracker.init(pModel);
  ctracker.start(video.elt);
  
  // mic setup
  mic = new p5.AudioIn();
  mic.start();
  noiseSmoother = new BGsmooth();

  // serial setup
  serial = new p5.SerialPort();
  serial.on('data', serialEvent);
  serial.open(port);
}

function draw() {
  clear();

  //-------------------
  // get loudness level
  //-------------------
  micLevel = mic.getLevel();
  // soundOffset = noiseSmoother.getBGoffset(micLevel);
  // tempScale = updateScale(tempScale, soundOffset);
  tempScale = micLevel;

  //------------------
  // image processing
  //------------------
  ctracker.getCurrentPosition();
  if (snapshot.width > 0 && positions.length>0) {
    holoHead = hologramize(head, width, height);
    // draw the head
    image(holoHead, 0, 0);
    drawBlood(head);
  }
}


//------------
// for testing
//------------
function mousePressed() {
  processPipline();
}

//-------------------------------------
// Arduino code (de-comment before use)
//-------------------------------------

// //---------------
// // button control
// //---------------
// const int  buttonPin = 2;
// int buttonState = 0;
// int lastButtonState = 0;
// const byte buttonMes = 0;

// //------------
// // flash light
// //------------
// int lightPin = 4;
// byte lightMes;

// void setup() {
//   pinMode(buttonPin, INPUT);
//   Serial.begin(9600);
// }


// void loop() {
//   buttonState = digitalRead(buttonPin);
//   if (buttonState != lastButtonState) {
//     if (buttonState == HIGH) {
//       digitalWrite(lightPin, HIGH);
//       Serial.write(buttonMes);
//     } 
//     delay(50);
//   }
//   lastButtonState = buttonState;

//   if(Serial.available()){
//     lightMes = Serial.read();
//     if(lightMes==255){
//       digitalWrite(lightPin, LOW);
//     }
//   }
// }