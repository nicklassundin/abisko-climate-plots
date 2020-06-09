var $ = require('jquery')

const Papa = require('papaparse');
const parse = require('../stats.js').parsers;
const help = require('../helpers.js')
var months = help.months;

var renderer = require('./renderer.js').render;

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

var dataset_struct = {
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

			var metaLang = require('../../config/charts/lang/'+nav_lang+'/'+define.lang+'.json')
			var meta = require('../../config/charts/'+define.config+'.json');
			$.extend(true, meta, metaLang);
			meta.data = require('../../config/charts/lang/'+nav_lang+'/dataSource.json')[define.data];
			if(define.monthly){
				$.extend(true, meta, require('../../config/charts/monthly.json'));
			}
			if(define.set){
				$.extend(true, meta, require('../../config/charts/'+define.set+'.json'));
			}
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
			render.setup(id, this.getMeta(meta));
		}else{
			render.setup(id, this.getMeta(this.metaRef));
		}
		var renderProc = function(data){
		}
		if(!this.cached) this.cached = this.parseRawData();
		this.cached.then(function(data){
			if(tag){
				data = tagApply(data, tag);
			}
			render.initiate(id, data)
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

var config = {
	zonal: dataset_struct.create(
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
		meta = {
			'64n-90n': { config: 'temperature', lang: 'diffTemperature_64n-90n', data: undefined, set: 'climate' }, 
			'nhem': { config: 'temperature', lang: 'diffTemperature_nhem', data: undefined, set: 'climate' }, 
			'glob': { config: 'temperature', lang: 'diffTemperature_glob', data: undefined, set: 'climate' }, 
		},
		reader = Papa.parse,
		local = false),
	abisko: dataset_struct.create(
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
		meta = {
			'temperatures': {
				'yrly': { config: 'temperature', lang: 'yrlyTemperature', data: 'ANS', set: 'weather' }, 
				'summer': { config: 'temperature', lang: 'summerTemperature', data: 'ANS', set: 'weather' },  
				'winter': { config: 'temperature', lang: 'winterTemperature', data: 'ANS', set: 'weather' }, 
				'monthly': { config: 'temperature', lang: 'monthlyTemperature', data: 'ANS', monthly: true, set: 'weather' }, 
				'difference': { config: 'temperature', lang: 'yrlyTemperature', data: 'ANS', set: 'climate'}, 
				'polar': { config: undefined, lang: undefined, data: 'ANS' }, 
			},
			'precipitation':{
				'yrly': { config: 'precipitation', lang: 'yrlyPrecipitation', data: 'ANS' , set: 'weather'}, 
				'summer': { config: 'precipitation', lang: 'summerPrecipitation', data: 'ANS', set: 'weather' }, 
				'winter': { config: 'precipitation', lang: 'winterPrecipitation', data: 'ANS', set: 'weather' }, 
				'monthly': { config: 'precipitation', lang: 'monthlyPrecipitation', data: 'ANS' , monthly: true, set: 'weather'}, 
				'difference': { config: 'temperature', lang: 'yrlyPrecipitation', data: 'ANS', set: 'climate'}, 
				'polar': { config: undefined, lang: undefined }, 
			},
			'growingSeason': { config: 'growingSeason', lang: 'growingSeason', data: 'ANS', set: 'weather'}, 
			'slideTemperature': { config: 'temperature', lang: 'yrlyTemperature', data: 'ANS', set: 'slide'}, 
		},
		reader = Papa.parse),
	smhi: dataset_struct.create(
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
		meta = {
			'temperatures': {
				'yrly': { config: 'temperature', lang: 'yrlyTemperature', data: 'SMHI-Weather', set: 'weather' }, 
				'summer': { config: 'temperature', lang: 'summerTemperature', data: 'SMHI-Weather', set: 'weather' },  
				'winter': { config: 'temperature', lang: 'winterTemperature', data: 'SMHI-Weather', set: 'weather' }, 
				'monthly': { config: 'temperature', lang: 'monthlyTemperature', data: 'SMHI-Weather', monthly: true, set: 'weatehr' },
				'difference': { config: 'difference', lang: 'diffTemperature', data: 'SMHI-Weather', set: 'climate' }, 
				'polar': { config: undefined, lang: undefined, data: 'SMHI-Weather', set: 'weather' }, 
			},
			'precipitation':{
				'yrly': { config: 'precipitation', lang: 'yrlyPrecipitation', data: 'SMHI-Hydrology', set: 'weather' }, 
				'summer': { config: 'precipitation', lang: 'summerPrecipitation', data: 'SMHI-Hydrology', set: 'weather' }, 
				'winter': { config: 'precipitation', lang: 'winterPrecipitation', data: 'SMHI-Hydrology', set: 'weather' }, 
				'monthly': { config: 'precipitation', lang: 'monthlyPrecipitation', data: 'SMHI-Hydrology', monly: true , set: 'weather' }, 
				'difference': { config: 'difference', lang: 'diffPrecipitation', data: 'SMHI-Hydrology', set: 'climate' }, 
				'polar': { config: undefined, lang: undefined, data: 'SMHI-Hydrology', set: 'weather' }, 
			},
			'growingSeason': { config: 'growingSeason', lang: 'growingSeason', data: 'SMHI-Hydrology', set: 'weather' }, 
			'slideTemperature': { config: 'temperature', lang: 'slideTemperature', data: 'SMHI-Hydrology', set: 'slide' }, 
		},
		reader = Papa.parse),
	// TODO Bake together
	tornetrask: dataset_struct.create(
		file = ["Tornetrask_islaggning_islossning.csv"], 
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.AbiskoIceData,
		meta = { config: 'ice', lang: 'ice', data: 'ANS' },
		reader = Papa.parse),
	tornetrask_iceTime: dataset_struct.create(
		file = ["Tornetrask_islaggning_islossning.csv"],
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.AbiskoIceData,
		meta = { config: 'iceTime', lang: 'iceTime', data: 'ANS' },
		reader = Papa.parse),
	abiskoSnowDepth: dataset_struct.create(
		file = ["ANS_SnowDepth.csv"], 
		preset = {
			//worker: useWebWorker, TODO BUG waiting for response
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.AbiskoSnowData,
		meta = {
			'periodMeans': { config: 'snowDepthPeriod', lang: 'snowDepthPeriod', data: 'ANS' },
			'decadeMeans': { config: 'snowDepthDecade', lang: 'snowDepthDecade', data: 'ANS' },
		},
		reader = Papa.parse),
	weeklyCO2: dataset_struct.create(
		file = ["weekly_in_situ_co2_mlo.csv"],
		preset = {
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.SCRIPPS_CO2,
		meta = {
			'weekly': { config: 'co2', lang: 'co2_weekly', data: 'Scipps-CO2' },
			'monthly': { config: 'co2', lang: 'co2_monthly', data: 'Scipps-CO2' },
		},
		reader = Papa.parse,
		local = false),
	permaHistogramCALM: dataset_struct.create(
		file = ["CALM.csv"], 
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.CALM,
		meta = { config: 'perma', lang: 'perma', data: undefined, set: 'weather' },
		reader = Papa.parse,
		local = false),
	iceThick: dataset_struct.create(
		file = ["Tornetrask-data.csv"],
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.AbiskoLakeThickness,
		meta = {
			'yrly': { config: 'iceThick', lang: 'iceThick', data: 'ANS' },
			'date': { config: 'iceThickDate', lang: 'iceThickDate', data: 'ANS' },
		},
		reader = Papa.parse,
		local = true)
}
exports.config = config;

exports.ids = Object.keys(config);
