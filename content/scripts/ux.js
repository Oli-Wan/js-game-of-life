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