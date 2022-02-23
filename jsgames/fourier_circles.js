
var cirCanvas = document.getElementById("circlesCanvas");
var freqCanvas = document.getElementById("frequenceCanvas");
var ctx = cirCanvas.getContext("2d");
var deltaTime = 0;
var lastTimestamp = 0;
var timestamp = 0;
var time = 0;

var linesPoint = [];
var speed = [];
var radius = [];

var states = ["draw", "switch", "undraw"];

var resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener('click', restart);

function restart() {
  time = 0;
  linesPoint = [];
}

window.onload = function() {
  loadParam();
  restart();
}

var slide = document.getElementById('pitchRange');

slide.onchange = function() {
  pitchShift.pitch = parseInt(this.value);
}

const url = "https://floreauluca.github.io/jsgames/data/wave.wav";
const player = new Tone.Player({
  url,
  loop: true,
  autostart: true,
});

pitchShift = new Tone
  .PitchShift({ pitch: 0 })
  .toDestination();

player.connect(pitchShift);

var btnPlay = document.getElementById("playBtn");
btnPlay.addEventListener('click', playBtn);
var playBool = false;

function playBtn() {
  if (playBool) {
    playBool = false;
    player.stop();
    console.log("Tone.stop()");
  } else {
    playBool = true;
    player.start();
    console.log("Tone.start()");
  }
}

var speedInputs = [];
var radiusInputs = [];

var circleCount = 0;
var updateCirclesBtn = document.getElementById("updateCirclesBtn");
updateCirclesBtn.addEventListener('click', updateCircles);

function clearCircles() {
  for (var i = 0; i < speedInputs.length; i++) {
    speedInputs[i].remove();
    radiusInputs[i].remove();
  }
  speed = [];
  radius = [];
  speedInputs = [];
  radiusInputs = [];
}

function updateCircles() {
  clearCircles();
  circleCount = parseInt(document.getElementById("circleCount").value);
  createInput();
}

var loadParamBtn = document.getElementById("loadParam");
loadParamBtn.addEventListener('click', loadParam);

var doReadInputs = false;

function loadParam() {
  var paramContainer = document.getElementsByClassName("paramContainer")[0];
  switch (document.getElementById("loadDropdown").value) {
    case "custom":
      doReadInputs = true;
    paramContainer.style.display = "block";
    clearCircles();
    updateCircles();
    break;
    case "flowerCamille":
      doReadInputs = false;
    paramContainer.style.display = "none";
    clearCircles();
    circleCount = 5;
    speed = [0.1, 1.1, 2.1, 3.1, 4.1];
    radius = [1/1, 1/2, 1/3, 1/4, 1/5];
    break;
    case "line":
      doReadInputs = false;
    paramContainer.style.display = "none";
    clearCircles();
    circleCount = 4;
    speed = [1, -1, 1, -1];
    radius = [0.5, 0.5, 0.5, 0.5];
    break;
    case "circles":
      doReadInputs = false;
    paramContainer.style.display = "none";
    clearCircles();
    circleCount = 5;
    speed = [10.1, 1, 1, 1, 1];
    radius = [1, 0.5, 0.4, 0.3, 0.2];
    break;
  default:
  }
  time = 0;
  linesPoint = [];
}
class FourierCircle {
  constructor(pos, radius, speed) {
    this.pos = pos;
    this.radius = radius;
    this.speed = speed;
  }

  draw(time) {
    time *= this.speed;
    let circle = cirCanvas.getContext("2d");
    circle.beginPath();
    circle.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
    circle.lineWidth = 5;
    circle.strokeStyle = '#FFFFFF';
    circle.stroke();
    circle.closePath();

    let newPos = new Vector2(
      this.pos.x + Math.cos(time * 2 * Math.PI) * this.radius,
      this.pos.y + Math.sin(time * 2 * Math.PI) * this.radius);

    circle.beginPath();
    circle.arc(newPos.x, newPos.y, this.radius * 0.15, 0, 2 * Math.PI);
    circle.fillStyle = `hsla(${time * 360}, 100%, 50%)`;
    circle.fill();
    circle.closePath();

    return newPos;
  }
}

draw();

function draw() {
  if (doReadInputs) {
    readInputs();
  }

  ctx.clearRect(0, 0, cirCanvas.width, cirCanvas.height);
  timestamp = Date.now();

  let circlePos = new Vector2(cirCanvas.width / 2, cirCanvas.height / 2);

  let speedModifier =
    parseInt(document.getElementById("speedSlider").value) / 10;
  document.getElementById("speedText").innerText =
    "SpeedSlider : " + speedModifier;

  for (var i = 0; i < circleCount; i++) {
    let circle = new FourierCircle(circlePos, radius[i] * 100, speed[i]);
    circlePos = circle.draw(time);
  }

  let cycleFreq = parseFloat(document.getElementById("frequence").value);

  //if ((mulModifier*10) % 10 === 0)
  //{
  // cycleFreq = 1;
  //} else if ((mulModifier*10) % 5 === 0)
  //{
  // cycleFreq = 2;
  //} else if ((mulModifier*10) % 2 === 0)
  //{
  // cycleFreq = 5;
  //}

  if (time % (cycleFreq * 2) < cycleFreq) {
    linesPoint.push(circlePos);
  } else {
    linesPoint.shift();
  }

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#FFFFFF';
  for (var j = 0; j < linesPoint.length; j++) {
    ctx.lineTo(linesPoint[j].x, linesPoint[j].y);
  }
  ctx.stroke();
  ctx.closePath();

  drawFrequency();

  requestAnimationFrame(draw);

  deltaTime = 0.016;
  lastTimestamp = timestamp;
  time += deltaTime * speedModifier;
}

function drawFrequency() {
  var freqCtx = freqCanvas.getContext("2d");
  freqCtx.clearRect(0, 0, freqCanvas.width, freqCanvas.height);
  let offset = 20;

  freqCtx.beginPath();
  freqCtx.lineWidth = 2;
  freqCtx.strokeStyle = '#FFFFFF';
  freqCtx.lineTo(offset, offset);
  freqCtx.lineTo(offset, freqCanvas.height - offset);
  freqCtx.lineTo(freqCanvas.width - offset, freqCanvas.height - offset);
  freqCtx.stroke();
  freqCtx.closePath();

  let width = freqCanvas.width - offset * 2;
  let height = freqCanvas.height - offset * 2;

  freqCtx.beginPath();
  freqCtx.lineWidth = 2;
  freqCtx.strokeStyle = '#FFFFFF';
  for (var j = 0; j < 10; j += 0.1) {
    let x = j;
    let y = 0;
    for (var i = 0; i < circleCount; i++) {
      y += Math.sin(x * speed[i] * 0.1 * 2 * Math.PI) * radius[i];
    }
    freqCtx.lineTo(x / 10 * width + offset,
      freqCanvas.height - offset - ((y / 5) * 0.5 + 0.5) * height);
  }
  freqCtx.stroke();
  freqCtx.closePath();
}

function createInput() {
  for (var i = 0; i < circleCount; i++) {
    speedInputs[i] = document.createElement("input");
    radiusInputs[i] = document.createElement("input");

    speedInputs[i].setAttribute("value", "1");
    radiusInputs[i].setAttribute("value", String(1 / (i + 1)));

    speedInputs[i].setAttribute("type", "number");
    radiusInputs[i].setAttribute("type", "number");

    document.getElementsByClassName("speedContainer")[0].appendChild(
      speedInputs[i]);
    document.getElementsByClassName("radiusContainer")[0].appendChild(
      radiusInputs[i]);
  }
  readInputs();
}

function readInputs() {
  for (var i = 0; i < circleCount; i++) {
    speed[i] = speedInputs[i].value;
    radius[i] = radiusInputs[i].value;
  }
}
