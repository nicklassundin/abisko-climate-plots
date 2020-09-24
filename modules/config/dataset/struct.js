var $ = require('jquery')

const Papa = require('papaparse');
const parse = require('../../stats/config.js').parsers;
const help = require('../../helpers.js')
var months = help.months;

var renderer = require('../renderer.js').render;

global.filePath = {
	station: function(fileName, id){
		if(id){
			return hostUrl+"/data/"+id+"/"+fileName;
		}else{
			return hostUrl+"/data/"+fileName;
		}
	},
}

// wander down the data structure with tag input example: [high, medium, low]
var tagApply = function(data, tag){
	var result = data;
	try{
		tag.forEach(each => {
			result = result[each];
		})	
	}catch(err){
		// console.log(err)
		result = result[tag]
	}
	return result;
}

var struct = {
	file: undefined,
	filePath: undefined,
	preset: undefined,
	cached: undefined,
	rawData: [],
	parser: undefined, 
	render: renderer, 
	reader: Papa.parse,
	metaRef: undefined,
	contFunc: function(reset=false, page=''){
		if(typeof this.rawData !== 'undefined' && this.rawData.length > 0){
			return this;
		}	
		if(Object.keys(this.rawData).length > 0) return false
		if(reset) this.cached = {};
		var ref = this;
		if(!this.rawData.then){
			this.rawData = new Promise(function(resolve, reject){
				ref.filePath(ref.file).forEach(file => {
					function data(file){
						return new Promise(function(resolve, reject){
							ref.preset.complete = function(result){
								resolve(result);
							};
							ref.reader(file, ref.preset)
						}).catch(function(error){
							console.log("FAILED TO LOAD DATA")
							console.log(error);
						})
					};
					try{
						ref.rawData.push(data(file));
					}catch(error){
						console.log(file)
						console.log(ref.rawData);
						throw error;
					}
				})
				resolve(ref.rawData);
			})
		}
		return this;
	},
	parseRawData: function(reset=false){
		var parser = this.parser;
		var rawDataPromise = this.rawData;
		return new Promise(function(resolve, reject){

			rawDataPromise.then(function(rawData){
				resolve(Promise.all(rawData).then(function(rawData){
					var data = parser(rawData);
					// console.log(data)
					return data;	
				}))
			})
		})
	},
	init: function(id, tag, renderTag=tag){
		var render = this.render;
		if(renderTag){
			var meta = tagApply(this.metaRef, renderTag);
			render.setup(id, meta);
		}else{
			try{
				render.setup(id, this.metaRef);
			}catch(error){
				console.log(id)
				console.log(this.metaRef);
				throw error
			}
		}
		var renderProc = function(data){
		}
		if(!this.cached) this.cached = this.parseRawData();
		this.cached.then(function(data){
			if(tag){
				data = tagApply(data, tag);
			}
			try{
				render.initiate(id, data)
			}catch(error){
				console.log(id);
				console.log(data);
				console.log(error);
				throw error;
			}
		})
		this.render = render;
		return this;
	},
	clone: function(){
		return Object.assign({}, this);
	},
	create: function(config, meta){
		var file = config.file;
		var preset = config.preset;
		if(preset.beforeFirstChuck) preset.beforeFirstChuck = preset.beforeFirstChuck.parseFunction();
		var parser = parse[config.parser];
		var local = config.local;

		var res = this.clone();
		res.rawData = [];
		if(!Array.isArray(file)){
			file = [file];
		}
		res.metaRef = meta;
		res.file = file;	
		res.filePath = (files) => files.map(x => filePath.station(x, (local ? station : undefined))); 
		res.preset = preset;
		res.parser = parser;
		res.reader = Papa.parse;
		return res;
	},
}
exports.struct = struct;
