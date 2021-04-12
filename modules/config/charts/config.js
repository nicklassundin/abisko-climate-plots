var $ = require('jquery')
const help = require('../../helpers.js')
var months = help.months;

var config = require('../dataset/config/config.js').config;
var createDiv = require('./struct.js').createDiv;

var rendF = {
	'temperature_64n90n': {
		func: function(reset=false){
			config['zonal'].contFunc(reset);
			config['zonal'].init('temperature_64n90n', '64n-90n')
		},
		html: function(doc){
			var no = 20;
			if(!variables.debug) no = variables.debug;
			return createDiv('temperature_64n90n', no);
		},
	},
	'temperature_nhem': {
		func: function(reset=false){
			config['zonal'].contFunc(reset);
			config['zonal'].init('temperature_nhem', 'nhem')
		},
		html: function(doc){
			var no = 21;
			if(!variables.debug) no = variables.debug;
			return createDiv('temperature_nhem', no);

		},
	},
	'temperature_glob': {
		func: function(reset=false){
			config['zonal'].contFunc(reset);
			config['zonal'].init('temperature_glob', 'glob')
		},
		html: function(doc){
			var no = 22;
			if(!variables.debug) no = variables.debug;
			return createDiv('temperature_glob', no);

		},
	},
	'arcticTemperatures': {
		func: function(reset=false){alert("PLACE HOLDER")}, 
		html: function(doc){
			var no = 16.1;
			if(!variables.debug) no = variables.debug;
			return createDiv('arcticTemperatures', no);

		},
	},
	'abiskoLakeIce':{
		func: function(reset=false){
			config['tornetrask'].contFunc(reset);
			config['tornetrask'].init('abiskoLakeIce', 'DOY')
		},
		html: function(doc){
			var no = 43;
			if(!variables.debug) no = variables.debug;
			return createDiv('abiskoLakeIce', no);

		},
	}, 
	'abiskoLakeIceBreakup':{
		func: function(reset=false){
			config['tornetrask'].contFunc(reset);
			config['tornetrask'].init('abiskoLakeIceBreakup', ['DOY', 'breakup'], 'breakupDOY')
		},
		html: function(doc){
			var no = 43;
			if(!variables.debug) no = variables.debug;
			return createDiv('abiskoLakeIceBreakup', no);

		},
	}, 
	'abiskoLakeIceFreezeup':{
		func: function(reset=false){
			config['tornetrask'].contFunc(reset);
			config['tornetrask'].init('abiskoLakeIceFreezeup', ['DOY', 'freeze'], 'freezeDOY')
		},
		html: function(doc){
			var no = 43;
			if(!variables.debug) no = variables.debug;
			return createDiv('abiskoLakeIceFreezeup', no);

		},
	}, 
	'abiskoLakeIceTime':{
		func: function(reset=false){
			config['tornetrask'].contFunc(reset);
			config['tornetrask'].init('abiskoLakeIceTime', 'iceTime')
		},
		html: function(doc){
			var no = 43;
			if(!variables.debug) no = variables.debug;
			return createDiv('abiskoLakeIceTime', no);

		},
	},
	'slideLakeIceTime':{
		func: function(reset=false){
			config['tornetrask'].contFunc(reset);
			config['tornetrask'].init('slideLakeIceTime', 'iceTime', 'slideIceTime')
		},
		html: function(doc){
			var no = 43;
			if(!variables.debug) no = variables.debug;
			return createDiv('slideLakeIceTime', no);

		},
	},
	'iceThicknessYear': {
		func: function(reset=false){
			config['iceThick'].contFunc(reset);
			config['iceThick'].init('iceThicknessYear', ['yrly'], ['yrly', 'max'])
		},
		html: function(doc){
			var no = 43;
			if(!variables.debug) no = variables.debug;
			return createDiv('iceThicknessYear', no);
		},
	},
	'iceThicknessDate': {
		func: function(reset=false){
			config['iceThick'].contFunc(reset);
			config['iceThick'].init('iceThicknessDate', 'date')
		},
		html: function(doc){
			var no = 43;
			if(!variables.debug) no = variables.debug;
			return createDiv('iceThicknessDate', no);
		},
	},
	'abiskoSnowDepthPeriodMeans':{
		func: function(reset=false) {
			config['abiskoSnowDepth'].contFunc(reset);
			config['abiskoSnowDepth'].init("abiskoSnowDepthPeriodMeans", "periodMeans")
		},

		html: function(doc){
			var no = 41;
			if(!variables.debug) no = variables.debug;
			return createDiv('abiskoSnowDepthPeriodMeans', no)
		},
	},
	'abiskoSnowDepthPeriodMeans2':{
		func: function(reset=false) {
			config['abiskoSnowDepth'].contFunc(reset);
			config['abiskoSnowDepth'].init("abiskoSnowDepthPeriodMeans2","decadeMeans")
		},
		html: function(doc){
			var no = 42;
			if(!variables.debug) no = variables.debug;
			return createDiv('abiskoSnowDepthPeriodMeans2',no)
		},
	},
	'annualAvgSnowDepth':{
		func: function(reset=false) {
			config['abiskoSnowDepth'].contFunc(reset);
			config['abiskoSnowDepth'].init("yrlyAvgSnowDepth",["snowDepth", 'singleStake', 'yrly'], ['snowDepth', 'yrly'])
		},
		html: function(doc){
			var no = 42;
			if(!variables.debug) no = variables.debug;
			return createDiv('yrlyAvgSnowDepth',no)
		},
	},
	'slideTemperature':{
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('slideTemperature',['temperatures','yrly'], ['temperatures', 'yrlySlide']);
		},
		html: function(doc){
			var no = 1;
			if(!variables.debug) no = variables.debug;
			return createDiv('slideTemperature', no);
		},
	},
	'slideTemperaturesSummer': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('slideTemperaturesSummer', ['temperatures','summer'], ['temperatures', 'summerSlide']);
		},
		html: function(doc){
			var no = 2;
			if(!variables.debug) no = variables.debug;
			return createDiv('slideTemperaturesSummer', no);
		},
	}, 
	'slideTemperaturesAutumn': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('slideTemperaturesAutumn', ['temperatures','autumn'], ['temperatures', 'autumnSlide']);
		},
		html: function(doc){
			var no = 2;
			if(!variables.debug) no = variables.debug;
			return createDiv('slideTemperaturesAutumn', no);
		},
	}, 
	'slideTemperaturesSpring': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('slideTemperaturesSpring', ['temperatures','spring'], ['temperatures', 'springSlide']);
		},
		html: function(doc){
			var no = 2;
			if(!variables.debug) no = variables.debug;
			return createDiv('slideTemperaturesSpring', no);
		},
	}, 
	'slideTemperaturesWinter': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('slideTemperaturesWinter', ['temperatures','winter'], ['temperatures', 'winterSlide']);
		},
		html: function(doc){
			var no = 3;
			if(!variables.debug) no = variables.debug;
			return createDiv('slideTemperaturesWinter', no);

		},
	},
	'monthsTemperatures': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('monthsTemperatures', ['temperatures','monthly'], ['temperatures', 'months']);
		},
		html: function(doc){
			var no = 3;
			if(!variables.debug) no = variables.debug;
			return createDiv('monthsTemperatures', no);

		},
	},
	'slideMonthlyTemperatures': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('monthlyTemperatures', ['temperatures','monthly'], ['temperatures', 'monthlySlide'])
		},
		html: function(doc){
			var no = 4;
			var div = document.createElement("div");
			div.setAttribute("id","monthlyTemperatures");
			if(variables.debug){
				months().forEach((month, index) => {
					div.appendChild(createDiv('monthlyTemperatures_'+month, no+index))
				})

			}else{
				months().forEach((month, index) => {
					div.appendChild(createDiv('monthlyTemperatures_'+month));
				})

			}
			return div;

		},
	}, 
	'slidePrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('Precipitation', ['precipitation','yrly'], ['precipitation', 'yrlySlide'])
		},
		html: function(doc){
			var no = 23;
			if(!variables.debug) no = variables.debug;
			return createDiv('Precipitation', no);

		},
	}, 
	'slideAutumnPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('autumnPrecipitation', ['precipitation','autumn'], ['precipitation', 'autumnSlide'])
		},
		html: function(doc){
			var no = 24;
			if(!variables.debug) no = variables.debug;
			return createDiv('autumnPrecipitation', no);

		},
	}, 
	'slideSpringPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('springPrecipitation', ['precipitation','spring'], ['precipitation', 'springSlide'])
		},
		html: function(doc){
			var no = 24;
			if(!variables.debug) no = variables.debug;
			return createDiv('springPrecipitation', no);

		},
	}, 
	'slideSummerPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('summerPrecipitation', ['precipitation','summer'], ['precipitation', 'summerSlide'])
		},
		html: function(doc){
			var no = 24;
			if(!variables.debug) no = variables.debug;
			return createDiv('summerPrecipitation', no);

		},
	}, 
	'slideWinterPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('winterPrecipitation', ['precipitation','winter'], ['precipitation', 'winterSlide'])
		},
		html: function(doc){
			var no = 25;
			if(!variables.debug) no = variables.debug;
			return createDiv('winterPrecipitation', no);

		},
	}, 
	'slideMonthlyPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('monthlyPrecipitation', ['precipitation','monthly'], ['precipitation', 'monthlySlide'])
		},
		html: function(doc){
			var no = 26;
			var div = document.createElement('div');
			div.setAttribute("id", "monthlyPrecipitation")
			if(variables.debug){
				months().forEach((month, index) => {
					div.appendChild(createDiv('monthlyPrecipitation_'+month, no+index));
				})

			}else{
				months().forEach((month, index) => {
					div.appendChild(createDiv('monthlyPrecipitation_'+month))
				})

			}
			return div
		},
	}, 
	'Temperatures':{
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('Temperatures',['temperatures','yrly']);
		},
		html: function(doc){
			var no = 1;
			if(!variables.debug) no = variables.debug;
			return createDiv('Temperatures', no);
		},

	}, 
	'TemperaturesSummer': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('TemperaturesSummer', ['temperatures','summer']);
		},
		html: function(doc){
			var no = 2;
			if(!variables.debug) no = variables.debug;
			return createDiv('TemperaturesSummer', no);
		},
	}, 
	'TemperaturesAutumn': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('TemperaturesAutumn', ['temperatures','autumn']);
		},
		html: function(doc){
			var no = 2;
			if(!variables.debug) no = variables.debug;
			return createDiv('TemperaturesAutumn', no);
		},
	}, 
	'TemperaturesSpring': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('TemperaturesSpring', ['temperatures','spring']);
		},
		html: function(doc){
			var no = 2;
			if(!variables.debug) no = variables.debug;
			return createDiv('TemperaturesSpring', no);
		},
	}, 
	'TemperaturesWinter': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('TemperaturesWinter', ['temperatures','winter']);
		},
		html: function(doc){
			var no = 3;
			if(!variables.debug) no = variables.debug;
			return createDiv('TemperaturesWinter', no);

		},
	},
	'avgTemperaturesByYear':{
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('avgTemperaturesByYear',['temperatures'], ['temperatures', 'avgByYear']);
		},
		html: function(doc){
			var no = 1;
			if(!variables.debug) no = variables.debug;
			return createDiv('avgTemperaturesByYear', no);
		},

	}, 
	'temperatureDifference': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('temperatureDifference', ['temperatures','yrly'],['temperatures','difference'])
		},
		html: function(doc){
			var no = 19;
			if(!variables.debug) no = variables.debug;
			return createDiv('temperatureDifference', no);

		},
	},
	"dailyExtremeTemperature": {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('dailyExtremeTemperature', ['temperatures','yrly'],['temperatures','dailyExtreme'])
		},
		html: function(doc){
			var no = 19;
			if(!variables.debug) no = variables.debug;
			return createDiv('dailyExtremeTemperature', no);

		},
	},
	"weeklyExtremeTemperature": {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('weeklyExtremeTemperature', ['temperatures','weeks'],['temperatures','weeklyExtreme'])
		},
		html: function(doc){
			var no = 19;
			if(!variables.debug) no = variables.debug;
			return createDiv('weeklyExtremeTemperature', no);

		},
	},
	'monthlyTemperaturesPolar': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('monthlyTemperaturesPolar', ['temperatures', 'yrlyFull'], ["temperatures", "polar"])
		},
		html: function(doc){
			var no = 4;
			var div = document.createElement("div");
			div.setAttribute("id","monthlyTemperaturesPolar");
			div.appendChild(createDiv('monthlyTemperaturesPolar'))
			return div;

		},
	}, 
	'monthlyPrecipitationPolar': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('monthlyPrecipitationPolar', ['precipitation', 'yrlyFull'], ["precipitation", "polar"])
		},
		html: function(doc){
			var no = 4;
			var div = document.createElement("div");
			div.setAttribute("id","monthlyPrecipitationPolar");
			div.appendChild(createDiv('monthlyPrecipitationPolar'))
			return div;

		},
	}, 
	'monthlyTemperatures': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('monthlyTemperatures', ['temperatures','monthly'])
		},
		html: function(doc){
			var no = 4;
			var div = document.createElement("div");
			div.setAttribute("id","monthlyTemperatures");
			if(variables.debug){
				months().forEach((month, index) => {
					div.appendChild(createDiv('monthlyTemperatures_'+month, no+index))
				})

			}else{
				months().forEach((month, index) => {
					div.appendChild(createDiv('monthlyTemperatures_'+month));
				})

			}
			return div;

		},
	}, 
	'Precipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('Precipitation', ['precipitation','yrly'])
		},
		html: function(doc){
			var no = 23;
			if(!variables.debug) no = variables.debug;
			return createDiv('Precipitation', no);

		},
	}, 
	'autumnPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('autumnPrecipitation', ['precipitation','autumn'])
		},
		html: function(doc){
			var no = 24;
			if(!variables.debug) no = variables.debug;
			return createDiv('autumnPrecipitation', no);

		},
	}, 
	'springPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('springPrecipitation', ['precipitation','spring'])
		},
		html: function(doc){
			var no = 24;
			if(!variables.debug) no = variables.debug;
			return createDiv('springPrecipitation', no);

		},
	}, 
	'summerPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('summerPrecipitation', ['precipitation','summer'])
		},
		html: function(doc){
			var no = 24;
			if(!variables.debug) no = variables.debug;
			return createDiv('summerPrecipitation', no);

		},
	}, 
	'winterPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('winterPrecipitation', ['precipitation','winter'])
		},
		html: function(doc){
			var no = 25;
			if(!variables.debug) no = variables.debug;
			return createDiv('winterPrecipitation', no);

		},
	}, 
	'annualPrecipitationDifference': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('annualPrecipitationDifference', ['precipitation','yrly'], ['precipitation','difference']);
		},
		html: function(doc){
			var no = 38;
			if(!variables.debug) no = variables.debug;
			return createDiv('annualPrecipitationDifference', no);

		},
	}, 
	"dailyExtremePrecipitation": {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('dailyExtremePrecipitation', ['precipitation','yrly'],['precipitation','dailyExtreme'])
		},
		html: function(doc){
			var no = 19;
			if(!variables.debug) no = variables.debug;
			return createDiv('dailyExtremePrecipitation', no);

		},
	},
	"weeklyExtremePrecipitation": {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('weeklyExtremePrecipitation', ['precipitation','weeks'],['precipitation','weeklyExtreme'])
		},
		html: function(doc){
			var no = 19;
			if(!variables.debug) no = variables.debug;
			return createDiv('weeklyExtremePrecipitation', no);

		},
	},
	'monthlyPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('monthlyPrecipitation', ['precipitation','monthly'])
		},
		html: function(doc){
			var no = 26;
			var div = document.createElement('div');
			div.setAttribute("id", "monthlyPrecipitation")
			if(variables.debug){
				months().forEach((month, index) => {
					div.appendChild(createDiv('monthlyPrecipitation_'+month, no+index));
				})

			}else{
				months().forEach((month, index) => {
					div.appendChild(createDiv('monthlyPrecipitation_'+month))
				})

			}
			return div
		},
	}, 
	'growingSeasonFrostFirst': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('growingSeasonFirst', ['growingSeason', 'first'])
		},
		html: function(doc){
			var no = 18;
			if(!variables.debug) no = variables.debug;
			return createDiv('growingSeasonFirst', no);

		}
	},
	'growingSeasonFrostLast': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('growingSeasonLast', ['growingSeason', 'last'])
		},
		html: function(doc){
			var no = 18;
			if(!variables.debug) no = variables.debug;
			return createDiv('growingSeasonLast', no);

		}
	},
	'growingSeasonDays': {
		func: function(reset=false){

			config[stationType].contFunc(reset);
			config[stationType].init('growingSeasonDays', ['growingSeason', 'days'])
		},
		html: function(doc){
			var no = 18;
			if(!variables.debug) no = variables.debug;
			return createDiv('growingSeasonDays', no);

		}
	},
	'growingSeason': {
		func: function(reset=false){

			config[stationType].contFunc(reset);
			config[stationType].init('growingSeason', ['growingSeason', 'weeks'])
		},
		html: function(doc){
			var no = 18;
			if(!variables.debug) no = variables.debug;
			return createDiv('growingSeason', no);

		}
	},
	'weeklyCO2': {
		func: function(reset=false){
			config['weeklyCO2'].contFunc(reset);
			config['weeklyCO2'].init('weeklyCO2', 'weekly')
		},
		html: function(doc){
			var no = 44;
			if(!variables.debug) no = variables.debug;
			return createDiv('weeklyCO2', no);
		}
	},
	'permaHistogramCALM': {
		func: function(reset=false){
			config['permaHistogramCALM'].contFunc(reset);
			config['permaHistogramCALM'].init('permaHistogramCALM','')
		},
		html: function(doc){
			var no = 45;
			if(!variables.debug) no = variables.debug;
			return createDiv("permaHistogramCALM", no);
		}
	}
}
exports.rendF = rendF;

exports.ids = Object.keys(rendF);
