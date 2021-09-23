
require('climate-plots-config').genStaticFiles(__dirname).then(() => {
	// Pre-setup
	var $ = require("jquery");
	var app = require('./app.js').app
	var web = require('./modules/server/web.js')
	if(process.argv.includes('d')){
		var dev = require('./dev.js')
		dev.setup(app)
	}
	web.webserver["http"](app);
	app.get( '/', (req, res) => {
		res.send('Lets do this');
	});
	app.use('/health', require('express-healthcheck')());
})


