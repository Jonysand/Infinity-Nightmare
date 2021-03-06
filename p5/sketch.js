//-------
// canvas
//-------
var cav;
const screenWidth = 2736;
const screenHeight = 1824;
const screenScale = 0.54;

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
var initHeadSizeWidth = screenHeight * screenScale/5;
var initHeadSizeHeight = screenHeight * screenScale/5;
var dr = 0;
let maxDr = 200;

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
const port = "COM5";
const lightMes = 255;



function setup() {
  // canvas setup
  cav = createCanvas(screenHeight * screenScale, screenHeight * screenScale);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cav.position(x, y);
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
  tempScale = micLevel*1.3;

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
