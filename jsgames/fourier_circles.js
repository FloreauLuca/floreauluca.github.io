
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var btn = document.getElementById("resetBtn");

var deltaTime = 0;
var lastTimestamp = 0;
var timestamp = 0;
var time = 0;

var linesPoint = [];

btn.addEventListener('click', restart);

function restart() {
  time = 0;
  linesPoint = [];
}

window.onload = function () {
  restart();
}

class FourierCircle {
  constructor(pos, radius, speed) {
    this.pos = pos;
    this.radius = radius;
    this.speed = speed;
  }

  draw(time) {
    time *= this.speed;
    let circle = canvas.getContext("2d");
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  timestamp = Date.now();

  let circlePos = new Vector2(canvas.width / 2, canvas.height / 2);

  let mulModifier = parseFloat(document.getElementById("mulSlider").value);
  let speedModifier = parseInt(document.getElementById("speedSlider").value) / 10;
  document.getElementById("mulText").innerHTML = mulModifier;
  document.getElementById("addText").innerHTML = speedModifier;
  
  var speed = [];

  switch (document.getElementById("dropdown").value) {
    case 'increase':
      speed = [0 + mulModifier, 1 + mulModifier, 2 + mulModifier, 3 + mulModifier, 4 + mulModifier];
    break;
    case 'decrease':
      speed = [0 - mulModifier, 1 - mulModifier, 2 - mulModifier, 3 - mulModifier, 4 - mulModifier];
    break;
    default:
      speed[0] = document.getElementById("speed1").value;
      speed[1] = document.getElementById("speed2").value;
      speed[2] = document.getElementById("speed3").value;
      speed[3] = document.getElementById("speed4").value;
      speed[4] = document.getElementById("speed5").value;
  }

  for (var i = 0; i < 5; i++) {
    let circle = new FourierCircle(circlePos, 100 / (i + 1), speed[i]);
    circlePos = circle.draw(time);
  }
  
  let cycleFreq = 10;
  if ((mulModifier*10) % 10 === 0)
  {
	  cycleFreq = 1;
  } else if ((mulModifier*10) % 5 === 0)
  {
	  cycleFreq = 2;
  } else if ((mulModifier*10) % 2 === 0)
  {
	  cycleFreq = 5;
  }

  cycleFreq = parseFloat(document.getElementById("frequence").value);

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

  requestAnimationFrame(draw);

  deltaTime = 0.016;
  lastTimestamp = timestamp;
  time += deltaTime * speedModifier;
}
