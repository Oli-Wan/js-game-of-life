var fs = require("fs");

var pathTo404 = process.cwd() + "/errors/404.html";
var pathTo500 = process.cwd() + "/errors/500.html";

exports.notFound = function (request, response) {

    fs.readFile(pathTo404, function(err, data) {
        if(err) throw err;

        response.writeHead(404);
        var page  = data.toString();
        response.end(page.replace("#path", request.url));
    });
};

exports.internalError = function(response, error) {
    fs.readFile(pathTo500, function(err, data) {
        if(err) throw err;

        response.writeHead(500);
        var page  = data.toString();
        response.end(page.replace("#error", error.code));
    });
};