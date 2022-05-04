class PhysicsSquare extends PhysicsObject {
  constructor(pos, size) {
    super(pos);
    this._size = size;
  }

  draw(canvas) {

    let square = canvas.getContext("2d");

    square.beginPath();
    square.rect(this._pos.x - this._size.x / 2, this._pos.y - this._size.y / 2, this._size.x, this._size.y);
    square.fillStyle = `hsla(${this._pos.y}, 100%, 50%)`;
    square.fill();
    square.lineWidth = 5;
    square.strokeStyle = '#FFFFFF';
    square.stroke();
    square.closePath();
  }
}
