var fs = require('fs');
var merge = require('merge');
var normPath = require("path").join(__dirname, "charts");
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

const language = {
	sv: require('../lang/sv/menu.json'),
	en: require('../lang/en/menu.json'),
}
var par = require('./parse.config.json');

exports.preset = new Promise((resolve, reject) => {
	fs.readdir(normPath, (err, FILES) => {
		Promise.all(FILES.filter((name) => { return name.includes(".json") && !name.includes('[BETA]') })
			.map(function(file){
				try{
					var f = {};
					var full = require("./charts/"+file);
					var def = full.config.meta;
					Object.keys(def).forEach(station => {
						var temp = {};
						$.extend( true, temp, full );
						temp.type = temp.type.replace('[stationType]', station);
						if(!f[station]) f[station] = {}
						var define = temp.config.meta[station]
						var files = {};
						files.ref = temp;
						files.config = require('../'+define.config+'.json');
						files.config.parse = par[temp.type]
						if(define.subset) files.subset = require('../'+define.subset+'.json');
						files.set = require('../'+define.set+'.json');
						['en', 'sv'].forEach(lang => {
							files[lang] = require('../lang/'+lang+'/'+define.lang+'.json');

							files[lang].dataSource = {
								meta: require('../lang/'+lang+'/dataSource.json')
							}
							files[lang].units = require('../lang/'+lang+'/units') 
							files[lang].time = require('../lang/'+lang+'/time.json');
							files[lang].menu = language[lang];

						})
							f[station][file.replace('.json','')] = files 
								
					})
					return f;
				}catch(ERROR){
					console.log(ERROR)
					console.log(file)
					// throw ERROR
					return f
				}
			})).then((res) => {
				// resolve(res.reduce((x,y) => {
				// 	return merge(x,y);
				// }))
				resolve(res)
			})
	})
})
