var $ = require('jquery')

const Papa = require('papaparse');
const parse = require('../../stats.js').parsers;
const help = require('../../helpers.js')
var months = help.months;

var renderer = require('../renderer.js').render;

var filePath = {
	station: function(fileName, id=station){
		return hostUrl+"/data/"+id+"/"+fileName;
	},
	other: function(fileName){
		return hostUrl+"/data/"+fileName;
	}
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
	getMeta: function(define){
		if(define.config != undefined){
			var metaConfig =require('../../../config/charts/'+define.config+'.json');
			var meta = {};
			$.extend(true, meta, metaConfig);
			var metaLang = require('../../../config/charts/lang/'+nav_lang+'/'+define.lang+'.json')
			$.extend(true, meta, metaLang);
			var data = require('../../../config/charts/lang/'+nav_lang+'/dataSource.json')[define.data];
			meta.data = {};
			$.extend(true, meta.data, data);
			if(define.monthly){
				var monthly = require('../../../config/charts/monthly.json');
				$.extend(true, meta, monthly);
			}
			if(define.set){
				var set = require('../../../config/charts/'+define.set+'.json');
				$.extend(true, meta, set);
			}
			if(meta.unitType){
				meta.units = require('../../../config/charts/lang/'+nav_lang+'/units.json')[meta.unitType];
			}
			// DEBUG TODO link to config files
			return meta;
		}else{
			return false
		}
	},
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
			render.setup(id, this.getMeta(meta));
		}else{
			try{
				render.setup(id, this.getMeta(this.metaRef));
			}catch(error){
				console.log(id)
				console.log(this.getMeta);
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
	create: function(file, preset, parser, meta, reader = Papa.parse, local=true){
		var res = this.clone();
		res.rawData = [];
		if(!Array.isArray(file)){
			file = [file];
		}
		res.metaRef = meta;
		res.file = file;	
		if(local){
			res.filePath = (files) => files.map(x => filePath.station(x)); 
		}else{
			res.filePath = (files) => files.map(x => filePath.other(x)); 
		}
		res.preset = preset;
		res.parser = parser;
		res.reader = reader;
		return res;
	},
}
exports.struct = struct;
