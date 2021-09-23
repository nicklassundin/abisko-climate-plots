
require('climate-plots-config').genStaticFiles(__dirname).then(() => {
	// Pre-setup
	var $ = require("jquery");
	if(process.argv.includes('d')){
		// var app = require('./dev-app.js').app
		var app = require('./app.js').app
		var dev = require('./dev.js')
		dev.setup(app)
		var web = require('./modules/server/web.js')
		web.webserver["http"](app);
		app.get( '/', (req, res) => {
			res.send('Lets do this');
		});
		app.use('/health', require('express-healthcheck')());
	}else{
		var app = require('./app.js').app
		var web = require('./modules/server/web.js')
		web.webserver["http"](app);
		app.get( '/', (req, res) => {
			res.send('Lets do this');
		});
		app.use('/health', require('express-healthcheck')());
	}
})


