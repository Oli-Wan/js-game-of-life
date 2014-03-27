window.addEventListener("load", function () {
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
    var restart = document.getElementById("restart");


    start.addEventListener("click", function () {
        window.run = setInterval(function () {
            game.nextGeneration();
        }, 50);
        this.disabled = restart.disabled  = "disabled";
    });

    stop.addEventListener('click', function () {
        clearInterval(window.run);
        start.disabled = restart.disabled = "";
    });

    restart.addEventListener('click',function(){
       game.init();
    });

    next.addEventListener('click', function () {
        var date1 = new Date();
        game.nextGeneration();
        var date2 = new Date();
        info.textContent = "Generation time : " + (date2 - date1);
    });

    zoomin.addEventListener('click', function () {
        drawer.zoom();
        game.restoreState();
    });

    zoomout.addEventListener('click', function () {
        drawer.dezoom();
        game.restoreState();
    });
});