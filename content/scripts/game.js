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

    self.nextGeneration();
}
