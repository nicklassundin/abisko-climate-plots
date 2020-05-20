var $ = require('jquery')

const renders = require('../render.js').graphs;

const Papa = require('papaparse');
const parse = require('../stats.js').parsers;
const help = require('../helpers.js')
var months = help.months;

var renderer = require('./renderer.js')

var filePath = {
	station: function(fileName, id=station){
		return hostUrl+"/data/"+id+"/"+fileName;
	},
	other: function(fileName){
		return hostUrl+"/data/"+fileName;
	}
}


var monthlyFunc = (render) => function(id, meta) {
	var result = [];
	//TODO
	months().forEach((month, index) => {
		var cloneMeta = Object.assign({}, meta, {})
		cloneMeta.month = help.monthName(month);
		result.push(render(id+"_"+month, cloneMeta))
	});	
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
	cached: undefined,
	rawData: [],
	parser: undefined, 
	render: undefined,
	reader: Papa.parse,
	metaRef: undefined,
	getMeta: function(define){
		if(define.config != undefined){

			var meta = require('../../config/charts/lang/'+nav_lang+'/'+define.lang+'.json')
			var metaConfig = require('../../config/charts/'+define.config+'.json');
			$.extend(true, meta, metaConfig);
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
		this.filePath(this.file).forEach(file => {
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
			ref.rawData.push(data(file));
		})
		return this;
	},
	parseRawData: function(reset=false){
		var parser = this.parser;
		var rawDataPromise = this.rawData;
		return new Promise(function(resolve, reject){
			Promise.all(rawDataPromise).then(function(rawData){
				var data = parser(rawData);
				resolve(data);	
			})
		})
	},
	init: function(id, tag, renderTag=tag){
		var render = this.render;
		if(tag){
			var meta = tagApply(this.metaRef, renderTag);
			render = tagApply(render, renderTag)(id, this.getMeta(meta));
		}else{
			render = render(id, this.getMeta(this.metaRef));
		}
		var renderProc = function(data){
			if(tag){
				data = tagApply(data, tag);
			}
			render = render(data)
		}
		if(!this.cached) this.cached = this.parseRawData();
		this.cached.then(function(data){
			renderProc(data);
		})
		return this;
	},
	clone: function(){
		return Object.assign({}, this);
	},
	create: function(src, file, preset, parser, render, meta, reader = Papa.parse, local=true){
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
		src = location.protocol+'//nicklassundin.github.io/abisko-climate-plots/', 
		// TODO place holder for later database
		file = ["ZonAnn.Ts.csv"],
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
		meta = {
			'64n-90n': { config: undefined, lang: undefined }, 
			'nhem': { config: undefined, lang: undefined }, 
			'glob': { config: undefined, lang: undefined }, 
		},
		reader = Papa.parse,
		local = false),
	abisko: dataset_struct.create(
		src = '',
		file = ["ANS_Temp_Prec.csv", "AWS_Daily_1984-2019.csv"],
		preset = {
			//worker: useWebWorker,
			header: true,
			//delimiter: ';',
			download: true,
			skipEmptyLines: true,
			beforeFirstChunk: function(result){
				global.stationName = "Abisko";
			},
			dynamicTyping: false,
			// fastMode: true TODO fix parsing error
		},
		parser = parse.AbiskoCsv,
		render = {
			'temperatures': {
				'yrly': renders.generic,
				'summer': renders.generic,
				'winter': renders.generic,
				'monthly': renders.generic,
				// 'monthly': monthlyFunc(renders.oldTemperature),
				'difference': renders.generic,
				'polar': renders.Polar,
			},
			'precipitation':{
				'yrly': renders.generic,
				'summer': renders.generic,
				'winter': renders.generic,
				'monthly': renders.generic,
				'difference': renders.generic,
				'polar': renders.Polar,
			},
			'growingSeason': renders.generic,
			'slideTemperature': renders.generic,
		},
		meta = {
			'temperatures': {
				'yrly': { config: 'temperature', lang: 'yrlyTemperature' }, 
				'summer': { config: 'temperature', lang: 'summerTemperature' },  
				'winter': { config: 'temperature', lang: 'winterTemperature' }, 
				'monthly': { config: 'monthlyTemperature', lang: 'monthlyTemperature' }, 
				'difference': { config: 'difference', lang: 'diffTemperature' }, 
				'polar': { config: undefined, lang: undefined }, 
			},
			'precipitation':{
				'yrly': { config: 'precipitation', lang: 'yrlyPrecipitation' }, 
				'summer': { config: 'precipitation', lang: 'summerPrecipitation' }, 
				'winter': { config: 'precipitation', lang: 'winterPrecipitation' }, 
				'monthly': { config: 'monthlyPrecipitation', lang: 'monthlyPrecipitation' }, 
				'difference': { config: 'difference', lang: 'diffPrecipitation' }, 
				'polar': { config: undefined, lang: undefined }, 
			},
			'growingSeason': { config: 'growingSeason', lang: 'growingSeason' }, 
			'slideTemperature': { config: 'slideTemperature', lang: 'slideTemperature' }, 
		},
		reader = Papa.parse),
	smhi: dataset_struct.create(
		src = '',
		file = ["temperature.csv", "precipitation.csv"],
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
			beforeFirstChunk: function(result){
				result = result.split("\n")
				var line = result.findIndex(x => x.indexOf("Tidsutsnitt:") > -1)  
				var rest = result.splice(0,line);
				result = result.join("\r\n");
				rest = rest[1].split(";");
				global.stationName = rest[0];
				return result
			},
			fastMode: true
		},
		parser = parse.smhiTemp,
		render = {
			'temperatures': {
				'yrly': renders.generic,
				'summer': renders.generic,
				'winter': renders.generic,
				'monthly': renders.generic,
				'difference': renders.generic,
			},
			'precipitation':{
				'yrly': renders.generic,
				'summer': renders.generic,
				'winter': renders.generic,
				'monthly': renders.generic, 
				'difference': renders.PrecipitationDifference,
			},
			'growingSeason': renders.generic,
			'slideTemperature' :renders.generic,
		},
		meta = {
			'temperatures': {
				'yrly': { config: 'temperature', lang: 'yrlyTemperature' }, 
				'summer': { config: 'temperature', lang: 'summerTemperature' },  
				'winter': { config: 'temperature', lang: 'winterTemperature' }, 
				'monthly': { config: 'monthlyTemperature', lang: 'monthlyTemperature' }, 
				'difference': { config: 'difference', lang: 'diffTemperature' }, 
				'polar': { config: undefined, lang: undefined }, 
			},
			'precipitation':{
				'yrly': { config: 'precipitation', lang: 'yrlyPrecipitation' }, 
				'summer': { config: 'precipitation', lang: 'summerPrecipitation' }, 
				'winter': { config: 'precipitation', lang: 'winterPrecipitation' }, 
				'monthly': { config: 'monthlyPrecipitation', lang: 'monthlyPrecipitation' }, 
				'difference': { config: 'difference', lang: 'diffPrecipitation' }, 
				'polar': { config: undefined, lang: undefined }, 
			},
			'growingSeason': { config: 'growingSeason', lang: 'growingSeason' }, 
			'slideTemperature': { config: 'slideTemperature', lang: 'slideTemperature' }, 
		},
		reader = Papa.parse),
	// TODO Bake together
	tornetrask: dataset_struct.create(
		src = '', 
		file = ["Tornetrask_islaggning_islossning.csv"], 
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.AbiskoIceData,
		render = renders.generic,
		meta = { config: 'ice', lang: 'ice' },
		reader = Papa.parse),
	tornetrask_iceTime: dataset_struct.create(
		src = '',
		file = ["Tornetrask_islaggning_islossning.csv"],
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.AbiskoIceData,
		render = renders.generic,
		meta = { config: 'iceTime', lang: 'iceTime' },
		reader = Papa.parse),
	abiskoSnowDepth: dataset_struct.create(
		src = '',
		file = ["ANS_SnowDepth.csv"], 
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
		meta = {
			'periodMeans': { config: undefined, lang: undefined },
			'decadeMeans': { config: undefined, lang: undefined },
		},
		reader = Papa.parse),
	weeklyCO2: dataset_struct.create(
		src ='',
		file = ["weekly_in_situ_co2_mlo.csv"],
		preset = {
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.SCRIPPS_CO2,
		render = {
			'weekly': renders.CO2,
			'monthly': renders.CO2,
		},
		meta = {
			'weekly': { config: undefined, lang: undefined },
			'monthly': { config: undefined, lang: undefined },
		},
		reader = Papa.parse,
		local = false),
	permaHistogramCALM: dataset_struct.create(
		src = '',
		file = ["CALM.csv"], 
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.CALM,
		render = renders.Perma,
		meta = { config: undefined, lang: undefined },
		reader = Papa.parse,
		local = false),
	iceThick: dataset_struct.create(
		src = '',
		file = ["Tornetrask-data.csv"],
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.AbiskoLakeThickness,
		render = {
			'yrly': renders.iceThicknessYear,
			'date': renders.iceThicknessDate
		},
		meta = {
			'yrly': { config: undefined, lang: undefined },
			'date': { config: undefined, lang: undefined },
		},
		reader = Papa.parse,
		local = true)
}
exports.config = config;

exports.ids = Object.keys(config);
