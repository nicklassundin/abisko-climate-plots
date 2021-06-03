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
app.use('/static', express.static(__dirname + '/static'));

// SMHI DB connection
const TYPE = 'corrected-archive';
require('./modules/server/smhi').init(app, TYPE);


var session = require('express-session');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({limit: '100mb', extended : true}));
app.use(express.json({limit: '100mb'}));
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
		app.get('/github', (req, res) => {
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
			fs.writeFile(file, JSON.stringify(json,null,2), (ERROR) => {
				if(ERROR) throw ERROR
			})
		}else{
			fs.writeFile(file, JSON.stringify(json,null,2), {flag: 'wx'}, function (err,data) {})
		}
	})
}
// const merger = require('./modules/config/charts/merge.js').preset;
// merger.then((json) => {
	// fileWrite(json, __dirname+'/static/modules.config.charts.merge.json')
// })
// TODO new
const merge = require('./config/charts/preset/merge.js').preset;
merge.then((json) => {
	json.forEach(entry => {
		Object.keys(entry).forEach(station => {
			var dir = __dirname+'/static/charts/'+station;
			if(!fs.existsSync(dir)) fs.mkdirSync(dir);
			Object.keys(entry[station]).forEach(key => {
					fileWrite(entry[station][key], __dirname+'/static/charts/'+station+'/'+key+'.json')
			})
		})
	})
})
var R = require('r-script');


require("require.async")(require);
// var sets = require('./modules/config/charts/parse.config.json')
const parsers = require('./modules/stats/config.js').parsers;
var rparse = R('./modules/stats/rscript/parser.r');
const Papa = require('papaparse')
var before = require('./modules/config/charts/help.js').preset;
var async = require("async");


var save = {};

// var vischange = {};
// vischange = sets['abisko'];
// vischange.station = 'abisko';
// vischange.preset.beforeFirstChunk = before(vischange.preset.beforeFirstChunk);
// vischange.fields = {
// 	date: 'Time',
// 	precip: 'Precipitation',
// }
// vischange.preset.worker = true;
// vischange.preset.download = false;

// app.get('/parser/rscript', (req, res) => {
// 	req.vischange = vischange;
// 	if(!save[req.vischange.station]){
// 		var temp = {};
// 		req.vischange.file.forEach(name => {
// 			temp[name] = new Promise((result, reject) => {
// 				var path = './data/'+req.vischange.station+'/'+name;
// 				const file = fs.createReadStream(path);
// 				// req.vischange.preset.step = function(d){
// 				// return d	
// 				// }
// 				req.vischange.preset.complete = function(d, f){
// 					result(d)
// 				};
// 				Papa.parse(file,req.vischange.preset)
// 			}).catch(function(error){
// 				console.log("FAIL TO LOAD DATA")
// 				console.log(error)
// 			})
// 		});
// 		Promise.all(Object.values(temp)).then(async function(data){
// 			res.json(data)

// 			// save[req.vischange.station] = parsers[req.vischange.parser](data);
// 			// save[req.vischange.station].then(data => {
// 			// res.json(data)
// 			// })
// 		})
// 	}else{
// 		res.json(save[req.vischange.station]);	
	// }
// })
// var python = require('python').shell;
exports.app = app;

// app.post('/receive', (req, res) => {
// 	console.log(Object.keys(req.body))
// 	console.log(Object.keys(req.body.data))
// 	var data = req.body.data;
// 	// console.log(req.body)
// 	// var data = JSON.parse(req.body);
// 	// console.log(data)
// 	fs.writeFile('./temp/test.js', data, err => {
// 		if (err) {
// 			console.error(err)
// 			return
// 		}
// 	})
// })
