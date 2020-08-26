var $ = require('jquery')
global.nav_lang = 'en';
var constant = require('../config/const.json');
global.startYear = constant.startYear;
global.baselineLower = constant.baselineLower;
global.baselineUpper = constant.baselineUpper;

global.stationType = "abisko" 
// TODO example IDs test
// global.station = 159880;
// global.station = 188790;
global.stationName = "";
global.hostUrl = undefined; 

var today = new Date();
global.variables = {
	date: new Date(today.getFullYear()-1, 11, 24),
	dateStr: function(){ return (this.date.getYear()+1900)+"-"+(this.date.getMonth()+1)+"-"+this.date.getDate() },
	metas: {},
}

var charts = require('./config/charts/config.js');
var sets = require('../static/preset.json');
lib = {
	renderChart: function(div, type, id="abisko", url){ 
		if(url){
			hostUrl = url;
		}else{
			hostUrl = location.protocol +"//"+ require("../config/server.json").domain;
		}
		global.station = id;
		// TODO refractor later
		if(id=="abisko"){
			if(stationType != "abisko"){
				global.stationType = "abisko";
				charts = require('./config/charts/config.js');
			}
		}else{
			if(stationType != "smhi"){
				global.stationType = "smhi";
				charts = require('./config/charts/config.js');
			}
		}
		$(function(){
			div.appendChild(charts.rendF[type].html());
			charts.rendF[type].func();
			return div;
		})
	},
	renderSets: function(div, set=(new URL(window.location.href).searchParams.get("set")), id=(new URL(window.location.href).searchParams.get("station")), url){
		if(url){

			hostUrl = url;
		}else{
			hostUrl = location.protocol +"//"+ require("../config/server.json").domain;
		} 
		variables.debug = (new URL(window.location.href).searchParams.get("debug") == "true" ? true : false)
		if(variables.debug) {
			var debug = document.createElement("div");
			debug.setAttribute("class", "debug");
			debug.innerHTML = "set: "+ set +"</br> station: "+ id
			div.appendChild(debug)
		}

		sets[set].forEach(type => {
			var container = document.createElement("div");
			container.setAttribute("id", "mark_"+type);
			if(variables.debug) {
				var debug = document.createElement("div");
				debug.setAttribute("class", "debug");
				debug.setAttribute("id", "debug_"+type);
				debug.innerHTML = "type: "+ type +"</br> station: "+ id
				var table = document.createElement("table");
				table.setAttribute("class", "debug");
				table.setAttribute("id", "debug_table_"+type);
				debug.appendChild(table)
				container.appendChild(debug)
			}
			div.appendChild(container);
			this.renderChart(container, type, id)
		})
	},
}

