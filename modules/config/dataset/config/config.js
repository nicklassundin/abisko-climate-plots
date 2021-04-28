var $ = require('jquery')

const Papa = require('papaparse');
const parse = require('../../../stats/config.js').parsers;
const preset = require('./help.js') 

var pres = preset.preset; 


var renderer = require('./../../renderer.js').render;

var dataset_struct = require('./../struct.js').struct;



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
		pres('zonal'),
		meta = {
			'64n-90n': meta_struct.create(config = 'temperature', lang = '64n-90n_Temperature', data = 'NASA-GISS-TEMP', set = 'climate'), 
			'nhem': meta_struct.create(config =  'temperature', lang =  'nhem_Temperature', data =  'NASA-GISS-TEMP', set =  'climate'), 
			'glob': meta_struct.create(config =  'temperature', lang =  'glob_Temperature', data =  'NASA-GISS-TEMP', set =  'climate'), 
		}),
	abisko: dataset_struct.create(
		pres('abisko'),
		meta = {
			'temperatures': {
				'yrly': meta_struct.create(config =  'temperature', lang =  'annualTemperature', data =  'ANS', set =  'weather'), 
				'summer': meta_struct.create(config =  'temperature', lang =  'summerTemperature', data =  'ANS', set =  'weather'),  
				'winter': meta_struct.create(config =  'temperature', lang =  'winterTemperature', data =  'ANS', set =  'weather'), 
				'autumn': meta_struct.create(config =  'temperature', lang =  'autumnTemperature', data =  'ANS', set =  'weather'), 
				'spring': meta_struct.create(config =  'temperature', lang =  'springTemperature', data =  'ANS', set =  'weather'), 
				'monthly': meta_struct.create(config =  'temperature', lang =  'monthlyTemperature', data =  'ANS', set = 'weather', subSet = 'monthly'),
				//TODO
				'months': meta_struct.create(config =  'temperature', lang =  'monthlyTemperature', data =  'ANS', set = 'slide', subSet = 'monthSet'), 
				// END
				'difference': meta_struct.create(config =  'temperature', lang =  'annualTemperature', data =  'ANS', set =  'climate'), 
				'dailyExtreme': meta_struct.create(config =  'temperature', lang =  'annualTemperature', data =  'ANS' , set =  'extremeDay'), 
				'weeklyExtreme': meta_struct.create(config =  'temperature', lang =  'annualTemperature', data =  'ANS' , set =  'extremeWeek'), 
				'polar': meta_struct.create(config =  undefined, lang =  undefined, data =  'ANS'), 
				'yrlySlide': meta_struct.create(config =  'temperature', lang =  'annualTemperature', data =  'ANS', set =  'slide'), 
				'summerSlide': meta_struct.create(config =  'temperature', lang =  'summerTemperature', data =  'ANS', set =  'slide'),  
				'winterSlide': meta_struct.create(config =  'temperature', lang =  'winterTemperature', data =  'ANS', set =  'slide'), 
				'autumnSlide': meta_struct.create(config =  'temperature', lang =  'autumnTemperature', data =  'ANS', set =  'slide'), 
				'springSlide': meta_struct.create(config =  'temperature', lang =  'springTemperature', data =  'ANS', set =  'slide'), 
				'monthlySlide': meta_struct.create(config =  'temperature', lang =  'monthlyTemperature', data =  'ANS', set = 'slide',  subSet = 'monthly'),
				'avgByYear': meta_struct.create(config =  'temperature', lang =  'annualTemperature', data =  'ANS', set =  'select'), 
			},
			'precipitation':{
				'yrly': meta_struct.create(config =  'precipitation', lang =  'annualPrecipitation', data =  'ANS' , set =  'weather'), 
				'summer': meta_struct.create(config =  'precipitation', lang =  'summerPrecipitation', data =  'ANS', set =  'weather'), 
				'spring': meta_struct.create(config =  'precipitation', lang =  'springPrecipitation', data =  'ANS', set =  'weather'), 
				'winter': meta_struct.create(config =  'precipitation', lang =  'winterPrecipitation', data =  'ANS', set =  'weather'), 
				'autumn': meta_struct.create(config =  'precipitation', lang =  'autumnPrecipitation', data =  'ANS', set =  'weather'), 
				'monthly': meta_struct.create(config =  'precipitation', lang =  'monthlyPrecipitation', data =  'ANS', set = 'weather', subSet = 'monthly'),
				'difference': meta_struct.create(config =  'precipitation', lang =  'annualPrecipitation', data =  'ANS', set =  'climate'), 
				'dailyExtreme': meta_struct.create(config =  'precipitation', lang =  'annualPrecipitation', data =  'ANS' , set =  'extremeDay'), 
				'weeklyExtreme': meta_struct.create(config =  'precipitation', lang =  'annualPrecipitation', data =  'ANS' , set =  'extremeWeek'), 
				'polar': meta_struct.create(config =  undefined, lang =  undefined), 
				'yrlySlide': meta_struct.create(config =  'precipitation', lang =  'annualPrecipitation', data =  'ANS' , set =  'slide'), 
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
				'diffWeeks': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data =  'ANS', set =  'climateWeeks'), 
				'diffDays': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data =  'ANS', set =  'climateDays'), 
				'slide': {
					'weeks': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data =  'ANS', set =  'slide'), 
					'days': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data =  'ANS', set =  'slide'), 
				}
			},
			'slideTemperature': meta_struct.create(config =  'temperature', lang =  'annualTemperature', data =  'ANS', set =  'slide'), 
		}),
	smhi: dataset_struct.create(
		pres('smhi'), 
		meta = {
			'temperatures': {
				'yrly': meta_struct.create(config =  'temperature', lang =  'annualTemperature', data = 'SMHI-Weather', set =  'weather'), 
				'summer': meta_struct.create(config =  'temperature', lang =  'summerTemperature', data = 'SMHI-Weather', set =  'weather'),  
				'winter': meta_struct.create(config =  'temperature', lang =  'winterTemperature', data = 'SMHI-Weather', set =  'weather'), 
				'autumn': meta_struct.create(config =  'temperature', lang =  'autumnTemperature', data = 'SMHI-Weather', set =  'weather'), 
				'spring': meta_struct.create(config =  'temperature', lang =  'springTemperature', data = 'SMHI-Weather', set =  'weather'), 
				'monthly': meta_struct.create(config =  'temperature', lang =  'monthlyTemperature', data = 'SMHI-Weather', set =  'weather', subset = 'monthly'), 
				//TODO
				'months': meta_struct.create(config =  'temperature', lang =  'monthlyTemperature', data = 'SMHI-Weather', set = 'slide', subset = 'monthSet'), 
				// END
				'difference': meta_struct.create(config =  'temperature', lang =  'annualTemperature', data = 'SMHI-Weather', set =  'climate'), 
				'dailyExtreme': meta_struct.create(config =  'temperature', lang =  'annualTemperature', data = 'SMHI-Weather' , set =  'extremeDay'), 
				'weeklyExtreme': meta_struct.create(config =  'temperature', lang =  'annualTemperature', data = 'SMHI-Weather' , set =  'extremeWeek'), 
				// 'polar': meta_struct.create(config =  undefined, lang =  undefined, data =  'SMHI-Weather'), 
				'yrlySlide': meta_struct.create(config =  'temperature', lang =  'annualTemperature', data =  'ANS', set =  'slide'), 
				'summerSlide': meta_struct.create(config =  'temperature', lang =  'summerTemperature', data =  'SMHI-Weather', set =  'slide'),  
				'winterSlide': meta_struct.create(config =  'temperature', lang =  'winterTemperature', data =  'SMHI-Weather', set =  'slide'), 
				'autumnSlide': meta_struct.create(config =  'temperature', lang =  'autumnTemperature', data =  'SMHI-Weather', set =  'slide'), 
				'springSlide': meta_struct.create(config =  'temperature', lang =  'springTemperature', data =  'SMHI-Weather', set =  'slide'), 
				'monthlySlide': meta_struct.create(config =  'temperature', lang =  'monthlyTemperature', data =  'SMHI-Weather', set = 'slide', subSet = 'monthly'), 
				'avgByYear': meta_struct.create(config =  'temperature', lang =  'annualTemperature', data =  'SMHI-Weather', set = 'select'), 
			},
			'precipitation':{
				'yrly': meta_struct.create(config =  'precipitation', lang =  'annualPrecipitation', data =  'SMHI-Hydrology' , set =  'weather'), 
				'summer': meta_struct.create(config =  'precipitation', lang =  'summerPrecipitation', data =  'SMHI-Hydrology', set =  'weather'), 
				'spring': meta_struct.create(config =  'precipitation', lang =  'springPrecipitation', data =  'SMHI-Hydrology', set =  'weather'), 
				'winter': meta_struct.create(config =  'precipitation', lang =  'winterPrecipitation', data =  'SMHI-Hydrology', set =  'weather'), 
				'autumn': meta_struct.create(config =  'precipitation', lang =  'autumnPrecipitation', data =  'SMHI-Hydrology', set =  'weather'), 
				'monthly': meta_struct.create(config =  'precipitation', lang =  'monthlyPrecipitation', data =  'SMHI-Hydrology' , set = 'weather', subSet = 'monthly'), 
				'difference': meta_struct.create(config =  'precipitation', lang =  'annualPrecipitation', data =  'SMHI-Hydrology', set =  'climate'), 
				'dailyExtreme': meta_struct.create(config =  'precipitation', lang =  'annualPrecipitation', data =  'SMHI-Hydrology' , set =  'extremeDay'), 
				'weeklyExtreme': meta_struct.create(config =  'precipitation', lang =  'annualPrecipitation', data =  'SMHI-Hydrology' , set =  'extremeWeek'), 
				'polar': meta_struct.create(config =  undefined, lang =  undefined), 
				'yrlySlide': meta_struct.create(config =  'precipitation', lang =  'annualPrecipitation', data =  'SMHI-Hydrology' , set =  'slide'), 
				'summerSlide': meta_struct.create(config =  'precipitation', lang =  'summerPrecipitation', data =  'SMHI-Hydrology', set =  'slide'), 
				'springSlide': meta_struct.create(config =  'precipitation', lang =  'springPrecipitation', data =  'SMHI-Hydrology', set =  'slide'), 
				'winterSlide': meta_struct.create(config =  'precipitation', lang =  'winterPrecipitation', data =  'SMHI-Hydrology', set =  'slide'), 
				'autumnSlide': meta_struct.create(config =  'precipitation', lang =  'autumnPrecipitation', data =  'SMHI-Hydrology', set =  'slide'), 
				'monthlySlide': meta_struct.create(config =  'precipitation', lang =  'monthlyPrecipitation', data =  'SMHI-Hydrology' , set = 'slide', subSet = 'monthly'), 
			},
			'growingSeason': {
				'weeks': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data =  'SMHI-Weather', set =  'weatherWeeks'), 
				'days': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data =  'SMHI-Weather', set =  'weatherDays'), 
				'first': meta_struct.create(config =  'growingSeasonFirst', lang =  'growingSeasonFrostFirst', data =  'SMHI-Weather', set =  'slide'), 
				'last': meta_struct.create(config =  'growingSeasonLast', lang =  'growingSeasonFrostLast', data = 'SMHI-Weather', set =  'slide'), 
				'diffWeeks': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data =  'SMHI-Weather', set =  'climateWeeks'), 
				'diffDays': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data =  'SMHI-Weather', set =  'climateDays'), 
				'slide': {
					'weeks': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data =  'SMHI-Weather', set =  'slide'), 
					'days': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data =  'SMHI-Weather', set =  'slide'), 
				}
			},
			'slideTemperature': meta_struct.create(config =  'temperature', lang =  'annualTemperature', data =  'SMHI-Weather', set =  'slide'), 
		}),
	// TODO Bake together
	tornetrask: dataset_struct.create(
		pres('tornetrask'),
		meta = {
			DOY: meta_struct.create(config =  'ice', lang =  'ice', data =  'ANS', set =  'weather'),
			breakupDOY: meta_struct.create(config =  'iceBreakup', lang =  'iceBreakup', data =  'ANS', set =  'weather'),
			freezeDOY: meta_struct.create(config =  'iceFreeze', lang =  'iceFreeze', data =  'ANS', set =  'weather'),
			iceTime: meta_struct.create(config =  'iceTime', lang =  'iceTime', data =  'ANS', set =  'weather'),
			slideIceTime: meta_struct.create(config =  'iceTime', lang =  'iceTime', data =  'ANS', set =  'slide'),
			difference: meta_struct.create(config =  'iceTime', lang =  'iceTime', data =  'ANS', set =  'climate'),
		}),
	abiskoSnowDepth: dataset_struct.create(
		pres('abiskoSnowDepth'),
		meta = {
			'periodMeans': meta_struct.create(config =  'snowDepthPeriod', lang =  'snowDepthPeriod', data =  'ANS', set =  'weather'),
			'decadeMeans': meta_struct.create(config =  'snowDepthDecade', lang =  'snowDepthDecade', data =  'ANS', set =  'weather'),
			'snowDepth': {
				'yrly': meta_struct.create(config =  'avgSnowDepth', lang =  'annualAvgSnowDepth', data =  'ANS', set =  'slide'),
			}
		}),
	weeklyCO2: dataset_struct.create(
		pres('weeklyCO2'),
		meta = {
			'weekly': meta_struct.create(config =  'co2', lang =  'co2_weekly', data =  'Scipps-CO2', set =  'weather'),
			'monthly': meta_struct.create(config =  'co2', lang =  'co2_monthly', data =  'Scipps-CO2', set =  'weather'),
		}),
	permaHistogramCALM: dataset_struct.create(
		pres('permaHistogramCALM'),
		meta = meta_struct.create(config =  'perma', lang =  'perma', data =  'GTNP-ANL', set =  'weather' )),
	iceThick: dataset_struct.create(
		pres('iceThick'),
		meta = {
			'yrly': {
				'max': meta_struct.create(config =  'iceThick', lang =  'iceThick', data =  'ANS', set =  'weather'),
			}, 
			'date': meta_struct.create(config =  'iceThickDate', lang =  'iceThickDate', data =  'ANS', set =  'weather'),
		})
}
exports.config = config;

exports.ids = Object.keys(config);
