var path = require("path"),
    fs = require("fs"),
    mime = require("mime"),
    errors = require("./errors.js");

exports.create = function(folder) {
    return new Static(folder);
};

function Static(folder) {
    var self = this;
    self.ressourcesRootPath = process.cwd() + "/" + folder;

    this.serve = function(request, response) {

        var resPath = path.normalize(self.ressourcesRootPath + request.url);

        fs.exists(resPath, function(exists) {

            if(!exists) {
                console.log( resPath + " not found" );
                errors.notFound(request, response);
                return;
            }

            fs.readFile(resPath,  function(err, data){
                if(err) {
                    console.error(err);
                    errors.internalError(response, err);
                    return;
                }

                var contentType = mime.lookup(resPath);
                response.writeHead("200", {ContentType: contentType});
                response.end(data);
            });
        });
    };
}