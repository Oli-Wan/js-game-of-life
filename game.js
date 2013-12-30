$(document).ready(function(){
    window.width = 600;
    window.height = 600;
    window.scale = 1;

    window.focus = {};
    window.focus.x = 300;
    window.focus.y = 300;
    init();

    //attaching events
    $("#start").click(startGame);
    $("#stop").click(stopGame);
    $("#next").click(oneGeneration);
    $("#zoomin").click(zoom);
    $("#zoomout").click(dezoom);
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
    $("#scale").html( window.scale );
    restoreState();
}

function dezoom(){
    if(window.scale == 1)
        return;

    window.scale--;

    $("#scale").html( window.scale );
    restoreState();
}

function restoreState(){
    var width = window.width;
    var height = window.height;
    var gameBoard = window.gameBoard;
    var refTable = window.generationCounter%2;
    var gameCanvas = document.getElementById("game-canvas");
    var b_context = gameCanvas.getContext("2d");

    var scale = window.scale;
    var heightInPixel = height/2;
    var widthInPixel = width/2;

    var xFocus = window.focus.x;
    var yFocus = window.focus.y;

    for(var i = 0; i < height; i++){
        for(var j = 0; j < width; j++){
            if((i >= (xFocus - heightInPixel)) && (i <= (xFocus + heightInPixel))
                && (j >= (yFocus - widthInPixel)) && (j <= (yFocus + widthInPixel)))
            {
                if(gameBoard[i][j][refTable])
                    b_context.fillRect(i*scale, j*scale, 1*scale, 1*scale);
                else
                    b_context.clearRect(i*scale, j*scale, 1*scale, 1*scale);
            }
        }
    }
}

function nextState(){
    var generationNb = ++window.generationCounter
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
    var heightInPixel = height/2;
    var widthInPixel = width/2;

    var xFocus = window.focus.x;
    var yFocus = window.focus.y;

    for(var i = 0; i < height; i++){
        for(var j = 0; j < width; j++){

            var neighboorCellsNb = 0;

            if(i > 0 )
            {
                if(gameBoard[i-1][j][refTable])
                    neighboorCellsNb++;

                if( j > 1)
                    if(gameBoard[i-1][j-1][refTable])
                        neighboorCellsNb++;
                if(j < height-1)
                    if(gameBoard[i-1][j+1][refTable])
                        neighboorCellsNb++;
            }

            if(i < height-1 )
            {
                if(gameBoard[i+1][j][refTable])
                    neighboorCellsNb++;

                if( j > 1)
                    if(gameBoard[i+1][j-1][refTable])
                        neighboorCellsNb++;
                if(j < height-1)
                    if(gameBoard[i+1][j+1][refTable])
                        neighboorCellsNb++;
            }

            if( j > 0)
                if(gameBoard[i][j-1][refTable])
                    neighboorCellsNb++;

            if(j < height-1)
                if(gameBoard[i][j+1][refTable])
                    neighboorCellsNb++;

            var currentState = gameBoard[i][j][refTable];
            var newState = currentState;

            if(neighboorCellsNb < 2 && currentState)
                newState = false;

            if(neighboorCellsNb > 3 && currentState)
                newState = false;

            if(neighboorCellsNb == 3 && !currentState )
                newState = true;

            gameBoard[i][j][newTable] = newState;

            if((i >= (xFocus - heightInPixel)) && (i <= (xFocus + heightInPixel))
                && (j >= (yFocus - widthInPixel)) && (j <= (yFocus + widthInPixel)))
            {
                if(newState != currentState)
                {
                    if(newState)
                        b_context.fillRect(i*scale, j*scale, 1*scale, 1*scale);
                    else
                        b_context.clearRect(i*scale, j*scale, 1*scale, 1*scale);
                }
            }
        }
    }
}
