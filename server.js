module.exports = (() => {
	var app = require("./app.js").app;
	if (process.argv.includes("d")) {
		const dev = require("./dev.js");
		dev.setup(app);

	}
	const web = require("./modules/server/web.js");
	const http = web.webserver.http(app);
	const glimworks = require('climate-plots-glimworks-reader');
	// glimworks.init(app, http, 'live')
	glimworks.init(app, http, 'production')
	// glimworks.init(app, http, 'xsLive')
	// glimworks.init(app, http, 'debug')
	app.get(
		"/",
		(req, res) => {

			res.send("Lets do this");

		}
	);
	const health = require("express-healthcheck")
	app.use(
		"/health",
		health()
	);
})()


