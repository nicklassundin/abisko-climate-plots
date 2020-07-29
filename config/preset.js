var fs = require('fs');
var merge = require('merge');
var normalizedPath = require("path").join(__dirname, "preset");
exports.preset = new Promise((resolve, reject) => {
	fs.readdir(normalizedPath, (err, files) => {
		Promise.all(files.filter((name) => { return name.includes(".json") })
			.map(function(file) {
				return require("./preset/" + file);
			})).then((res) => {
				resolve(res.reduce((x, y) => {
					return merge(x, y);
				}))
			})
	})
})
