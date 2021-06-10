var fs = require('fs');
var merge = require('merge');
var normalizedPath = require("path").join(__dirname, "preset");
exports.preset = new Promise((resolve, reject) => {
	fs.readdir(normalizedPath, (err, files) => {
		Promise.all(files.filter((name) => { return name.includes(".json") })
			.map(function(file) {
				try{
					var json = require("./preset/" + file);
					if(file === 'full.json'){
						json = {
							all: Object.keys(json)
						} 
					}else{
						json[file.replace('.json', '')] = Object.keys(json);
					}
					return json
				}catch(ERROR){
					console.log(ERROR)
					throw ERROR
				}
			})).then((res) => {
				resolve(res.reduce((x, y) => {
					return merge(x, y);
				}))
			})
	})
})
