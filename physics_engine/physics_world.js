class PhysicsWorld {
  constructor(canvas) {
    this._canvas = canvas;
    this._gravity = new Vector2(0, 9.18);
    this._objects = [];
  }

  register(object) {
    this._objects.push(object);
  }

  update(deltaTime) {
    for (let object of this._objects) {
      object.addForce(this._gravity);
      object.updatePos(deltaTime);
      object.draw(this._canvas);
    }
  }
}
