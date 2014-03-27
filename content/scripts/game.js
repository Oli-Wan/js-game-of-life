function GameOfLife(width, height, drawer) {
    this.width = width;
    this.height = height;
    this.drawer = drawer;

    this.init();
}

GameOfLife.prototype.init = function() {
    this.board = new Array(this.height);
    for (var i = 0; i < this.height; i++) {
        var newRow = new Array(this.width);
        for (var j = 0; j < this.width; j++)
            newRow[j] = Math.random() > 0.5;

        this.board[i] = newRow;
    }
    this.nextGeneration();
};

GameOfLife.prototype.nextGeneration = function() {
    var width = this.width,
        height = this.height;

    var newGeneration = [];

    for(var y = 0; y < height; y++){
        var newRow = [];

        for(var x = 0; x < width; x++){

            var neighbourCount = 0;

            if(y > 0 )
            {
                if(this.board[y-1][x])
                    neighbourCount++;

                if( x > 1)
                    if(this.board[y-1][x-1])
                        neighbourCount++;
                if(x < height-1)
                    if(this.board[y-1][x+1])
                        neighbourCount++;
            }

            if(y < height-1 )
            {
                if(this.board[y+1][x])
                    neighbourCount++;

                if( x > 1)
                    if(this.board[y+1][x-1])
                        neighbourCount++;
                if(x < height-1)
                    if(this.board[y+1][x+1])
                        neighbourCount++;
            }

            if( x > 0)
                if(this.board[y][x-1])
                    neighbourCount++;

            if(x < height-1)
                if(this.board[y][x+1])
                    neighbourCount++;

            var currentState = this.board[y][x];
            var newState = currentState;

            if(neighbourCount < 2 && currentState)
                newState = false;

            if(neighbourCount > 3 && currentState)
                newState = false;

            if(neighbourCount == 3 && !currentState )
                newState = true;

            newRow[x] = newState;

            if (newState != currentState) {
                this.drawer.display(x, y, newState);
            }
        }
        newGeneration[y] = newRow;
    }

    this.board = newGeneration;
    this.drawer.showFocus();
};

GameOfLife.prototype.restoreState = function() {
    for(var y = 0; y < this.height; y++){
        for(var x = 0; x < this.width; x++) {
            if (this.board[y][x])
                this.drawer.fill(x,y);
            else
                this.drawer.clear(x,y);
        }
    }
    this.drawer.showFocus();
};
