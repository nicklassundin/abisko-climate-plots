var $ = require('jquery')
const Papa = require('papaparse');
const parse = require('../stats.js').parsers;
const help = require('../helpers.js')

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
	var id = param.get('id');
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

global.buildChart = function(doc, id, reset=false){
	var call = function(id){
		return new Promise(function(resolve,reject){
			try{
				resolve(true);
				doc.appendChild(rendF[id].html(debug, doc));	
				rendF[id].func(reset);
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
			config['zonal'].init('temperatureDifference1','64n-90n')
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
			config['zonal'].init('temperatureDifference2','nhem');
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
			config['zonal'].init('temperatureDifference3', 'glob');
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
			config['tornetrask'].init('abiskoLakeIce')
		},
		html: function(debug=false, doc){
			var no = 43;
			if(!debug) no = debug;
			return createDiv('abiskoLakeIce', no);

		},
	}, 
	'abiskoLakeIceTime':{
		func: function(reset=false){
			config['tornetrask_iceTime'].contFunc(reset);
			config['tornetrask_iceTime'].init('abiskoLakeIceTime')
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
	'yearlyPrecipitation': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('yearlyPrecipitation', ['precipitation','yrly'])
		},
		html: function(debug=false, doc){
			var no = 23;
			if(!debug) no = debug;
			return createDiv('yearlyPrecipitation', no);

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
	'summerPrecipitationDifference': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('summerPrecipitationDifference', ['precipitation','summer'], ['precipitation','difference']);
		},
		html: function(debug=false, doc){
			var no = 39;
			if(!debug) no = debug;
			return createDiv('summerPrecipitationDifference', no);

		},
	}, 
	'winterPrecipitationDifference': {
		func: function(reset=false){
			config[stationType].contFunc(reset);
			config[stationType].init('winterPrecipitationDifference', ['precipitation','winter'],['precipitation','difference']);
		},
		html: function(debug=false, doc){
			var no = 40;
			if(!debug) no = debug;
			return createDiv('winterPrecipitationDifference', no);

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
