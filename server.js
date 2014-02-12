var http = require("http"),
    contents = require("./modules/static.js"),
    router = require("./modules/router.js").get(),
    port  = 80;

var staticServer = contents.create("content");

router.register("/", staticServer.serve);
router.register("/test", function(request, response) {
    response.end("AHAHAHAHA");
});

router.setDefaultPath("/game.html");

http.createServer(function(request, response) {
    router.route(request,response);
}).listen("1337");

console.log("Server running on port " + port);