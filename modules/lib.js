var $ = require('jquery')
global.nav_lang = 'en';
global.baselineLower = '';
global.baselineUpper = '';

// global.station = "abisko" 
// global.station = 159880;
// global.station = 188790;


lib = {
	renderChart: function(div, type, id="abisko"){ 
		global.station = id;
		$(function(){
			var config = require('./config/dataset.js').config;
			var charts = require('./config/charts.js');
			div.appendChild(charts.rendF[type].html());
			charts.rendF[type].func();
			return div;
		})
	},
	// listCharts: charts.ids
}
