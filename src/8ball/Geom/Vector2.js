"use strict";

function Vector2(x=0, y=0) {

    this.x = x;
    this.y = y;
}

Object.defineProperty(Vector2, "zero",
    {
        get: function() {
            return new Vector2();
        }
    });

Object.defineProperty(Vector2.prototype, "isZero",
    {
        get: function() {
            return this.x === 0 && this.y === 0;
        }
    });

Object.defineProperty(Vector2.prototype, "length",
    {
        get: function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
    });

Vector2.prototype.addTo = function(vector) {
    if (vector.constructor === Vector2) {
        this.x += vector.x;
        this.y += vector.y;
    } else if (vector.constructor === Number) {
        this.x += vector;
        this.y += vector;
    }
    return this;
}

Vector2.prototype.add = function(vector) {

    const result = this.copy();
    return result.addTo(vector);
}

Vector2.prototype.subtractFrom = function(vector) {

    if (vector.constructor === Vector2) {
        this.x -= vector.x;
        this.y -= vector.y;
    } else if (vector.constructor === Number) {
        this.x -= vector;
        this.y -= vector;
    }
    return this;
}

Vector2.prototype.subtract = function(vector) {

    const result = this.copy();
    return result.subtractFrom(vector);
}

Vector2.prototype.divideBy = function(vector) {

    if (vector.constructor === Vector2) {
        this.x /= vector.x;
        this.y /= vector.y;
    } else if (vector.constructor === Number) {
        this.x /= vector;
        this.y /= vector;
    }
    return this;
}

Vector2.prototype.divide = function(vector) {

    const result = this.copy();
    return result.divideBy(vector);
}

Vector2.prototype.multiplyWith = function(vector) {

    if (vector.constructor === Vector2) {
        this.x *= vector.x;
        this.y *= vector.y;
    } else if (vector.constructor === Number) {
        this.x *= vector;
        this.y *= vector;
    }
    return this;
}

Vector2.prototype.multiply = function(vector) {

    const result = this.copy();
    return result.multiplyWith(vector);
}

Vector2.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
}

Vector2.prototype.normalize = function() {
    const length = this.length;
    if (length === 0) {
        return;
    }
    this.divideBy(length);
}

Vector2.prototype.copy = function() {
    return new Vector2(this.x, this.y);
}

Vector2.prototype.equals = function(obj) {
    return this.x === obj.x && this.y === obj.y;
}

Vector2.prototype.distanceFrom = function(obj) {
    return Math.sqrt((this.x-obj.x)*(this.x-obj.x) + (this.y-obj.y)*(this.y-obj.y));
}