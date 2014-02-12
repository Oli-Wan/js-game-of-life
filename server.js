var http = require("http"),
    contents = require("./modules/static.js"),
    router = require("./modules/router.js").get(),
    port  = 8080;

var staticServer = contents.create("content");

router.register("/", staticServer.serve);

router.setDefaultPath("/game.html");

http.createServer(function(request, response) {
    router.route(request,response);
}).listen(port);

console.log("Server running on port " + port);