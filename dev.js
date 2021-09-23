exports.setup = function(app){
	var version = require('./package.json').version + '';

	var fs = require('fs');

	// Pre-setup
	var $ = require("jquery");

	var hbs = require('hbs');
	var plotConfig = require('climate-plots-config')
	const custom = plotConfig.custom;
	exports.custom = custom;
	var stati = require('./static/charts/stations.json')
	hbs.registerPartials(__dirname + '/views/partials', function (err) {
		custom.then(chrts => {
			var stations = Object.keys(stati).map(st => {
				if(st === "smhi"){
					return "53430";
				}else{
					return st
				}
			})
			var sets = stati;
			app.render('browse-release.hbs', {sets, chrts, stations, version}, (err, str) => {
				if(err) throw err
				fs.writeFile('index.html', str, err => {
					if (err) {
						console.error(err)
						return
					}
				})
			})	
			app.get('/github', (req, res) => {
				res.render('browse-release.hbs', {
					sets,
					chrts,
					stations,
					version,
				})
			})
		})
	});

}
