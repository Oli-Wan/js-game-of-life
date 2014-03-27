function Drawer(width, height, canvas) {
    this.canvas = canvas;

    this.width = width;
    this.height = height;

    this.scale = 2;
    this.minScale = 2;

    this.focus = {
        x: height / 2,
        y: width / 2
    };
    this.calculateRange();
}

Drawer.prototype.zoom = function () {
    this.scale += 1;
    this.calculateRange();
};

Drawer.prototype.dezoom = function () {
    if (this.scale == this.minScale)
        return;

    this.scale -= 1;
    this.calculateRange();
};

Drawer.prototype.calculateRange = function () {
    var scaledWidth = Math.abs(this.width / this.scale / 2);
    var scaledHeight = Math.abs(this.height / this.scale / 2);

    var xFocus = this.focus.x;
    var yFocus = this.focus.y;

    this.range = {
        xMax: xFocus + scaledWidth,
        xMin: xFocus - scaledWidth,
        yMax: yFocus + scaledHeight,
        yMin: yFocus - scaledHeight
    };
};

Drawer.prototype.isInRange = function (x, y) {
    return (x > this.range.xMin) && (x < this.range.xMax) && (y > this.range.yMin) && (y < this.range.yMax)
};

Drawer.prototype.translateX = function (x) {
    return x - this.range.xMin;
};

Drawer.prototype.translateY = function (x) {
    return x - this.range.yMin;
};

Drawer.prototype.showFocus = function () {
    var xFocus = this.focus.x;
    var yFocus = this.focus.y;
    this.canvas.fillStyle = "rgba(200, 0, 0, 0.5)";
    this.canvas.fillRect(xFocus, yFocus - 10, 5, 25);
    this.canvas.fillRect(xFocus - 10, yFocus, 25, 5);
    this.canvas.fillStyle = "black";
};

Drawer.prototype.display = function (x, y, alive) {
    if (this.isInRange(x, y)) {
        if (alive)
            this.fill(x, y);
        else
            this.clear(x, y);
    }
};

Drawer.prototype.fill = function (x, y) {
    var scale = this.scale;
    this.canvas.fillRect((x - this.range.xMin) * scale, (y - this.range.yMin) * scale, scale, scale);
};

Drawer.prototype.clear = function (x, y) {
    var scale = this.scale;
    this.canvas.clearRect((x - this.range.xMin) * scale, (y - this.range.yMin) * scale, scale, scale);
};
