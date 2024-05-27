const Server = require('./server.js');
/**
 Initiate server instance when running project
 */
module.exports = (() => {
	try {
		/**
		 * Server
		 * @type {Server}
		 */
		let server = new Server(process.argv.includes("d"));
		server.createApp();
		return server;
	}catch (error) {
		throw error;
	}
})()