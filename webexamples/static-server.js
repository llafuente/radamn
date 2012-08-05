var express = require("express"),
    path = require("path");

(function() {
    "use strict";

    var server = express.createServer();
    server.use(server.router);
    server.use(express.static(__dirname)); //.htmls
    server.use(express.static(path.join(__dirname, ".."))); //all files
    server.use(express.static(path.join(__dirname, "..", "node_modules"))); // all modules
    server.use(express.static(path.join(__dirname, "..", "examples")));
    server.use(express.static(path.join(__dirname, "..", "examples", "resources")));
    server.listen(process.argv[2] || 8080);

}());