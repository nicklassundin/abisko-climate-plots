const ucid = require('unique-commit-id');
var latestCommit = "[Commit-id]";
try{
	latestCommit = ucid.latest();
}catch(error){
	latestCommit = error;
	console.log(error);
}

// Pre-setup
var $ = require("jquery");


var fs = require('fs');
const express = require('express');
const request = require('request');

// Setup
const app = express();
var hbs = require('hbs');
// Open file access
app.use('/css', express.static(__dirname + '/css'));
app.use('/dep', express.static(__dirname + '/dep'));
app.use('/modules', express.static(__dirname + '/modules'));
app.use('/config', express.static(__dirname + '/config'));
app.use('/data', express.static(__dirname + '/data'));
app.use('/data/abisko', express.static(__dirname + '/data/abisko'));
app.use('/client', express.static(__dirname + '/client'));
app.use('/tmp', express.static(__dirname + '/tmp'));
app.use('/maps', express.static(__dirname + '/maps'));


// SMHI DB connection
const TYPE = 'corrected-archive';
require('./modules/server/smhi').init(app, TYPE);


var session = require('express-session');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

const url = require('url');
const custom = require('./config/preset.js').preset;
exports.custom = custom;

var charts = (req) => {
	return new Promise((res, rej) => {
		custom.then(IDs => {
			const queryObject = url.parse(req.url,true).query;
			var id;
			var ids;
			if(!queryObject.id) {
				ids = IDs.all;
			}else if(!custom[queryObject.id]){
				ids = queryObject.id.split(",");
			}else{
				ids = IDs[queryObject.id];
			}
			res(ids.map(id => {
				return {
					id: id,
					station: queryObject.station
				}
			}))
		})
	})
}
app.get( '/chart', (req, res) => {
	charts(req).then(chrts => {
		res.render('chart.hbs', {
			chrts
		})
	})
});

hbs.registerPartials(__dirname + '/views/partials');
custom.then(chrts => {
	stations = ["abisko", "53430", "global"];
	app.get('/browse', (req, res) => {
		res.render('browse.hbs', {
			chrts,
			stations,
			latestCommit
		})
	})
})

exports.app = app;
