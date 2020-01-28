
const fs = require('fs');
const config = require('../config/server.json')
exports.webserver = {
	options: {
		key: fs.readFileSync('./encrypt/private.key'),
		cert: fs.readFileSync( './encrypt/primary.crt' ),
		// ca: fs.readFileSync( './encrypt/intermediate.crt' )
	},
	http: function(app){
		const http = require('http');
		try{
			return http.createServer(app).listen(config.port);
		}catch(err){
			console.log(err)
			return err;
		}
	},
	https: function(app){
		const https = require('https');
		try{
			return https.createServer(this.options, app).listen(config.https.port);
		}catch(err){
			console.log(err);
			return err;
		}
	}
}


