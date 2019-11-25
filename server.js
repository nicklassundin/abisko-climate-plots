
var fs = require('fs');
// const http = require('http');
const express = require('express');
const request = require('request');
const url = require('url');

// const jquery = require('jquery')
var $ = require("jquery");
const charts = require('./config/charts.json');
const language = require('./config/language.json');
const stats = require('./modules/stats');
const smhi = require('./modules/smhi');
const lib = require('./modules/lib');

const hostname = '127.0.0.1';
const port = 3000;

const app = express();
app.set('view engine', 'pug');

// const ID = 'smhiTemp';
// const STATION = 159880; // LUND
const STATION = 188790; // ABISKO 
const TYPE = 'corrected-archive';
// const TYPE = 'latest-months';

app.use(express.static(__dirname + '/css'));


app.get( '/', (req, res) => {
	res.render('index', {
		comment: "This is the main page",
		ids: charts.ids
	})
});

app.get( '/chart', (req, res) => {
	// console.log(req)
	// res.statusCode = 200;
	// res.setHeader('Content-Type', 'text/plain');
	// res.send('Hello World');
	// lib.config[ID].contFunc()
	// JSON.stringify(lib.config[ID])
	// console.log(lib.config[ID])
	const queryObject = url.parse(req.url,true).query;
	const ID = queryObject.id.split(",");
	const URL = smhi.get_smhi_station_url(STATION, TYPE);
	
	console.log(queryObject)
	request({
		url: URL,
		json: true
	}, function(error, response, body) {
		// console.log(body.value)
		// console.log(charts.ids)
		res.render('chart', {
			legacy: true,
			ID_REQ: ID,
			FILE: JSON.stringify(response)
		})
	});
});

const server = app.listen(port, () => {
	console.log(`Express running → PORT ${server.address().port}`);
});


