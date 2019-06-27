/*****************************/
/* LOADING DATA HAPPENS HERE */
/*****************************/

// TODO cached parsing and generalization
var url = function(){
	return 'https://nicklassundin.github.io/abisko-climate-plots/';
}
var monthlyFunc = (render) => function(data, id, title, src="") {
	months().forEach(month =>  
		render(data[month], id+"_"+month, title+" "+monthName(month)));
};


var containerRender = (renderF, id, title, src) => function(data){
	renderF(data, id, title, src);
}

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
				'summerTemps': renderAbiskoMonthlyTemperatureGraph,
				'winterTemps': renderAbiskoMonthlyTemperatureGraph,
				'monthlyTemps': monthlyFunc(renderAbiskoMonthlyTemperatureGraph),
				'difference': renderTemperatureDifferenceGraph,
			},

			'precipitation':{
				'yrly': renderYearlyPrecipitationGraph,
				'summerPrecipitation': renderYearlyPrecipitationGraph,
				'winterPrecipitation': renderYearlyPrecipitationGraph,
				'monthlyPrecip': monthlyFunc(renderMonthlyPrecipitationGraph),
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
			'periodMeans': renderAbiskoSnowGraph,
			'decadeMeans': renderAbiskoSnowGraph,
		}
	}
}
// wander down the data structure with tag input example: [high, medium, low]
var tagApply = function(data, tag){
	var result = data;
	try{
		tag.forEach(each => {
			result = result[each];
		})	
	}catch{
		result = result[tag]
	}
	return result;
}

var contFunc = (reset=false, type,file, src) => function(id, title, tag, renderTag=tag){
	if(reset) papaF[type].cached = undefined;
	var op = papaF[type];
		// console.log(tag)
		// console.log(op)
	if(op.cached){
		var render = tagApply(op.render, renderTag);
		var data = tagApply(op.cached,tag);
		render(data,id,title)

	}else{	
		op.preset.complete = function(result){
			var data = op.parser(result);
			papaF[type].cached = data;
			if(tag) data = tagApply(data, tag);
			var render = op.render;
			if(tag){
				render = tagApply(render, renderTag);
			}
			// TODO render all when tag=true
			render(data,id,title)
		};
		Papa.parse(url()+''+file, op.preset)
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

	}
}

var selectText = function(e){
	e.focus();
	e.select();
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
var urlParams = new URLSearchParams(window.location.search);

var getID = function(urlParams){

	var id = null;
	try{
		id = urlParams.get('id').split(',');
		if(id=='all'){fail()}
	}catch{
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
			'abiskoLakeIce'];
	}
	return id
}

var baseline = null;
if(urlParams.get('baselineLower')){
	baselineLower = parseInt(urlParams.get('baselineLower'));
	baselineUpper = parseInt(urlParams.get('baselineUpper'));
}
const baselineForm = (urlParams.get('baselineForm')=='true')||(urlParams.get('baselineForm')==undefined)
const debug = urlParams.get('debug');
const share = urlParams.get('share');

var getUrl = function(uid=urlParams.get('id'),debug=urlParams.get('debug'),share=urlParams.get('share'),baselineForm=urlParams.get('baselineForm'),baselineLower=urlParams.get('baselineLower'),baselineUpper=urlParams.get('baselineUpper')){
	var addparams = function(p, v, rest='?'){
		if(v) return rest+p+'='+v;
		return rest;
	}

	var params = addparams('id',uid);
	params = addparams('debug',debug,params+'&');
	params = addparams('share',share,params+'&');
	params = addparams('baselineForm',baselineForm,params+'&');
	params = addparams('baselineLower',baselineLower,params+'&');
	params = addparams('baselineUpper',baselineUpper,params+'&');
	return ((''+window.location).split('?')[0]+params)

}
// console.log(getUrl())

var bpage = function(doc=document.createElement('div'), par=window.location.search, ids=getID(new URLSearchParams(par)), reset=false){
	doc.innerHTML = "";
	urlParams = new URLSearchParams(par);
	if(baselineForm=='true') doc.appendChild(createBaseline());
	if(Array.isArray(ids)) {
		ids.forEach(each => {
			try{
				doc.appendChild(rendF[each].html(debug, doc));	
				rendF[each].func(reset);
			}catch(e){
				console.log("failed to render: "+each)
			}
		})
	}else{
		doc.appendChild(rendF[ids].html(debug, doc));
		rendF[ids].func(reset);
	}

	if(share=='true'){
		var input = document.createElement("input");
		input.setAttribute('id', 'input');
		input.setAttribute('type', 'text');
		var body = doc,
			html = document.documentElement;
		var height = Math.max( body.scrollHeight, body.offsetHeight, 
			html.clientHeight, html.scrollHeight, html.offsetHeight );
		input.setAttribute('value', "<iframe src='"+window.location+"&share=false"+"' width='100%' height='"+height+"'></iframe>") // TODO ifram
		doc.appendChild(input);
		var cp = document.createElement("button");
		cp.innerHTML = 'Copy link';
		cp.setAttribute('onclick', "copy()");
		doc.appendChild(cp);
	}
	return doc
}


var createDiv = function(id, no=null){
	var div = document.createElement('div');
	div.setAttribute("id",id);
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
			contFunc(reset,'zonal', 'data/ZonAnn.Ts.csv','https:data.giss.nasa.gov/gistemp/')('temperatureDifference1', 'Temperature difference for Arctic (64N-90N)','64n-90n')
		},
		html: function(debug=false, doc){
			var no = 20;
			if(!debug) no = debug;
			return createDiv('temperatureDifference1', no);
			
		},
	},
	'temperatureDifference2': {
		func: function(reset=false){
			contFunc(reset,'zonal', 'data/ZonAnn.Ts.csv','https:data.giss.nasa.gov/gistemp/')('temperatureDifference2','Temperature difference for Northern Hemisphere','nhem');
		},
		html: function(debug=false, doc){
			var no = 21;
			if(!debug) no = debug;
			return createDiv('temperatureDifference2', no);
			
		},
	},
	'temperatureDifference3': {
		func: function(reset=false){
			contFunc(reset,'zonal', 'data/ZonAnn.Ts.csv','https:data.giss.nasa.gov/gistemp/')('temperatureDifference3','Global temperature difference', 'glob');
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
			contFunc(reset,'tornetrask', "data/Tornetrask_islaggning_islossning.csv", "https://www.arcticcirc.net/")('abiskoLakeIce','Torneträsk Freeze-up and break-up of lake ice vs ice time')
		},
		html: function(debug=false, doc){
			var no = 43;
			if(!debug) no = debug;
			return createDiv('abiskoLakeIce', no);
			
		},
	}, 
	'abiskoSnowDepthPeriodMeans':{
		func: function(reset=false) {
			contFunc(reset,'abiskoSnowDepth',"data/ANS_SnowDepth.csv", "https://www.arcticcirc.net/")("abiskoSnowDepthPeriodMeans", "Monthly mean snow depth for Abisko","periodMeans")
		},

		html: function(debug=false, doc){
			var no = 41;
			if(!debug) no = debug;
			return createDiv('abiskoSnowDepthPeriodMeans', no)
		},
	},
	'abiskoSnowDepthPeriodMeans2':{
		func: function(reset=false) {
			contFunc(reset,'abiskoSnowDepth',"data/ANS_SnowDepth.csv", "https://www.arcticcirc.net/")("abiskoSnowDepthPeriodMeans2", "Monthly mean snow depth for Abisko","decadeMeans")
		},
		html: function(debug=false, doc){
			var no = 42;
			if(!debug) no = debug;
			return createDiv('abiskoSnowDepthPeriodMeans2',no)
		},
	},
	'AbiskoTemperatures':{
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('AbiskoTemperatures', 'Abisko temperatures', ['temperatures','yrly']);
		},
		html: function(debug=false, doc){
			var no = 1;
			if(!debug) no = debug;
			return createDiv('AbiskoTemperatures', no);
		},

	}, 
	'AbiskoTemperaturesSummer': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('AbiskoTemperaturesSummer', 'Abisko temperatures for '+summerRange, ['temperatures','summerTemps']);
		},
		html: function(debug=false, doc){
			var no = 2;
			if(!debug) no = debug;
			return createDiv('AbiskoTemperaturesSummer', no);
		},
	}, 
	'AbiskoTemperaturesWinter': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('AbiskoTemperaturesWinter', 'Abisko temperatures for '+winterRange, ['temperatures','winterTemps']);
		},
		html: function(debug=false, doc){
			var no = 3;
			if(!debug) no = debug;
			return createDiv('AbiskoTemperaturesWinter', no);
			
		},
	},
	'temperatureDifferenceAbisko': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('temperatureDifferenceAbisko', 'Temperature difference for Abisko', ['temperatures','yrly'],['temperatures','difference'])
		},
		html: function(debug=false, doc){
			var no = 19;
			if(!debug) no = debug;
			return createDiv('temperatureDifferenceAbisko', no);
			
		},
	},
	'monthlyAbiskoTemperatures': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('monthlyAbiskoTemperatures', 'Abisko temperatures for', ['temperatures','monthlyTemps'])
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
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('yearlyPrecipitation','Yearly precipitation', ['precipitation','yrly'])
		},
		html: function(debug=false, doc){
			var no = 23;
			if(!debug) no = debug;
			return createDiv('yearlyPrecipitation', no);
			
		},
	}, 
	'summerPrecipitation': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('summerPrecipitation','Precipitation for '+summerRange, ['precipitation','summerPrecipitation'])
		},
		html: function(debug=false, doc){
			var no = 24;
			if(!debug) no = debug;
			return createDiv('summerPrecipitation', no);
			
		},
	}, 
	'winterPrecipitation': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('winterPrecipitation','Precipitation for '+winterRange, ['precipitation','winterPrecipitation'])
		},
		html: function(debug=false, doc){
			var no = 25;
			if(!debug) no = debug;
			return createDiv('winterPrecipitation', no);
			
		},
	}, 
	'yearlyPrecipitationDifference': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('yearlyPrecipitationDifference', 'Precipitation difference', ['precipitation','yrly'], ['precipitation','difference']);
		},
		html: function(debug=false, doc){
			var no = 38;
			if(!debug) no = debug;
			return createDiv('yearlyPrecipitationDifference', no);
			
		},
	}, 
	'summerPrecipitationDifference': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('summerPrecipitationDifference', 'Precipitation difference '+summerRange, ['precipitation','summerPrecipitation'], ['precipitation','difference']);
		},
		html: function(debug=false, doc){
			var no = 39;
			if(!debug) no = debug;
			return createDiv('summerPrecipitationDifference', no);
			
		},
	}, 
	'winterPrecipitationDifference': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('winterPrecipitationDifference', 'Precipitation difference '+winterRange, ['precipitation','winterPrecipitation'],['precipitation','difference']);
		},
		html: function(debug=false, doc){
			var no = 40;
			if(!debug) no = debug;
			return createDiv('winterPrecipitationDifference', no);
			
		},
	}, 
	'monthlyPrecipitation': {
		func: function(reset=false){
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('monthlyPrecipitation', 'Abisko Precipitation for', ['precipitation','monthlyPrecip'])
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
			contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('growingSeason', 'Growing season', 'growingSeason')
		},
		html: function(debug=false, doc){
			var no = 18;
			if(!debug) no = debug;
			return createDiv('growingSeason', no);
			
		}
	}
}

