//const Server = require('./server.js');
import Server from './server.js';
import startPythonServer from 'python.server'

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
			startPythonServer(server.app)
		}
		return server;
	}catch (error) {
		throw error;
	}
})()