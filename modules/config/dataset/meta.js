var $ = require('jquery')

const Papa = require('papaparse');
const parse = require('../../stats/config.js').parsers;
const preset = require('./config.json');
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

exports.getMeta = function(src, parser){
	return meta_struct.create({
		'temperatures': {
			'yrly': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data = src, set =  'weather'), 
			'summer': meta_struct.create(config =  'temperature', lang =  'summerTemperature', data = src, set =  'weather'),  
			'winter': meta_struct.create(config =  'temperature', lang =  'winterTemperature', data = src, set =  'weather'), 
			'autumn': meta_struct.create(config =  'temperature', lang =  'autumnTemperature', data = src, set =  'weather'), 
			'spring': meta_struct.create(config =  'temperature', lang =  'springTemperature', data = src, set =  'weather'), 
			'monthly': meta_struct.create(config =  'temperature', lang =  'monthlyTemperature', data = src, set = 'weather', subSet = 'monthly'),
			//TODO
			'months': meta_struct.create(config =  'temperature', lang =  'monthlyTemperature', data = src, set = 'slide', subSet = 'monthSet'), 
			// END
			'difference': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data = src, set =  'climate'), 
			'dailyExtreme': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data = src , set =  'extremeDay'), 
			'weeklyExtreme': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data = src , set =  'extremeWeek'), 
			'polar': meta_struct.create(config =  undefined, lang =  undefined, data = src), 
			'yrlySlide': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data = src, set =  'slide'), 
			'summerSlide': meta_struct.create(config =  'temperature', lang =  'summerTemperature', data = src, set =  'slide'),  
			'winterSlide': meta_struct.create(config =  'temperature', lang =  'winterTemperature', data = src, set =  'slide'), 
			'autumnSlide': meta_struct.create(config =  'temperature', lang =  'autumnTemperature', data = src, set =  'slide'), 
			'springSlide': meta_struct.create(config =  'temperature', lang =  'springTemperature', data = src, set =  'slide'), 
			'monthlySlide': meta_struct.create(config =  'temperature', lang =  'monthlyTemperature', data = src, set = 'slide',  subSet = 'monthly')
		},
		'precipitation':{
			'yrly': meta_struct.create(config =  'precipitation', lang =  'yrlyPrecipitation', data = src , set =  'weather'), 
			'summer': meta_struct.create(config =  'precipitation', lang =  'summerPrecipitation', data = src, set =  'weather'), 
			'spring': meta_struct.create(config =  'precipitation', lang =  'springPrecipitation', data = src, set =  'weather'), 
			'winter': meta_struct.create(config =  'precipitation', lang =  'winterPrecipitation', data = src, set =  'weather'), 
			'autumn': meta_struct.create(config =  'precipitation', lang =  'autumnPrecipitation', data = src, set =  'weather'), 
			'monthly': meta_struct.create(config =  'precipitation', lang =  'monthlyPrecipitation', data = src, set = 'weather', subSet = 'monthly'),
			'difference': meta_struct.create(config =  'precipitation', lang =  'yrlyPrecipitation', data = src, set =  'climate'), 
			'dailyExtreme': meta_struct.create(config =  'precipitation', lang =  'yrlyPrecipitation', data = src , set =  'extremeDay'), 
			'weeklyExtreme': meta_struct.create(config =  'precipitation', lang =  'yrlyPrecipitation', data = src , set =  'extremeWeek'), 
			'polar': meta_struct.create(config =  undefined, lang =  undefined), 
			'yrlySlide': meta_struct.create(config =  'precipitation', lang =  'yrlyPrecipitation', data = src , set =  'slide'), 
			'summerSlide': meta_struct.create(config =  'precipitation', lang =  'summerPrecipitation', data = src, set =  'slide'), 
			'springSlide': meta_struct.create(config =  'precipitation', lang =  'springPrecipitation', data = src, set =  'slide'), 
			'winterSlide': meta_struct.create(config =  'precipitation', lang =  'winterPrecipitation', data = src, set =  'slide'), 
			'autumnSlide': meta_struct.create(config =  'precipitation', lang =  'autumnPrecipitation', data = src, set =  'slide'), 
			'monthlySlide': meta_struct.create(config =  'precipitation', lang =  'monthlyPrecipitation', data = src, set = 'slide', subSet = 'monthly'), 
		},
		'growingSeason': {
			'weeks': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data =src, set = 'weatherWeeks'), 
			'days': meta_struct.create(config =  'growingSeason', lang =  'growingSeason', data =src, set = 'weatherDays'), 
			'first': meta_struct.create(config =  'growingSeasonFirst', lang =  'growingSeasonFrostFirst', data =src, set = 'slide'), 
			'last': meta_struct.create(config =  'growingSeasonLast', lang =  'growingSeasonFrostLast', data =src, set = 'slide'), 
		},
		'slideTemperature': meta_struct.create(config =  'temperature', lang =  'yrlyTemperature', data = src, set =  'slide'), 
		"ice": {
			"DOY": meta_struct.create(config = 'ice', lang = 'ice', data =  src, set =  'weather'),
		}
	}, parse[parser])
}
