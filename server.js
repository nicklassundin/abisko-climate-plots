// Pre-setup
var $ = require("jquery");
if(process.argv.includes('d')){
	var app = require('./dev-app.js').app
	var web = require('./modules/server/web.js')
	web.webserver["http"](app);
	app.get( '/', (req, res) => {
		res.send('Lets do this');
	});
}else{
	var app = require('./app.js').app
	var web = require('./modules/server/web.js')
	web.webserver["http"](app);
	app.get( '/', (req, res) => {
		res.send('Lets do this');
	});
}


