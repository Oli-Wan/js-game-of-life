function Drawer(width, height, canvas) {
    var self = this;

    self.canvas = canvas;
    self.width = width;
    self.height = height;

    self.scale = 1;
    self.focus = {
        x: height/2,
        y: width/2
    };
    self.range = {
        xMax: width,
        xMin:0,
        yMax: height,
        yMin:0
    };

    self.zoom = function() {
        self.scale += 1;
        self.calculateRange();
        self.displayScale();
    };

    self.dezoom = function() {
        if(self.scale == 1)
            return;

        self.scale -= 1;
        self.calculateRange();
        self.displayScale();
    };

    self.calculateRange = function() {
        var scaledWidth = Math.abs(self.width/self.scale/2);
        var scaledHeight = Math.abs(self.height/self.scale/2);

        var xFocus = self.focus.x;
        var yFocus = self.focus.y;

        self.range = {
            xMax:xFocus + scaledWidth,
            xMin:xFocus - scaledWidth,
            yMax:yFocus + scaledHeight,
            yMin:yFocus - scaledHeight
        };
    };

    self.isInRange = function(x,y) {
        return (x > self.range.xMin) && (x < self.range.xMax) && (y > self.range.yMin) && (y < self.range.yMax)
    };

    self.displayScale = function() {
        $("#scale").html( self.scale );
    };

    self.translateX = function(x) {
        return x - self.range.xMin;
    };

    self.translateY = function(x) {
        return x - self.range.yMin;
    };

    self.showFocus = function() {
        var xFocus = self.focus.x;
        var yFocus = self.focus.y;
        self.canvas.fillStyle = "rgba(200, 0, 0, 0.5)";
        self.canvas.fillRect(xFocus, yFocus-10, 5, 25);
        self.canvas.fillRect(xFocus-10, yFocus, 25, 5);
        self.canvas.fillStyle = "black";
    };

    self.display = function(x,  y, alive) {
        if(self.isInRange(x,y)) {
            if(alive)
                self.fill(x, y);
            else
                self.clear(x, y);
        }
    };

    self.fill = function(x, y) {
        var scale = self.scale;
        self.canvas.fillRect((x - self.range.xMin)*scale , (y - self.range.yMin)*scale , scale, scale);
    };

    self.clear = function(x, y) {
        var scale = self.scale;
        self.canvas.clearRect((x - self.range.xMin)*scale , (y - self.range.yMin)*scale , scale, scale);
    };
}
