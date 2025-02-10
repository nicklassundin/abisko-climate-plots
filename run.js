//const Server = require('./server.js');
import Server from './server.js';
import startPythonServer from './submodules/python.server/startPythonServer.js';

import { createProxyMiddleware } from 'http-proxy-middleware';
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