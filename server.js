// Pre-setup
var $ = require("jquery");
var generate = require('climate-plots-config')
console.log(generate)
if(process.argv.includes('d')){
	generate.genStaticFiles(__dirname).then(() => {
		var app = require('./dev-app.js').app
		var web = require('./modules/server/web.js')
		web.webserver["http"](app);
		app.get( '/', (req, res) => {
			res.send('Lets do this');
		});
		app.use('/health', require('express-healthcheck')());
	})
}else{
	var app = require('./app.js').app
	var web = require('./modules/server/web.js')
	web.webserver["http"](app);
	app.get( '/', (req, res) => {
		res.send('Lets do this');
	});
	app.use('/health', require('express-healthcheck')());
}


