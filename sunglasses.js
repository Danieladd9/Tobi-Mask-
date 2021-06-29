// based on Coding Train's Clown Nose Example


let video;
let poseNet;
let nose;
let eyeL;
let eyeR;
let earL;
let earR;

function setup() {
  createCanvas(640, 480);
  nose = createVector(0, 0);
  eyeL = createVector(0, 0);
  eyeR = createVector(0, 0);
  earR = createVector(0, 0);
  earL = createVector(0, 0);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  // console.log(poses);
  if (poses.length > 0) {
    let nX = poses[0].pose.keypoints[0].position.x;
    let nY = poses[0].pose.keypoints[0].position.y;
    let elX = poses[0].pose.keypoints[1].position.x;
    let elY = poses[0].pose.keypoints[1].position.y;
    let erX = poses[0].pose.keypoints[2].position.x;
    let erY = poses[0].pose.keypoints[2].position.y;
    let earLX = poses[0].pose.keypoints[3].position.x;
    let earLY = poses[0].pose.keypoints[3].position.y;
    let earRX = poses[0].pose.keypoints[4].position.x;
    let earRY = poses[0].pose.keypoints[4].position.y;

    nose.x = lerp(nose.x, nX, 0.5);
    nose.y = lerp(nose.y, nY, 0.5);
    eyeL.x = lerp(eyeL.x, elX, 0.5);
    eyeL.y = lerp(eyeL.y, elY, 0.5);
    eyeR.x = lerp(eyeR.x, erX, 0.5);
    eyeR.y = lerp(eyeR.y, erY, 0.5);
    earL.x = lerp(earL.x, earLX, 0.5);
    earL.y = lerp(earL.y, earLY, 0.5);
    earR.x = lerp(earR.x, earRX, 0.5);
    earR.y = lerp(earR.y, earRY, 0.5);

  }
}

function modelReady() {
  console.log('model ready');
}

function draw() {
  image(video, 0, 0);

  //nose:
  let d = dist(nose.x, nose.y, eyeL.x, eyeL.y);
  noStroke();
  fill(255, 0, 0);
  ellipse(nose.x, nose.y, d);

  // ears:
  fill(20, 200, 10);
  rect(earL.x, earL.y, 10, 30);
  rect(earR.x, earR.y, 10, 30);

  //glasses:
  fill(0, 75);
  strokeWeight(4);
  stroke(0);
  let eyeDiameter = dist(eyeL.x, eyeL.y, eyeR.x, eyeR.y);
  ellipse(eyeL.x, eyeL.y, eyeDiameter * 0.75);
  ellipse(eyeR.x, eyeR.y, eyeDiameter * 0.75);
  let glass = p5.Vector.sub(eyeL, eyeR).setMag(eyeDiameter * 0.375);
  line(eyeL.x - glass.x, eyeL.y - glass.y, eyeR.x + glass.x, eyeR.y + glass.y); 
  rectMode(CENTER);
  line(eyeL.x + glass.x, eyeL.y + glass.y, earL.x, earL.y - 10);
  line(eyeR.x - glass.x, eyeR.y - glass.y, earR.x, earR.y - 10);
  console.log(frameRate());
}