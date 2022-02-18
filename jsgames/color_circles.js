var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var radius = 30;
var count = 10;
var deltaTime = 0;
var lastTimestamp = 0;
update_size();

window.addEventListener('resize', () => {
  update_size();
});

draw();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDebug();
  for (var y = 0; y < canvas.height / count; y++) {
    for (var x = 0; x < canvas.width / count; x++) {
      drawCircle(x * (radius + radius) + radius, y * (radius + radius) + radius);
    }
  }
  requestAnimationFrame(draw);
  var timestamp = Date.now();
  deltaTime = 1000/(timestamp - lastTimestamp);
  lastTimestamp = timestamp;
}

var relativeX;
var relativeY;
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
  relativeX = e.clientX - canvas.offsetLeft;
  relativeY = e.clientY;
}

function drawCircle(x, y) {
  ctx.beginPath();
  let radiusModif = (Math.sin((lastTimestamp / 1000) + (y+x) / 100) * 0.5 + 0.5);
  ctx.arc(x, y, radius - radiusModif * 20, 0, Math.PI * 2);
  let colorHue = x / canvas.width;
  if (Math.abs(x - relativeX) < radius && Math.abs(y - relativeY) < radius) {
    ctx.fillStyle = "#FFFFFF";
  } else {
    ctx.fillStyle = `hsla(${colorHue*360}, 100%, 50%)`;
  }
  ctx.fill();
  ctx.closePath();
}

function drawDebug() {
  if (document.getElementById("debug")) {
    document.getElementById("debug").style.color = "white";
    document.getElementById("debug").innerHTML = "Pos: " + relativeX + ", " + relativeY;
    document.getElementById("debug").innerHTML += "\n Dt: " + deltaTime;
  }
}


function update_size() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
