var errors = require("./errors.js"),
    path = require("path");


exports.get = function() {
    return new Router();
};

function Router() {
    this.routes = [];
    this.defaultPath = "/";

    this.setDefaultPath = function(defaultRoute) {
        this.defaultPath = defaultRoute;
    };

    this.register = function(route, fn) {
        this.routes.push({
            route: route,
            handler: fn
        });

        // make sure longer routes are always checked first
        this.routes.sort(function(a,b){
            var aRouteLength = a.route.length;
            var bRouteLength = b.route.length;

            if(aRouteLength > bRouteLength) {
                return -1;
            } else if(aRouteLength == bRouteLength) {
                return 0;
            } else {
                return 1;
            }
        });
    };

    this.route = function(request, response) {
        var requestPath = request.url;

        if(requestPath.length <= 0 || requestPath == "/")
            request.url = this.defaultPath;

        var routeFound = false;

        for(var i = 0; i < this.routes.length; i++) {
            var currentRoute = this.routes[i];
            if(request.url.indexOf(currentRoute.route) == 0) {
                currentRoute.handler.call(this, request, response);
                routeFound = true;
                break;
            }
        }

        if(!routeFound)
            errors.notFound(request,response);
    };
}