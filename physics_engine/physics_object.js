class PhysicsObject {
  constructor(pos) {
    this._pos = pos;
    this._speed = new Vector2();
  }

  get pos() {
    return this._pos;
  }

  set pos(pos) {
    this._pos = pos;
  }

  addForce(force) {
    this._speed = this._speed.add(force);
  }

  updatePos(deltaTime) {
    this._pos = this._pos.add(this._speed.multScalar(deltaTime))
    //console.log(this._pos.toString());
  }
}
