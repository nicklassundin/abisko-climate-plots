var $ = require('jquery')
global.nav_lang = 'en';
global.baselineLower = '';
global.baselineUpper = '';
global.station = '';

var config = require('./config/dataset.js').config;
var charts = require('./config/charts.js');

lib = {
	renderChart: function(div, id){ 
		$(function(){
			div.appendChild(charts.rendF[id].html());
			charts.rendF[id].func();
			return div;
		})
	},
	listCharts: charts.ids
}
