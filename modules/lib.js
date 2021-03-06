
console.log("Visual Change Library Restart")
var $ = require('jquery')
global.queryString = require('query-string');
global.nav_lang = 'en';
var constant = require('../config/const.json');
global.startYear = constant.startYear;
global.baselineLower = constant.baselineLower;
global.baselineUpper = constant.baselineUpper;

// global.station = 159880;
// global.station = 188790;
// global.stationName = "";
global.hostUrl = undefined; 

var today = new Date();
global.variables = {
	date: new Date(today.getFullYear()-1, 11, 24),
	dateStr: function(){ return (this.date.getYear()+1900)+"-"+(this.date.getMonth()+1)+"-"+this.date.getDate() },
	metas: {},
}

var charts = require('./config/dataset/struct.js').struct
var sets = require('../static/preset.json');
exports.stats = require('./stats/config.js')

var meta = require('./config/metaMngr.js').meta

const stationTypeMap = require('../static/charts/stationTypeMap.json');
lib = {
	renderChart: function(div, type, url=window.location.origin){
		if(type.startYear) startYear = null;
		if(hostUrl){
			if(url){
				hostUrl = url;
			}else{
				hostUrl = window.location.origin
			}
		}
		meta.getMeta(type).then(cfg =>{
			$(function(){
				cfg.files.config.noAxisLim = type.override ? !type.override.axislim : false;
				cfg.files.config.contex = type.context === undefined ? true : type.context
				var chrt = charts.build(cfg, div)
			})
		})
	},
	renderSets: function(div, 
		set=(new URL(window.location.href).searchParams.get("set")), 
		id=(new URL(window.location.href).searchParams.get("station")), 
		url=window.location.origin){
		if(url){
			hostUrl = url;
		}else{
			hostUrl = window.location.origin
		} 
		variables.debug = (new URL(window.location.href).searchParams.get("debug") == "true" ? true : false)
		if(variables.debug) {
			var debug = document.createElement("div");
			debug.setAttribute("class", "debug");
			debug.innerHTML = "set: "+ set +"</br> station: "+ id
			div.appendChild(debug)
		}
		var ids = sets[set] ? sets[set] : [set];
		if(!Array.isArray(ids)){
			ids = Object.values(ids);
		}else{
			ids = ids.map(each => {
				return {
					"station": id,
					"plot": each,
				}
			})
		}
		ids.forEach(type => {
			var container = document.createElement("div");
			type.id = type.station+'_'+type.plot;
			$.extend(true, type, stationTypeMap[type.station]);
			container.setAttribute("id", "mark_"+type.id);
			if(variables.debug) {
				var debug = document.createElement("div");
				debug.setAttribute("class", "debug");
				debug.setAttribute("id", "debug_"+type);
				debug.innerHTML = "type: "+ type +"</br> station: "+ id
				var table = document.createElement("table");
				table.setAttribute("class", "debug");
				table.setAttribute("id", "debug_table_"+type.id);
				debug.appendChild(table)
				container.appendChild(debug)
			}
			div.appendChild(container);
			this.renderChart(container, type, url)
		})
	},
}

