"use strict";

function handleKeyDown(evt) {
    const code = evt.keyCode;
    if (code < 0 || code > 255) {
        return;
    }

    if (!Keyboard._keyStates[code].down) {
        Keyboard._keyStates[code].pressed = true;
    }
    Keyboard._keyStates[code].down = true;
}

function handleKeyUp(evt) {
    const code = evt.keyCode;
    if (code < 0 || code > 255) {
        return;
    }

    Keyboard._keyStates[code].down = false;
}

function KeyboardSingleton() {
    this._keyStates = [];

    for (let i = 0; i < 256; ++i) {
        this._keyStates.push(new ButtonState());
    }
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
}

KeyboardSingleton.prototype.reset = function() {

    for (let i = 0; i < 256; ++i) {
        this._keyStates[i].pressed = false;
    }
}

KeyboardSingleton.prototype.pressed = function(key) {
    return this._keyStates[key].pressed;
}

KeyboardSingleton.prototype.down = function(key) {
    return this._keyStates[key].down;
}

const Keyboard = new KeyboardSingleton();