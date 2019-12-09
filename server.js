
const hostname = '127.0.0.1';
const port = 80;
const serverURL = "http://localhost";

var fs = require('fs');
const express = require('express');
const request = require('request');
const url = require('url');

var $ = require("jquery");
const custom = require('./config/custom.json');
const constants = require('./config/const.json');
// const language = require('./config/language.json');
// const stats = require('./modules/stats');
const smhi = require('./modules/smhi');
// const lib = require('./modules/lib');


// Security
// const serverCert = [fs.readFileSync("encrypt/primary.crt", "utf8")];
/////############///////////
/////############///////////
// DATABASE
var database = require('./modules/db');
/////############///////////
/////############///////////
/////############///////////


const app = express();
app.set('view engine', 'pug');

// const ID = 'smhiTemp';
const TYPE = 'corrected-archive';
// const TYPE = 'latest-months';

// var key = fs.readFileSync('encrypt/private.key');
// var cert = fs.readFileSync( 'encrypt/primary.crt' );
// var ca = fs.readFileSync( 'encrypt/intermediate.crt' );
// var options = {
	// key: key,
	// cert: cert,
	// ca: ca
// };
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
app.use('/tmp', express.static(__dirname + '/tmp'));

smhi.init(app, TYPE)

// app.get( '/map/sweden', (req, res) => {
// 	res.render('map', {
// 	})
// });

// INTERFACE DATABASE

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


////////////
var session = require('express-session');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		database.admin.then(function(connection){
			connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
				if (results.length > 0) {
					request.session.loggedin = true;
					request.session.username = username;
					response.render('upload', 
						{
							username: username,
							password: password
						});
				} else {
					response.send('Incorrect Username and/or Password!');
				}			
				response.end();
			});
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

var multer = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })
app.post('/upload', upload.single('file'), function(request, response, next){
	if(request.session.loggedin){
		var username = request.body.username;
		var password = request.body.password;
		var filename = request.body.type;
		const file = request.file
		fs.writeFile("temp/"+filename ,file.buffer,  "binary",function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log("The file was saved!");
				database.importCSV("temp/"+filename, filename, database.admin);
				response.send(file)
			}
		});
	} else {
		response.send('Please login to view this page!')
	}
})

app.get('/', (req, res) => {
	res.render('login', {})	
})

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});


/////############///////////
/////############///////////
/////############///////////


app.get( '/chart', (req, res) => {
	const queryObject = url.parse(req.url,true).query;
	var ID; 
	if(!queryObject.id) {
		ID = custom.ids;
	}else{
		ID = queryObject.id.split(",");
	}
	var LANG;
	if(!queryObject.lang){
		LANG = 'en';
	}else{
		LANG = queryObject.lang;
	}
	var STATION;
	if(!queryObject.station){
		STATION = 159880; // LUND
		// STATION = 188790; // ABISKO 
	}else{
		STATION = queryObject.station;
	}

	res.render('chart', {
		ID_REQ: ID,
		// FILE: JSON.stringify(response),
		LANG: LANG,
		STATION: STATION,
		baselineLower: constants.baselineLower,
		baselineUpper: constants.baselineUpper
	})
});



