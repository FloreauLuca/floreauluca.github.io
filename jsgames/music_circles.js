
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var deltaTime = 0;
var lastTimestamp = 0;
var timestamp = 0;
var time = 0;

update_size();

function update_size() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
  update_size();
});

function clickSound() {
  let beat = new Audio('./data/drum.wav');
  // Play the beat
  beat.play();
}
document.addEventListener("click", clickSound, false);

var relativeX;
var relativeY;
function mouseMoveHandler(e) {
  relativeX = e.clientX - canvas.offsetLeft;
  relativeY = e.clientY;
}
document.addEventListener("mousemove", mouseMoveHandler, false);

class MusicCircle {
  constructor(x, y, radius) {
    this.radius = radius;
    this.x = x;
    this.y = y;
  }
  draw(time) {
    let circle = canvas.getContext("2d");
    circle.beginPath();
    circle.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    circle.lineWidth = 5;
    circle.strokeStyle = '#FFFFFF';
    circle.stroke();
    circle.closePath();
    
    circle.beginPath();
    circle.arc(this.x + Math.cos(time * 2 * Math.PI) * this.radius, this.y + Math.sin(time * 2 * Math.PI) * this.radius, this.radius * 0.15, 0, 2 * Math.PI);
    circle.fillStyle = `hsla(${time * 360}, 100%, 50%)`;
    circle.fill();
    circle.closePath();
  }
}

draw();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  timestamp = Date.now();
  timestamp *= 0.5;
  time = (timestamp % 1000) / 1000;
  let circle = new MusicCircle(window.innerWidth / 2, window.innerHeight / 2, 100);
  circle.draw(time);

  requestAnimationFrame(draw);

  deltaTime = 1000 / (timestamp - lastTimestamp);
  lastTimestamp = timestamp;
}

