var $ = require('jquery')
global.nav_lang = 'en';
global.baselineLower = '';
global.baselineUpper = '';

global.stationType = "abisko" 
// global.station = 159880;
// global.station = 188790;
global.stationName = "";

global.variables = {
	date: new Date(),
	dateStr: function(){ return (this.date.getYear()+1900)+"-"+(this.date.getMonth()+1)+"-"+this.date.getDate() }
}

var config = require('./config/dataset.js').config;
var charts = require('./config/charts.js');
var sets = require('../config/custom.json');

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
	renderSets: function(div, set=(new URL(window.location.href).searchParams.get("set")), id=(new URL(window.location.href).searchParams.get("station"))){
		sets[set].forEach(type => {
			var container = document.createElement("div");
			container.setAttribute("id", "mark_"+type);
			div.appendChild(container);
			this.renderChart(container, type, id)
		})
	}
}
