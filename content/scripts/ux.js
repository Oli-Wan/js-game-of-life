window.addEventListener("load", function() {
    var width = 600,
        height = 600;

    var canvas = document.getElementById("game-canvas");

    var drawer = new Drawer(width, height, canvas.getContext("2d"));
    var game = new GameOfLife(width, height, drawer);

    //attaching events
    var start = document.getElementById("start");
    var stop = document.getElementById("stop");
    var next = document.getElementById("next");
    var zoomin = document.getElementById("zoomin");
    var zoomout = document.getElementById("zoomout");
    var info = document.getElementById("info");


    start.addEventListener("click", function(){
        window.run = setInterval(game.nextGeneration, 50);
        this.disabled = "disabled";
    });


    stop.addEventListener('click', function() {
        clearInterval(window.run);
        start.disabled = "";
    });

    next.addEventListener('click', function() {
        var date1 = new Date();
        game.nextGeneration();
        var date2 = new Date();
        info.textContent = "Generation time : " + (date2 - date1);
    });

    zoomin.addEventListener('click', function(){
        drawer.zoom();
        game.restoreState();
    });

    zoomout.addEventListener('click', function(){
        drawer.dezoom();
        game.restoreState();
    });
});