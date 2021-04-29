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
var lib = require('./app.js');
var app = lib.app;

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
lib.custom.then((json) => {
	fileWrite(json, __dirname+'/temp/preset.json') 
})
const merger = require('./modules/config/charts/merge.js').preset;
merger.then((json) => {
	fileWrite(json, __dirname+'/temp/modules.config.charts.merge.json')
})

lib.custom.then(chrts => {
	stations = ["abisko", "53430", "global"];
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
