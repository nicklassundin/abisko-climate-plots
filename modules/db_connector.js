// require('./f_stats')
// require('./helpers.js')
// require('./highcharts-regression.js')
// require('./import_parser.js')
// require('./jquery.js')
// require('./lib.js')
// require('./papaparse.min.js')
// require('./regression.js')
// require('./styles.css')

var mysql = require('mysql'); 

var conOptions = {
	resultatit: {
		host: "sql.resultatit.com",
		user: "abisko",
		password: "SsPnBbAo0991",
		// database: "abisko", 
	},
	local: {
		host: 'localhost',
		user: 'root',
		password: 'password',
		database: 'abisko',
		insecureAuth: true,
		socketPath: '/tmp/mysql.sock',
	},
}

var connect = function(opt=conOptions.resultatit){
	var dbcon = mysql.createConnection(opt)
	dbcon.connect(function(err) {
		if (err){
			console.log("failed Connect to resultatit.com : "+err+'');
		}else{	
			console.log("Connected!");
		}
	});
	return dbcon;
}

// var all_con = Object.keys(conOptions).map(key => {
// return connect(conOptions[key]);
// })

var con = mysql.createConnection(conOptions.resultatit);


// console.log(con)

var getDatabase = function(){
	var sql = "SELECT DATABASE();";
	con.query(sql, function (err, result) {
		if (err){
			console.log(err+'')
		}else{
			console.log(result);
		}
	});
}
// console.log(getDatabase())

var getAllDatabases = function(){
	var sql = "SELECT `schema_name` from INFORMATION_SCHEMA.SCHEMATA;" 
	con.query(sql, function (err, result) {
		if (err){
			console.log(err+'')
		}else{
			console.log(result);
		}
	});
}
// getAllDatabases()

var selectDatabase = function(name){
	var sql = "USE "+name;
	con.query(sql, function (err, result) {
		if (err){
			console.log(err+'')
		}else{
			console.log(result);
		}
	});
}
// selectDatabase("abisko")

var createTable = function(name){
	var sql = "CREATE TABLE "+name+" (x VARCHAR(255), y VARCHAR(255))";
	con.query(sql, function (err, result) {
		if (err) {
			console.log(err+'')
		}else{

			console.log("Table created");
		}
	});
}
// createTable("test")

var insertTable = function(table, x, y, ){
	var sql = "INSERT INTO "+table+" (x, y) VALUES ('"+x+"', '"+y+"')";
	con.query(sql, function (err, result) {
		if (err){
			console.log(err+'')
		}else{
			console.log("1 record inserted "+table+" : ["+x+","+y+"]");
		} 
	});
}
// insertTable("test", 4, 2);


var dropTable = function(table){
	var response;
	con.query("DROP TABLE "+table+";", function(err, result){
		if(err){
			console.log(err+'');
		}else{
			answer = result;
			console.log("removed: "+table)
		}
	})
}

var selectFrom = function(table){
	var answer;
	con.query("SELECT * FROM "+table+";", function (err, result, fields) {
		if (err){
			console.log(err+'')
		}else{
			answer = result;
			console.log("success: "+answer)
		}
	});
	return answer;
}
// selectFrom("test")

var http = require('http'),
    fs = require('fs');


fs.readFile('./view.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(8080);
});




