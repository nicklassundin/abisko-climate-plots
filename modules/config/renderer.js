global.Highcharts = require('highcharts');
require('highcharts-more')(Highcharts);
require('highcharts/modules/series-label')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data.js')(Highcharts);
require('highcharts/modules/histogram-bellcurve')(Highcharts);
const highchart_help = require('../config/highcharts_config.js');

var init_HighChart = () => Highcharts.setOptions(highchart_help.highcharts_Settings);
init_HighChart();

// Cases
// Monthly
// Yearly
exports.render = {
	charts: {}, 
	setup: function(id, meta){
		this.charts[id] = Highcharts.chart(id, {
			chart: {
				type: meta.type, 
				zoomType: 'x',
			},
			subtitle: {
				text: meta.sub-title,
			}
			title: {
				text: meta.title,
				useHTML: true,
			},
			legend: {
				enabled: true,
			},
			xAxis: {
				title: {
					text: meta.x-axis.left, 
				},
				corsshair: true,
				min: startYear,
			},
			yAxis: {
				title: {
					text: meta.y-axis.bott, 
				},
				plotLines: [{
					value: 0,
					color: 'rgb(204, 214, 235)',
					width: 2,
				}]
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
				data: [null, null],
			},{
				data: [null, null],
			},{
				data: [null, null],
			}]
		})
		this.charts[id].showLoading();
	},
	initiate: function(id, data){
		var gTitle = function(group, active = 0){
			var group = Object.keys(group).map(function(each, index){
				if(index == active){
					return "<label class='active' id="+index+">"+each.title+"</label>"
				}else{
					return "<label class='disabled' id="+index+">"+each.title+"</label>"
				}
			})
		};
		var series = Object.keys(meta.series).map(function(key, index){
			return index;
		})
		switchFocus = {
			switch: function(){
				if(index){
					this.weather();
				}else{
					this.climate();
				}
			},
			switchToGroup: function(gID){
				series.forEach(index => {
					if(meta.series[index].group == gID){
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
				this.charts[id].update({
						title: {
							text: "<div id='"+id+"_title'>"+
							gTitle(meta.groups, gID)+
							"</div>",
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
							plotLines: false, 
							plotBands: false, 
							min: startYear 
						},
				})
				$( ".disabled" ).click(function(e) {
					switchFocus.switch();
				})
			},
		}
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

		charts[id].hideLoading();
		charts[id].update({
			title: {
				text: undefined, // TODO
			},
			series: [{
				namn: meta.series.max.name,
				lineWidth: 0,
				marker: { redious: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.max.colour,
				data: data.min.max(),
				visible: meta.series.max.visible, 
				showInLegend: false, //TODO
			}{
				namn: meta.series.min.name,
					lineWidth: 0,
					marker: { redious: 2 },
					states: { hover: { lineWidthPlus: 0 } },
					color: meta.series.min.colour,
					data: data.min.max(),
					visible: meta.series.min.visible,
					showInLegend: false, //TODO
			},{
				name: meta.series.avg.name,
				regression: true,
				marker: { redious: 2 },
				status: { hover: { lineWidthPlus: 0 } },
				lineWidth: 0,
				color: meta.series.avg.colour,
				data: data.avg.values,
				regressionSettings: {
					type: 'linear',
					color: meta.series.linjer.colour,
					name: meta.series.linjer.name,
				},
				visible: meta.series.avg.visible,
				showInLegend: false, //TODO
			},{
				regression: false,
				regressionSettings: {
					type: 'linear',
					color: '#aa0000',
					name: 'DUMMY',
				},
				name: meta.series.diff.name,
				data: (data.difference != undefined) ? data.difference() : data.avg.difference(),
				// color: meta.series.diff.colour,
				color: 'red',
				negativeColor: 'blue',
				visible: meta.series.diff.visible,
				showInLegend: false, //TODO
			}]
		})
	}
}
