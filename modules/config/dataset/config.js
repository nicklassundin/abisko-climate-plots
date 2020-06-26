var $ = require('jquery')

const Papa = require('papaparse');
const parse = require('../../stats.js').parsers;

var renderer = require('./../renderer.js').render;

var dataset_struct = require('./struct.js').struct;

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
			'growingSeason': { config: 'growingSeason', lang: 'growingSeason', data: 'ANS', set: 'slide'}, 
			'growingSeasonDays': { config: 'growingSeason', lang: 'growingSeasonDays', data: 'ANS', set: 'slide'}, 
			'growingSeasonFrostFirst': { config: 'growingSeasonFirst', lang: 'growingSeasonFrostFirst', data: 'ANS', set: 'slide'}, 
			'growingSeasonFrostLast': { config: 'growingSeasonLast', lang: 'growingSeasonFrostLast', data: 'ANS', set: 'slide'}, 
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
			'growingSeason': { config: 'growingSeason', lang: 'growingSeason', data: 'SMHI-Weather', set: 'slide' }, 
			'growingSeasonDays': { config: 'growingSeason', lang: 'growingSeasonDays', data: 'SMHI-Weather', set: 'slide'}, 
			'growingSeasonFrostFirst': { config: 'growingSeasonFirst', lang: 'growingSeasonFrostFirst', data: 'SMHI-Weather', set: 'slide'},
			'growingSeasonFrostLast': { config: 'growingSeasonLast', lang: 'growingSeasonFrostLast', data: 'SMHI-Weather', set: 'slide'}, 
			'slideTemperature': { config: 'temperature', lang: 'slideTemperature', data: 'SMHI-Weather', set: 'slide' }, 
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
