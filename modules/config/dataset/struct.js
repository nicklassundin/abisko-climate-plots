var $ = require('jquery')

const Papa = require('papaparse');
const parse = require('../../stats/config.js').parsers;
const help = require('../../helpers.js')

var createDiv = require('../charts/struct.js').createDiv;

var renderer = require('../renderer.js').render;

//TODO Demo
// var demo = require('../../../data/demo.js').data;


global.filePath = {
	station: function(fileName, id){
		//TODO hotfix
		if(id){
			return hostUrl+"/data/"+id+"/"+fileName;
		}else{
			return hostUrl+"/data/"+fileName;
		}
	},
}

// wander down the data structure with tag input example: [high, medium, low]
var tagApply = function(data, tags){
	// console.log(tags)
	// console.log(data)
	if(Array.isArray(tags) && tags.length == 1){
		tags = tags[0];
	}
	return new Promise((res, rej) => {
		var result = data;
		if(data.then){
			data.then(d => {
				res(tagApply(d, tags))
			})
		}else{
			if(Array.isArray(tags)){
				var tag = tags.shift()
				res(tagApply(result[tag], tags))
			}else{
				// console.log(result)
				// console.log(tags)
				// console.log(result[tags])
				// fdsfds
				res(result[tags.replace('[stationName]', station)])
			}
		}
	}).catch(error=>{
		// console.log(tags)
		// console.log(data)
		throw error
	})
}

/// 
///////

// var merged = require('../../../static/modules.config.charts.merge.json');
var container = {};

///////

var struct = {
	type: undefined,
	config: undefined, 
	html: function(config){
		var id = config.files.stationDef.id;
		var subset = config.files.subset;
		// if(subset){
			// subset = subset.subset;
			// var div = document.createElement("div");
			// subset.sets.forEach(month => {
				// div.appendChild(createDiv(id+'_'+month));
			// })
		// }else{
			return createDiv(id, false)
		// }	
		// return div
	},
	build: function(config, div){
		this.config = config;
		var ref = config.files.ref;
		var id = ref.id
		this.metaRef[id] = config;
		var stationType = config.files.stationDef.stationType;
		var type = config.files.ref.type; 
		this.type = type;
		div.appendChild(this.html(config))
		if(!container[type]){
			container[type] = this.create(id, config)	
		}
		container[type].contFunc(false, id, container[type].metaRef[id]);
		container[type].init(id);
		return container[type];
	},
	file: undefined,
	filePath: undefined,
	preset: undefined,
	cached: {},
	rawData: [],
	parser: undefined, 
	render: renderer, 
	reader: Papa.parse, // TODO be a module that are self contained
	metaRef: {}, 
	contFunc: function(reset=false, id, config){
		id = config.files.stationDef.id;
		if(!this.metaRef[id]) this.metaRef[id] = config
		if(typeof this.rawData !== 'undefined' && this.rawData.length > 0){
			return this;
		}	
		if(Object.keys(this.rawData).length > 0) return false
		if(reset) this.cached = {};
		var ref = this;
		if(!this.rawData.then){
			var path = ref.filePath(ref.file);
			this.rawData = new Promise(function(resolve, reject){
				function data(file){
					return new Promise(function(resolve, reject){
						// console.log(file)
						// console.log(ref.preset)
						ref.preset.complete = function(result){
							// console.log(result)
							resolve(result);
						};
						ref.reader(file, ref.preset)
					}).catch(function(error){
						console.log("FAILED TO LOAD DATA")
						console.log(error);
					})
				};
				ref.file.forEach((file, index) => {
					// TODO Demo
					// if(demo[station] && demo[station][file]){

					// console.log(demo[station][file])
					// ref.rawData.push(
					// data(demo[station][file]))
					// }else{
					try{
						ref.rawData.push(data(path[index]));
					}catch(error){
						console.log(file)
						console.log(ref.rawData);
						throw error;
					}
					// }
				})
				resolve(ref.rawData);
			})
		}
		return this;
	},
	parseRawData: function(tags){
		var tag = tags[0]
		var temp = this.parser;
		var parser = this.parser;
		// console.log("Parser")
		// console.log(this.parser.pre)
		if(!(typeof parser === "function")){
			parser = parser[tag]
		}
		var rawDataPromise = this.rawData;
		return new Promise(function(resolve, reject){
			rawDataPromise.then(function(rawData){
				resolve(Promise.all(rawData).then(function(rawData){
					// $.ajax({
					// type: "POST",
					// url: hostUrl+'/receive',
					// data: {
					// data: JSON.stringify(rawData)
					// },
					// success: success,
					// dataType: 'script'
					// });
					var data = parser(rawData);	
					// console.log(rawData)
					// console.log(data)
					return data
				})
					.catch(error =>{
						console.log("FAILED DATA PARSE")
						console.log(tags)
						console.log(tag)
						console.log(parser)
						console.log(temp)
						throw error}))
			})
		})
	},
	init: function(id){
		// console.log(this.metaRef)
		// console.log(id)
		var tag = this.metaRef[id].files.ref.tag.data
		// var render = this.render;
		var meta = this.metaRef[id]
		var st_id = meta.files.stationDef.id;
		this.render.setup(meta);
		if(!Array.isArray(tag)) tag = [tag];
		if(!this.cached[id]) this.cached[id] = {};
		if(!this.cached[id][tag[0]]){
			// console.log('parse')
			this.cached[id][tag[0]] = this.parseRawData(tag)
		}
		var data = new Promise((res, rej) => {
			if(tag){
				res(tagApply(this.cached[id], [...tag]))
			}else{
				res(this.cached[id])
			}
		})
		try{
			if(data.then){
				data.then(d => {
					this.render.initiate(st_id, d)
				})
			}else{
				this.render.initiate(st_id, data)
			}
		}catch(error){
			console.log(id);
			console.log(data);
			console.log(error);
			throw error;
		}
		// })
		// this.render = render;
		return this;
	},
	clone: function(){
		return Object.assign({}, this);
	},
	create: function(id, config){
		// console.log(id)
		// console.log(config)
		if(!this.metaRef[id]){
			this.metaRef[id] = {}
			$.extend(true, this.metaRef[id], config)
		}
		var cfg = config.files.config.parse;
		var file = cfg.file;
		var preset = cfg.preset;
		var parser = parse[cfg.parser];
		var local = cfg.local;
		// console.log(file)
		var res = this.clone();
		res.metRef = this.metaRef[id];
		this.rawData = [];
		if(!Array.isArray(file)){
			file = [file];
		}
		res.file = file;
		var station = config.files.stationDef.stationType.data
		res.filePath = (files) => files.map(x => filePath.station(x, station)); 

		res.preset = preset;
		res.parser = parser;
		res.reader = Papa.parse;
		return res;
	},
}
exports.struct = struct;
