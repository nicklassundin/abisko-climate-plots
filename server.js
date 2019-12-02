
var fs = require('fs');
const express = require('express');
const request = require('request');
const url = require('url');

var $ = require("jquery");
// const custom = require('./config/custom.json');
// const language = require('./config/language.json');
// const stats = require('./modules/stats');
const smhi = require('./modules/smhi');
// const lib = require('./modules/lib');

const hostname = '127.0.0.1';
const port = 80;
const serverURL = "http://localhost";

const app = express();
app.set('view engine', 'pug');

// const ID = 'smhiTemp';
// const STATION = 159880; // LUND
const STATION = 188790; // ABISKO 
const TYPE = 'corrected-archive';
// const TYPE = 'latest-months';

var key = fs.readFileSync('encrypt/private.key');
var cert = fs.readFileSync( 'encrypt/primary.crt' );
var ca = fs.readFileSync( 'encrypt/intermediate.crt' );
var options = {
	key: key,
	cert: cert,
	ca: ca
};
// const https = require('https');
// const server = https.createServer(options, app).listen(443);
const http = require('http');
const server = http.createServer(app).listen(80);
// http.createServer(app).listen(80);

// var forceSsl = require('express-force-ssl');
// app.use(forceSsl);

app.use('/css', express.static(__dirname + '/css'));
app.use('/dep', express.static(__dirname + '/dep'));
app.use('/modules', express.static(__dirname + '/modules'));
app.use('/config', express.static(__dirname + '/config'));
app.use('/data', express.static(__dirname + '/data'));
app.use('/client', express.static(__dirname + '/client'));


app.get( '/', (req, res) => {
	res.render('index', {
		comment: "This is the main page",
		IDS: custom.ids
	})
});

app.get( '/abisko', (req, res) => {
	var temp = lib.config['abisko'];
	// temp.file = [hostname+':'+port+'/'+temp.file];
	request({
		url: "http://localhost:"+port+'/data/ANS_Temp_Prec.csv',
		json: true,
		path: '/',
		method: 'GET',
	}, function(error, response, body){
		res.render('index', {
			comment: JSON.stringify(response), 
			ids: custom.ids,
		})

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
	var ID; 
	if(!queryObject.id) {
		ID = custom.ids;
	}else{
		ID = queryObject.id.split(",");
	}
	const SMHI_URL = smhi.get_smhi_station_url(STATION, TYPE);
	// console.log(queryObject)
	request({
		url: SMHI_URL,
		json: true,
		path: '/',
		method: 'GET',
	}, function(error, response, body) {
		// console.log(body.value)
		// console.log(charts.ids)
		res.render('chart', {
			ID_REQ: ID,
			FILE: JSON.stringify(response),
			// LANG: JSON.stringify(language)
		})
	});
});



