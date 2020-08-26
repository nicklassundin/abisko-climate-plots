var $ = require('jquery')

const Papa = require('papaparse');
const parse = require('../../stats/config.js').parsers;

var renderer = require('./../renderer.js').render;

var dataset_struct = require('./struct.js').struct;

var meta_struct = {
	config: undefined,
	lang: undefined,
	set: undefined,
	subSet: undefined,
	create: function(config, lang, data, set, subSet){
		var res = this.clone();
		res.config = config;
		res.lang = lang;
		res.set = set;
		res.data = data;
		res.subSet = subSet;
		return res
	},
	clone: function(){
		return Object.assign({}, this);
	}
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
			'64n-90n': meta_struct.create(config = 'temperature', lang = '64n-90n_Temperature', data = 'NASA-GISS-TEMP', set = 'climate'), 
			'nhem': meta_struct.create(config =  'temperature', lang =  'nhem_Temperature', data =  'NASA-GISS-TEMP', set =  'climate'), 
			'glob': meta_struct.create(config =  'temperature', lang =  'glob_Temperature', data =  'NASA-GISS-TEMP', set =  'climate'), 
		},
		reader = Papa.parse,
		local = false),
	abisko: dataset_struct.create(
		file = ["ANS_Temp_Prec.csv", "AWS_Daily_1984-2019.csv", "ANS_Prec.csv"],
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
				'yrly': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data =  'ANS', set =  'weather'), 
				'summer': meta_struct.create(config =  'temperature', lang =  'summerTemperature', data =  'ANS', set =  'weather'),  
				'winter': meta_struct.create(config =  'temperature', lang =  'winterTemperature', data =  'ANS', set =  'weather'), 
				'autumn': meta_struct.create(config =  'temperature', lang =  'autumnTemperature', data =  'ANS', set =  'weather'), 
				'spring': meta_struct.create(config =  'temperature', lang =  'springTemperature', data =  'ANS', set =  'weather'), 
				'monthly': meta_struct.create(config =  'temperature', lang =  'monthlyTemperature', data =  'ANS', set = 'weather', subSet = 'monthly'),
				//TODO
				'months': meta_struct.create(config =  'temperature', lang =  'monthlyTemperature', data =  'ANS', set = 'slide', subSet = 'monthSet'), 
				// END
				'difference': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data =  'ANS', set =  'climate'), 
				'dailyExtreme': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data =  'ANS' , set =  'extremeDay'), 
				'weeklyExtreme': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data =  'ANS' , set =  'extremeWeek'), 
				'polar': meta_struct.create(config =  undefined, lang =  undefined, data =  'ANS'), 
				'yrlySlide': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data =  'ANS', set =  'slide'), 
				'summerSlide': meta_struct.create(config =  'temperature', lang =  'summerTemperature', data =  'ANS', set =  'slide'),  
				'winterSlide': meta_struct.create(config =  'temperature', lang =  'winterTemperature', data =  'ANS', set =  'slide'), 
				'autumnSlide': meta_struct.create(config =  'temperature', lang =  'autumnTemperature', data =  'ANS', set =  'slide'), 
				'springSlide': meta_struct.create(config =  'temperature', lang =  'springTemperature', data =  'ANS', set =  'slide'), 
				'monthlySlide': meta_struct.create(config =  'temperature', lang =  'monthlyTemperature', data =  'ANS', set = 'slide',  subSet = 'monthly')
			},
			'precipitation':{
				'yrly': meta_struct.create(config =  'precipitation', lang =  'yrlyPrecipitation', data =  'ANS' , set =  'weather'), 
				'summer': meta_struct.create(config =  'precipitation', lang =  'summerPrecipitation', data =  'ANS', set =  'weather'), 
				'spring': meta_struct.create(config =  'precipitation', lang =  'springPrecipitation', data =  'ANS', set =  'weather'), 
				'winter': meta_struct.create(config =  'precipitation', lang =  'winterPrecipitation', data =  'ANS', set =  'weather'), 
				'autumn': meta_struct.create(config =  'precipitation', lang =  'autumnPrecipitation', data =  'ANS', set =  'weather'), 
				'monthly': meta_struct.create(config =  'precipitation', lang =  'monthlyPrecipitation', data =  'ANS', set = 'weather', subSet = 'monthly'),
				'difference': meta_struct.create(config =  'precipitation', lang =  'yrlyPrecipitation', data =  'ANS', set =  'climate'), 
				'dailyExtreme': meta_struct.create(config =  'precipitation', lang =  'yrlyPrecipitation', data =  'ANS' , set =  'extremeDay'), 
				'weeklyExtreme': meta_struct.create(config =  'precipitation', lang =  'yrlyPrecipitation', data =  'ANS' , set =  'extremeWeek'), 
				'polar': meta_struct.create(config =  undefined, lang =  undefined), 
				'yrlySlide': meta_struct.create(config =  'precipitation', lang =  'yrlyPrecipitation', data =  'ANS' , set =  'slide'), 
				'summerSlide': meta_struct.create(config =  'precipitation', lang =  'summerPrecipitation', data =  'ANS', set =  'slide'), 
				'springSlide': meta_struct.create(config =  'precipitation', lang =  'springPrecipitation', data =  'ANS', set =  'slide'), 
				'winterSlide': meta_struct.create(config =  'precipitation', lang =  'winterPrecipitation', data =  'ANS', set =  'slide'), 
				'autumnSlide': meta_struct.create(config =  'precipitation', lang =  'autumnPrecipitation', data =  'ANS', set =  'slide'), 
				'monthlySlide': meta_struct.create(config =  'precipitation', lang =  'monthlyPrecipitation', data =  'ANS', set = 'slide', subSet = 'monthly'), 
			},
			'growingSeason': {
				'weeks': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data = 'ANS', set = 'weatherWeeks'), 
				// 'weeks': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data =  'ANS', set =  'slide'), 
				'days': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data = 'ANS', set = 'weatherDays'), 
				// 'days': meta_struct.create(config =  'growingSeason', lang =  'growingSeasonDays', data = 'ANS', set = 'slide'), 
				'first': meta_struct.create(config =  'growingSeasonFirst', lang =  'growingSeasonFrostFirst', data = 'ANS', set = 'slide'), 
				'last': meta_struct.create(config =  'growingSeasonLast', lang =  'growingSeasonFrostLast', data = 'ANS', set = 'slide'), 
			},
			'slideTemperature': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data =  'ANS', set =  'slide'), 
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
				'yrly': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data = 'SMHI-Weather', set =  'weather'), 
				'summer': meta_struct.create(config =  'temperature', lang =  'summerTemperature', data = 'SMHI-Weather', set =  'weather'),  
				'winter': meta_struct.create(config =  'temperature', lang =  'winterTemperature', data = 'SMHI-Weather', set =  'weather'), 
				'autumn': meta_struct.create(config =  'temperature', lang =  'autumnTemperature', data = 'SMHI-Weather', set =  'weather'), 
				'spring': meta_struct.create(config =  'temperature', lang =  'springTemperature', data = 'SMHI-Weather', set =  'weather'), 
				'monthly': meta_struct.create(config =  'temperature', lang =  'monthlyTemperature', data = 'SMHI-Weather', set =  'weather', subset = 'monthly'), 
				//TODO
				'months': meta_struct.create(config =  'temperature', lang =  'monthlyTemperature', data = 'SMHI-Weather', set = 'slide', subset = 'monthSet'), 
				// END
				'difference': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data = 'SMHI-Weather', set =  'climate'), 
				'dailyExtreme': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data = 'SMHI-Weather' , set =  'extremeDay'), 
				'weeklyExtreme': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data = 'SMHI-Weather' , set =  'extremeWeek'), 
				// 'polar': meta_struct.create(config =  undefined, lang =  undefined, data =  'SMHI-Weather'), 
				'yrlySlide': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data =  'ANS', set =  'slide'), 
				'summerSlide': meta_struct.create(config =  'temperature', lang =  'summerTemperature', data =  'SMHI-Weather', set =  'slide'),  
				'winterSlide': meta_struct.create(config =  'temperature', lang =  'winterTemperature', data =  'SMHI-Weather', set =  'slide'), 
				'autumnSlide': meta_struct.create(config =  'temperature', lang =  'autumnTemperature', data =  'SMHI-Weather', set =  'slide'), 
				'springSlide': meta_struct.create(config =  'temperature', lang =  'springTemperature', data =  'SMHI-Weather', set =  'slide'), 
				'monthlySlide': meta_struct.create(config =  'temperature', lang =  'monthlyTemperature', data =  'SMHI-Weather', set = 'slide', subSet = 'monthly'), 
			},
			'precipitation':{
				'yrly': meta_struct.create(config =  'precipitation', lang =  'yrlyPrecipitation', data =  'SMHI-Hydrology' , set =  'weather'), 
				'summer': meta_struct.create(config =  'precipitation', lang =  'summerPrecipitation', data =  'SMHI-Hydrology', set =  'weather'), 
				'spring': meta_struct.create(config =  'precipitation', lang =  'springPrecipitation', data =  'SMHI-Hydrology', set =  'weather'), 
				'winter': meta_struct.create(config =  'precipitation', lang =  'winterPrecipitation', data =  'SMHI-Hydrology', set =  'weather'), 
				'autumn': meta_struct.create(config =  'precipitation', lang =  'autumnPrecipitation', data =  'SMHI-Hydrology', set =  'weather'), 
				'monthly': meta_struct.create(config =  'precipitation', lang =  'monthlyPrecipitation', data =  'SMHI-Hydrology' , set = 'weather', subSet = 'monthly'), 
				'difference': meta_struct.create(config =  'precipitation', lang =  'yrlyPrecipitation', data =  'SMHI-Hydrology', set =  'climate'), 
				'dailyExtreme': meta_struct.create(config =  'precipitation', lang =  'yrlyPrecipitation', data =  'SMHI-Hydrology' , set =  'extremeDay'), 
				'weeklyExtreme': meta_struct.create(config =  'precipitation', lang =  'yrlyPrecipitation', data =  'SMHI-Hydrology' , set =  'extremeWeek'), 
				'polar': meta_struct.create(config =  undefined, lang =  undefined), 
				'yrlySlide': meta_struct.create(config =  'precipitation', lang =  'yrlyPrecipitation', data =  'SMHI-Hydrology' , set =  'slide'), 
				'summerSlide': meta_struct.create(config =  'precipitation', lang =  'summerPrecipitation', data =  'SMHI-Hydrology', set =  'slide'), 
				'springSlide': meta_struct.create(config =  'precipitation', lang =  'springPrecipitation', data =  'SMHI-Hydrology', set =  'slide'), 
				'winterSlide': meta_struct.create(config =  'precipitation', lang =  'winterPrecipitation', data =  'SMHI-Hydrology', set =  'slide'), 
				'autumnSlide': meta_struct.create(config =  'precipitation', lang =  'autumnPrecipitation', data =  'SMHI-Hydrology', set =  'slide'), 
				'monthlySlide': meta_struct.create(config =  'precipitation', lang =  'monthlyPrecipitation', data =  'SMHI-Hydrology' , set = 'slide', subSet = 'monthly'), 
			},
			'growingSeason': {
				'weeks': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data =  'SMHI-Weather', set =  'weatherWeeks'), 
				// 'weeks': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data =  'SMHI-Weather', set =  'slide'), 
				'days': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data =  'SMHI-Weather', set =  'weatherDays'), 
				// 'days': meta_struct.create(config =  'growingSeason', lang =  'growingSeasonDays', data =  'SMHI-Weather', set =  'slide'), 
				'first': meta_struct.create(config =  'growingSeasonFirst', lang =  'growingSeasonFrostFirst', data =  'SMHI-Weather', set =  'slide'), 
				'last': meta_struct.create(config =  'growingSeasonLast', lang =  'growingSeasonFrostLast', data = 'SMHI-Weather', set =  'slide'), 
			},
			'slideTemperature': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data =  'SMHI-Weather', set =  'slide'), 
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
			DOY: meta_struct.create(config =  'ice', lang =  'ice', data =  'ANS', set =  'weather'),
			breakupDOY: meta_struct.create(config =  'iceBreakup', lang =  'iceBreakup', data =  'ANS', set =  'weather'),
			freezeDOY: meta_struct.create(config =  'iceFreeze', lang =  'iceFreeze', data =  'ANS', set =  'weather'),
			iceTime: meta_struct.create(config =  'iceTime', lang =  'iceTime', data =  'ANS', set =  'weather'),
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
			'periodMeans': meta_struct.create(config =  'snowDepthPeriod', lang =  'snowDepthPeriod', data =  'ANS', set =  'weather'),
			'decadeMeans': meta_struct.create(config =  'snowDepthDecade', lang =  'snowDepthDecade', data =  'ANS', set =  'weather'),
			'snowDepth': {
				'yrly': meta_struct.create(config =  'avgSnowDepth', lang =  'yrlyAvgSnowDepth', data =  'ANS', set =  'slide'),
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
			'weekly': meta_struct.create(config =  'co2', lang =  'co2_weekly', data =  'Scipps-CO2', set =  'weather'),
			'monthly': meta_struct.create(config =  'co2', lang =  'co2_monthly', data =  'Scipps-CO2', set =  'weather'),
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
		meta = meta_struct.create(config =  'perma', lang =  'perma', data =  'GTNP-ANL', set =  'weather' ),
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
				'max': meta_struct.create(config =  'iceThick', lang =  'iceThick', data =  'ANS', set =  'weather'),
			}, 
			'date': meta_struct.create(config =  'iceThickDate', lang =  'iceThickDate', data =  'ANS', set =  'weather'),
		},
		reader = Papa.parse,
		local = true)
}
exports.config = config;

exports.ids = Object.keys(config);
