var $ = require('jquery')
const renders = require('../render.js').graphs;
const Papa = require('papaparse');
const parse = require('../stats.js').parsers;
const help = require('../helpers.js')
var months = help.months;

const hostUrl = require("../../config/server.json").serverURL;

var filePath = function(fileName, id=station){
		return hostUrl+"/"+"data/"+id+"/"+fileName;
}


var monthlyFunc = (render) => function(id, title, src="") {
	var result = [];
	months().forEach((month, index) =>  
		result.push(render(id+"_"+month, title+" "+help.monthName(month))));	
	return function(data){
		result.forEach((func, index) => func(data[index+1+'']));	
	}
};
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

var dataset_struct = {
	src: undefined,
	file: undefined,
	filePath: undefined,
	preset: undefined,
	cached: {},
	rawData: {},
	parser: undefined, 
	render: undefined,
	reader: Papa.parse,
	contFunc: function(reset=false, page=''){	
		if(Object.keys(this.rawData).length > 0) return false
		if(reset) this.cached = {};
		if(this.rawData)
			var ref = this;
		this.filePath().forEach(file => {
			function data(file){
				return new Promise(function(resolve, reject){
					ref.preset.complete = function(result){
						resolve(ref.parser(result, ref.src));
					};
					ref.reader(file, ref.preset)
				}).catch(function(error){
					console.log("FAILED TO LOAD DATA")
					console.log(error);
				})
			};
			if(!this.rawData[file]) this.rawData[file] = data(file);
		})
	},
	init: function(id, tag, renderTag=tag){
		var render = this.render;
		var rawData = this.rawData;
		var promise = rawData[Object.keys(rawData)[0]];
		new Promise(function(resolve, reject){
			if(tag) render = tagApply(render, renderTag);
			resolve(render);
		}).then(function(result){
			render = result(id)
			promise.then(function(data){
				var result = data
				if(tag){
					result = tagApply(data, tag);
				}
				render(result);
				return data
			})
		}).catch(function(err){
			console.log(err)
		});
	},
	clone: function(){
		return Object.assign({}, this);
	},
	create: function(src, file, preset, parser, render, reader = Papa.parse){
		var res = this.clone();
		res.rawData = {};
		res.cached = {};
		if(Array.isArray(file)){
			res.file = file;
		}else{
			res.file = [file];
		}
		res.filePath = () => res.file.map(x => filePath(file))
		res.src = src;
		res.preset = preset;
		res.parser = parser;
		res.render = render;
		res.reader = reader;
		return res;
	},
}

var config = {
	zonal: dataset_struct.create(
		src = 'https://nicklassundin.github.io/abisko-climate-plots/', 
		// TODO place holder for later database
		file = "ZonAnn.Ts.csv",
		preset = {
			//worker: useWebWorker,
			header: true,
			delimiter: ',',
			download: true,
			skipEmptyLines: true,
			dynamicTyping: true,
		},
		parser = parse.GISSTEMPzonalMeans,
		render = {
			'64n-90n': renders.TemperatureDifference,
			'nhem': renders.TemperatureDifference,
			'glob': renders.TemperatureDifference,
		},
		reader = Papa.parse),
	abisko: dataset_struct.create(
		src = '',
		file = "ANS_Temp_Prec.csv",
		preset = {
			//worker: useWebWorker,
			header: true,
			//delimiter: ';',
			download: true,
			skipEmptyLines: true,
			dynamicTyping: false,
		},
		parser = parse.AbiskoCsv,
		render = {
			'temperatures': {
				'yrly': renders.Temperature,
				'summer': renders.Temperature,
				'winter': renders.Temperature,
				'monthly': monthlyFunc(renders.Temperature),
				'difference': renders.TemperatureDifference,
			},
			'precipitation':{
				'yrly': renders.YearlyPrecipitation,
				'summer': renders.YearlyPrecipitation,
				'winter': renders.YearlyPrecipitation,
				'monthly': monthlyFunc(renders.MonthlyPrecipitation),
				'difference': renders.PrecipitationDifference,
			},
			'growingSeason': renders.GrowingSeason,

		},
		reader = Papa.parse),
	tornetrask: dataset_struct.create(
		src = '', 
		file = "Tornetrask_islaggning_islossning.csv",
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.AbiskoIceData,
		render = renders.AbiskoIce,
		reader = Papa.parse),
	tornetrask_iceTime: dataset_struct.create(
		src = '',
		file = "Tornetrask_islaggning_islossning.csv",
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.AbiskoIceData,
		render = renders.AbiskoIceTime,
		reader = Papa.parse),
	abiskoSnowDepth: dataset_struct.create(
		src = '',
		file = hostUrl+"/"+"data/ANS_SnowDepth.csv",
		preset = {
			//worker: useWebWorker, TODO BUG waiting for response
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.AbiskoSnowData,
		render = {
			'periodMeans': renders.AbiskoSnow,
			'decadeMeans': renders.AbiskoSnow,
		},
		reader = Papa.parse),
	weeklyCO2: dataset_struct.create(
		src ='',
		file = "weekly_in_situ_co2_mlo.csv",
		preset = {
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.SCRIPPS_CO2,
		render = {
			'weekly': renders.CO2,
			'monthly': renders.CO2,
		},
		reader = Papa.parse),

	permaHistogramCALM: dataset_struct.create(
		src = '',
		file = "data/CALM.csv",
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.CALM,
		render = renders.Perma,
		reader = Papa.parse),
	smhiTemp: dataset_struct.create(
		src = '',
		file = "temperature.csv",
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
			beforeFirstChunk: function(result){
				result = result.split("\n")
				var line = result.findIndex(x => x.indexOf("Tidsutsnitt:") > -1)  
				result.splice(0,line);
				result = result.join("\r\n");
				return result
			}
		},
		parser = parse.smhiTemp,
		render = {
			yrly: renders.Temperature,
		}),
}
exports.config = config;

exports.ids = Object.keys(config);
