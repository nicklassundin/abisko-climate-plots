const express = require('express');
var fs = require('fs');
const { lstatSync, readdirSync } = require('fs')

exports.lang = function(app, dirname, dir){
	var files = fs.readdir(dirname + dir, function(err, files){
		if(err){
			return console.log('Unable to scan directory: ' + err);
		}
		files.forEach(function(file){
			var path = dir+"/"+file;
			if(lstatSync(dirname + path).isDirectory()){
				console.log(path)
				app.use(path, express.static(dirname + path))
			}
		})
	});
}


