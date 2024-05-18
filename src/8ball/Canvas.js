"use strict";

function Canvas2D() {
    this._canvas = null;
    this._canvasContext = null;
    this._canvasOffset = Vector2.zero;
}

Object.defineProperty(Canvas2D.prototype, "offset",
    {
        get: function() {
            return this._canvasOffset;
        }
    });

Object.defineProperty(Canvas2D.prototype, "scale",
    {
        get: function() {
            return new Vector2(this._canvas.width / Game.size.x,
                this._canvas.height / Game.size.y);
        }
    });

Canvas2D.prototype.init = function(divName, canvasName) {
    this._canvas = document.getElementById(canvasName);
    this._div = document.getElementById(divName);

    if (this._canvas.getContext) {
        this._canvasContext = this._canvas.getContext('2d');
    } else {
        alert("You browser is not HMTL5 compatible!");
        return;
    }

    window.onresize = Canvas2D.prototype.resize;
    this.resize();
}

Canvas2D.prototype.clear = function() {
    this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
}

Canvas2D.prototype.resize = function() {
    let gameCanvas = Canvas._canvas;
    const gameArea = Canvas._div;
    const widthToHeight = Game.size.x / Game.size.y;
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;
    const newWidthToHeight = newWidth / newHeight;

    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
    } else {
        newHeight = newWidth / widthToHeight;
    }

    gameArea.style.width = newWidth + 'px';
    gameArea.style.height = newHeight + 'px';

    gameArea.style.marginTop = (window.innerHeight - newHeight) / 2 + 'px';
    gameArea.style.marginLeft = (window.innerWidth - newWidth) / 2 + 'px';
    gameArea.style.marginBottom = (window.innerHeight - newHeight) / 2 + 'px';
    gameArea.style.marginRight = (window.innerWidth - newWidth) / 2 + 'px';

    gameCanvas.width = newWidth;
    gameCanvas.height = newHeight;

    const offset = Vector2.zero;
    if (gameCanvas.offsetParent) {
        do {
            offset.x += gameCanvas.offsetLeft;
            offset.y += gameCanvas.offsetTop;
        } while ((gameCanvas = gameCanvas.offsetParent));
    }
    Canvas._canvasOffset = offset;
}

Canvas2D.prototype.drawImage = function(sprite, position, rotation, scale, origin) {

    const canvasScale = this.scale;

    position = typeof position !== 'undefined' ? position : Vector2.zero;
    rotation = typeof rotation !== 'undefined' ? rotation : 0;
    scale = typeof scale !== 'undefined' ? scale : 1;
    origin = typeof origin !== 'undefined' ? origin : Vector2.zero;

    this._canvasContext.save();
    this._canvasContext.scale(canvasScale.x, canvasScale.y);
    this._canvasContext.translate(position.x, position.y);
    this._canvasContext.rotate(rotation);
    this._canvasContext.drawImage(sprite, 0, 0, 
        sprite.width, sprite.height,
        -origin.x * scale, -origin.y * scale,
        sprite.width * scale, sprite.height * scale);
    this._canvasContext.restore();
}

Canvas2D.prototype.drawText = function(text, position, origin, color, textAlign, fontname, fontsize) {

    const canvasScale = this.scale;

    position = typeof position !== 'undefined' ? position : Vector2.zero;
    origin = typeof origin !== 'undefined' ? origin : Vector2.zero;
    color = typeof color !== 'undefined' ? color : COLOR.BLACK;
    textAlign = typeof textAlign !== 'undefined' ? textAlign: "top";
    fontname = typeof fontname !== 'undefined' ? fontname : "sans-serif";
    fontsize = typeof fontsize !== 'undefined' ? fontsize : "20px";

    this._canvasContext.save();
    this._canvasContext.scale(canvasScale.x, canvasScale.y);
    this._canvasContext.translate(position.x - origin.x, position.y - origin.y);
    this._canvasContext.textBaseline = 'top';
    this._canvasContext.font = fontsize + " " + fontname;
    this._canvasContext.fillStyle = color.toString();
    this._canvasContext.textAlign = textAlign;
    this._canvasContext.fillText(text, 0, 0);
    this._canvasContext.restore();
}

let Canvas = new Canvas2D();

