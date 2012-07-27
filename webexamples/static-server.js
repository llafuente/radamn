var express = require("express"),
    path = require("path");

(function() {
"use strict";

var server = express.createServer();
server.use(server.router);
server.use(express.static(__dirname));
server.use(express.static(path.join(__dirname, "..")));
server.use(express.static(path.join(__dirname, "..", "node_modules", "node-class")));
server.use(express.static(path.join(__dirname, "..", "examples", "resources")));
server.use(express.static(path.join(__dirname, "..", "examples")));
server.listen(process.argv[2] || 8080);

}());