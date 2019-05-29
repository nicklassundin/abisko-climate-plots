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


var PLACEHOLDER_abisko = function(){
	parseAbisko('data/ANS_Temp_Prec.csv','https://www.arcticcirc.net/');
}

var tornetrask = function(){
	parseTornetrask('data/Tornetrask_islaggning_islossning.csv','https://www.arcticcirc.net/');
}

var abiskoSnowDepth = function() {
	parseSnowDepth('data/ANS_SnowDepth_1913-2017.csv','https://www.arcticcirc.net/');

}


var cached = null;
var parseAb = function(){
	if(!cached){
		var cached = parseAbiskoGen('data/ANS_Temp_Prec.csv','https://www.arcticcirc.net/');
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
			diff: {
				yrly: function(){
					cached(renderTemperatureDifferenceGraph, 'temperatureDifferenceAbisko', 'Temperature difference for Abisko', 'temperatures')
				},
			}
		},
		percip: {
			yrly: function(){
				cached(renderYearlyPrecipitationGraph, 'yearlyPrecipitation','Yearly precipitation', 'yearlyPrecipitation')
			},
			summer: function(){
				cached(renderYearlyPrecipitationGraph, 'summerPrecipitation','Precipitation for '+summerRange, 'summerPrecipitation')
			},
			winter: function(){
				cached(renderYearlyPrecipitationGraph, 'winterPrecipitation','Precipitation for '+winterRange, 'winterPrecipitation')
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
		}
	};
	return result;
}

var createDiv = function(id){
	var div = document.createElement('div');
	div.setAttribute("id",id);
	return div
}

var rendF = {
	'northernHemisphere': {
		func: nhTemp,
		html: function(){
			document.body.appendChild(createDiv('northernHemisphere'));
		},
	},
	'globalTemperatures': {
		func: zonalTemp().globTemp,
		html: function(){
			document.body.appendChild(createDiv('globalTemperatures'));
		},
	},
	'temperatureDifference1': {
		func: zonalTemp().diff.artic, 	// TODO opt
		html: function(){
			document.body.appendChild(createDiv('temperatureDifference1'));
		},
	},
	'temperatureDifference2': {
		func: zonalTemp().diff.nh,    	// 
		html: function(){
			document.body.appendChild(createDiv('temperatureDifference2'));
		},
	},
	'temperatureDifference3': {
		func: zonalTemp().diff.glob,	//
		html: function(){
			document.body.appendChild(createDiv('temperatureDifference3'));
		},
	},
	'arcticTemperatures': {
		func: zonalTemp().arctic, 
		html: function(){
			document.body.appendChild(createDiv('arcticTemperatures'));
		},
	},
	'abiskoLakeIce':{
		func: tornetrask,
		html: function(){
			document.body.appendChild(createDiv('abiskoLakeIce'));
		},
	}, 
	'abiskoSnowDepthMeans':{
		func: abiskoSnowDepth,
		html: function(){
			document.body.appendChild(createDiv('abiskoSnowDepthMeans'))
			document.body.appendChild(createDiv('abiskoSnowDepthMeans2'))
		},
	},
	'AbiskoTemperatures':{
		func: parseAb().temps.yrly,
		html: function(){
			document.body.appendChild(createDiv('AbiskoTemperatures'));
		},

	}, 
	'AbiskoTemperaturesSummer': {
		func: parseAb().temps.summer,
		html: function(){
			document.body.appendChild(createDiv('AbiskoTemperatures'));
		},
	}, 
	'AbiskoTemperaturesWinter': {
		func: parseAb().temps.winter,
		html: function(){
			document.body.appendChild(createDiv('AbiskoTemperatures'));
		},
	},
	'monthlyAbiskoTemperatures': {
		func: PLACEHOLDER_abisko,
		html: function(){
			months().forEach(month => {
				document.body.appendChild(createDiv('monthlyAbiskoTemperatures_'+month));
			})
		},
	}, 
	'yearlyPrecipitation': {
		func: parseAb().percip.yrly,
		html: function(){
			// document.body.appendChild(createDiv('AbiskoTemperatures'));
		},
	}, 
	'summerPrecipitation': {
		func: parseAb().percip.summer,
		html: function(){
			// document.body.appendChild(createDiv('AbiskoTemperatures'));
		},
	}, 
	'winterPrecipitation': {
		func: parseAb().percip.winter,
		html: function(){
			// document.body.appendChild(createDiv('AbiskoTemperatures'));
		},
	}, 
	'yearlyPrecipitationDifference': {
		func: parseAb().percip.diff.yrly,
		html: function(){
			// document.body.appendChild(createDiv('AbiskoTemperatures'));
		},
	}, 
	'summerPrecipitationDifference': {
		func: parseAb().percip.diff.summer,
		html: function(){
			// document.body.appendChild(createDiv('AbiskoTemperatures'));
		},
	}, 
	'winterPrecipitationDifference': {
		func: parseAb().percip.diff.winter,
		html: function(){
			// document.body.appendChild(createDiv('AbiskoTemperatures'));
		},
	}, 
	'monthlyPrecipitation': {
		func: PLACEHOLDER_abisko,
		html: function(){
			months().forEach(month => {
				document.body.appendChild(createDiv('monthlyPrecipitation_'+month));
			})
		},
	}, 
}


// var parseAb = parseAbiskoGen('data/ANS_Temp_Prec.csv','https://www.arcticcirc.net/');


// parseAb(renderTemperatureGraph, 'AbiskoTemperatures', 'Abisko temperatures', 'temperatures');
// parseAb(renderAbiskoMonthlyTemperatureGraph, 'AbiskoTemperaturesSummer', 'Abisko temperatures for '+summerRange, 'summerTemps');
// parseAb(renderAbiskoMonthlyTemperatureGraph, 'AbiskoTemperaturesWinter', 'Abisko temperatures for '+winterRange, 'winterTemps');

// parseAb(renderTemperatureDifferenceGraph, 'temperatureDifferenceAbisko', 'Temperature difference for Abisko', 'temperatures')
// parseAb(renderYearlyPrecipitationGraph, 'yearlyPrecipitation','Yearly precipitation', 'yearlyPrecipitation')

// parseAb(renderYearlyPrecipitationGraph, 'summerPrecipitation','Precipitation for '+summerRange, 'summerPrecipitation')
// parseAb(renderYearlyPrecipitationGraph, 'winterPrecipitation','Precipitation for '+winterRange, 'winterPrecipitation')

// parseAb(renderPrecipitationDifferenceGraph, 'yearlyPrecipitationDifference', 'Precipitation difference', 'yearlyPrecipitation');
// parseAb(renderPrecipitationDifferenceGraph, 'summerPrecipitationDifference', 'Precipitation difference '+summerRange, 'summerPrecipitation');
// parseAb(renderPrecipitationDifferenceGraph, 'winterPrecipitationDifference', 'Precipitation difference '+winterRange, 'winterPrecipitation');


