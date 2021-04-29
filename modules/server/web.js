
const fs = require('fs');
var config = undefined;
try{
	config = require('../../config/server.json')
}catch(ERROR){
	config = require('../../config/default.server.json')
}

exports.webserver = {
	http: function(app){
		const http = require('http');
		try{
			return http.createServer(app).listen(config.port);
		}catch(err){
			console.log(err)
			return err;
		}
	},
}


