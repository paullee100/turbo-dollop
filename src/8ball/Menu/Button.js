function Button(sprite, position, callback, hoverSprite) {

    this.sprite = sprite;
    this.hoverSprite = hoverSprite ? hoverSprite : sprite;
    this.position = position;
    this.callback = callback;

}

Button.prototype.draw = function() {
    
    if (this.mouseInsideBorders()) {
        Canvas.drawImage(this.hoverSprite, this.position, 0, 1);
        Canvas._canvas.style.cursor = "pointer";
    } else {
        Canvas.drawImage(this.sprite, this.position, 0, 0.98);
    }
}

Button.prototype.handleInput = function() {

    if (Mouse.left.pressed && this.mouseInsideBorders()) {
        this.callback();
    }
}

Button.prototype.mouseInsideBorders = function() {

    mousePos = Mouse.position;

    if (mousePos.x > this.position.x && 
        mousePos.x < this.position.x + this.sprite.width && 
        mousePos.y > this.position.y && 
        mousePos.y < this.position.y + this.sprite.height) {
        return true;
    }
    return false;
}