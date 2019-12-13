var fs = require('fs');
var mysql = require('mysql2');
var Client = require('ssh2').Client;
var ssh = new Client();
var csv = require('fast-csv');

var db_config = require('../encrypt/db.json');

const HOST = db_config.ssh.host; 
const PORT = db_config.ssh.port;
const USER = db_config.ssh.user;
const PASSWORD = db_config.ssh.password;

var connect = function(account=db_config.database.webserver){
	return new Promise(function(resolve, reject){
		console.log("START SSH connection")
		ssh.on('ready', function() {
			console.log("SSH READY")
			ssh.forwardOut(
				// source address, this can usually be any valid address
				'127.0.0.1',
				// source port, this can be any valid port number
				12345,
				// destination address (localhost here refers to the SSH server)
				'127.0.0.1',
				// destination port
				account.port,
				function (err, stream) {
					if (err) throw err; // SSH error: can also send error in promise ex. reject(err)
					// use `sql` connection as usual
					const connection = mysql.createConnection({
						host     : account.host,
						user     : account.user,
						password : account.password, 
						database : account.database,
						stream: stream
					});
					// send connection back in variable depending on success or not
					connection.connect(function(err){
						if (!err) {
							console.log("SSH connected")
							resolve(connection);
						} else {
							reject(err);
						}
					});
				});
		}).connect({
			host: HOST,
			port: PORT,
			username: USER,
			password: PASSWORD
		});
	});
}

var db = connect

module.exports = {
	webserver: connect(),
	admin: connect(db_config.database.admin),
	importCSV: function(filename, table, connection){
		let stream = fs.createReadStream(filename);
		let csvData = [];
		let csvStream = csv
			.parse()
			.on("data", function (data){
				console.log(data)
				csvData.push(data);
			})
			.on("end", function(){
				var head = csvData.shift();
				// console.log(head)
				connection.then(function(connection){
					// console.log(table)
					let query = 'SELECT * FROM `'+table+'`;' 
					connection.query(query, function(error, results, fields){
						// console.log(results)
						let col = fields.map(each => { return each.name });
						// console.log(col)
						let query = 'INSERT INTO `'+table+'` ( '+col+' ) VALUES ?;';
						connection.query(query, [csvData], (error, response) => {
							console.log("QUERY DB ERROR: ")
							console.log(error || response);
						})
					})
				}).catch(function(error){
					console.log("connect to DB ERROR: ")
					console.log(error)
				});
			});
		stream.pipe(csvStream);
	},
	getCSV: function(filename, database){
		return new Promise(function(resolve, reject){
			database.then(function(connection){
				let query = 'SELECT * FROM `'+filename+'`;';
				connection.query(query, function(error, result, fields){
					resolve(result);
				})
			})

		});
	},
	createTable(name, col, database){
		database.then(function(connection){
			console.log(name)
			console.log(col)
			let query = 'CREATE TABLE `'+name+'`( '+col+' );'
			connection.query(query, (error, response) => {
				console.log(error || response);	
			})
		})
	}
};
