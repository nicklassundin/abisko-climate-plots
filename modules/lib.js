const Papa = require('../dep/papaparse.min.js');
const renders = require('./render.js');
const parse = require('./stats.js');

var monthlyFunc = (render) => function(id, title, src="") {
	var result = [];
	months().forEach((month, index) =>  
		result.push(render(id+"_"+month, title+" "+monthName(month))));	
	return function(data){
		result.forEach((func, index) => func(data[index+1+'']));	
	}
};

var dataset_struct = {
	src: undefined,
	file: undefined,
	preset: undefined,
	cached: {},
	rawData: {},
	parser: undefined, 
	render: undefined,
	reader: Papa.parse,
	contFunc: function(reset=false){	
		if(Object.keys(this.rawData).length > 0) return false
		if(reset) this.cached = {};
		if(this.rawData)
			var ref = this;
		this.file.forEach(file => {
			function data(file){
				addr = file; 
				return new Promise(function(resolve, reject){
					ref.preset.complete = function(result){
						resolve(ref.parser(result, ref.src));
					};
					ref.reader(url(file), ref.preset)
				}).catch(function(error){
					console.log("Failed to fetch data");
					console.log(error);
					var er_div = document.createElement("div");
					er_div.innerHTML = paste("Something went wrong, if you have adblocker try closing it, reload the page.    ERROR MESSAGE: ", error.message);	
					// document.getElementById(id).append(er_div);
					// TODO add to all relavent divs
				})
			};
			if(!this.rawData[file]) this.rawData[file] = data(file); 
		})
	},
	init: function(id, tag, renderTag=tag){
		// console.log(id)
		// console.log(tag)
		// console.log(this)
		var render = this.render;
		// console.log(this)
		var rawData = this.rawData;
		// console.log(rawData)	
		// var promise = path();
		var promise = rawData[Object.keys(rawData)[0]];
		// console.log(promise)

		new Promise(function(resolve, reject){
			if(tag) render = tagApply(render, renderTag);
			resolve(render);
		}).then(function(result){
			render = result(id);
			promise.then(function(data){
				var result = data
				if(tag){
					result = tagApply(data, tag);
				}
				render(result);
				return data
			})
		});
	},
	clone: function(){
		return Object.assign({}, this);
	},
	create: function(src, file, preset, parser, render, reader = Papa.parse){
		var res = this.clone();
		res.rawData = {};
		res.cached = {};
		if(Array.isArray(file)){
			res.file = file;
		}else{
			res.file = [file];
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
	//// gisstemp:{
	// 	preset: function(complete){
	// 		return {
	// 			// //worker: useWebWorker,
	// 			header: true,
	// 			delimiter: ',',
	// 			download: true,
	// 			skipEmptyLines: true,
	// 			dynamicTyping: true,
	// 			comments: 'Station',
	// 			complete: complete, 
	// 		};	
	// 	},
	// 	cached: undefined,
	// 	parser: parseGISSTEMP,
	// },

	zonal: dataset_struct.create(
		src = 'https://nicklassundin.github.io/abisko-climate-plots/', 
		// TODO place holder for later database
		file = "data/ZonAnn.Ts.csv",
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
			'64n-90n': renders.TemperatureDifferenceGraph,
			'nhem': renders.TemperatureDifferenceGraph,
			'glob': renders.TemperatureDifferenceGraph,
		},
		reader = Papa.parse),
	abisko: dataset_struct.create(
		src = '',
		file = "data/ANS_Temp_Prec.csv",
		preset = {
			//worker: useWebWorker,
			header: true,
			//delimiter: ';',
			download: true,
			skipEmptyLines: true,
			dynamicTyping: false,
		},
		parser = parse.AbiskoCsv,
		render = {
			'temperatures': {
				'yrly': renders.TemperatureGraph,
				'summer': renders.TemperatureGraph,
				'winter': renders.TemperatureGraph,
				'monthly': monthlyFunc(renders.TemperatureGraph),
				'difference': renders.TemperatureDifferenceGraph,
			},

			'precipitation':{
				'yrly': renders.YearlyPrecipitationGraph,
				'summer': renders.YearlyPrecipitationGraph,
				'winter': renders.YearlyPrecipitationGraph,
				'monthly': monthlyFunc(renders.MonthlyPrecipitationGraph),
				'difference': renders.PrecipitationDifferenceGraph,
			},
			'growingSeason': renders.GrowingSeasonGraph,

		},
		reader = Papa.parse),
	tornetrask: dataset_struct.create(
		src = '',
		file = "data/Tornetrask_islaggning_islossning.csv",
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.AbiskoIceData,
		render = renders.AbiskoIceGraph,
		reader = Papa.parse),
	tornetrask_iceTime: dataset_struct.create(
		src = '',
		file = "data/Tornetrask_islaggning_islossning.csv",
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.AbiskoIceData,
		render = renders.AbiskoIceTimeGraph,
		reader = Papa.parse),
	abiskoSnowDepth: dataset_struct.create(
		src = '',
		file = "data/ANS_SnowDepth.csv",
		preset = {
			//worker: useWebWorker, TODO BUG waiting for response
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.AbiskoSnowData,
		render = {
			'periodMeans': renders.AbiskoSnowGraph,
			'decadeMeans': renders.AbiskoSnowGraph,
		},
		reader = Papa.parse),
	weeklyCO2: dataset_struct.create(
		src ='',
		file = "data/weekly_in_situ_co2_mlo.csv",
		preset = {
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.SCRIPPS_CO2,
		render = {
			'weekly': renders.CO2,
			'monthly': renders.CO2,
		},
		reader = Papa.parse),

	permaHistogramCALM: dataset_struct.create(
		src = '',
		file = "data/CALM.csv",
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.CALM,
		render = renders.Perma,
		reader = Papa.parse),
	smhiTemp: dataset_struct.create(
		src = '',
		file = [
			// "data/smhi-opendata_umea.csv"
			"data/smhi-opendata_19_20_53430_20191106_082848.csv"
			// "data/smhi-opendata_19_20_140500_20191021_085425.csv"
			// , 
			// "data/smhi-opendata_19_20_140480_20191022_164727.csv"
			// ,
			// "data/smhi-opendata_19_20_140490_20191022_164733.csv"
		],
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
			beforeFirstChunk: function(result){
				result = result.split("\n")
				var line = result.findIndex(x => x.indexOf("Tidsutsnitt:") > -1)  
				result.splice(0,line);
				result = result.join("\r\n");
				return result
			}
		},
		parser = parse.smhiTemp,
		render = {
			yrly: renders.TemperatureGraph,
		}),
}
exports.config = config;

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

var selectText = function(e){
	if(e === document.activeElement){
		e.blur();
	}else{
		e.focus();
		e.select();
	}
};

var copy = function() {
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

var getID = function(param=urlParams){
	var id = param.get('id');
	if(id){
		id = id.split(',');
	}else{
		id = ['AbiskoTemperatures',
			'AbiskoTemperaturesSummer',
			'AbiskoTemperaturesWinter',
			'monthlyAbiskoTemperatures',
			'growingSeason',
			'temperatureDifferenceAbisko',
			'temperatureDifference1',
			'temperatureDifference2',
			'temperatureDifference3',
			'yearlyPrecipitation',
			'summerPrecipitation',
			'winterPrecipitation',
			'monthlyPrecipitation',
			'yearlyPrecipitationDifference',
			'summerPrecipitationDifference',
			'winterPrecipitationDifference',
			'abiskoSnowDepthPeriodMeans',
			'abiskoSnowDepthPeriodMeans2',
			'abiskoLakeIce',
			'weeklyCO2',
			'permaHistogramCALM',
		];
	}
	return id
}

// var urlParams = new URLSearchParams(window.location.search);
var baseline = null;
var baselineForm = undefined;


exports.buildChart = function(doc, id, reset=false){
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

var rendF = {
	// 'northernHemisphere': {
	// 	func: function(reset=false) {
	// 		functorGISSTEMP('data/NH.Ts.csv',renderTemperatureGraph,'https://data.giss.nasa.gov/gistemp/')('northernHemisphere','Northern Hemisphere temperatures');
	// 	},
	// 	html: function(debug=false, doc){
	// 		var no = 16;
	// 		if(!debug) no = debug;
	// 		return createDiv('northernHemisphere', no);

	// 	},
	// },
	// 'globalTemperatures': {
	// 	func: function(reset=false){
	// 		functorGISSTEMP('data/GLB.Ts.csv',renderTemperatureGraph, 'https://data.giss.nasa.gov/gistemp/')('globalTemperatures','Global temperatures');
	// 	},
	// 	html: function(debug=false, doc){
	// 		var no = 17;
	// 		if(!debug) no = debug;
	// 		return createDiv('globalTemperatures', no);

	// 	},
	// },
	'temperatureDifference1': {
		func: function(reset=false){
			config['zonal'].contFunc(reset);
			config['zonal'].init('temperatureDifference1','64n-90n')
			// contFunc(reset,'zonal', 'data/ZonAnn.Ts.csv','https:data.giss.nasa.gov/gistemp/')('temperatureDifference1','64n-90n')
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
			// contFunc(reset,'zonal', 'data/ZonAnn.Ts.csv','https:data.giss.nasa.gov/gistemp/')('temperatureDifference2','nhem');
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
			// contFunc(reset,'tornetrask', "data/Tornetrask_islaggning_islossning.csv", "https://www.arcticcirc.net/")('abiskoLakeIce')
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
			// contFunc(reset,'tornetrask', "data/Tornetrask_islaggning_islossning.csv", "https://www.arcticcirc.net/")('abiskoLakeIce')
			config['tornetrask_iceTime'].contFunc(reset);
			config['tornetrask_iceTime'].init('abiskoLakeIceTime')
		},
		html: function(debug=false, doc){
			var no = 43;
			if(!debug) no = debug;
			return createDiv('abiskoLakeIceTime', no);

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
	'AbiskoTemperatures':{
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('AbiskoTemperatures',['temperatures','yrly']);
			// contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('AbiskoTemperatures',['temperatures','yrly']);
		},
		html: function(debug=false, doc){
			var no = 1;
			if(!debug) no = debug;
			return createDiv('AbiskoTemperatures', no);
		},

	}, 
	'AbiskoTemperaturesSummer': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('AbiskoTemperaturesSummer', ['temperatures','summer']);
		},
		html: function(debug=false, doc){
			var no = 2;
			if(!debug) no = debug;
			return createDiv('AbiskoTemperaturesSummer', no);
		},
	}, 
	'AbiskoTemperaturesWinter': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('AbiskoTemperaturesWinter', ['temperatures','winter']);
		},
		html: function(debug=false, doc){
			var no = 3;
			if(!debug) no = debug;
			return createDiv('AbiskoTemperaturesWinter', no);

		},
	},
	'temperatureDifferenceAbisko': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('temperatureDifferenceAbisko', ['temperatures','yrly'],['temperatures','difference'])
			// contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('temperatureDifferenceAbisko', ['temperatures','yrly'],['temperatures','difference'])
		},
		html: function(debug=false, doc){
			var no = 19;
			if(!debug) no = debug;
			return createDiv('temperatureDifferenceAbisko', no);

		},
	},
	'monthlyAbiskoTemperatures': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('monthlyAbiskoTemperatures', ['temperatures','monthly'])
			// contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('monthlyAbiskoTemperatures', ['temperatures','monthly'])
		},
		html: function(debug=false, doc){
			var no = 4;
			var div = document.createElement("div");
			div.setAttribute("id","monthlyAbiskoTemperatures");
			if(debug){
				months().forEach((month, index) => {
					div.appendChild(createDiv('monthlyAbiskoTemperatures_'+month, no+index))
				})

			}else{
				months().forEach((month, index) => {
					div.appendChild(createDiv('monthlyAbiskoTemperatures_'+month));
				})

			}
			return div;

		},
	}, 
	'yearlyPrecipitation': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('yearlyPrecipitation', ['precipitation','yrly'])
			// contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('yearlyPrecipitation', ['precipitation','yrly'])
		},
		html: function(debug=false, doc){
			var no = 23;
			if(!debug) no = debug;
			return createDiv('yearlyPrecipitation', no);

		},
	}, 
	'summerPrecipitation': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('summerPrecipitation', ['precipitation','summer'])
		},
		html: function(debug=false, doc){
			var no = 24;
			if(!debug) no = debug;
			return createDiv('summerPrecipitation', no);

		},
	}, 
	'winterPrecipitation': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('winterPrecipitation', ['precipitation','winter'])
		},
		html: function(debug=false, doc){
			var no = 25;
			if(!debug) no = debug;
			return createDiv('winterPrecipitation', no);

		},
	}, 
	'yearlyPrecipitationDifference': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('yearlyPrecipitationDifference', ['precipitation','yrly'], ['precipitation','difference']);
		},
		html: function(debug=false, doc){
			var no = 38;
			if(!debug) no = debug;
			return createDiv('yearlyPrecipitationDifference', no);

		},
	}, 
	'summerPrecipitationDifference': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('summerPrecipitationDifference', ['precipitation','summer'], ['precipitation','difference']);
		},
		html: function(debug=false, doc){
			var no = 39;
			if(!debug) no = debug;
			return createDiv('summerPrecipitationDifference', no);

		},
	}, 
	'winterPrecipitationDifference': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('winterPrecipitationDifference', ['precipitation','winter'],['precipitation','difference']);
		},
		html: function(debug=false, doc){
			var no = 40;
			if(!debug) no = debug;
			return createDiv('winterPrecipitationDifference', no);

		},
	}, 
	'monthlyPrecipitation': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('monthlyPrecipitation', ['precipitation','monthly'])
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

			config['abisko'].contFunc(reset);
			config['abisko'].init('growingSeason', 'growingSeason')
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
	},
	'smhiTemp': {
		func: function(reset=false){
			config['smhiTemp'].contFunc(reset)
			config['smhiTemp'].init('smhiTemp', 'yrly');
		},
		html: function(debug=false, doc){
			var no = 46;
			if(!debug) no = debug;
			return createDiv("smhiTemp", no);
		}
	}
}
// console.log(config)
