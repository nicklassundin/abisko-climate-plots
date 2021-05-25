var $ = require('jquery')

const Papa = require('papaparse');
const parse = require('../../stats/config.js').parsers;
const help = require('../../helpers.js')
var months = help.months;

var renderer = require('../renderer.js').render;

//TODO Demo
// var demo = require('../../../data/demo.js').data;

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
var tagApply = function(data, tags){
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
				res(result[tags])
			}
		}
	}).catch(error=>{
		console.log(tags)
		console.log(data)
		throw error
	})
}

var struct = {
	file: undefined,
	filePath: undefined,
	preset: undefined,
	cached: undefined,
	rawData: [],
	parser: undefined, 
	render: renderer, 
	reader: Papa.parse, // TODO be a module that are self contained
	metaRef: undefined,
	contFunc: function(reset=false, meta){
		this.metaRef = meta;
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
						ref.preset.complete = function(result){
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
		// console.log(this.parser)
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
					return data
				})
					.catch(error =>{
						console.log(tags)
						console.log(tag)
						console.log(parser)
						console.log(temp)
						throw error}))
			})
		})
	},
	init: function(id, tag, renderTag=tag){
		// console.log(this.parser)
		var render = this.render;
		var meta = this.metaRef[id]
		render.setup(id, meta);
		// var renderProc = function(data){
		// }
		if(!Array.isArray(tag)) tag = [tag];
		if(!this.cached){
			this.cached = {};
			this.cached[tag[0]] = this.parseRawData(tag);
		}
		if(!this.cached[tag[0]]){
			console.log("re-run")
			console.log(this.cached)
			this.cached[tag[0]] = this.parseRawData(tag);
		}
		console.log(this.cached)
		console.log(tag)
		// this.cached[tag[0]].then(function(data){
		if(tag){
			data = tagApply(this.cached, [...tag]);
		}
		console.log(data)
		try{
			if(data.then){
				data.then(d => {
					render.initiate(id, d)
				})
			}else{

				render.initiate(id, data)
			}
		}catch(error){
			console.log(id);
			console.log(data);
			console.log(error);
			throw error;
		}
		// })
		this.render = render;
		return this;
	},
	clone: function(){
		return Object.assign({}, this);
	},
	create: function(config){ 
		var file = config.file;
		var preset = config.preset;
		var parser = parse[config.parser];
		var local = config.local;

		var res = this.clone();
		res.rawData = [];
		if(!Array.isArray(file)){
			file = [file];
		}
		res.file = file;	
		res.filePath = (files) => files.map(x => filePath.station(x, (local ? station : undefined))); 
		res.preset = preset;
		res.parser = parser;
		res.reader = Papa.parse;
		return res;
	},
}
exports.struct = struct;
