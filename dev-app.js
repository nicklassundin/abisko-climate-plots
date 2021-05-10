const ucid = require('unique-commit-id');
var latestCommit = "[Commit-id]";
try{
	latestCommit = ucid.latest();
}catch(error){
	latestCommit = error;
	console.log(error);
}
var fs = require('fs');
var express = require('express');

// Pre-setup
var $ = require("jquery");


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

hbs.registerPartials(__dirname + '/views/partials', function (err) {
	custom.then(chrts => {
		stations = ["abisko", "53430", "global"];
		app.render('browse-release.hbs', {chrts, stations, latestCommit }, (err, str) => {
			if(err) throw err
			fs.writeFile('index.html', str, err => {
				if (err) {
					console.error(err)
					return
				}
			})
		})	
		app.get('/static', (req, res) => {
			res.render('browse-release.hbs', {
				chrts,
				stations,
				latestCommit
			})
		})

		stations = ["abisko", "53430", "global"];
		app.get('/browse', (req, res) => {
			res.render('browse.hbs', {
				chrts,
				stations,
				latestCommit
			})
		})
		fileWrite(chrts, __dirname+'/static/preset.json') 
	})
});

/////

var fileWrite = function(json, file){
	fs.exists(file, function (exists) {
		if(exists){
			fs.writeFile(file, JSON.stringify(json), (ERROR) => {
				if(ERROR) throw ERROR
			})
		}else{
			fs.writeFile(file, JSON.stringify(json), {flag: 'wx'}, function (err,data) {})
		}
	})
}
const merger = require('./modules/config/charts/merge.js').preset;
merger.then((json) => {
	fileWrite(json, __dirname+'/static/modules.config.charts.merge.json')
})


// app.get('/d3-map', (req, res) => {
// 	charts(req).then(chrts => {
// 		res.render('d3-map.hbs', {
// 			chrts
// 		})
// 	})
// });


// app.get('/map', (req, res) => {
// 	res.render('map.hbs', {

// })
// })
exports.app = app;
