const Server = require('./server.js');
module.exports = (() => {
	try {
		let server = new Server(process.argv.includes("d"));
		server.createApp();
		return server.createAPI();
	}catch (error) {
		throw error;
	}
})()