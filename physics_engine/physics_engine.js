
var physicsCanvas = document.getElementById("physicsCanvas");
var ctx = physicsCanvas.getContext("2d");

var timestamp = Date.now();
var lastTimestamp = Date.now();
var deltaTime = 0;
var time = 0;

var world = new PhysicsWorld(physicsCanvas);

init();

function init() {
  //let count = 10;
  //for (let i = 0; i < 10; i++) {
  //  let circlePos =
  //    new Vector2(i * physicsCanvas.width / (count) + physicsCanvas.width / (count * 2), physicsCanvas.height / count);
  //  let circle = new PhysicsCircle(circlePos, 20 * (Math.random()+0.5));
  //  world.register(circle);
  //}

  let count = 10;
  for (let i = 0; i < 10; i++) {
    let squarePos =
      new Vector2(i * physicsCanvas.width / (count) + physicsCanvas.width / (count * 2), physicsCanvas.height / count);
    let squareSize =
      new Vector2(20 * (Math.random() + 0.5), 20 * (Math.random() + 0.5));
    let square = new PhysicsSquare(squarePos, squareSize);
    world.register(square);
  }
}

draw();

function draw() {
  ctx.clearRect(0, 0, physicsCanvas.width, physicsCanvas.height);
  
  world.update(deltaTime);
  
  requestAnimationFrame(draw);

  timestamp = Date.now();
  deltaTime = (timestamp - lastTimestamp)  / 1000;
  lastTimestamp = timestamp;
  time += deltaTime;
}
