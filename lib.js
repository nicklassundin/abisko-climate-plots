/*****************************/
/* LOADING DATA HAPPENS HERE */
// TODO cached parsing and generalization

var mark = function(id="mark",par=window.location.search) {
	var param = (''+par);
	var mark = document.getElementById(id+param);
	if(!mark) mark = document.getElementById(id);

	var container = document.createElement("div")
	container.setAttribute('id','cont'+param);
	mark.appendChild(bpage(container,par=window.location.seach));
}

var url = function(file='', src='view.html'){
	return 'https://nicklassundin.github.io/abisko-climate-plots/'+file;
	var result = window.location.href.split('?')[0].replace(src,file);
	$.ajax({
		url: result, 
		type: 'HEAD',
		error: function(){
			result = 'https://nicklassundin.github.io/abisko-climate-plots/'+file;
		},
		success: function(){}
	});
	return result
}
var monthlyFunc = (render) => function(data, id, title, src="") {
	months().forEach((month, index) =>  
		render(data[index+1+''], id+"_"+month, title+" "+monthName(month)));
};

var papaF = {
	// gisstemp:{
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
	zonal: {
		src: 'https://nicklassundin.github.io/abisko-climate-plots/', // TODO place holder for later database
		preset: {
			//worker: useWebWorker,
			header: true,
			delimiter: ',',
			download: true,
			skipEmptyLines: true,
			dynamicTyping: true,
		},
		cached: undefined,
		parser: parseGISSTEMPzonalMeans,
		render: {
			'64n-90n': renderTemperatureDifferenceGraph,
			'nhem': renderTemperatureDifferenceGraph,
			'glob': renderTemperatureDifferenceGraph,
		}
	},
	abisko: {
		preset:{
			//worker: useWebWorker,
			header: true,
			//delimiter: ';',
			download: true,
			skipEmptyLines: true,
			dynamicTyping: false,
		},
		cached: undefined,
		parser: parseAbiskoCsv,
		render: {
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

		}
	},
	tornetrask: {
		preset: {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		cached: undefined,
		parser: parseAbiskoIceData,
		render: renderAbiskoIceGraph,
	},
	abiskoSnowDepth: {
		preset: {
			//worker: useWebWorker, TODO BUG waiting for response
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		cached: undefined,
		parser: parseAbiskoSnowData,
		render: {
			// 'periodMeans': renderAbiskoSnowGraph,
			'decadeMeans': renderAbiskoSnowGraph,
		}
	},
	weeklyCO2: {
		preset: {
			download: true,
			skipEmptyLines: true,
		},
		cached: undefined,
		parser: parseSCRIPPS_CO2,
		render: {
			'weekly': renderCO2,
			'monthly': renderCO2,
		} 
	},
	permaHistogramCALM: {
		preset: {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		cached: undefined,
		parser: parseCALM,
		render: renderPerma,
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
		result = result[tag]
	}
	return result;
}

var contFunc = (reset=false, type, file, src) => function(id, tag, renderTag=tag){	
	if(reset) papaF[type].cached = undefined;
	var op = papaF[type];
	var URL = url(file);

	if(op.cached){
		var render = tagApply(op.render, renderTag);
		var data = tagApply(op.cached,tag);
		render(data,id)
		console.log('cached')
	}else{
		op.preset.complete = function(result){
			var data = op.parser(result);
			papaF[type].cached = data;
			if(tag) data = tagApply(data, tag);
			var render = op.render;
			if(tag){
				render = tagApply(render, renderTag);
			}
			render(data,id)
		};
		Papa.parse(URL, op.preset)
	}
}

const csv = {
	nasa: {
		nh: "data/NH.Ts.csv",
		glb: "data/GLB.Ts.csv",
		zon:"data/ZoneAnn.Ts.csv",
		src: "https://data.giss.nasa.gov/gistemp/",
	},
	abisko: {
		temp: "data/ANS_Temp_Prec.csv",
		snow: "data/ANS_SnowDepth.csv",
		tornetrask: "data/Tornetrask_islaggning_islossning.csv",
		src: "https://www.arcticcirc.net/",

	},
	scripps: {
		weekly: "data/weekly_in_situ_co2_mlo.csv",
		monthly: "data/monthly_in_situ_co2_mlo.csv",
	},
	calm: "data/CALM.csv",
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
			'weeklyCO2',
			'permaHistogramCALM',
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
	'northernHemisphere': {
		func: function(reset=false) {
			functorGISSTEMP('data/NH.Ts.csv',renderTemperatureGraph,'https://data.giss.nasa.gov/gistemp/')('northernHemisphere','Northern Hemisphere temperatures');
		},
		html: function(debug=false, doc){
			var no = 16;
			if(!debug) no = debug;
			return createDiv('northernHemisphere', no);

		},
	},
	'globalTemperatures': {
		func: function(reset=false){
			functorGISSTEMP('data/GLB.Ts.csv',renderTemperatureGraph, 'https://data.giss.nasa.gov/gistemp/')('globalTemperatures','Global temperatures');
		},
		html: function(debug=false, doc){
			var no = 17;
			if(!debug) no = debug;
			return createDiv('globalTemperatures', no);

		},
	},
	'temperatureDifference1': {
		func: function(reset=false){
			contFunc(reset,'zonal', 'data/ZonAnn.Ts.csv','https:data.giss.nasa.gov/gistemp/')('temperatureDifference1','64n-90n')
		},
		html: function(debug=false, doc){
			var no = 20;
			if(!debug) no = debug;
			return createDiv('temperatureDifference1', no);

		},
	},
	'temperatureDifference2': {
		func: function(reset=false){
			contFunc(reset,'zonal', 'data/ZonAnn.Ts.csv','https:data.giss.nasa.gov/gistemp/')('temperatureDifference2','nhem');
		},
		html: function(debug=false, doc){
			var no = 21;
			if(!debug) no = debug;
			return createDiv('temperatureDifference2', no);

		},
	},
	'temperatureDifference3': {
		func: function(reset=false){
			contFunc(reset,'zonal', 'data/ZonAnn.Ts.csv','https:data.giss.nasa.gov/gistemp/')('temperatureDifference3', 'glob');
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
			contFunc(reset,'tornetrask', "data/Tornetrask_islaggning_islossning.csv", "https://www.arcticcirc.net/")('abiskoLakeIce')
		},
		html: function(debug=false, doc){
			var no = 43;
			if(!debug) no = debug;
			return createDiv('abiskoLakeIce', no);

		},
	}, 
	'abiskoSnowDepthPeriodMeans':{
		func: function(reset=false) {
			contFunc(reset,'abiskoSnowDepth',"data/ANS_SnowDepth.csv", "https://www.arcticcirc.net/")("abiskoSnowDepthPeriodMeans", "decadeMeans")
		},

		html: function(debug=false, doc){
			var no = 41;
			if(!debug) no = debug;
			return createDiv('abiskoSnowDepthPeriodMeans', no)
		},
	},
	'abiskoSnowDepthPeriodMeans2':{
		func: function(reset=false) {
			contFunc(reset,'abiskoSnowDepth',"data/ANS_SnowDepth.csv", "https://www.arcticcirc.net/")("abiskoSnowDepthPeriodMeans2","decadeMeans")
		},
		html: function(debug=false, doc){
			var no = 42;
			if(!debug) no = debug;
			return createDiv('abiskoSnowDepthPeriodMeans2',no)
		},
	},
	'AbiskoTemperatures':{
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('AbiskoTemperatures',['temperatures','yrly']);
		},
		html: function(debug=false, doc){
			var no = 1;
			if(!debug) no = debug;
			return createDiv('AbiskoTemperatures', no);
		},

	}, 
	'AbiskoTemperaturesSummer': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('AbiskoTemperaturesSummer', ['temperatures','summer']);
		},
		html: function(debug=false, doc){
			var no = 2;
			if(!debug) no = debug;
			return createDiv('AbiskoTemperaturesSummer', no);
		},
	}, 
	'AbiskoTemperaturesWinter': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('AbiskoTemperaturesWinter', ['temperatures','winter']);
		},
		html: function(debug=false, doc){
			var no = 3;
			if(!debug) no = debug;
			return createDiv('AbiskoTemperaturesWinter', no);

		},
	},
	'temperatureDifferenceAbisko': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('temperatureDifferenceAbisko', ['temperatures','yrly'],['temperatures','difference'])
		},
		html: function(debug=false, doc){
			var no = 19;
			if(!debug) no = debug;
			return createDiv('temperatureDifferenceAbisko', no);

		},
	},
	'monthlyAbiskoTemperatures': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('monthlyAbiskoTemperatures', ['temperatures','monthly'])
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
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('yearlyPrecipitation', ['precipitation','yrly'])
		},
		html: function(debug=false, doc){
			var no = 23;
			if(!debug) no = debug;
			return createDiv('yearlyPrecipitation', no);

		},
	}, 
	'summerPrecipitation': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('summerPrecipitation', ['precipitation','summer'])
		},
		html: function(debug=false, doc){
			var no = 24;
			if(!debug) no = debug;
			return createDiv('summerPrecipitation', no);

		},
	}, 
	'winterPrecipitation': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('winterPrecipitation', ['precipitation','winter'])
		},
		html: function(debug=false, doc){
			var no = 25;
			if(!debug) no = debug;
			return createDiv('winterPrecipitation', no);

		},
	}, 
	'yearlyPrecipitationDifference': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('yearlyPrecipitationDifference', ['precipitation','yrly'], ['precipitation','difference']);
		},
		html: function(debug=false, doc){
			var no = 38;
			if(!debug) no = debug;
			return createDiv('yearlyPrecipitationDifference', no);

		},
	}, 
	'summerPrecipitationDifference': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('summerPrecipitationDifference', ['precipitation','summer'], ['precipitation','difference']);
		},
		html: function(debug=false, doc){
			var no = 39;
			if(!debug) no = debug;
			return createDiv('summerPrecipitationDifference', no);

		},
	}, 
	'winterPrecipitationDifference': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('winterPrecipitationDifference', ['precipitation','winter'],['precipitation','difference']);
		},
		html: function(debug=false, doc){
			var no = 40;
			if(!debug) no = debug;
			return createDiv('winterPrecipitationDifference', no);

		},
	}, 
	'monthlyPrecipitation': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('monthlyPrecipitation', ['precipitation','monthly'])
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
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('growingSeason', 'growingSeason')
		},
		html: function(debug=false, doc){
			var no = 18;
			if(!debug) no = debug;
			return createDiv('growingSeason', no);

		}
	},
	'weeklyCO2': {
		func: function(reset=false){
			contFunc(reset,"weeklyCO2",csv.scripps.weekly,'')('weeklyCO2', 'weekly')
		},
		html: function(debug=false, doc){
			var no = 44;
			if(!debug) no = debug;
			return createDiv('weeklyCO2', no);
		}
	},
	'permaHistogramCALM': {
		func: function(reset=false){
			contFunc(reset, "permaHistogramCALM", csv.calm,'')('permaHistogramCALM','')
		},
		html: function(debug=false, doc){
			var no = 45;
			if(!debug) no = debug;
			return createDiv("permaHistogramCALM", no);
		}
	}
}

