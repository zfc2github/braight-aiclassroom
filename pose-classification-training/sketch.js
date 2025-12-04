// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet using p5.js
=== */
/* eslint-disable */


var video = null;
var canvas = null;
var ctx = null;
let poses = [];
let animationFrameId;
let poseNet = null;

function initPoseNet() {
  // Grab elements, create settings, etc.
  video = document.getElementById("camera-video");
  canvas = document.getElementById("camera-canvas");
  ctx = canvas.getContext("2d");

// The detected positions will be inside an array
  poses = [];
  
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
  }
  // Create a webcam capture
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
      video.srcObject = stream;
      video.play();
    });
  }

  try {
    video.addEventListener("loadeddata", () => {
      // 创建一个新的 poseNet 方法
      poseNet = ml5.poseNet(video, modelReady);
      poseNet.on("pose", gotPoses);
  
      // 开始绘制循环
      drawCameraIntoCanvas();
    })
    
  } catch (error) {
    console.error("Failed to initialize poseNet:", error);
  }
}

function resetPoseNet() {
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
  }
  /*// 先取消所有回调
  if (poseNet) {
    poseNet.removeAllListeners && poseNet.removeAllListeners();
  }
  video = null;
  canvas = null;
  ctx = null;
  poses = [];
  if (animationFrameId) {
    window.cancelAnimationFrame(animationFrameId);
  }
  animationFrameId = null;
  poseNet = null;*/
}

// A function to draw the video and poses into the canvas.
// This function is independent of the result of posenet
// This way the video will not seem slow if poseNet
// is not detecting a position
function drawCameraIntoCanvas() {
  if (!video || !ctx) {
    return;
  }
  // Draw the video element into the canvas
  ctx.drawImage(video, 0, 0, 640, 480);
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
  animationFrameId = window.requestAnimationFrame(drawCameraIntoCanvas);
}

// A function that gets called every time there's an update from the model
function gotPoses(results) {
  poses = results;
}

function modelReady() {
  console.log("model ready");
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j += 1) {
      let keypoint = poses[i].pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
        // ctx.stroke();
        ctx.fillStyle = "red";
        ctx.fill();
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i += 1) {
    // For every skeleton, loop through all body connections
    for (let j = 0; j < poses[i].skeleton.length; j += 1) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      ctx.beginPath();
      ctx.moveTo(partA.position.x, partA.position.y);
      ctx.lineTo(partB.position.x, partB.position.y);
      ctx.stroke();
    }
  }
}
