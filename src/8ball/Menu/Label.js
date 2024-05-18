function Label(text, position, origin, color, textAlign, fontname, fontsize) {

    this.text = typeof text !== 'undefined' ? text : '';
    this.position = typeof position !== 'undefined' ? position: Vector2.zero;
    this.origin = typeof origin !== 'undefined' ? origin : Vector2.zero;
    this.color = typeof color !== 'undefined' ? color : COLOR.BLACK;
    this.textAlign = typeof textAlign !== 'undefined' ? textAlign : "top";
    this.fontname = typeof fontname !== 'undefined' ? fontname : "Courier New";
    this.fontsize = typeof fontsize !== 'undefined' ? fontsize : "20px";
}

Label.prototype.draw = function() {

    Canvas.drawText(
        this.text,
        this.position,
        this.origin,
        this.color,
        this.textAlign,
        this.fontname,
        this.fontsize
    );
}