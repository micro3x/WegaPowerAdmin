var http = require("http"),
  url = require("url"),
  path = require("path"),
  fs = require("fs")
port = 80,
  appConfig = require('./appConfig');

var Server = function (serverPort = 80) {

  port = serverPort;

  http.createServer(function (request, response) {

    if (request.method == "GET" && request.url.startsWith("/api")) {
      var responseData = {};
      var apiPath = request.url.substring(4);

      if (apiPath.toLowerCase().startsWith("/appconfig")) {
        responseData = appConfig.getConfig();
      }

      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(JSON.stringify(responseData));
      response.end();
      return;
    }

    if (request.method == "POST" && request.url.startsWith("/api")) {
      var body = '';

      request.on('data', function (data) {
        body += data;
      })

      request.on('end', function () {
        appConfig.saveConfig(JSON.parse(body));
      })
      
      response.writeHead(200, { "Content-Type": "application/json" });
      response.write("SON.stringify(responseData)");
      response.end();
      return;
    }

    var uri = url.parse(request.url).pathname
      , filename = path.join(process.cwd() + "/www", uri);

    var contentTypesByExtension = {
      '.html': "text/html",
      '.css': "text/css",
      '.js': "text/javascript"
    };

    fs.exists(filename, function (exists) {
      if (!exists) {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.write("404 Not Found\n");
        response.end();
        return;
      }

      if (fs.statSync(filename).isDirectory()) filename += '/index.html';

      fs.readFile(filename, "binary", function (err, file) {
        if (err) {
          response.writeHead(500, { "Content-Type": "text/plain" });
          response.write(err + "\n");
          response.end();
          return;
        }

        var headers = {};
        var contentType = contentTypesByExtension[path.extname(filename)];
        if (contentType) headers["Content-Type"] = contentType;
        response.writeHead(200, headers);
        response.write(file, "binary");
        response.end();
      });
    });
  }).listen(parseInt(port, 10));


  return {

  }
}

module.exports = { Server: Server };

