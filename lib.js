/*****************************/
/* LOADING DATA HAPPENS HERE */
// TODO cached parsing and generalization

// TODO
// console.log(getTempSMHI(159880, "months"));
// test = csv_smhi_json(159880, "archive");
// console.log(test)
////////////

var variables = {
	date: new Date(),
	dateStr: function(){ return (this.date.getYear()+1900)+"-"+(this.date.getMonth()+1)+"-"+this.date.getDate() }
}

var mark = function(id="mark",par=window.location.search) {
	var param = (''+par);
	var mark = document.getElementById(id+param);
	if(!mark) mark = document.getElementById(id);

	var container = document.createElement("div")
	container.setAttribute('id','cont'+param);
	mark.appendChild(bpage(container,par=window.location.seach));
}

var url = function(file='', src='view.html'){
	// return 'https://nicklassundin.github.io/abisko-climate-plots/'+file;
	var result = 'https://nicklassundin.github.io/abisko-climate-plots/'+file;
	$.ajax({
		url: result, 
		type: 'HEAD',
		error: function(){
			result = window.location.href.split('?')[0].replace(src,file);
		},
		success: function(){	
			result = 'https://nicklassundin.github.io/abisko-climate-plots/'+file;
		}
	});
	// console.log(result)
	return result
}
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
		parser = parseGISSTEMPzonalMeans,
		render = {
			'64n-90n': renderTemperatureDifferenceGraph,
			'nhem': renderTemperatureDifferenceGraph,
			'glob': renderTemperatureDifferenceGraph,
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
		parser = parseAbiskoCsv,
		render = {
			'temperatures': {
				'yrly': renderTemperatureGraph,
				'summer': renderTemperatureGraph,
				'winter': renderTemperatureGraph,
				'monthly': monthlyFunc(renderTemperatureGraph),
				'difference': renderTemperatureDifferenceGraph,
			},

			'precipitation':{
				'yrly': renderYearlyPrecipitationGraph,
				'summer': renderYearlyPrecipitationGraph,
				'winter': renderYearlyPrecipitationGraph,
				'monthly': monthlyFunc(renderMonthlyPrecipitationGraph),
				'difference': renderPrecipitationDifferenceGraph,
			},
			'growingSeason': renderGrowingSeasonGraph,

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
		parser = parseAbiskoIceData,
		render = renderAbiskoIceGraph,
		reader = Papa.parse),
	tornetrask_iceTime: dataset_struct.create(
		src = '',
		file = "data/Tornetrask_islaggning_islossning.csv",
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parseAbiskoIceData,
		render = renderAbiskoIceTimeGraph,
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
		parser = parseAbiskoSnowData,
		render = {
			'periodMeans': renderAbiskoSnowGraph,
			'decadeMeans': renderAbiskoSnowGraph,
		},
		reader = Papa.parse),
	weeklyCO2: dataset_struct.create(
		src ='',
		file = "data/weekly_in_situ_co2_mlo.csv",
		preset = {
			download: true,
			skipEmptyLines: true,
		},
		parser = parseSCRIPPS_CO2,
		render = {
			'weekly': renderCO2,
			'monthly': renderCO2,
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
		parser = parseCALM,
		render = renderPerma,
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
		parser = smhiTemp,
		render = {
			yrly: renderTemperatureGraph,
		}),
	iceThick: dataset_struct.create(
		src = '',
		file = ["data/Tornetrask-data.csv"],
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = AbiskoLakeThickness,
		render = {
			'yrly': iceThicknessYear,
			'date': iceThicknessDate
		},
		reader = Papa.parse,
		local = true)
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

var selectText = function(e){
	if(e === document.activeElement){
		e.blur();
	}else{
		e.focus();
		e.select();
	}
};
// TODO Seperate them to one constructor with general input for reuse
var createBaseline = function(ver=true, change){
	var text = language[nav_lang]['baselineform'];
	var createInput = function(name, value, div=document.createElement('div')){
		var submit = change;
		if(submit){
			submit = submit+"('baseline"+name+"')"
		}else{
			submit = "submit(this)"
		}
		var label = document.createElement('label');
		label.setAttribute("for","baselineLower");
		label.innerHTML = text[name.toLowerCase()];
		var input = document.createElement('input');
		input.setAttribute("size","4")
		input.setAttribute("maxlength","4")
		input.setAttribute("name","baseline"+name);
		input.setAttribute("type","text");
		input.setAttribute("value",value);
		input.setAttribute("onClick",onclick="selectText(this)")
		input.setAttribute("onChange",onchange=submit+'(this.value)')
		div.appendChild(label)
		div.appendChild(input)
		return div;
	}
	var form = document.createElement('form');
	form.setAttribute("id",baseline);
	var header = document.createElement('header');
	header.innerHTML = text.title;

	var lower = createInput("Lower", baselineLower);
	if(ver) lower.appendChild(document.createElement('br'));

	var upper = createInput("Upper", baselineUpper,lower);

	var br2 = document.createElement('br');
	form.appendChild(header)
	form.appendChild(lower)
	form.appendChild(upper)
	if(ver)form.appendChild(br2)

	// Hidden option because magic
	var value = urlParams.get('id');
	if(value){
		var id = document.createElement('input');
		id.setAttribute("type","hidden");
		id.setAttribute("name", "id");
		id.setAttribute("value",''+value);
		form.appendChild(id);
	}	
	value = urlParams.get('debug');
	if(value){
		var debug = document.createElement('input');
		debug.setAttribute("type","hidden");
		debug.setAttribute("name", "debug");
		debug.setAttribute("value",''+ value);
		form.appendChild(debug);
	}
	value = urlParams.get('share');
	if(value){
		var share = document.createElement('input');
		share.setAttribute("type","hidden");
		share.setAttribute("name", "share");
		share.setAttribute("value",''+value);
		form.appendChild(share);
	}
	var input = document.createElement('input');
	var input = document.createElement('input');
	input.setAttribute("type","submit")
	if(ver)form.appendChild(input)
	return form;
}

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
			'abiskoLakeIceTime',
			'weeklyCO2',
			'permaHistogramCALM',
			'iceThicknessYear',
			'iceThicknessDate'
		];
	}
	return id
}

var urlParams = new URLSearchParams(window.location.search);
var baseline = null;
var baselineForm = undefined;

var getUrl = function(uid=urlParams.get('id'),debug=urlParams.get('debug'),share=urlParams.get('share'),baselineForm=urlParams.get('baselineForm'),baselineLower=urlParams.get('baselineLower'),baselineUpper=urlParams.get('baselineUpper')){
	var addparams = function(p, v, rest){
		if(!rest){
			rest = '?';
		}else{
			rest = '&'+rest;
		}
		if(v) return rest+p+'='+v;
		return '';
	}
	if(!uid) uid = getID();
	var params = addparams('id',uid);
	params = addparams('debug',debug,params);
	params = addparams('share',share,params);
	params = addparams('baselineForm',baselineForm,params);
	params = addparams('baselineLower',baselineLower,params);
	params = addparams('baselineUpper',baselineUpper,params);
	return ((''+window.location).split('?')[0]+params)

}

var bpage = function(doc=document.createElement('div'), par=window.location.search, ids=getID(new URLSearchParams(par)), reset=false){
	doc.innerHTML = "";
	urlParams = new URLSearchParams(par);
	if(urlParams.get('baselineLower')){
		baselineLower = parseInt(urlParams.get('baselineLower'));
		baselineUpper = parseInt(urlParams.get('baselineUpper'));
	}
	baselineForm = (urlParams.get('baselineForm')=='true')||(urlParams.get('baselineForm')==undefined)
	// var share = urlParams.get('share');
	if(baselineForm=='true') doc.appendChild(createBaseline());
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
			config['tornetrask_iceTime'].contFunc(reset);
			config['tornetrask_iceTime'].init('abiskoLakeIceTime')
		},
		html: function(debug=false, doc){
			var no = 47;
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
}
// console.log(config)
