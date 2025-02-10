//const Server = require('./server.js');
import Server from './server.js';
import startPythonServer from 'python.server'


const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
/**
 Initiate server instance when running project
 */
(() => {
	console.log("Starting server...");
	try {
		/**
		 * Server
		 * @type {Server}
		 */
		let server = new Server(process.argv.includes("d"));
		server.createApp()
		if (!server.app) {
			throw new Error("Server not started");
		}else{
			startPythonServer(server.app, {host: redisHost, port: redisPort});
		}
		return server;
	}catch (error) {
		throw error;
	}
})()