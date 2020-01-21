var $ = require('jquery')
global.nav_lang = 'en';
global.baselineLower = '';
global.baselineUpper = '';
global.station = 159880;

var config = require('./config/dataset.js').config;
var charts = require('./config/charts.js');

lib = {
	renderChart: function(div, type, id){ 
		station = id;
		$(function(){
			div.appendChild(charts.rendF[type].html());
			charts.rendF[type].func();
			return div;
		})
	},
	listCharts: charts.ids
}
