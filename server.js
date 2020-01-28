process.argv.forEach(function (val, index, array) {
	//TODO argument on start up	
});

const config = require('./config/server.json');
const hostname = config.hostname;
const port = config.port;
const serverURL = config.serverURL; 

var fs = require('fs');
const express = require('express');
const request = require('request');
const url = require('url');

var $ = require("jquery");
const custom = require('./config/custom.json');
const constants = require('./config/const.json');
const smhi = require('./modules/smhi');
var database = require('./modules/db');

const app = express();
var engines = require('consolidate');

app.engine('pug', engines.pug);
app.engine('handlebars', engines.handlebars);

const TYPE = 'corrected-archive';

var webserver = {
	options: {
		key: fs.readFileSync('encrypt/private.key'),
		cert: fs.readFileSync( 'encrypt/primary.crt' ),
		// ca: fs.readFileSync( 'encrypt/intermediate.crt' )
	},
	http: function(app){
		const http = require('http');
		try{
			return http.createServer(app).listen(port);
		}catch(err){
			console.log(err)
		}
	},
	https: function(app){
		const https = require('https');
		try{
			return https.createServer(this.options, app).listen(config.https.port);
		}catch(err){
			console.log(err);
		}
	}
}
webserver.https(app);


app.use('/css', express.static(__dirname + '/css'));
app.use('/dep', express.static(__dirname + '/dep'));
app.use('/modules', express.static(__dirname + '/modules'));
app.use('/config', express.static(__dirname + '/config'));
app.use('/data', express.static(__dirname + '/data'));
app.use('/client', express.static(__dirname + '/client'));
app.use('/tmp', express.static(__dirname + '/tmp'));

smhi.init(app, TYPE)

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
					response.render('upload.pug', 
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
app.post('/admin/upload', upload.single('file'), function(request, response, next){
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
	res.render('login.pug', {})	
})

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.post('/admin/create/table', function(request, response, next){
	if(request.session.loggedin){
		console.log(request)
		var username = request.body.username;
		var password = request.body.password;
		var tablename = request.body.tablename;
		var columns = request.body.columns;
		database.createTable(tablename, columns, database.admin);
		response.send('Created new table '+tablename)
	} else {
		response.send('Please login to view this page!')
	}
})

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
	res.render('chart.hbs', {
		ID_REQ: ID,
		LANG: LANG,
		STATION: STATION,
		baselineLower: constants.baselineLower,
		baselineUpper: constants.baselineUpper
	})
});

const Json2csvParser = require("json2csv").Parser;
app.get('/abisko/ANS_SnowDepth.csv', (request, response) => {
	database.getCSV('ANS_SnowDepth.csv', database.admin).then(function(data){
		const jsonData = JSON.parse(JSON.stringify(data));
		const json2csvParser = new Json2csvParser({ header: true});
		const csv = json2csvParser.parse(jsonData);
		response.send(csv);
		// response.send(data);
	})
});
