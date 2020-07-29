// Pre-setup
var $ = require("jquery");

process.argv.forEach(function (val, index, array) {
	//TODO argument on start up	
});

var fs = require('fs');
const express = require('express');
const request = require('request');

// Setup
const app = express();
var engines = require('consolidate');
app.engine('pug', engines.pug);
app.engine('handlebars', engines.handlebars);


// Starts webserver
const config = require('./config/server.json');
require('./modules/webserver.js').webserver["http"](app);
require('./modules/webserver.js').webserver["https"](app);

// Local Database
var cache = require('./db/core.js').struct;

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
require('./modules/smhi').init(app, TYPE);

// require('./modules/api/api').lang(app, __dirname, '/lang');

// Database
var database = require('./modules/db');

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

const url = require('url');
const custom = new Promise((resolve, reject) => {
	var res = require('./config/preset.json')
	require('./config/preset.js').preset.then(data => {
		var str = JSON.stringify(data);
		if(str != JSON.stringify(res)){
		fs.writeFile('config/preset.json', str, (error) => {
			if(error){
				console.log(error)
			}else{
			
			}
		})
		}
	}).then(() => {
			resolve(require('./config/preset.json'))
	})
})
const constants = require('./config/const.json');

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
app.get('/d3-map', (req, res) => {
	charts(req).then(chrts => {
		res.render('d3-map.hbs', {
			chrts
		})
	})
});

app.render('chart-release.hbs',{ charts: [{ id: "Temperatures", station: "abisko" } ] }, (err, str) => {
	fs.writeFile('static/temp.html', str, err => {
		if (err) {
			console.error(err)
			return
		}
	})
	app.get('/static', (req, res) => {
		res.send(str);
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

});

app.get('/map', (req, res) => {
	res.render('map.hbs', {

	})
})
