class PhysicsCircle extends PhysicsObject {
  constructor(pos, radius) {
    super(pos);
    this._radius = radius;
  }

  draw(canvas) {

    let circle = canvas.getContext("2d");

    circle.beginPath();
    circle.arc(this._pos.x, this._pos.y, this._radius, 0, 2 * Math.PI);
    circle.fillStyle = `hsla(${this._pos.y}, 100%, 50%)`;
    circle.fill();
    circle.lineWidth = 5;
    circle.strokeStyle = '#FFFFFF';
    circle.stroke();
    circle.closePath();
  }
}
