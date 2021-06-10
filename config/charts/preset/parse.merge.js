var fs = require('fs');
var merge = require('merge');
var normPath = require("path").join(__dirname, "config");
exports.preset = new Promise((resolve, reject) => {
	fs.readdir(normPath, (err, files) => {
		Promise.all(files.filter((name) => { return name.includes(".json") })
			.map(function(file){
				try{
					var f = {};
					f[file.replace('.json','')] = require("./config/"+file);
					return f;
				}catch(ERROR){
					console.log(ERROR)
					throw ERROR
				}
			})).then((res) => {
				resolve(res.reduce((x,y) => {
					return merge(x,y);
				}))
			})
	})
})
