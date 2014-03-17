$(document).ready(function(){
    var width = 600,
        height = 600;

    var canvas = document.getElementById("game-canvas");

    var drawer = new Drawer(width, height, canvas.getContext("2d"));
    var game = new GameOfLife(width, height, drawer);

    //attaching events
    $("#start").click(function(){
        window.run = setInterval(game.nextGeneration, 50);
        $("#start").attr("disabled", "disabled");
    });

    $("#stop").click(function() {
        clearInterval(window.run);
        $("#start").removeAttr("disabled");
    });

    $("#next").click(function() {
        var date1 = new Date();
        game.nextGeneration();
        var date2 = new Date();
        $("#info").html( "Generation time : " + (date2 - date1) );
    });

    $("#zoomin").click(function(){
        drawer.zoom();
        game.restoreState();
    });

    $("#zoomout").click(function(){
        drawer.dezoom();
        game.restoreState();
    });
});

function GameOfLife(width, height, drawer) {
    var self = this;

    self.scale = 1;
    self.width = width;
    self.height = height;
    self.generation = 0;

    self.board = new Array(height);
    self.drawer = drawer;


    for(var i = 0; i < height; i++){
        var newRow = new Array(width);
        for(var j = 0; j < width; j++)
            newRow[j] = Math.random() > 0.5;

        self.board[i] = newRow;
    }

    self.nextGeneration = function() {
        self.generation += 1;

        var width = self.width,
            height = self.height;

        var newGeneration = [];

        for(var y = 0; y < height; y++){
            var newRow = [];

            for(var x = 0; x < width; x++){

                var neighbourCount = 0;

                if(y > 0 )
                {
                    if(self.board[y-1][x])
                        neighbourCount++;

                    if( x > 1)
                        if(self.board[y-1][x-1])
                            neighbourCount++;
                    if(x < height-1)
                        if(self.board[y-1][x+1])
                            neighbourCount++;
                }

                if(y < height-1 )
                {
                    if(self.board[y+1][x])
                        neighbourCount++;

                    if( x > 1)
                        if(self.board[y+1][x-1])
                            neighbourCount++;
                    if(x < height-1)
                        if(self.board[y+1][x+1])
                            neighbourCount++;
                }

                if( x > 0)
                    if(self.board[y][x-1])
                        neighbourCount++;

                if(x < height-1)
                    if(self.board[y][x+1])
                        neighbourCount++;

                var currentState = self.board[y][x];
                var newState = currentState;

                if(neighbourCount < 2 && currentState)
                    newState = false;

                if(neighbourCount > 3 && currentState)
                    newState = false;

                if(neighbourCount == 3 && !currentState )
                    newState = true;

                newRow[x] = newState;

                if (newState != currentState) {
                    self.drawer.display(x, y, newState);
                }
            }
            newGeneration[y] = newRow;
        }

        self.board = newGeneration;
        self.drawer.showFocus();
    };

    self.restoreState = function() {
        for(var y = 0; y < self.height; y++){
            for(var x = 0; x < self.width; x++) {
                if (self.board[y][x])
                    self.drawer.fill(x,y);
                else
                    self.drawer.clear(x,y);
            }
        }
        self.drawer.showFocus();
    };

    self.restoreState();
}

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

