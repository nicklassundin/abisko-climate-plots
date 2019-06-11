
var createBaseline = function(){
	var form = document.createElement('form');
	form.setAttribute("id",baseline);
	var header = document.createElement('header');
	header.innerHTML = "Year range for baseline";

	var lowLabel = document.createElement('label');
	lowLabel.setAttribute("for","baselineLower");
	lowLabel.innerHTML = "Lower limit ";
	var lowInput = document.createElement('input');
	lowInput.setAttribute("name","baselineLower");
	lowInput.setAttribute("type","text");
	lowInput.setAttribute("value",baselineLower)

	var br1 = document.createElement('br');

	var upperLabel = document.createElement('label');
	upperLabel.setAttribute("for","baselineUpper");
	upperLabel.innerHTML = "Upper limit ";
	var upperInput = document.createElement('input');
	upperInput.setAttribute("name","baselineUpper");
	upperInput.setAttribute("type","text");
	upperInput.setAttribute("value",baselineUpper)

	var br2 = document.createElement('br');
	form.appendChild(header)
	form.appendChild(lowLabel)
	form.appendChild(lowInput)
	form.appendChild(br1)
	form.appendChild(upperLabel)
	form.appendChild(upperInput)
	form.appendChild(br2)

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
	form.appendChild(input)
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
console.log(urlParams)
var getID = function(){

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
			'temperatureDifference3','yearlyPrecipitation','summerPrecipitation',
			'winterPrecipitation','monthlyPrecipitation','yearlyPrecipitationDifference',
			'summerPrecipitationDifference','winterPrecipitationDifference','abiskoSnowDepthMeans','abiskoLakeIce'];
	}
	return id
}
var ids = getID();

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

var bpage = function(doc=document.getElementById("container"), url=window.location.search){
	urlParams = new URLSearchParams(url);
	if(baselineForm) doc.appendChild(createBaseline());

	ids.forEach(each => {
		rendF[each].html(debug, doc);	
		rendF[each].func();
	})

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


var nhTemp = function() {
	functorGISSTEMP('data/NH.Ts.csv',renderTemperatureGraph,'https://data.giss.nasa.gov/gistemp/')('northernHemisphere','Northern Hemisphere temperatures');
}
var glbTemp = function(){
	functorGISSTEMP('data/GLB.Ts.csv',renderTemperatureGraph, 'https://data.giss.nasa.gov/gistemp/')('globalTemperatures','Global temperatures');

}


var zCached = null;
var zonalTemp = function(){
	var cached;
	if(zCached){
		cached = zCached;
	}else{
		var cached = parseZonal('data/ZonAnn.Ts.csv', 'https://data.giss.nasa.gov/gistemp/');
	}
	var result = {

		cached, 
		diff: {

			arctic: function(){
				cached(containerRender(renderTemperatureDifferenceGraph,'temperatureDifference1','Temperature difference for Arctic (64N-90N)'), '64n-90n');
			},
			nh: function(){
				cached(containerRender(renderTemperatureDifferenceGraph,'temperatureDifference2','Temperature difference for Northern Hemisphere'),'nhem');
			},
			glob: function(){
				cached(containerRender(renderTemperatureDifferenceGraph,'temperatureDifference3','Global temperature difference'), 'glob');
			},
		},
		arctic: function(){
			this.cached(containerRender(renderTemperatureGraph,'arcticTemperatures','Arctic (64N-90N) temperatures'), 'yrly');
		},
		// globTemp: function(){
		// this.cached(containerRender(renderTemperature))
		// },
	}
	return result;
};


var tornetrask = function(){
	parseTornetrask('data/Tornetrask_islaggning_islossning.csv','https://www.arcticcirc.net/');
}

var abiskoSnowDepth = function() {
	parseSnowDepth('data/ANS_SnowDepth.csv','https://www.arcticcirc.net/');
}


var cached = null;
var parseAb = function(){
	if(!cached){
		var cached = parseAbisko('data/ANS_Temp_Prec.csv','https://www.arcticcirc.net/');
	}
	var result = {
		temps: {
			yrly: function(){
				cached(renderTemperatureGraph, 'AbiskoTemperatures', 'Abisko temperatures', 'temperatures');
			},
			summer: function(){
				cached(renderAbiskoMonthlyTemperatureGraph, 'AbiskoTemperaturesSummer', 'Abisko temperatures for '+summerRange, 'summerTemps');
			},
			winter: function(){
				cached(renderAbiskoMonthlyTemperatureGraph, 'AbiskoTemperaturesWinter', 'Abisko temperatures for '+winterRange, 'winterTemps');
			},
			monthly: function(){
				cached(monthlyFunc(renderAbiskoMonthlyTemperatureGraph), 'monthlyAbiskoTemperatures', 'Abisko temperatures for', 'monthlyTemps')
			},
			diff: {
				yrly: function(){
					cached(renderTemperatureDifferenceGraph, 'temperatureDifferenceAbisko', 'Temperature difference for Abisko', 'temperatures')
				},
			}
		},
		precip: {
			yrly: function(){
				cached(renderYearlyPrecipitationGraph, 'yearlyPrecipitation','Yearly precipitation', 'yearlyPrecipitation')
			},
			summer: function(){
				cached(renderYearlyPrecipitationGraph, 'summerPrecipitation','Precipitation for '+summerRange, 'summerPrecipitation')
			},
			winter: function(){
				cached(renderYearlyPrecipitationGraph, 'winterPrecipitation','Precipitation for '+winterRange, 'winterPrecipitation')
			},
			monthly: function(){
				cached(monthlyFunc(renderMonthlyPrecipitationGraph), 'monthlyPrecipitation', 'Abisko Precipitation for', 'monthlyPrecip')
			},
			diff: {
				yrly: function(){
					cached(renderPrecipitationDifferenceGraph, 'yearlyPrecipitationDifference', 'Precipitation difference', 'yearlyPrecipitation');
				},
				summer: function(){
					cached(renderPrecipitationDifferenceGraph, 'summerPrecipitationDifference', 'Precipitation difference '+summerRange, 'summerPrecipitation');
				},
				winter: function(){
					cached(renderPrecipitationDifferenceGraph, 'winterPrecipitationDifference', 'Precipitation difference '+winterRange, 'winterPrecipitation');
				},
			},
		},
		growingSeason: function(){
			cached(renderGrowingSeasonGraph,'growingSeason', 'Growing season', 'growingSeason')
		}
	};
	return result;
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
		func: nhTemp,
		html: function(debug=false, doc){
			var no = 16;
			if(!debug) no = debug;
			doc.appendChild(createDiv('northernHemisphere', no));
			if(debug)console.log(no)
		},
	},
	'globalTemperatures': {
		func: glbTemp,
		html: function(debug=false, doc){
			var no = 17;
			if(!debug) no = debug;
			doc.appendChild(createDiv('globalTemperatures', no));
			if(debug)console.log(no)
		},
	},
	'temperatureDifference1': {
		func: zonalTemp().diff.arctic, 	// TODO opt
		html: function(debug=false, doc){
			var no = 20;
			if(!debug) no = debug;
			doc.appendChild(createDiv('temperatureDifference1', no));
			if(debug)console.log(no)
		},
	},
	'temperatureDifference2': {
		func: zonalTemp().diff.nh,    	// 
		html: function(debug=false, doc){
			var no = 21;
			if(!debug) no = debug;
			doc.appendChild(createDiv('temperatureDifference2', no));
			if(debug)console.log(no)
		},
	},
	'temperatureDifference3': {
		func: zonalTemp().diff.glob,	//
		html: function(debug=false, doc){
			var no = 22;
			if(!debug) no = debug;
			doc.appendChild(createDiv('temperatureDifference3', no));
			if(debug)console.log(no)
		},
	},
	'arcticTemperatures': {
		func: zonalTemp().arctic, 
		html: function(debug=false, doc){
			var no = 16.1;
			if(!debug) no = debug;
			doc.appendChild(createDiv('arcticTemperatures', no));
			if(debug)console.log(no)
		},
	},
	'abiskoLakeIce':{
		func: tornetrask,
		html: function(debug=false, doc){
			var no = 43;
			if(!debug) no = debug;
			doc.appendChild(createDiv('abiskoLakeIce', no));
			if(debug)console.log(no)
		},
	}, 
	'abiskoSnowDepthMeans':{
		func: abiskoSnowDepth,
		html: function(debug=false, doc){
			var no = 41;
			if(!debug) no = debug;
			doc.appendChild(createDiv('abiskoSnowDepthPeriodMeans',no))
			if(debug)console.log(no)
			no = 42;
			if(!debug) no = debug;
			doc.appendChild(createDiv('abiskoSnowDepthPeriodMeans2',no))
			if(debug)console.log(no)
		},
	},
	'AbiskoTemperatures':{
		func: parseAb().temps.yrly,
		html: function(debug=false, doc){
			var no = 1;
			if(!debug) no = debug;
			doc.appendChild(createDiv('AbiskoTemperatures', no));
			if(debug)console.log(no)
		},

	}, 
	'AbiskoTemperaturesSummer': {
		func: parseAb().temps.summer,
		html: function(debug=false, doc){
			var no = 2;
			if(!debug) no = debug;
			doc.appendChild(createDiv('AbiskoTemperaturesSummer', no));
			if(debug)console.log(no)
		},
	}, 
	'AbiskoTemperaturesWinter': {
		func: parseAb().temps.winter,
		html: function(debug=false, doc){
			var no = 3;
			if(!debug) no = debug;
			doc.appendChild(createDiv('AbiskoTemperaturesWinter', no));
			if(debug)console.log(no)
		},
	},
	'temperatureDifferenceAbisko': {
		func: parseAb().temps.diff.yrly,
		html: function(debug=false, doc){
			var no = 19;
			if(!debug) no = debug;
			doc.appendChild(createDiv('temperatureDifferenceAbisko', no));
			if(debug)console.log(no)
		},
	},
	'monthlyAbiskoTemperatures': {
		func: parseAb().temps.monthly,
		html: function(debug=false, doc){
			var no = 4;
			if(debug){
				months().forEach((month, index) => {
					doc.appendChild(createDiv('monthlyAbiskoTemperatures_'+month, no+index));
				})

			}else{
				months().forEach((month, index) => {
					doc.appendChild(createDiv('monthlyAbiskoTemperatures_'+month));
				})

			}
			if(debug)console.log(no)
		},
	}, 
	'yearlyPrecipitation': {
		func: parseAb().precip.yrly,
		html: function(debug=false, doc){
			var no = 23;
			if(!debug) no = debug;
			doc.appendChild(createDiv('yearlyPrecipitation', no));
			if(debug)console.log(no)
		},
	}, 
	'summerPrecipitation': {
		func: parseAb().precip.summer,
		html: function(debug=false, doc){
			var no = 24;
			if(!debug) no = debug;
			doc.appendChild(createDiv('summerPrecipitation', no));
			if(debug)console.log(no)
		},
	}, 
	'winterPrecipitation': {
		func: parseAb().precip.winter,
		html: function(debug=false, doc){
			var no = 25;
			if(!debug) no = debug;
			doc.appendChild(createDiv('winterPrecipitation', no));
			if(debug)console.log(no)
		},
	}, 
	'yearlyPrecipitationDifference': {
		func: parseAb().precip.diff.yrly,
		html: function(debug=false, doc){
			var no = 38;
			if(!debug) no = debug;
			doc.appendChild(createDiv('yearlyPrecipitationDifference', no));
			if(debug)console.log(no)
		},
	}, 
	'summerPrecipitationDifference': {
		func: parseAb().precip.diff.summer,
		html: function(debug=false, doc){
			var no = 39;
			if(!debug) no = debug;
			doc.appendChild(createDiv('summerPrecipitationDifference', no));
			if(debug)console.log(no)
		},
	}, 
	'winterPrecipitationDifference': {
		func: parseAb().precip.diff.winter,
		html: function(debug=false, doc){
			var no = 40;
			if(!debug) no = debug;
			doc.appendChild(createDiv('winterPrecipitationDifference',no));
			if(debug)console.log(no)
		},
	}, 
	'monthlyPrecipitation': {
		func: parseAb().precip.monthly,
		html: function(debug=false, doc){
			var no = 26;
			if(debug){
				months().forEach((month, index) => {
					doc.appendChild(createDiv('monthlyPrecipitation_'+month, no+index));
				})

			}else{
				months().forEach((month, index) => {
					doc.appendChild(createDiv('monthlyPrecipitation_'+month));
				})

			}
			if(debug)console.log(no)
		},
	}, 
	'growingSeason': {
		func: parseAb().growingSeason,
		html: function(debug=false, doc){
			var no = 18;
			if(!debug) no = debug;
			doc.appendChild(createDiv('growingSeason', no));
			if(debug)console.log(no)
		}
	}
}

