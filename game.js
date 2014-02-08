$(document).ready(function(){
    window.width = 600;
    window.height = 600;
    window.scale = 1;

    window.focus = {};
    window.focus.x = 300;
    window.focus.y = 300;

    window.xMinRange = 0;
    window.xMaxRange = 600;
    window.yMinRange = 0;
    window.yMaxRange = 600;

    init();
    displayScale();

    //attaching events
    $("#start").click(startGame);
    $("#stop").click(stopGame);
    $("#next").click(oneGeneration);
    $("#zoomin").click(zoom);
    $("#zoomout").click(dezoom);

    //$("#game-canvas").click(setFocus)
});

function init(){
    window.generationCounter = 0;
    var width = window.width;
    var height = window.height;

    var canvas = document.getElementById("game-canvas");

    var gameBoard = new Array(height);

    for(var i = 0; i < height; i++){
        var newRow = new Array(width);

        for(var j = 0; j < width; j++)
        {
            var random = Math.random() > 0.5;
            newRow[j] = [random, random];
        }
        gameBoard[i] = newRow;
    }
    window.gameBoard = gameBoard;

    nextState();
}

function startGame(){
    window.run = setInterval(nextState, 50);
    $("#start").attr("disabled", "disabled");
}

function stopGame(){
    clearInterval(window.run);
    $("#start").removeAttr("disabled");
}

function oneGeneration(){
    var date1 = new Date();
    nextState();
    var date2 = new Date();
    $("#info").html( "Generation time : " + (date2 - date1) );
}

function zoom(){
    window.scale++;
    calculateZomRange();
    displayScale();
    restoreState();
}

function dezoom(){
    if(window.scale == 1)
        return;

    window.scale--;
    calculateZomRange();
    displayScale();
    restoreState();
}

function calculateZomRange() {
    var scale = window.scale;

    var scaledWidth = Math.abs(window.width/scale/2);
    var scaledHeight = Math.abs(window.height/scale/2);

    var xFocus = window.focus.x;
    var yFocus = window.focus.y;

    window.xMinRange = xFocus - scaledWidth;
    window.xMaxRange = xFocus + scaledWidth;
    window.yMinRange = yFocus - scaledHeight;
    window.yMaxRange = yFocus + scaledHeight;
}

function displayScale() {
    $("#scale").html( window.scale );
}

function showFocus(b_context) {
    var xFocus = window.focus.x;
    var yFocus = window.focus.y;
    b_context.fillStyle = "rgba(200, 0, 0, 0.5)";
    b_context.fillRect(xFocus, yFocus-10, 5, 25);
    b_context.fillRect(xFocus-10, yFocus, 25, 5);
    b_context.fillStyle = "black";
}


function setFocus(e) {
    var x = Math.floor(e.pageX-$("#game-canvas").offset().left);
    var y = Math.floor(e.pageY-$("#game-canvas").offset().top);

    window.focus.x = x;
    window.focus.y = y;

    restoreState();
}

function restoreState(){
    var width = window.width;
    var height = window.height;
    var gameBoard = window.gameBoard;
    var refTable = window.generationCounter%2;
    var gameCanvas = document.getElementById("game-canvas");
    var drawer = gameCanvas.getContext("2d");

    var scale = window.scale;

    var xMinRange = window.xMinRange;
    var xMaxRange = window.xMaxRange;
    var yMinRange = window.yMinRange;
    var yMaxRange = window.yMaxRange;

    for(var y = 0; y < height; y++){
        for(var x = 0; x < width; x++) {

            if (gameBoard[y][x][refTable])
                drawer.fillRect((x - xMinRange)*scale , (y- yMinRange)*scale , scale, scale);
            else
                drawer.clearRect((x - xMinRange)*scale , (y- yMinRange)*scale, scale, scale);

//            display(x, xMinRange, xMaxRange, y, yMinRange, yMaxRange, gameBoard[y][x][refTable], drawer, scale);
        }
    }
    showFocus(drawer);
}

function display(x, xMinRange, xMaxRange, y, yMinRange, yMaxRange, alive, drawer, scale) {
    if ((x > xMinRange) && (x < xMaxRange) && (y > yMinRange) && (y < yMaxRange)) {
        if (alive)
            drawer.fillRect((x - xMinRange)*scale , (y- yMinRange)*scale , scale, scale);
        else
            drawer.clearRect((x - xMinRange)*scale , (y- yMinRange)*scale, scale, scale);
    }
}

function nextState(){
    var generationNb = ++window.generationCounter;
    var newTable = window.generationCounter%2;
    var refTable = ( newTable == 0 ) ? 1:0;

    var generationNbP = $("#generation-nb");
    generationNbP.html( generationNb );

    var gameCanvas = document.getElementById("game-canvas");
    var b_context = gameCanvas.getContext("2d");
    var width = window.width;
    var height = window.height;
    var gameBoard = window.gameBoard;

    var scale = window.scale;

    var xMinRange = window.xMinRange;
    var xMaxRange = window.xMaxRange;
    var yMinRange = window.yMinRange;
    var yMaxRange = window.yMaxRange;

    for(var y = 0; y < height; y++){
        for(var x = 0; x < width; x++){

            var neighbourCellsNb = 0;

            if(y > 0 )
            {
                if(gameBoard[y-1][x][refTable])
                    neighbourCellsNb++;

                if( x > 1)
                    if(gameBoard[y-1][x-1][refTable])
                        neighbourCellsNb++;
                if(x < height-1)
                    if(gameBoard[y-1][x+1][refTable])
                        neighbourCellsNb++;
            }

            if(y < height-1 )
            {
                if(gameBoard[y+1][x][refTable])
                    neighbourCellsNb++;

                if( x > 1)
                    if(gameBoard[y+1][x-1][refTable])
                        neighbourCellsNb++;
                if(x < height-1)
                    if(gameBoard[y+1][x+1][refTable])
                        neighbourCellsNb++;
            }

            if( x > 0)
                if(gameBoard[y][x-1][refTable])
                    neighbourCellsNb++;

            if(x < height-1)
                if(gameBoard[y][x+1][refTable])
                    neighbourCellsNb++;

            var currentState = gameBoard[y][x][refTable];
            var newState = currentState;

            if(neighbourCellsNb < 2 && currentState)
                newState = false;

            if(neighbourCellsNb > 3 && currentState)
                newState = false;

            if(neighbourCellsNb == 3 && !currentState )
                newState = true;

            gameBoard[y][x][newTable] = newState;

            if (newState != currentState) {
                display(x, xMinRange, xMaxRange, y, yMinRange, yMaxRange, newState,  b_context, scale);
            }
        }
    }
    showFocus(b_context);
}