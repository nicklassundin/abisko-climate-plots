global.Highcharts = require('highcharts');
require('highcharts-more')(Highcharts);
require('highcharts/modules/series-label')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data.js')(Highcharts);
require('highcharts/modules/histogram-bellcurve')(Highcharts);
const highchart_help = require('../../config/highcharts_config.js');
var base = require('../render.js')

const help = require('../helpers.js');
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
				max: meta.yAxis.max,
				min: meta.yAxis.min,
				ticketInterval: 1,
				lineWidth: 1,
			},
			tooltip: {
				shared: true,
				valueSuffix: ' '+meta.valueSuffix,
				valueDecimals: meta.decimals,
			},
			series: Object.keys(meta.series).map(each => ({
				showInLegend: false,
				data: [null, null],
			}))
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
		var seriesBuild = {
			max: () => ({
				name: meta.series.max.name,
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.max.colour,
				data: (data.max.max != undefined) ? data.max.max() : data.max(),
				visible: false,
				showInLegend: false, //TODO
				type: meta.series.max.type,
			}),
			min: () => ({
				name: meta.series.min.name,
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.min.colour,
				data: (data.min.min != undefined) ? data.min.min() : data.min(),
				visible: false,
				showInLegend: false, //TODO
				type: meta.series.min.type,
			}),
			avg: () => ({
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
			}),
			diff: () => ({
				regression: false,
				regressionSettings: {
					type: 'linear',
					color: '#aa0000',
					name: 'DUMMY',
				},
				name: meta.series.diff.name,
				type: meta.series.diff.type,
				data: (data.difference != undefined) ? data.difference() : (data.avg != undefined) ? data.avg.difference() : data.total.difference(),
				color: 'red',
				negativeColor: 'blue',
				visible: false,
				showInLegend: false, //TODO
			}),
			linjer: () => ({
				name: meta.series.linjer.name,
				type: meta.series.linjer.typ,
				visible: false,
				showInLegend: false
			}),
			snow: () => ({
				name: meta.series.snow.name,
				type: meta.series.snow.type,
				stack: meta.groups[meta.series.snow.group].title,
				stacking: 'normal',
				color: meta.series.snow.colour,
				data: data.snow.values,
				visible: false,
				showInLegend: false,
				borderColor: meta.series.snow.borderColour,
				states: {
					hover: {
						color: meta.series.snow.hoverColour,
						animation: {
							duration: 0,
						}
					}
				}
			}),
			rain: () => ({
				name: meta.series.rain.name,
				type: meta.series.rain.type,
				stack: meta.groups[meta.series.rain.group].title,
				stacking: 'normal',
				data: data.rain.values,
				color: meta.series.rain.colour,
				visible: false,
				showInLegend: false,
				borderColor: meta.series.rain.borderColour,
				states: {
					hover: {
						color: meta.series.rain.hoverColour,
						animation: {
							duration: 0,
						}
					}
				}
			}),
			iceTime: () => ({
				regression: false,
				type: meta.series.iceTime.type,
				regressionSettings: {
					type: 'linear',
					color: '#00bb00',
					name: '[placeholder]',
				},
				name: meta.series.iceTime.name,
				color: meta.series.iceTime.colour,
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				data: data.iceTime,
			}),
			freeze: () => ({
				regression: false,
				type: meta.series.freeze.type,
				regressionSettings: {
					type: 'linear',
					color: '#0000ee',
					name: '[placeholder]',
				},
				name: meta.series.freeze.name,
				color: meta.series.freeze.colour,
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				data: data.freezeDOY,
			}),
			breakup: () => ({
				regression: false,
				type: meta.series.breakup.type,
				regressionSettings: {
					type: 'linear',
					color: '#0000ee',
					name: '[placeholder]',
				},
				name: meta.series.breakup.name,
				color: meta.series.breakup.colour,
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				data: data.breakupDOY,
			})
		}
		this.chart.hideLoading();
		var series = [];
		Object.keys(meta.series).forEach(key => {
			if(meta.series[key].visible){
				series.push(seriesBuild[key]());
			}else{
				series.push({
					visible: false,
					showInLegend: false
				})
			}
		})
		this.chart.update({
			title: {
				text: meta.title,
				useHTML: true,
			},
			series: series
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
		Object.keys(meta.series).forEach((key, index) => {
			if(meta.series[key].group == gID){
				$('#' + id).highcharts().series[index].update({
					visible: true,
					showInLegend: true,
				})
			}else{
				$('#' + id).highcharts().series[index].update({
					visible: false,
					showInLegend: false,
				})
			}
		})
		this.chart.update({
			title: {
				text: meta.title.replace("[stationName]", stationName).replace("[month]", meta.month),
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
		if(meta.month){
			this.charts[id] = {};
			this.charts[id].meta = meta;
			help.months().forEach((month, index) => {
				var cloneMeta = Object.assign({}, meta, {});
				cloneMeta.month = help.monthName(month);
				this.charts[id][month] = chart.clone();
				this.charts[id][month].setup(id+"_"+month, cloneMeta);
			})
		}else{
			this.charts[id] = chart.clone();
			this.charts[id].setup(id, meta);
		}
	},
	initiate: function(id, data){
		if(this.charts[id].meta.month){
			help.months().forEach((month, index) => {
				this.charts[id][month].initiate(data[index+1+'']);
			})
		}else{
			this.charts[id].initiate(data)
		}
	}
}
