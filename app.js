
var config = require('./config');
var Server = require('./index');

var server = new Server(config);
server.start();