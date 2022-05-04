class Vector2 {
  constructor(x, y) {
    this.x = (x === undefined) ? 0 : x;
    this.y = (y === undefined) ? 0 : y;
  }

  set(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	clone() {
    return new Vector2(this.x, this.y);
  }

	add(vector) {
		return new Vector2(this.x + vector.x, this.y + vector.y);
	}

	sub(vector) {
		return new Vector2(this.x - vector.x, this.y - vector.y);
  }

  multScalar(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

	scale(scalar) {
		return new Vector2(this.x * scalar, this.y * scalar);
	}

	dot(vector) {
		return (this.x * vector.x + this.y + vector.y);
	}

  magnitudeSqr() {
    return (this.x * this.x + this.y * this.y);
  }

	magnitude() {
		return Math.sqrt(this.magnitudeSqr());
	}

  distanceSqr(vector) {
    var deltaX = this.x - vector.x;
    var deltaY = this.y - vector.y;
    return (deltaX * deltaX + deltaY * deltaY);
  }

	distance (vector) {
		return Math.sqrt(this.distanceSqr(vector));
	}

	normalize() {
		var mag = this.magnitude();
		var vector = this.clone();
		if(Math.abs(mag) < 1e-9) {
			vector.x = 0;
			vector.y = 0;
		} else {
			vector.x /= mag;
			vector.y /= mag;
		}
		return vector;
	}

	angle() {
		return Math.atan2(this.y, this.x);
	}

	rotate(alpha) {
		var cos = Math.cos(alpha);
		var sin = Math.sin(alpha);
		var vector = new Vector2();
		vector.x = this.x * cos - this.y * sin;
		vector.y = this.x * sin + this.y * cos;
		return vector;
	}

	toPrecision(precision) {
		var vector = this.clone();
		vector.x = vector.x.toFixed(precision);
		vector.y = vector.y.toFixed(precision);
		return vector;
	}

	toString () {
		var vector = this.toPrecision(1);
		return ("(" + vector.x + ", " + vector.y + ")");
	}
};
