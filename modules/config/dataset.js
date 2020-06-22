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
			var metaConfig =require('../../config/charts/'+define.config+'.json');
			var meta = {};
			$.extend(true, meta, metaConfig);
			var metaLang = require('../../config/charts/lang/'+nav_lang+'/'+define.lang+'.json')
			$.extend(true, meta, metaLang);
			var data = require('../../config/charts/lang/'+nav_lang+'/dataSource.json')[define.data];
			meta.data = {};
			$.extend(true, meta.data, data);
			if(define.monthly){
				var monthly = require('../../config/charts/monthly.json');
				$.extend(true, meta, monthly);
			}
			if(define.set){
				var set = require('../../config/charts/'+define.set+'.json');
				$.extend(true, meta, set);
			}
			if(meta.unitType){
				meta.units = require('../../config/charts/lang/'+nav_lang+'/units.json')[meta.unitType];
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
				// console.log(data)
				resolve(data);	
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
			'64n-90n': { config: 'temperature', lang: '64n-90n_Temperature', data: undefined, set: 'climate' }, 
			'nhem': { config: 'temperature', lang: 'nhem_Temperature', data: undefined, set: 'climate' }, 
			'glob': { config: 'temperature', lang: 'glob_Temperature', data: undefined, set: 'climate' }, 
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
				'autumn': { config: 'temperature', lang: 'autumnTemperature', data: 'ANS', set: 'weather' }, 
				'spring': { config: 'temperature', lang: 'springTemperature', data: 'ANS', set: 'weather' }, 
				'monthly': { config: 'temperature', lang: 'monthlyTemperature', data: 'ANS', monthly: true, set: 'weather' }, 
				'difference': { config: 'temperature', lang: 'yrlyTemperature', data: 'ANS', set: 'climate'}, 
				'dailyExtreme': { config: 'temperature', lang: 'yrlyTemperature', data: 'ANS' , set: 'extremeDay'}, 
				'weeklyExtreme': { config: 'temperature', lang: 'yrlyTemperature', data: 'ANS' , set: 'extremeWeek'}, 
				'polar': { config: undefined, lang: undefined, data: 'ANS' }, 
				'yrlySlide': { config: 'temperature', lang: 'yrlyTemperature', data: 'ANS', set: 'slide' }, 
				'summerSlide': { config: 'temperature', lang: 'summerTemperature', data: 'ANS', set: 'slide' },  
				'winterSlide': { config: 'temperature', lang: 'winterTemperature', data: 'ANS', set: 'slide' }, 
				'autumnSlide': { config: 'temperature', lang: 'autumnTemperature', data: 'ANS', set: 'slide' }, 
				'springSlide': { config: 'temperature', lang: 'springTemperature', data: 'ANS', set: 'slide' }, 
				'monthlySlide': { config: 'temperature', lang: 'monthlyTemperature', data: 'ANS', monthly: true, set: 'slide' }, 
			},
			'precipitation':{
				'yrly': { config: 'precipitation', lang: 'yrlyPrecipitation', data: 'ANS' , set: 'weather'}, 
				'summer': { config: 'precipitation', lang: 'summerPrecipitation', data: 'ANS', set: 'weather' }, 
				'spring': { config: 'precipitation', lang: 'summerPrecipitation', data: 'ANS', set: 'weather' }, 
				'winter': { config: 'precipitation', lang: 'winterPrecipitation', data: 'ANS', set: 'weather' }, 
				'autumn': { config: 'precipitation', lang: 'autumnPrecipitation', data: 'ANS', set: 'weather' }, 
				'monthly': { config: 'precipitation', lang: 'monthlyPrecipitation', data: 'ANS' , monthly: true, set: 'weather'}, 
				'difference': { config: 'precipitation', lang: 'yrlyPrecipitation', data: 'ANS', set: 'climate'}, 
				'dailyExtreme': { config: 'precipitation', lang: 'yrlyPrecipitation', data: 'ANS' , set: 'extremeDay'}, 
				'weeklyExtreme': { config: 'precipitation', lang: 'yrlyPrecipitation', data: 'ANS' , set: 'extremeWeek'}, 
				'polar': { config: undefined, lang: undefined }, 
				'yrlySlide': { config: 'precipitation', lang: 'yrlyPrecipitation', data: 'ANS' , set: 'slide'}, 
				'summerSlide': { config: 'precipitation', lang: 'summerPrecipitation', data: 'ANS', set: 'slide' }, 
				'springSlide': { config: 'precipitation', lang: 'springPrecipitation', data: 'ANS', set: 'slide' }, 
				'winterSlide': { config: 'precipitation', lang: 'winterPrecipitation', data: 'ANS', set: 'slide' }, 
				'autumnSlide': { config: 'precipitation', lang: 'autumnPrecipitation', data: 'ANS', set: 'slide' }, 
				'monthlySlide': { config: 'precipitation', lang: 'monthlyPrecipitation', data: 'ANS' , monthly: true, set: 'slide'}, 
			},
			'growingSeason': { config: 'growingSeason', lang: 'growingSeason', data: 'ANS', set: 'weather'}, 
			'growingSeasonDays': { config: 'growingSeason', lang: 'growingSeasonDays', data: 'ANS', set: 'weather'}, 
			'growingSeasonFrostFirst': { config: 'growingSeasonFirst', lang: 'growingSeasonFrostFirst', data: 'ANS', set: 'weather'}, 
			'growingSeasonFrostLast': { config: 'growingSeasonLast', lang: 'growingSeasonFrostLast', data: 'ANS', set: 'weather'}, 
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
				'monthly': { config: 'temperature', lang: 'monthlyTemperature', data: 'SMHI-Weather', monthly: true, set: 'weather' },
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
		meta = {
			DOY: { config: 'ice', lang: 'ice', data: 'ANS', set: 'weather' },
			breakupDOY: { config: 'iceBreakup', lang: 'iceBreakup', data: 'ANS', set: 'slide' },
			freezeDOY: { config: 'iceFreeze', lang: 'iceFreeze', data: 'ANS', set: 'slide' },
			iceTime: { config: 'iceTime', lang: 'iceTime', data: 'ANS', set: 'slide' },
		},
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
			'periodMeans': { config: 'snowDepthPeriod', lang: 'snowDepthPeriod', data: 'ANS', set: 'weather' },
			'decadeMeans': { config: 'snowDepthDecade', lang: 'snowDepthDecade', data: 'ANS', set: 'weather' },
			'snowDepth': {
				'yrly': { config: 'avgSnowDepth', lang: 'yrlyAvgSnowDepth', data: 'ANS', set: 'slide' },
			}
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
			'weekly': { config: 'co2', lang: 'co2_weekly', data: 'Scipps-CO2', set: 'weather' },
			'monthly': { config: 'co2', lang: 'co2_monthly', data: 'Scipps-CO2', set: 'weather' },
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
			'yrly': {
				'max': { config: 'iceThick', lang: 'iceThick', data: 'ANS', set: 'slide' },
			}, 
			'date': { config: 'iceThickDate', lang: 'iceThickDate', data: 'ANS', set: 'slide' },
		},
		reader = Papa.parse,
		local = true)
}
exports.config = config;

exports.ids = Object.keys(config);
