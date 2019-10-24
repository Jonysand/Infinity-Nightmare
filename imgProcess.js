//-------------------------------------
// start taking snapshot and processing
//-------------------------------------
function serialEvent() {
  fromSerial = serial.read();
  if (fromSerial == 0) {
    //may need some delay, better modeified at ardunio part
    processPipline();
  }
  serial.write(lightMes);
}



//--------------------
// whole image process
//--------------------
function processPipline() {
  snapshot = video.get();
  positions = ctracker.getCurrentPosition();
  if (positions.length > 0) {
    maskFace = maskOfFace(positions, videoWidth * 2, videoHeight * 2);
    snapshot.mask(maskFace);
    head = cropImage(snapshot, positions);
    head.filter(GRAY);
    dr = 0;
  }
}



//-------------
// extract face
//-------------
function maskOfFace(positions, width, height) {
  let imgMask = createGraphics(width, height);
  imgMask.noStroke();

  imgMask.beginShape();
  for (var i = 0; i < positions.length; i++) {
    if (i <= 18) {
      imgMask.vertex(positions[i][0], positions[i][1]);
    } else if (i <= 22) {
      imgMask.vertex(positions[41 - i][0], positions[41 - i][1]);
    }
  }
  imgMask.endShape(CLOSE);

  return imgMask;
}



//------------------
// crop the head out
//------------------
function cropImage(oneFrame, positions) {
  let leftMost = Math.min.apply(Math, positions.map(function(v) {
    return v[0];
  }));
  let rightMost = Math.max.apply(Math, positions.map(function(v) {
    return v[0];
  }));
  let topMost = Math.min.apply(Math, positions.map(function(v) {
    return v[1];
  }));
  let bottomMost = Math.max.apply(Math, positions.map(function(v) {
    return v[1];
  }));

  // calibration for `positions` coordinates
  leftMost /= 2;
  rightMost /= 2;
  topMost /= 2;
  bottomMost /= 2;

  let imgWidth = (rightMost - leftMost);
  let imgHeight = (bottomMost - topMost);

  var resultImg = createImage(imgWidth, imgHeight);

  resultImg.copy(oneFrame, leftMost, topMost, imgWidth, imgHeight, 0, 0, imgWidth, imgWidth);

  return resultImg;
}



//----------------------
// make head to hologram
//----------------------
function hologramize(head, width, height) {
  if (head.width <= 0 || head.height <= 0) {
    return head;
  }
  var resultImg = createGraphics(width, height);
  var imgCopy = head;

  // initial size of each head
  imgCopy.resize(initHeadSizeWidth, initHeadSizeHeight);

  resultImg.background(0);
  resultImg.noStroke();
  resultImg.imageMode(CENTER);

  let tempWidth = imgCopy.width * (1 + tempScale);
  let tempHeight = imgCopy.height * (1 + tempScale)

  resultImg.push();
  resultImg.translate(width / 2, height / 6);
  resultImg.image(imgCopy, 0, 0, tempWidth, tempHeight);
  resultImg.pop();

  resultImg.push();
  resultImg.translate(width / 6, height / 2);
  resultImg.rotate(-PI / 2);
  resultImg.image(imgCopy, 0, 0, tempWidth, tempHeight);
  resultImg.pop();

  resultImg.push();
  resultImg.translate(width / 2, 5 * height / 6);
  resultImg.rotate(PI);
  resultImg.image(imgCopy, 0, 0, tempWidth, tempHeight);
  resultImg.pop();

  resultImg.push();
  resultImg.translate(5 * width / 6, height / 2);
  resultImg.rotate(PI / 2);
  resultImg.image(imgCopy, 0, 0, tempWidth, tempHeight);
  resultImg.pop();

  return resultImg;
}



//---------------------
// draw blood (in loop)
//---------------------
function getPositionsOnHead(positions) {
  let leftMost = Math.min.apply(Math, positions.map(function(v) {
    return v[0];
  }));
  let rightMost = Math.max.apply(Math, positions.map(function(v) {
    return v[0];
  }));
  let topMost = Math.min.apply(Math, positions.map(function(v) {
    return v[1];
  }));
  let bottomMost = Math.max.apply(Math, positions.map(function(v) {
    return v[1];
  }));

  let headWidth = rightMost - leftMost;
  let headHeight = bottomMost - topMost;

  var resultPositions = [];

  for (var i = 0; i < positions.length; i++) {
    resultPositions.push([(positions[i][0] - leftMost - headWidth / 2) / headWidth * initHeadSizeWidth, (positions[i][1] - topMost - headHeight / 2) / headHeight * initHeadSizeHeight]);
  }
  return resultPositions;
}

function drawBlood(head) {
  headPositions = getPositionsOnHead(positions);

  push();
  translate(width / 2, height / 6);
  drawBloodEachHead(headPositions);
  pop();

  push();
  translate(width / 6, height / 2);
  rotate(-PI / 2);
  drawBloodEachHead(headPositions);
  pop();

  push();
  translate(width / 2, 5 * height / 6);
  rotate(PI);
  drawBloodEachHead(headPositions);
  pop();

  push();
  translate(5 * width / 6, height / 2);
  rotate(PI / 2);
  drawBloodEachHead(headPositions);
  pop();
}

function drawBloodEachHead(positions) {
  noStroke();
  for (var i = 0; i < positions.length; i++) {
    // set the color of the ellipse based on position on screen
    if (i == 25 || i == 30) {
      fill(0, 255, 0);
      bloodTear(positions[i][0] * (1 + tempScale), positions[i][1] * (1 + tempScale), 10, dr);
    }
    // else if (i < 32) {
      // fill(0, 255, 0);
      // ellipse(positions[i][0] * (1 + tempScale), positions[i][1] * (1 + tempScale), 10, 10);
    //   drawBumpGradient(positions[i][0] * (1 + tempScale), positions[i][1] * (1 + tempScale), 10);
    // } 
    // else if (i == 32) {
    //   // fill(0, 255, 0);
    //   // ellipse(positions[i][0] * (1 + tempScale), positions[i][1] * (1 + tempScale), 10, 10);
    //   drawBumpGradient(positions[i][0] * (1 + tempScale), positions[i][1] * (1 + tempScale), 10);
    // } 
    else if (i == 44 || i == 50) {
      fill(255, 0, 0);
      // rect(positions[i][0] * (1 + tempScale), positions[i][1] * (1 + tempScale), 5, 25);
      // drawBloodGradient(positions[i][0] * (1 + tempScale), positions[i][1] * (1 + tempScale), 5, 25);
      bloodTear(positions[i][0] * (1 + tempScale), positions[i][1] * (1 + tempScale), 10, dr);
    } else if (i == 42 || i == 43 || i == 25 || i == 30|| i==23 || i==28) {
      fill(255, 0, 0);
      // rect(positions[i][0] * (1 + tempScale), positions[i][1] * (1 + tempScale), 5, 40);
      // drawBloodGradient(positions[i][0] * (1 + tempScale), positions[i][1] * (1 + tempScale), 5, 40);
      bloodTear(positions[i][0] * (1 + tempScale), positions[i][1] * (1 + tempScale), 10, dr);
    }
  }
  if (dr < maxDr) {
    dr += 0.3;
  }
}

function drawBumpGradient(x, y, radius) {
  noFill();
  let c1 = color(0, 255 * abs(sin(millis() / 500)), 0);
  let c2 = color(0, 255 * abs(sin(millis() / 500 + PI / 4)), 0);
  for (let r = 1; r <= radius; r++) {
    let inter = map(r, 1, radius, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    ellipse(x, y, r, r);
  }
}

function drawBloodGradient(x, y, w, h) {
  let c1 = color(255 * abs(sin(millis() / 500)), 0, 0);
  let c2 = color(255 * abs(sin(millis() / 500 + PI / 4)), 0, 0);
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c2, c1, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

function bloodTear(x, y, r, h) {
  fill(255, 0, 0);
  noStroke();
  beginShape();
  vertex(x, y);
  vertex(x + r, y + h);
  arc(x, y + h, 2 * r, 2 * r, 0, PI);
  vertex(x - r, y + h);
  vertex(x, y);
  endShape(CLOSE);
}