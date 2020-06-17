var $ = require('jquery')
const Papa = require('papaparse');
const parse = require('../stats.js').parsers;
const help = require('../helpers.js')

// var React = require('react');
// var reactSwipeableViews = require("react-swipeable-views")

// import React from 'react';
// import SwipeableViews from 'react-swipeable-views';

global.urlParams = new URLSearchParams(window.location.search);
var months = help.months;

global.selectText = function(e){
	if(e === document.activeElement){
		e.blur();
	}else{
		e.focus();
		e.select();
	}
};

global.copy = function() {
	var body = doc,
		html = document.documentElement;
	var height = Math.max( body.scrollHeight, body.offsetHeight, 
		html.clientHeight, html.scrollHeight, html.offsetHeight );
	var href = (""+window.location).split('share=true').join('share=false');
	input.setAttribute('value', "<iframe src='"+href+"' width='100%' height='"+height+"' frameBorder=''0'></iframe>") // TODO ifram
	var copyText = document.getElementById("input");
	copyText.select();
	document.execCommand("copy");
	alert(copyText.value);
}


var config = require('./dataset.js').config;
global.getID = function(param=urlParams){
	var id = param.get('set');
	if(id){
		id = id.split(',');
	}else{
		id = charts.ids;
	}
	return id
}

var createDiv = function(id, no=null){
	var div = document.createElement('div');
	div.setAttribute("id",id);
	var overlay = document.createElement('div');
	overlay.setAttribute("id", id+"overlay");
	overlay.setAttribute("class","overlay");
	var fig = document.createElement('figure');
	if(no){
		var remove = getID().filter(each => each!=id.split('_')[0]);
		if(remove){
			var del = document.createElement('a');
			del.setAttribute('href', getUrl(uid=remove))
			del.innerHTML = 'remove ';
			fig.appendChild(del);
		}

		var a = document.createElement('a');
		a.innerHTML = 'no: '+no;
		fig.appendChild(a);

		var aID = document.createElement('a');
		aID.innerHTML = ' id: '+id;
		fig.appendChild(aID);
	}
	fig.appendChild(div);
	fig.appendChild(overlay);
	return fig
}

global.buildChart = function(doc, ids, reset=false){
	var call = function(id){
		return new Promise(function(resolve,reject){
			try{
				doc.appendChild(rendF[id].html(false, doc));	
				rendF[id].func(reset);
				resolve(true);
			}catch(err){
				reject(err)
			}
		})
	}

	var sequence = function(array){
		var target = array.shift();
		if(target){
			call(target).then(function(){
				sequence(array);
			}).catch(function(err){
				// TODO Improve quality
				var div = document.createElement("div");
				div.innerHTML = "[PLACEHOLDER ERROR] - Sorry we couldn't deliver the graph you deserved, if you have block adder on try turning in off. "
				var error = document.createElement("div");
				error.innerHTML = err;
				doc.appendChild(div)
				doc.appendChild(error)
				console.log("failed to render: "+target)
				throw error
			})
		}
	};	
	var debug = urlParams.get('debug');
	if(!Array.isArray(ids)) ids = [ids];
	sequence(ids)

	if(urlParams.get('share')=='true'){
		var input = document.createElement("input");
		input.setAttribute('id', 'input');
		input.setAttribute('type', 'text');
		var body = doc;
		var html = document.documentElement;
		var height = Math.max( body.scrollHeight, body.offsetHeight, 
			html.clientHeight, html.scrollHeight, html.offsetHeight );
		input.setAttribute('value', "<iframe src='"+window.location+"&share=false"+"' width='100%' height='"+height+"'></iframe>") // TODO ifram
		doc.appendChild(input);
		var cp = document.createElement("button");
		cp.innerHTML = 'Copy link';
		cp.setAttribute('onclick', "copy()");
		doc.appendChild(cp);
	}
	// disable context menu TODO event handler maybe
	doc.oncontextmenu = function(){
		return false;
	};
	return doc
}

var rendF = {
	'temperatureDifference1': {
		func: function(reset=false){
			config['zonal'].contFunc(reset);
			config['zonal'].init('temperatureDifference1', '64n-90n')
		},
		html: function(debug=false, doc){
			var no = 20;
			if(!debug) no = debug;
			return createDiv('temperatureDifference1', no);
		},
	},
	'temperatureDifference2': {
		func: function(reset=false){
			config['zonal'].contFunc(reset);
			config['zonal'].init('temperatureDifference2', 'nhem')
		},
		html: function(debug=false, doc){
			var no = 21;
			if(!debug) no = debug;
			return createDiv('temperatureDifference2', no);

		},
	},
	'temperatureDifference3': {
		func: function(reset=false){
			config['zonal'].contFunc(reset);
			config['zonal'].init('temperatureDifference3', 'glob')
		},
		html: function(debug=false, doc){
			var no = 22;
			if(!debug) no = debug;
			return createDiv('temperatureDifference3', no);

		},
	},
	'arcticTemperatures': {
		func: function(reset=false){alert("PLACE HOLDER")}, 
		html: function(debug=false, doc){
			var no = 16.1;
			if(!debug) no = debug;
			return createDiv('arcticTemperatures', no);

		},
	},
	'abiskoLakeIce':{
		func: function(reset=false){
			config['tornetrask'].contFunc(reset);
			config['tornetrask'].init('abiskoLakeIce', 'DOY')
		},
		html: function(debug=false, doc){
			var no = 43;
			if(!debug) no = debug;
			return createDiv('abiskoLakeIce', no);

		},
	}, 
	'abiskoLakeIceBreakup':{
		func: function(reset=false){
			config['tornetrask'].contFunc(reset);
			config['tornetrask'].init('abiskoLakeIceBreakup', ['DOY', 'breakup'], 'breakupDOY')
		},
		html: function(debug=false, doc){
			var no = 43;
			if(!debug) no = debug;
			return createDiv('abiskoLakeIceBreakup', no);

		},
	}, 
	'abiskoLakeIceFreezeup':{
		func: function(reset=false){
			config['tornetrask'].contFunc(reset);
			config['tornetrask'].init('abiskoLakeIceFreezeup', ['DOY', 'freeze'], 'freezeDOY')
		},
		html: function(debug=false, doc){
			var no = 43;
			if(!debug) no = debug;
			return createDiv('abiskoLakeIceFreezeup', no);

		},
	}, 
	'abiskoLakeIceTime':{
		func: function(reset=false){
			config['tornetrask'].contFunc(reset);
			config['tornetrask'].init('abiskoLakeIceTime', 'iceTime')
		},
		html: function(debug=false, doc){
			var no = 43;
			if(!debug) no = debug;
			return createDiv('abiskoLakeIceTime', no);

		},
	},
	'iceThicknessYear': {
		func: function(reset=false){
			config['iceThick'].contFunc(reset);
			config['iceThick'].init('iceThicknessYear', 'yrly')
		},
		html: function(debug=false, doc){
			var no = 43;
			if(!debug) no = debug;
			return createDiv('iceThicknessYear', no);
		},
	},
	'iceThicknessDate': {
		func: function(reset=false){
			config['iceThick'].contFunc(reset);
			config['iceThick'].init('iceThicknessDate', 'date')
		},
		html: function(debug=false, doc){
			var no = 43;
			if(!debug) no = debug;
			return createDiv('iceThicknessDate', no);
		},
	},
	'abiskoSnowDepthPeriodMeans':{
		func: function(reset=false) {
			config['abiskoSnowDepth'].contFunc(reset);
			config['abiskoSnowDepth'].init("abiskoSnowDepthPeriodMeans", "periodMeans")
		},

		html: function(debug=false, doc){
			var no = 41;
			if(!debug) no = debug;
			return createDiv('abiskoSnowDepthPeriodMeans', no)
		},
	},
	'abiskoSnowDepthPeriodMeans2':{
		func: function(reset=false) {
			config['abiskoSnowDepth'].contFunc(reset);
			config['abiskoSnowDepth'].init("abiskoSnowDepthPeriodMeans2","decadeMeans")
		},
		html: function(debug=false, doc){
			var no = 42;
			if(!debug) no = debug;
			return createDiv('abiskoSnowDepthPeriodMeans2',no)
		},
	},
	'yrlyAvgSnowDepth':{
		func: function(reset=false) {
			config['abiskoSnowDepth'].contFunc(reset);
			config['abiskoSnowDepth'].init("yrlyAvgSnowDepth",["snowDepth", 'singleStake', 'yrly'], ['snowDepth', 'yrly'])
		},
		html: function(debug=false, doc){
			var no = 42;
			if(!debug) no = debug;
			return createDiv('yrlyAvgSnowDepth',no)
		},
	},
	'slideTemperature':{
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('slideTemperature',['temperatures','yrly'], ['temperatures', 'yrlySlide']);
		},
		html: function(debug=false, doc){
			var no = 1;
			if(!debug) no = debug;
			return createDiv('slideTemperature', no);
		},
	},
	'slideTemperaturesSummer': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('TemperaturesSummer', ['temperatures','summer'], ['temperatures', 'summerSlide']);
		},
		html: function(debug=false, doc){
			var no = 2;
			if(!debug) no = debug;
			return createDiv('TemperaturesSummer', no);
		},
	}, 
	'slideTemperaturesAutumn': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('TemperaturesAutumn', ['temperatures','autumn'], ['temperatures', 'autumnSlide']);
		},
		html: function(debug=false, doc){
			var no = 2;
			if(!debug) no = debug;
			return createDiv('TemperaturesAutumn', no);
		},
	}, 
	'slideTemperaturesSpring': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('TemperaturesSpring', ['temperatures','spring'], ['temperatures', 'springSlide']);
		},
		html: function(debug=false, doc){
			var no = 2;
			if(!debug) no = debug;
			return createDiv('TemperaturesSpring', no);
		},
	}, 
	'slideTemperaturesWinter': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('TemperaturesWinter', ['temperatures','winter'], ['temperatures', 'winterSlide']);
		},
		html: function(debug=false, doc){
			var no = 3;
			if(!debug) no = debug;
			return createDiv('TemperaturesWinter', no);

		},
	},
	'slideMonthlyTemperatures': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('monthlyTemperatures', ['temperatures','monthly'], ['temperatures', 'monthlySlide'])
		},
		html: function(debug=false, doc){
			var no = 4;
			var div = document.createElement("div");
			div.setAttribute("id","monthlyTemperatures");
			if(debug){
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
		html: function(debug=false, doc){
			var no = 23;
			if(!debug) no = debug;
			return createDiv('Precipitation', no);

		},
	}, 
	'slideAutumnPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('autumnPrecipitation', ['precipitation','autumn'], ['precipitation', 'autumnSlide'])
		},
		html: function(debug=false, doc){
			var no = 24;
			if(!debug) no = debug;
			return createDiv('autumnPrecipitation', no);

		},
	}, 
	'slideSpringPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('springPrecipitation', ['precipitation','spring'], ['precipitation', 'springSlide'])
		},
		html: function(debug=false, doc){
			var no = 24;
			if(!debug) no = debug;
			return createDiv('springPrecipitation', no);

		},
	}, 
	'slideSummerPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('summerPrecipitation', ['precipitation','summer'], ['precipitation', 'summerSlide'])
		},
		html: function(debug=false, doc){
			var no = 24;
			if(!debug) no = debug;
			return createDiv('summerPrecipitation', no);

		},
	}, 
	'slideWinterPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('winterPrecipitation', ['precipitation','winter'], ['precipitation', 'winterSlide'])
		},
		html: function(debug=false, doc){
			var no = 25;
			if(!debug) no = debug;
			return createDiv('winterPrecipitation', no);

		},
	}, 
	'slideMonthlyPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('monthlyPrecipitation', ['precipitation','monthly'], ['precipitation', 'monthlySlide'])
		},
		html: function(debug=false, doc){
			var no = 26;
			var div = document.createElement('div');
			div.setAttribute("id", "monthlyPrecipitation")
			if(debug){
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
		html: function(debug=false, doc){
			var no = 1;
			if(!debug) no = debug;
			return createDiv('Temperatures', no);
		},

	}, 
	'TemperaturesSummer': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('TemperaturesSummer', ['temperatures','summer']);
		},
		html: function(debug=false, doc){
			var no = 2;
			if(!debug) no = debug;
			return createDiv('TemperaturesSummer', no);
		},
	}, 
	'TemperaturesAutumn': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('TemperaturesAutumn', ['temperatures','autumn']);
		},
		html: function(debug=false, doc){
			var no = 2;
			if(!debug) no = debug;
			return createDiv('TemperaturesAutumn', no);
		},
	}, 
	'TemperaturesSpring': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('TemperaturesSpring', ['temperatures','spring']);
		},
		html: function(debug=false, doc){
			var no = 2;
			if(!debug) no = debug;
			return createDiv('TemperaturesSpring', no);
		},
	}, 
	'TemperaturesWinter': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('TemperaturesWinter', ['temperatures','winter']);
		},
		html: function(debug=false, doc){
			var no = 3;
			if(!debug) no = debug;
			return createDiv('TemperaturesWinter', no);

		},
	},
	'temperatureDifference': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('temperatureDifference', ['temperatures','yrly'],['temperatures','difference'])
		},
		html: function(debug=false, doc){
			var no = 19;
			if(!debug) no = debug;
			return createDiv('temperatureDifference', no);

		},
	},
	"dailyExtremeTemperature": {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('dailyExtremeTemperature', ['temperatures','yrly'],['temperatures','dailyExtreme'])
		},
		html: function(debug=false, doc){
			var no = 19;
			if(!debug) no = debug;
			return createDiv('dailyExtremeTemperature', no);

		},
	},
	"weeklyExtremeTemperature": {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('weeklyExtremeTemperature', ['temperatures','weeks'],['temperatures','weeklyExtreme'])
		},
		html: function(debug=false, doc){
			var no = 19;
			if(!debug) no = debug;
			return createDiv('weeklyExtremeTemperature', no);

		},
	},
	'monthlyTemperaturesPolar': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('monthlyTemperaturesPolar', ['temperatures', 'yrlyFull'], ["temperatures", "polar"])
		},
		html: function(debug=false, doc){
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
		html: function(debug=false, doc){
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
		html: function(debug=false, doc){
			var no = 4;
			var div = document.createElement("div");
			div.setAttribute("id","monthlyTemperatures");
			if(debug){
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
		html: function(debug=false, doc){
			var no = 23;
			if(!debug) no = debug;
			return createDiv('Precipitation', no);

		},
	}, 
	'autumnPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('autumnPrecipitation', ['precipitation','autumn'])
		},
		html: function(debug=false, doc){
			var no = 24;
			if(!debug) no = debug;
			return createDiv('autumnPrecipitation', no);

		},
	}, 
	'springPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('springPrecipitation', ['precipitation','spring'])
		},
		html: function(debug=false, doc){
			var no = 24;
			if(!debug) no = debug;
			return createDiv('springPrecipitation', no);

		},
	}, 
	'summerPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('summerPrecipitation', ['precipitation','summer'])
		},
		html: function(debug=false, doc){
			var no = 24;
			if(!debug) no = debug;
			return createDiv('summerPrecipitation', no);

		},
	}, 
	'winterPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('winterPrecipitation', ['precipitation','winter'])
		},
		html: function(debug=false, doc){
			var no = 25;
			if(!debug) no = debug;
			return createDiv('winterPrecipitation', no);

		},
	}, 
	'yearlyPrecipitationDifference': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('yearlyPrecipitationDifference', ['precipitation','yrly'], ['precipitation','difference']);
		},
		html: function(debug=false, doc){
			var no = 38;
			if(!debug) no = debug;
			return createDiv('yearlyPrecipitationDifference', no);

		},
	}, 
	"dailyExtremePrecipitation": {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('dailyExtremePrecipitation', ['precipitation','yrly'],['precipitation','dailyExtreme'])
		},
		html: function(debug=false, doc){
			var no = 19;
			if(!debug) no = debug;
			return createDiv('dailyExtremePrecipitation', no);

		},
	},
	"weeklyExtremePrecipitation": {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('weeklyExtremePrecipitation', ['precipitation','weeks'],['precipitation','weeklyExtreme'])
		},
		html: function(debug=false, doc){
			var no = 19;
			if(!debug) no = debug;
			return createDiv('weeklyExtremePrecipitation', no);

		},
	},
	'monthlyPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('monthlyPrecipitation', ['precipitation','monthly'])
		},
		html: function(debug=false, doc){
			var no = 26;
			var div = document.createElement('div');
			div.setAttribute("id", "monthlyPrecipitation")
			if(debug){
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
			config[stationType].init('growingSeasonFirst', ['temperatures', 'yrlySplit'], 'growingSeasonFrostFirst')
		},
		html: function(debug=false, doc){
			var no = 18;
			if(!debug) no = debug;
			return createDiv('growingSeasonFirst', no);

		}
	},
	'growingSeasonFrostLast': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('growingSeasonLast', ['temperatures', 'yrlySplit'], 'growingSeasonFrostLast')
		},
		html: function(debug=false, doc){
			var no = 18;
			if(!debug) no = debug;
			return createDiv('growingSeasonLast', no);

		}
	},
	'growingSeasonDays': {
		func: function(reset=false){

			config[stationType].contFunc(reset);
			config[stationType].init('growingSeasonDays', 'growingSeasonDays')
		},
		html: function(debug=false, doc){
			var no = 18;
			if(!debug) no = debug;
			return createDiv('growingSeasonDays', no);

		}
	},
	'growingSeason': {
		func: function(reset=false){

			config[stationType].contFunc(reset);
			config[stationType].init('growingSeason', 'growingSeason')
		},
		html: function(debug=false, doc){
			var no = 18;
			if(!debug) no = debug;
			return createDiv('growingSeason', no);

		}
	},
	'weeklyCO2': {
		func: function(reset=false){
			config['weeklyCO2'].contFunc(reset);
			config['weeklyCO2'].init('weeklyCO2', 'weekly')
		},
		html: function(debug=false, doc){
			var no = 44;
			if(!debug) no = debug;
			return createDiv('weeklyCO2', no);
		}
	},
	'permaHistogramCALM': {
		func: function(reset=false){
			config['permaHistogramCALM'].contFunc(reset);
			config['permaHistogramCALM'].init('permaHistogramCALM','')
		},
		html: function(debug=false, doc){
			var no = 45;
			if(!debug) no = debug;
			return createDiv("permaHistogramCALM", no);
		}
	}
}
exports.rendF = rendF;

exports.ids = Object.keys(rendF);
