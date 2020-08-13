
const fs = require('fs');
const defa = require('../config/default.server.json')
const custom = require('../config/server.json')

const config = (custom ? custom : defa)

var pem = require('pem');


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
	https: function(app){
		const https = require('https');
		pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
			if (err) {
				throw err
			}else{
				try{
					return https.createServer({ 
						key: keys.serviceKey, 
						cert: keys.certificate 
					}, app).listen(config.https.port);
				}catch(err){
					console.log(err);
					return err;
				}
			}
		})
	}
}


