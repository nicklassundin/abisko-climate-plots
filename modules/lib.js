var $ = require('jquery')
global.nav_lang = 'en';
global.baselineLower = '';
global.baselineUpper = '';

global.stationType = "abisko" 
// global.station = 159880;
// global.station = 188790;

var config = require('./config/dataset.js').config;
var charts = require('./config/charts.js');

lib = {
	renderChart: function(div, type, id="abisko"){ 
		global.station = id;
		// TODO refractor later
		if(id=="abisko"){
			if(stationType != "abisko"){
				global.stationType = "abisko";
				config = require('./config/dataset.js').config;
				charts = require('./config/charts.js');
			}
		}else{
			if(stationType != "smhi"){
				global.stationType = "smhi";
				config = require('./config/dataset.js').config;
				charts = require('./config/charts.js');
			}
		}
		$(function(){
			div.appendChild(charts.rendF[type].html());
			charts.rendF[type].func();
			return div;
		})
	},
	// listCharts: charts.ids
}
