var fs = require('fs');
var mysql = require('mysql2');
var Client = require('ssh2').Client;
var ssh = new Client();
var csv = require('fast-csv');

// var config = require('../encrypt/db.json')
var config = false;
var defa = require('../encrypt/default.db.json')

var db_config = (config ? config : defa);



const HOST = db_config.ssh.host; 
const PORT = db_config.ssh.port;
const USER = db_config.ssh.user;
const PASSWORD = db_config.ssh.password;

var connect = function(account=db_config.database.admin){
	return new Promise(function(resolve, reject){
		// console.log("START SSH connection")
		ssh.on('ready', function() {
			// console.log("SSH READY")
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
					if (err) reject(err); // SSH error: can also send error in promise ex. reject(err)
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
							// console.log("SSH connected")
							resolve(connection);
						} else {
							reject(err);
						}
					})
				});
		}).on('error', function(err){
			console.error('Error during connecting to the device: ' + err);
		}).connect({
			host: HOST,
			port: PORT,
			username: USER,
			password: PASSWORD
		});
	}).catch(function(error){
		// console.log(error)
	})
}



module.exports = {
	ssh: function(account=db_config.database.admin){
		if(config){
			return new Promise(function(resolve, reject){
				// console.log("START SSH connection")
				ssh.on('ready', function() {
					resolve(ssh)	
				}).on('error', function(err){
					console.error('Error during connecting to the device: ' + err);
				}).connect({
					host: HOST,
					port: PORT,
					username: USER,
					password: PASSWORD
				});
			}).catch(function(error){
				// console.log(error)
			})
		}else{
			return new Promise((resolve, reject) => {
				resolve("SSH not configured create a copy of default.db.json named db.json, and configure that file");
			})
		}
	},
	connect: connect,
	admin: (config ? connect(db_config.database.admin) : function(){
		return new Promise((resolve, reject) => {
				resolve("SSH not configured create a copy of default.db.json named db.json, and configure that file");
		})
	}()),
	makeQuery: function(database, query){
		return new Promise(function(resolve, reject){
			database.then(function(connection){
				connection.query(query, (error, response) => {
					if(error){
						reject(error);
					}else if(response){
						resolve(response);
					}
				})
			}).catch(function(error){
				console.log(error)
			})
		})
	},
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
		var makeQuery = this.makeQuery;
		return new Promise(function(resolve, reject){
			let query = 'SELECT * FROM `'+filename+'`;';
			makeQuery(database, query).then(function(res){
				resolve(res);
			});
		});
	},
	createTable(name, col, database){
		let query = 'CREATE TABLE `'+name+'`( '+col+' );'
		this.makeQuery(database, query);
	}
};
