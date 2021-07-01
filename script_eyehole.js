let video;
let latestPrediction = null;

// p5 function
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // ml5 function
  let facemesh = ml5.facemesh(video, () => {
    console.log("Model is ready!");
  });

  // ml5 function
  facemesh.on("predict", (results) => {
    // results is an Array
    // we care about the first object only
    // results[0]
    // console.log(results[0]);
    latestPrediction = results[0];
  });

  video.hide();
}

// p5 function
function draw() {
  // draw webcam video
  image(video, 0, 0, width, height);

  if (!latestPrediction) return; // don't draw anything else
  //-----------------------------------

  drawFullFaceCovering(); // cover the face with white shape

  let eyeholeMask = createEyeholeMask();

  let webcamCopy = video.get(); // get a new copy of the webcam image
  webcamCopy.mask(eyeholeMask); // apply the eyehole mask
  image(webcamCopy, 0, 0, width, height); // draw eye on top of the full face covering
}

function drawFullFaceCovering() {
let faceCovering = createGraphics(width, height);
faceCovering.beginShape()
  //changed color to fire orange for obitos face
 faceCovering.fill(255, 119, 0);
faceCovering.noStroke();
  //ffunction for spiral on facemask
  // drawSpiral();
  // "silhouette" is the outline of the whole face mesh
  latestPrediction.annotations.silhouette.forEach((point) => {
  faceCovering.curveVertex(point[0 /* x */], point[1 /* y */]);
  });
 faceCovering.endShape(CLOSE);
image(faceCovering, 0, 0);
   let spiral = drawSpiral()
   spiral.mask(faceCovering);
   image(spiral, 0, 0);

}

function drawSpiral() {
  let spiral = createGraphics(width, height);
  spiral.push();
  let a = 0.5;
  let b = 0.5;
  let rightEye = latestPrediction.annotations.rightEyeUpper0[0];
  spiral.stroke(255);
 spiral. noFill();
  
  spiral.translate(rightEye[0], rightEye[1]);
  spiral.beginShape();
    for (let i = 0; i < 360*2; i ++) {
      //let t = seq(0,5*pi, length.out=500);
      let x = (a + b*i) * cos(i);
      let y = (a + b*i) * sin(i);
      spiral.vertex(x, y);
    }
  spiral.endShape();
  spiral.pop()
  let spiralImage = createImage(width, height);
  spiralImage.copy(spiral, 0, 0, width, height, 0, 0, width, height);
  return spiralImage;
  // translate(0, 0); -not needed
}
//---
// function drawSpiral() {
//   oldX = c.width/2;
//   oldY = c.height/2;
  
//   for (let i=0; i<size; i++) {
//     newAngle = (angle/10) * i;
//     x = (c.width/2) + (spiralWidth * newAngle) * Math.sin(newAngle);
//     y = (c.height/2) + (spiralWidth * newAngle) * Math.cos(newAngle);
    
//     // stroke(randomColor()); // Random Color for each line segment
//     // strokeWeight(randomWeight()); // Random Weight (1-5)
    
//     line(oldX, oldY, x, y);
//     oldX = x;
//     oldY = y;
//   }
// }

function createEyeholeMask() {
  let eyeholeMask = createGraphics(width, height); // draw into a "graphics" object instead of the canvas directly
  eyeholeMask.background("rgba(255,255,255,0)"); // transparent background (zero alpha)
  eyeholeMask.noStroke();

  // get the eyehole points from the facemesh
  let rightEyeUpper = latestPrediction.annotations.rightEyeUpper1;
  let rightEyeLower = [
    ...latestPrediction.annotations.rightEyeLower1,
  ].reverse(); /* note that we have to reverse one of the arrays so that the shape draws properly */

  // draw the actual shape
  eyeholeMask.beginShape();
  // draw from left to right along the top of the eye
  rightEyeUpper.forEach((point) => {
    eyeholeMask.curveVertex(point[0 /* x */], point[1 /* y */]); // using curveVertex for smooth lines
  });
  // draw back from right to left along the bottom of the eye
  rightEyeLower.forEach((point) => {
    eyeholeMask.curveVertex(point[0 /* x */], point[1 /* y */]);
  });
  eyeholeMask.endShape(CLOSE); // CLOSE makes sure we join back to the beginning

  return eyeholeMask;

}
