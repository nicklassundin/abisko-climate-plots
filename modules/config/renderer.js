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
					text: meta.xAxis.bott, 
				},
				corsshair: true,
				min: startYear,
			},
			yAxis: {
				title: {
					text: meta.yAxis.left, 
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
				valueSuffix: ' '+meta.valueSuffix,
				valueDecimals: meta.decimals,
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
		if(Object.keys(meta.groups).length > 1){
			var gTitle = this.groupTitle();
			$('#'+id).append(gTitle);
			this.chart.showLoading();
		}
	},
	groupTitle: function(active = 0){
		var meta = this.meta;
		var group = Object.keys(meta.groups).map(function(each, index){
			if(index == active){
				return "<button class='tablinks active' id="+index+">"+meta.groups[each].title+"</button>"
			}else{
				return "<button class='tablinks' id="+index+">"+meta.groups[each].title+"</button>"
			}
		})
		return "<div id='"+this.id+"_title' class='tab'>" + group + "</div>"
	},
	initiate: function(data){
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
				text: meta.title,
				useHTML: true,
			},
			series: [{
				name: meta.series.max.name,
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.max.colour,
				data: (data.max.max != undefined) ? data.max.max() : data.max(),
				visible: false,
				showInLegend: false, //TODO
				type: meta.series.max.type,
			},{
				name: meta.series.min.name,
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.min.colour,
				data: (data.min.min != undefined) ? data.min.min() : data.min(),
				visible: false,
				showInLegend: false, //TODO
				type: meta.series.min.type,
			},{
				name: meta.series.avg.name,
				lineWidth: 0,
				regression: true,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.avg.colour,
				data: (data.avg != undefined) ? data.avg.values : data.values,
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
		if(Object.keys(meta.groups).length > 1){
			var chart = this;
			$( ".tablinks" ).click(function(e) {
				$(".tablinks").toggleClass('active')
				// e.currentTarget.className += " active";
				chart.switchToGroup(e.target.id);
			})
		}
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
				// // console.log("Show")
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
				text: meta.title.replace("[stationName]", stationName),
				useHTML: true,
			},
			subtitle: {
				text: meta.groups[gID].subTitle.replace("[baseline]", baselineLower +" - "+ baselineUpper)
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
