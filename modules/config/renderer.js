global.Highcharts = require('highcharts');
require('highcharts-more')(Highcharts);
require('highcharts/modules/series-label')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data.js')(Highcharts);
require('highcharts/modules/histogram-bellcurve')(Highcharts);
const highchart_help = require('../../config/highcharts_config.js');
var base = require('../render.js')

// console.log(base)
// console.log(Object.keys(base))

var init_HighChart = () => Highcharts.setOptions(highchart_help.highcharts_Settings);
init_HighChart();

// Cases
// Monthly
// Yearly

var chart = {
	id: undefined,
	chart: undefined,
	meta: undefined,
	setup: function(id, meta){
		this.id = id;
		this.meta = meta;
		this.chart = Highcharts.chart(id, {
			chart: {
				type: meta.type, 
				zoomType: 'x',
			},
			subtitle: {
				text: meta.subTitle,
			},
			title: {
				text: meta.title,
				useHTML: true,
			},
			legend: {
				enabled: true,
			},
			xAxis: {
				title: {
					text: meta.xAxis.left, 
				},
				corsshair: true,
				min: startYear,
			},
			yAxis: {
				title: {
					text: meta.yAxis.bott, 
				},
				plotLines: [{
					value: 0,
					color: 'rgb(204, 214, 235)',
					width: 2,
				}],
				// max: 60,
				// min: -20,
				ticketInterval: 1,
				lineWidth: 1,
			},
			tooltip: {
				shared: true,
				valueSuffix: ' °C',
				valueDecimals: 2,
			},
			series: [{
				showInLegend: false,
				data: [null, null],
			},{
				showInLegend: false,
				data: [null, null],
			},{
				showInLegend: false,
				data: [null, null],
			},{
				showInLegend: false,
				data: [null, null],
			},{
				showInLegend: false,
				data: [null, null],
			}]
		})
		this.chart.showLoading();
	},
	groupTitle: function(active = 0){
		var meta = this.meta;
		var group = Object.keys(meta.groups).map(function(each, index){
			if(index == active){
				return "<label class='active' id="+index+">"+meta.groups[each].title+"</label>"
			}else{
				return "<label class='disabled' id="+index+">"+meta.groups[each].title+"</label>"
			}
		})
		return "<div id='"+this.id+"_title'>" + group + "</div>"
	},
	initiate: function(data){
		console.log(data)
		var id = this.id;
		var meta = this.meta;
		// $('#'+id).bind('mousewheel', function(e){
		// 	delta = delta + e.originalEvent.deltaY;
		// 	if(delta < -100){
		// 		delta = 0;
		// 		switchFocus.weather();
		// 	}else if(delta > 100){
		// 		delta = 0;
		// 		switchFocus.climate();
		// 	}
		// 	return false;
		// });

		this.chart.hideLoading();
		this.chart.update({
			title: {
				text: this.groupTitle(0),
				useHTML: true,
			},
			series: [{
				name: meta.series.max.name,
				lineWidth: 1,
				marker: { redious: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.max.colour,
				data: data.min.max(),
				visible: false,
				showInLegend: false, //TODO
				type: meta.series.max.type,
			},{
				name: meta.series.min.name,
				lineWidth: 1,
				marker: { redious: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.min.colour,
				data: data.min.min(),
				visible: false,
				showInLegend: false, //TODO
				type: meta.series.min.type,
			},{
				name: meta.series.avg.name,
				lineWidth: 1,
				regression: true,
				marker: { redious: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.avg.colour,
				data: data.avg.values,
				regressionSettings: {
					type: 'linear',
					color: meta.series.linjer.colour,
					name: meta.series.linjer.name,
				},
				visible: false,
				showInLegend: false, //TODO
				type: meta.series.avg.type,
			},{
				regression: false,
				regressionSettings: {
					type: 'linear',
					color: '#aa0000',
					name: 'DUMMY',
				},
				name: meta.series.diff.name,
				type: meta.series.diff.type,
				data: (data.difference != undefined) ? data.difference() : data.avg.difference(),
				color: 'red',
				negativeColor: 'blue',
				visible: false,
				showInLegend: false, //TODO
			},{
				name: meta.series.linjer.name,
				typ: meta.series.linjer.typ,
				visible: false,
				showInLegend: false
			}]
		})
		this.switchToGroup(0)	
	},
	switch: function(){
		if(index){
			this.weather();
		}else{
			this.climate();
		}
	},
	switchToGroup: function(gID){
		var meta = this.meta;
		var id = this.id;
		// console.log(gID)
		Object.keys(meta.series).forEach((key, index) => {
			if(meta.series[key].group == gID){
				// console.log("Show")
				// console.log(key)
				// console.log(meta.series[key].group)
				$('#' + id).highcharts().series[index].update({
					visible: true,
					showInLegend: true,
				})
			}else{
				// console.log("Hide")
				// console.log(key)
				// console.log(meta.series[key].group)
				$('#' + id).highcharts().series[index].update({
					visible: false,
					showInLegend: false,
				})
			}
		})
		this.chart.update({
			title: {
				text: this.groupTitle(gID),
				useHTML: true,
			},
			subtitle: {
				text: '' 
			},
			xAxis: {
				title: {
					text: Highcharts.getOptions().lang.years, 
				},
				crosshair: true,
				plotLines: meta.groups[gID].baseline ? base.baseline.plotlines(id) : false, 
				plotBands: meta.groups[gID].baseline ? base.baseline.plotBandsDiff(id) : false, 
				min: startYear 
			},
		})
		var chart = this;
		$( ".disabled" ).click(function(e) {
			// console.log(e)
			chart.switchToGroup(e.target.id);
		})
	},
	clone: function(){
		return Object.assign({}, this);
	}
}
exports.render = {
	charts: {},
	setup: function(id, meta){
		this.charts[id] = chart.clone();
		this.charts[id].setup(id, meta);
	},
	initiate: function(id, data){
		this.charts[id].initiate(data)
	}
}
