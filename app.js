const ucid = require('unique-commit-id');
const latestCommit = ucid.latest();

// Pre-setup
var $ = require("jquery");

// process.argv.forEach(function (val, index, array) {
//TODO argument on start up	
// });

var fs = require('fs');
const express = require('express');
const request = require('request');

// Setup
const app = express();
// var Handlebars = require('handlebars');
var hbs = require('hbs');
// var engines = require('consolidate');
// app.engine('pug', engines.pug);
// app.engine('handlebars', engines.handlebars);


// Local Database
var cache = require('./modules/server/db/core.js').struct;

cache.createTable('datafiles');
fs.readdir('data/abisko', (err, files) => {
	// TODO read files and enter them
	// cache.insertInto('datafiles', files);
	cache.initApi(app, 'datafiles')
});

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

// require('./modules/api/api').lang(app, __dirname, '/lang');

// Database
var database = require('./modules/server/db/db');

app.get('/databases', (req, res) => {
	database.webserver.then(function(connection){
		console.log("Server Connected Success")
		// console.log(connection)
		connection.query('SHOW DATABASES;', function(error, result, fields){
			console.log(" - Query Success")
			if(error){
				console.log(error);
				return;
			}
			res.send(result)
		})
	})
})

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
custom.then((json) => {
	fs.writeFile(__dirname+'/temp/preset.json', JSON.stringify(json), (ERROR) => {
		if(ERROR) throw ERROR
	})
})
const merger = require('./modules/config/charts/merge.js').preset;
merger.then((json) => {
	fs.writeFile(__dirname+'/temp/modules.config.charts.merge.json', JSON.stringify(json), (ERROR) => {
		if(ERROR) throw ERROR
	})
})

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


// console.log(Handlebars)
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
	app.get('/static', (req, res) => {
		stations = ["abisko", "53430", "global"];
		app.render('browse-release.hbs', {chrts, stations, latestCommit }, (err, str) => {
			fs.writeFile('temp/index.html', str, err => {
				if (err) {
					console.error(err)
					return
				}
			})
			app.use('/static', express.static(__dirname + '/static'));
			app.use('/static/css', express.static(__dirname + '/css'));
			app.use('/static/dep', express.static(__dirname + '/dep'));
			app.use('/static/modules', express.static(__dirname + '/modules'));
			app.use('/static/config', express.static(__dirname + '/config'));
			app.use('/static/data', express.static(__dirname + '/data'));
			app.use('/static/data/abisko', express.static(__dirname + '/data/abisko'));
			app.use('/static/client', express.static(__dirname + '/client'));
			app.use('/static/tmp', express.static(__dirname + '/tmp'));
			app.use('/static/maps', express.static(__dirname + '/maps'));
			res.send(str);
		})	
	})
})

app.get('/d3-map', (req, res) => {
	charts(req).then(chrts => {
		res.render('d3-map.hbs', {
			chrts
		})
	})
});


app.get('/map', (req, res) => {
	res.render('map.hbs', {

	})
})
exports.app = app;
