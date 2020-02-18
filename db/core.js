
const request = require('request');
// var config = require('../modules/config/dataset.js');
// var dataset = config.config; 

const sqlite3 = require('sqlite3').verbose();
exports.struct = {
	database: new sqlite3.Database('./db/NodeInventory.db'),
	createTable: function(name){
		this.database.run("CREATE TABLE IF NOT EXISTS "+name+" (name TEXT UNIQUE, file TEXT UNIQUE)");
	},
	insertInto: function(table, entry){
		try{
			var stmt = this.database.prepare("INSERT INTO "+table+" VALUES (?, ?)");
			Object.keys(entry).forEach(key => {
				stmt.run(key+", "+entry[key]);
			})
		}catch(error){
			console.log(error)	
		}
	},
	initApi: function(app, table, key='*', GET='/api/'+table){
		var db = this.database;
		app.get(GET,  function(req, res){
			let sql = `SELECT`+key+` FROM `+table;
			db.all(sql, [], (err, rows) => {
				if (err) {
					throw err;
				}
				// db.close();
				res.send(rows);
			});
		});
	},
	insertJson: function(table, values){
		var stmt = this.database.preper("INSERT INTO "+table+"()") // TODO
	}
};

