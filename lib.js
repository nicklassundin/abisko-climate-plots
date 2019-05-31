// function makeDocument() {
//   var div = document.getElementById("render");
//   div.innerHTML = "<div id='render'></div><figcaption></figcaption><script type=text/javascript>functorGISSTEMP('data/NH.Ts.csv',renderTemperatureGraph,'https://data.giss.nasa.gov/gistemp/')('div','Northern Hemisphere temperatures');</script>";
// }


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

var createBaseline = function(){
	var form = document.createElement('form');
	form.setAttribute("id",baseline);
	var header = document.createElement('header');
	header.innerHTML = "Year range for baseline";
	
	var lowLabel = document.createElement('label');
	lowLabel.setAttribute("for","baselineLower");
	lowLabel.innerHTML = "Lower limit";
	var lowInput = document.createElement('input');
	lowInput.setAttribute("name","baselineLower");
	lowInput.setAttribute("type","text");
	lowInput.setAttribute("value","1961")
	
	var br1 = document.createElement('br');

	var upperLabel = document.createElement('label');
	upperLabel.setAttribute("for","baselineUpper");
	upperLabel.innerHTML = "Upper limit";
	var upperInput = document.createElement('input');
	upperInput.setAttribute("name","baselineUpper");
	upperInput.setAttribute("type","text");
	upperInput.setAttribute("value","1990")
	
	var br2 = document.createElement('br');
	var input = document.createElement('input');
	input.setAttribute("type","submit")
	form.appendChild(header)
	form.appendChild(lowLabel)
	form.appendChild(lowInput)
	form.appendChild(br1)
	form.appendChild(upperLabel)
	form.appendChild(upperInput)
	form.appendChild(br2)
	form.appendChild(input)
	return form;
}

var createDiv = function(id, no=null){
	var div = document.createElement('div');
	div.setAttribute("id",id);
	if(no){
		var div2 = document.createElement('div');
		var a = document.createElement('a');
		a.innerHTML = no;
		div2.appendChild(a);
		div2.appendChild(div)
		return div2
	}
	return div
}

var rendF = {
	'northernHemisphere': {
		func: nhTemp,
		html: function(debug=false){
			var no = 16;
			if(!false) no = debug;
			document.body.appendChild(createDiv('northernHemisphere', no));
		},
	},
	'globalTemperatures': {
		func: zonalTemp().globTemp,
		html: function(debug=false){
			var no = 17;
			if(!false) no = debug;
			document.body.appendChild(createDiv('globalTemperatures', no));
		},
	},
	'temperatureDifference1': {
		func: zonalTemp().diff.artic, 	// TODO opt
		html: function(debug=false){
			var no = 20;
			if(!false) no = debug;
			document.body.appendChild(createDiv('temperatureDifference1', no));
		},
	},
	'temperatureDifference2': {
		func: zonalTemp().diff.nh,    	// 
		html: function(debug=false){
			var no = 21;
			if(!false) no = debug;
			document.body.appendChild(createDiv('temperatureDifference2', no));
		},
	},
	'temperatureDifference3': {
		func: zonalTemp().diff.glob,	//
		html: function(debug=false){
			var no = 22;
			if(!false) no = debug;
			document.body.appendChild(createDiv('temperatureDifference3', no));
		},
	},
	'arcticTemperatures': {
		func: zonalTemp().arctic, 
		html: function(debug=false){
			var no = 16.1;
			if(!false) no = debug;
			document.body.appendChild(createDiv('arcticTemperatures', no));
		},
	},
	'abiskoLakeIce':{
		func: tornetrask,
		html: function(debug=false){
			var no = 43;
			if(!false) no = debug;
			document.body.appendChild(createDiv('abiskoLakeIce', no));
		},
	}, 
	'abiskoSnowDepthMeans':{
		func: abiskoSnowDepth,
		html: function(debug=false){
			var no = 41;
			if(!false) no = debug;
			document.body.appendChild(createDiv('abiskoSnowDepthMeans'))
			no = 42;
			if(!false) no = debug;
			document.body.appendChild(createDiv('abiskoSnowDepthMeans2'))
		},
	},
	'AbiskoTemperatures':{
		func: parseAb().temps.yrly,
		html: function(debug=false){
			var no = 1;
			if(!false) no = debug;
			document.body.appendChild(createDiv('AbiskoTemperatures', no));
		},

	}, 
	'AbiskoTemperaturesSummer': {
		func: parseAb().temps.summer,
		html: function(debug=false){
			var no = 2;
			if(!false) no = debug;
			document.body.appendChild(createDiv('AbiskoTemperaturesSummer', no));
		},
	}, 
	'AbiskoTemperaturesWinter': {
		func: parseAb().temps.winter,
		html: function(debug=false){
			var no = 3;
			if(!false) no = debug;
			document.body.appendChild(createDiv('AbiskoTemperatures', no));
		},
	},
	'temperatureDifferenceAbisko': {
		func: parseAb().temps.diff.yrly,
		html: function(debug=false){
			var no = 19;
			if(!false) no = debug;
			document.body.appendChild(createDiv('yearlyPrecipitationDifference', no));
		},
	},
	'monthlyAbiskoTemperatures': {
		func: parseAb().temps.monthly,
		html: function(debug=false){
			var no = 4;
			if(!false) no = debug;
			months().forEach((month, index) => {
				document.body.appendChild(createDiv('monthlyAbiskoTemperatures_'+month, no));
			})
		},
	}, 
	'yearlyPrecipitation': {
		func: parseAb().precip.yrly,
		html: function(debug=false){
			var no = 23;
			if(!false) no = debug;
			document.body.appendChild(createDiv('yearlyPrecipitation', no));
		},
	}, 
	'summerPrecipitation': {
		func: parseAb().precip.summer,
		html: function(debug=false){
			var no = 24;
			if(!false) no = debug;
			document.body.appendChild(createDiv('summerPrecipitation', no));
		},
	}, 
	'winterPrecipitation': {
		func: parseAb().precip.winter,
		html: function(debug=false){
			var no = 25;
			if(!false) no = debug;
			document.body.appendChild(createDiv('winterPrecipitation', no));
		},
	}, 
	'yearlyPrecipitationDifference': {
		func: parseAb().precip.diff.yrly,
		html: function(debug=false){
			var no = 38;
			if(!false) no = debug;
			document.body.appendChild(createDiv('yearlyPrecipitationDifference', no));
		},
	}, 
	'summerPrecipitationDifference': {
		func: parseAb().precip.diff.summer,
		html: function(debug=false){
			var no = 39;
			if(!false) no = debug;
			document.body.appendChild(createDiv('summerPrecipitationDifference', no));
		},
	}, 
	'winterPrecipitationDifference': {
		func: parseAb().precip.diff.winter,
		html: function(debug=false){
			var no = 40;
			if(!false) no = debug;
			document.body.appendChild(createDiv('winterPrecipitationDifference', 25, no));
		},
	}, 
	'monthlyPrecipitation': {
		func: parseAb().precip.monthly,
		html: function(debug=false){
		var no = 0;
			if(!false) no = debug;
			months().forEach(month => {
				document.body.appendChild(createDiv('monthlyPrecipitation_'+month, no));
			})
		},
	}, 
	'growingSeason': {
		func: parseAb().growingSeason,
		html: function(debug=false){
			var no = 18;
			if(!false) no = debug;
			document.body.appendChild(createDiv('growingSeason', no));
		}
	}
}

