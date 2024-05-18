"use strict";

function handleMouseMove(event) {

    const canvasScale = Canvas.scale;
    const canvasOffset = Canvas.offset;
    const mx = (event.pageX - canvasOffset.x) / canvasScale.x;
    const my = (event.pageY - canvasOffset.y) / canvasScale.y;
    Mouse._position = new Vector2(mx, my);
}

function handleMouseDown(event) {

    handleMouseMove(event);

    if (event.which === 1) {
        if (!Mouse._left.down) {
            Mouse._left.pressed = true;
        }
        Mouse._left.down = true;
    } else if (event.which === 2) {
        if (!Mouse._middle.down) {
            Mouse._middle.pressed = true;
        }
        Mouse._middle.down = true;
    } else if (event.which === 3) {
        if (!Mouse._right.down) {
            Mouse._right.pressed = true;
        }
        Mouse._right.down = true;
    }

}

function handleMouseUp(event) {

    handleMouseMove(event);

    if (event.which === 1) {
        Mouse._left.down = false;
    } else if (event.which === 2) {
        Mouse._middle.down = false;
    } else if (event.which === 3) {
        Mouse._right.down = false;
    }
    
}

function MouseSingleton() {

    this._position = Vector2.zero;
    this._left = new ButtonState();
    this._middle = new ButtonState();
    this._right = new ButtonState();

    document.onmousemove = handleMouseMove;
    document.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
}

Object.defineProperty(MouseSingleton.prototype, "left",
    {
        get: function() {
            return this._left;
        }
    });

Object.defineProperty(MouseSingleton.prototype, "middle",
    {
        get: function() {
            return this._middle;
        }
    });

Object.defineProperty(MouseSingleton.prototype, "right",
    {
        get: function() {
            return this._right;
        }
    });

Object.defineProperty(MouseSingleton.prototype, "position",
    {
        get: function() {
            return this._position;
        }
    });

MouseSingleton.prototype.reset = function() {

    this._left.pressed = false;
    this._middle.pressed = false;
    this._right.pressed = false;
}

MouseSingleton.prototype.containsMouseDown = function(rect) {
    return this._left.down && rect.contains(this._position);
}

MouseSingleton.prototype.containsMousePress = function(rect) {
    return this._left.pressed && rect.contains(this._position);
}

let Mouse = new MouseSingleton();