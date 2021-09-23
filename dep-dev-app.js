var version = require('./package.json').version + '';

var fs = require('fs');
var express = require('express');

// Pre-setup
var $ = require("jquery");
// Setup
const app = express();
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

/////
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
