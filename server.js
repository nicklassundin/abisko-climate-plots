// Pre-setup
var $ = require("jquery");

// process.argv.forEach(function (val, index, array) {
	//TODO argument on start up	
// });

// var fs = require('fs');
// const express = require('express');
// const request = require('request');

// Setup
// const app = express();
// var engines = require('consolidate');
// app.engine('pug', engines.pug);
// app.engine('handlebars', engines.handlebars);

var app = require('./app.js').app

// Starts webserver
var web = require('./modules/server/web.js')
web.webserver["http"](app);
web.webserver["https"](app);
