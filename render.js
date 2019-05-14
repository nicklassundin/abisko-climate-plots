// language constant 
var l = 0;
var LANG = ['Svenska','English'];

// legend label constants
var MAX = ["Max", "Max"];
var MIN = ["Min","Min"];
var YRL_AVG = ["Yearly average", "Årligt genomsnitt"];
var MNTH_AVG = ["Monthly average", "Månatlig genomsnitt"];
var YRL_CNF_INT = ["Confidence interval (yearly avg.)", "Konfidence interval (Årligt genomsnitt)"];
var WK = ["Weeks","veckor"];
var MVNG_AVG = ["Moving average", "Rörligt genomsnitt"];
var MVNG_AVG_CNF_INT = ["Confidence interval (moving avg.)","Konfidence interval (rörligt genomsnitt)"];

// Percipitation
var PRC_SNW = ["Precipitation from snow", "Utfällning från snö"];
var PRC_RN = ["Precipitation from rain", "Utfällning från regn"];
var PRC_AVG = ["Total average precipitation", "Genomsnittlig utfällning"];
// Freeze-up and Break-up
var FRZ = ["Freeze-up","Freeze-up"];
var BRK = ["Break-up", "Break-up"];
var ICE_TIME = ["Ice time", "Ice time"];
var ICE_TIME_MVNG_AVG = ["Ice time (moving average)", "Ice time (moving average)"];

// Localization
var SWE_OPTION = {
	lang:{
		shortMonths: ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec'],
		downloadJPEG: 'Ladda ner som JPEG',
		downloadPDF: 'Ladda ner som PDF',
		months: ['Januari','Februari','Mars','April','Maj','Juni','Juli','Augusti','September','Oktober','November','December'],
	}
};

/*****************/
/* RENDER GRAPHS */
/*****************/



var global_chart_settings = {
	exporting: {
		// showTable: true, // TODO DATA TABLE
		buttons: {
			contextButton: {
				menuItems: [{
					textKey: 'downloadPDF',
					onclick: function(){
						this.exportChart({
							type: 'application/pdf'
						});
					},
				},{
					textKey: 'downloadJPEG',
					onclick: function(){
						this.exportChart({
							type: 'image/jpeg'
						});
					}
				},'downloadSVG','viewFullscreen','printChart',{
					separator: true,
				},{
					text: LANG[l],
					onclick: function(){
						if(l==0){
							l=1;
						}else{
							l=0;
						};
						// TODO Lang switching
					},
				},{
					text: 'Show data [DUMMY]',
					onclick: function(){
						if(this.options.exporting.showTable) {
							var element = this.dataTableDiv; 
							element.parentNode.removeChild(element);
						};
						this.update({
							exporting: {
								showTable: !this.options.exporting.showTable, 
							},
						});
						// TODO CHANGE export:showTable: true
					},
				}],
			},
		},
	},
};
Highcharts.setOptions(global_chart_settings);

var renderTemperatureGraph = function (temperatures, id, title) {
	// console.log(title);
	var chart = Highcharts.chart(id, {
		chart: {
			type: 'line',
			zoomType: 'xy',
		},
		title: {
			text: title,
		},
		xAxis: {
			title: {
				text: 'Year',
			},
			crosshair: true,
		},
		yAxis: {
			title: {
				text: 'Temperature [°C]'
			},
			plotLines: [{
				value: 0,
				color: 'rgb(204, 214, 235)',
				width: 2,
			}],
			max: 2,
			min: -3,
			tickInterval: 1,
			lineWidth: 1,
		},
		tooltip: {
			shared: true,
			valueSuffix: ' °C',
			valueDecimals: 2,
		},
		series: [{
			name: MAX[l],
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#ff0000',
			data: temperatures.max,
			visible: false,
		}, {
			name: MIN[l],
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#0000ff',
			data: temperatures.min,
			visible: false,
		}, 
			// 	{
			// 	name: YRL_AVG[l],
			// 	lineWidth: 0,
			// 	marker: { radius: 2 },
			// 	states: { hover: { lineWidthPlus: 0 } },
			// 	color: '#888888',
			// 	data: temperatures.avg,
			// 	visible: false,
			// },
			{
				name: YRL_CNF_INT[l],
				type: 'arearange',
				color: '#888888',
				data: temperatures.ci,
				zIndex: 0,
				fillOpacity: 0.3,
				lineWidth: 0,
				states: { hover: { lineWidthPlus: 0 } },
				marker: { enabled: false },
				visible: false,
			}, {
				name: MVNG_AVG[l],
				color: '#888888',
				marker: { enabled: false },
				data: temperatures.movAvg,
			}, {
				name: MVNG_AVG_CNF_INT[l],
				type: 'arearange',
				color: '#7777ff',
				data: temperatures.ciMovAvg,
				zIndex: 0,
				fillOpacity: 0.3,
				lineWidth: 0,
				states: { hover: { lineWidthPlus: 0 } },
				marker: { enabled: false },
			},
			{
				regression: true,
				name: 'Yearly averages',
				marker: {radius: 2},
				states: {hover: { lineWidthPlus: 0 }},
				lineWidth: 0,
				color: '#888888',
				regressionSettings: {
					type: 'linear',
					color: '#4444ff',
					name: 'Linear regression',
				},
				data: temperatures.avg,
			}],

		//
		// 	exporting: {
		// 		buttons: {
		// 			contextButton: {
		// 				menuItems: [{
		// 					textKey: 'downloadPDF',
		// 					onclick: function(){
		// 						this.exportChart({
		// 							type: 'application/pdf'
		// 						});
		// 					},
		// 				},{
		// 					separator: true
		// 				},{
		// 						textKey: 'downloadJPEG',
		// 					onclick: function(){
		// 						this.exportChart({
		// 							type: 'image/jpeg'
		// 						});
		// 					}
		// 				}],
		// 			},
		// 		},
		// 	},
		// 	navigation: {
		// 		menuItemStyle: {
		// 			padding: '10px',
		// 		},
		// 	},
		//
	});
};

var renderAbiskoTemperatureGraph = function (temperatures, id, title) {
	// console.log(title);
	Highcharts.chart(id, {
		chart: {
			type: 'line',
			zoomType: 'xy',
		},
		title: {
			text: title,
		},
		xAxis: {
			title: {
				text: 'Year',
			},
			crosshair: true,
		},
		yAxis: {
			title: {
				text: 'Temperature [°C]'
			},
			plotLines: [{
				value: 0,
				color: 'rgb(204, 214, 235)',
				width: 2,
			}],
			//max: 2,
			//min: -3,
			tickInterval: 1,
			lineWidth: 1,
		},
		tooltip: {
			shared: true,
			valueSuffix: ' °C',
			valueDecimals: 2,
		},
		series: [{
			// regression: true,
			// regressionSettings: {
			// 	type: 'polynomial',
			// 	color: '#ff0000',
			// 	name: 'Polynomial regression (max)'
			// },
			name: MAX[l],
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#ff0000',
			data: temperatures.max,
			visible: false,
		}, {
			// regression: true,
			// regressionSettings: {
			// 	type: 'polynomial',
			// 	color: '#0000ff',
			// 	name: 'Polynomial regression (min)'
			// },
			name: MIN[l],
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#0000ff',
			data: temperatures.min,
			visible: false,
		}, {
			regression: true,
			regressionSettings: {
				type: 'linear',
				color: '#888888',
				name: 'Linear regression',
				visible: false,
			},
			name: YRL_AVG[l],
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#888888',
			data: temperatures.avg,
			visible: true,
		},{
			regression: true,
			regressionSettings: {
				type: 'polynomial',
				color: '#aaaaaa',
				name: 'Polynomial regression',
				dashStyle: 'ShortDash',
				visible: false,
			},
			visible: false,
			showInLegend: false,
			enableMouseTracking: false,
			name: YRL_AVG[l],
			lineWidth: 0,
			marker: { radius: 0 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#888888',
			data: temperatures.avg,
		},{
			regression: true,
			regressionSettings: {
				type: 'loess',
				color: '#aaaaaa',
				name: 'Local regression',
				dashStyle: 'ShortDot',
				visible: false,
			},
			visible: false,
			showInLegend: false,
			enableMouseTracking: false,
			name: YRL_AVG[l],
			lineWidth: 0,
			marker: { radius: 0 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#888888',
			data: temperatures.avg,
		},{
			name: YRL_CNF_INT[l],
			type: 'arearange',
			color: '#888888',
			data: temperatures.ci,
			zIndex: 0,
			fillOpacity: 0.3,
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: { enabled: false },
			visible: false,
		}, {
			name: MVNG_AVG[l],
			color: '#888888',
			marker: { enabled: false },
			data: temperatures.movAvg,
		}, {
			name: MVNG_AVG_CNF_INT[l],
			type: 'arearange',
			color: '#7777ff',
			data: temperatures.ciMovAvg,
			zIndex: 0,
			fillOpacity: 0.3,
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: { enabled: false },
			visible: false,
		}],
	});
};

var renderAbiskoMonthlyTemperatureGraph = function (temperatures, id, title) {
	// console.log(title);
	// console.log(temperatures);
	Highcharts.chart(id, {
		chart: {
			type: 'line',
			zoomType: 'xy',
		},
		title: {
			text: title,
		},
		xAxis: {
			title: {
				text: 'Year',
			},
			crosshair: true,
		},
		yAxis: {
			title: {
				text: 'Temperature [°C]'
			},
			plotLines: [{
				value: 0,
				color: 'rgb(204, 214, 235)',
				width: 2,
			}],
			//max: 2,
			//min: -3,
			tickInterval: 1,
			lineWidth: 1,
		},
		tooltip: {
			shared: true,
			valueSuffix: ' °C',
			valueDecimals: 2,
		},
		series: [{
			name: MAX[l],
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#ff0000',
			data: temperatures.max,
			visible: false,
		}, {
			name: MIN[l],
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#0000ff',
			data: temperatures.min,
			visible: false,
		}, {
			regression: true,
			regressionSettings: {
				type: 'linear',
				color: '#aaaaaa',
				name: 'linear regression',
			},
			name: MNTH_AVG[l],
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#888888',
			data: temperatures.avg,
			visible: true,
		},{
			name: 'Confidence interval',
			type: 'arearange',
			color: '#888888',
			data: temperatures.ci,
			zIndex: 0,
			fillOpacity: 0.3,
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: { enabled: false },
			visible: false,

		},{
			name: 'Confidence interval (moving avg.)',
			type: 'arearange',
			color: '#7777ff',
			data: temperatures.ciMovAvg,
			zIndex: 0,
			fillOpacity: 0.3,
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: { enabled: false },
			visible: false,

		},{
			name: MVNG_AVG[l],
			color: '#888888',
			marker: { enabled: false },
			data: temperatures.movAvg,
		}],
	});
};

var renderTemperatureDifferenceGraph = function (temperatures, id, title) {
	// console.log(title);
	// console.log(temperatures);
	Highcharts.chart(id, {
		chart: {
			type: 'column'
		},
		title: {
			text: title,
		},
		subtitle: {
			//text: 'Difference between yearly average and average for 1961-1990',
		},
		xAxis: {
			title: {
				text: 'Year',
			},
			crosshair: true,
			plotBands: [{
				color: 'rgb(245, 245, 245)',
				from: baselineLower,
				to: baselineUpper,
			}],
		},
		yAxis: {
			title: {
				text: 'Temperature [°C]'
			},
			lineWidth: 1,
			min: -2,
			max: 3,
			tickInterval: 1,
		},
		tooltip: {
			shared: true,
			valueSuffix: ' °C',
			valueDecimals: 2,
		},
		legend: {
			enabled: true,
		},
		annotations: [{
			labelOptions: {
				barkgroundColor: 'red',
				verticalAlign: 'top',
			},
			labels: [{
				point: {
					xAxis: 0,
					yAxis: 0,
					x: baselineLower + (baselineUpper - baselineLower) / 2,
					y: 2.4,
				},
				text: 'Baseline',
			}],
		}],
		series: [{
			regression: true,
			regressionSettings: {
				type: 'linear',
				color: '#aa0000',
				name: 'Linear regression', 
			},
			name: 'Difference',
			data: temperatures.difference,
			color: 'red',
			negativeColor: 'blue',
		}
			//
			//
			// ,{
			// 		name: 'Linear regression',
			// 		type: 'line',
			// 		visible: false,
			// 		marker: {
			// 			enable: false,
			// 		},
			// 		color: rainColor.color,
			// 		states: {
			// 			hober: {
			// 				lineWidth: 0,
			// 			},
			// 		},
			// 		enableMouseTracking: false,
			//
			// 		data: [
			// 			{ x: temperatures.years[0], 
			// 				y: temperatures.linear_diff(temperatures.years[0]) },
			// 			{ x: temperatures.years[temperatures.years.length - 1],
			// 				y: temperatures.linear_diff(temperatures.years[temperatures.years.length - 1]) }
			// 		],
			//
			// 	},
			//
			//

			//
		],
	});
};

var renderGrowingSeasonGraph = function (season, id) {
	Highcharts.chart(id, {
		chart: {
			type: 'line',
			zoomType: 'xy',
		},
		title: {
			text: 'Growing season',
		},
		subtitle: {
			text: 'The maximum consecutive weeks with average temperature above freezing.',
		},
		xAxis: {
			title: {
				text: 'Year',
			},
			crosshair: true,
		},
		yAxis: {
			title: {
				text: WK[l]
			},
			tickInterval: 1,
			lineWidth: 1,
		},
		tooltip: {
			shared: true,
			valueDecimals: 0,
		},
		series: [{
			regression: true,
			regressionSettings: {
				type: 'linear',
				color: '#008800',
				name: 'Linear regression',
			},
			name: WK[l],
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#00aa00',
			data: season.weeks,
			visible: true,
		},{ 
			name: 'Confidence interval',
			type: 'arearange',
			color: '#005500',
			data: season.ci,
			zIndex: 0,
			fillOpacity: 0.3,
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: { enabled: false },
			visible: false,

		}, {
			name: MVNG_AVG[l],
			color: '#00aa00',
			marker: { enabled: false },
			data: season.movAvg,
		},{
			name: 'Confidence interval (moving avg.)',
			type: 'arearange',
			color: '#006600',
			data: season.ciMovAvg,
			zIndex: 0,
			fillOpacity: 0.3,
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: { enabled: false },
			visible: false,

		}],
	});
}

var renderPrecipitationDifferenceGraph = function (precipitation, id, title) {
	// console.log(precipitation);
	Highcharts.chart(id, {
		chart: {
			type: 'column'
		},
		title: {
			text: title,
		},
		subtitle: {
			//text: 'Difference between yearly average and average for 1961-1990',
		},
		xAxis: {
			title: {
				text: 'Year',
			},
			crosshair: true,
			plotBands: [{
				color: 'rgb(245, 245, 245)',
				from: baselineLower,
				to: baselineUpper,
			}],
		},
		yAxis: {
			title: {
				text: 'Precipitation [mm]'
			},
			lineWidth: 1,
			//min: -2,
			//max: 3,
			tickInterval: 1,
		},
		tooltip: {
			shared: true,
			valueSuffix: ' mm',
			valueDecimals: 2,
		},
		legend: {
			enabled: true,
		},
		annotations: [{
			labelOptions: {
				barkgroundColor: 'red',
				verticalAlign: 'top',
			},
			labels: [{
				point: {
					xAxis: 0,
					yAxis: 0,
					x: baselineLower + (baselineUpper - baselineLower) / 2,
					y: 100,
				},
				text: 'Baseline',
			}],
		}],
		series: [{
			regression: true,
			name: 'Difference',
			data: precipitation.difference,
			color: 'red',
			negativeColor: 'blue',
			regressionSettings: {
				type: 'linear',
				color: rainColor.color,
				name: 'Linear regression',
			},
		},
			//	REST code
			// 	{
			// 	name: 'Linear regression',
			// 	type: 'line',
			// 	visible: false,
			// 	marker: {
			// 		enable: false,
			// 	},
			// 	color: rainColor.color,
			// 	states: {
			// 		hober: {
			// 			lineWidth: 0,
			// 		},
			// 	},
			// 	enableMouseTracking: false,
			// 	//
			//
			// 	data: [
			// 		{ x: precipitation.years[0], 
			// 			y: precipitation.linear_diff(precipitation.years[0]) },
			// 		{ x: precipitation.years[precipitation.years.length - 1],
			// 			y: precipitation.linear_diff(precipitation.years[precipitation.years.length - 1]) }
			// 	],
			//
			// 	//
			// },
		],
	});
};

var renderYearlyPrecipitationGraph = function (precipitation, id, title) {
	Highcharts.chart(id, {
		chart: {
			type: 'line'
		},
		title: {
			text: title,
		},
		xAxis: {
			title: {
				text: 'Year',
			},
			crosshair: true,
		},
		yAxis: {
			title: {
				text: 'Total precipitation [mm]'
			},
			lineWidth: 1,
			floor: 0, // Precipitation can never be negative
		},
		tooltip: {
			shared: true,
			// valueSuffix: ' mm',
			// valueDecimals: 0,
			// headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>' +
			// '<span style="color: red">\u25CF</span> Linear regression: <b>' + precipitation.linear + '</b><br />' +
			// '<span style="color: white; visibility: hidden">\u25CF</span> Total precipitation: <b>{point.total:.0f} mm</b><br />',
		},
		series: [{
			id: 'snow',
			regression: true,
			regressionSettings: {
				type: 'linear',
				color: snowColor.color,
				name: 'Linear regression of snow',
			},
			name: PRC_SNW[l],
			type: 'column',
			stack: 'precip',
			stacking: 'normal',
			data: precipitation.snow,
			color: snowColor.color,
			visible: true,
			borderColor: snowColor.borderColor,
			states: {
				hover: {
					color: snowColor.hover,
					animation: {
						duration: 0,
					},
				},
			},
		},{
			id: 'movAvg',
			name: 'Moving average precipitation',
			color: rainColor.color,
			visible: false,
			data: precipitation.movAvg,
			marker: { enabled: false },
			states: { hover: { lineWidthPlus: 0 } },
		},{
			id: 'ciMovAvg',
			name: 'Confidence interval (mov avg.)',
			type: 'arearange',
			color: '#000055',
			data: precipitation.ciMovAvg,
			zIndex: 0,
			fillOpacity: 0.3,
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: { enabled: false },
			visible: false,
		},{
			id: 'rain',
			regression: true,
			regressionSettings: {
				type: 'linear',
				color: rainColor.color,
				name: 'Linear regression of rain',
			},
			name: PRC_RN[l],
			type: 'column',
			stack: 'precip',
			stacking: 'normal',
			visible: true,
			data: precipitation.rain,
			color: rainColor.color,
			borderColor: rainColor.borderColor,
			states: {
				hover: {
					color: rainColor.hover,
					animation: {
						duration: 0,
					},
				},
			},
		},{
			id: 'linear',
			name: 'Linear regression from all sources',
			visible: false,
			linkedTo: ':previous',
			marker: {
				enabled: false, // Linear regression lines doesn't contain points
			},
			color: 'red',
			states: {
				hover: {
					lineWidth: 0, // Do nothing on hover
				},
			},
			enableMouseTracking: false, // No interactivity
			data: [
				{ x: precipitation.years[0], 
					y: precipitation.linear(precipitation.years[0]) },
				{ x: precipitation.years[precipitation.years.length - 1],
					y: precipitation.linear(precipitation.years[precipitation.years.length - 1]) }
			],
		}],
	});
};

var renderMonthlyPrecipitationGraph = function (precipitation, id, title) {
	Highcharts.chart(id, {
		chart: {
			type: 'line'
		},
		title: {
			text: title,
		},
		xAxis: {
			title: {
				text: 'Year',
			},
			crosshair: true,
		},
		yAxis: {
			title: {
				text: 'Total precipitation [mm]'
			},
			lineWidth: 1,
			max: 150,
			floor: 0, // Precipitation can never be negative
		},
		tooltip: {
			shared: true,
			valueSuffix: ' mm',
			valueDecimals: 0,
			headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>' +
			//'<span style="color: red">\u25CF</span> Linear regression: <b>' + precipitation.linear + '</b><br />' +
			'<span style="color: white; visibility: hidden">\u25CF</span> Total precipitation: <b>{point.total:.0f} mm</b><br />',
		},
		series: [{
			regression: true,
			regressionSettings: {
				type: 'linear',
				color: snowColor.color,
				name: 'Linear regression (snow)',
			},
			name: PRC_SNW[l],
			type: 'column',
			stack: 'precip',
			stacking: 'normal',
			data: precipitation.snow,
			color: snowColor.color,
			borderColor: snowColor.borderColor,
			states: {
				hover: {
					color: snowColor.hover,
					animation: {
						duration: 0,
					},
				},
			},
		}, {
			regression: true,
			regressionSettings: {
				type: 'linear',
				color:rainColor.color,
				name: 'Linear regression (rain)',
			},
			name: PRC_RN[l],
			type: 'column',
			stack: 'precip',
			stacking: 'normal',
			data: precipitation.rain,
			color: rainColor.color,
			borderColor: rainColor.borderColor,
			states: {
				hover: {
					color: rainColor.hover,
					animation: {
						duration: 0,
					},
				},
			},
		},{
			name: 'Confidence interval (mov avg.)',
			type: 'arearange',
			color: '#000055',
			data: precipitation.ciMovAvg,
			zIndex: 0,
			fillOpacity: 0.3,
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: { enabled: false },
			visible: false,

		},{
			name: 'Moving average precipitation',
			visible: false,
			color: rainColor.color,
			data: precipitation.movAvg,
			marker: { enabled: false },
		},{
			name: 'Linear regression (total)',
			visible: false,
			marker: {
				enabled: false, // Linear regression lines doesn't contain points
			},
			color: 'red',
			states: {
				hover: {
					lineWidth: 0, // Do nothing on hover
				},
			},
			enableMouseTracking: false, // No interactivity
			data: [
				{ x: precipitation.years[0], 
					y: precipitation.linear(precipitation.years[0]) },
				{ x: precipitation.years[precipitation.years.length - 1],
					y: precipitation.linear(precipitation.years[precipitation.years.length - 1]) }
			],
		},
			// {
			// 	name: 'Linear regression (snow)',
			// 	visible: false,
			// 	marker: {
			// 		enabled: false 
			// 	},
			// 	color: rainColor.color,
			// 	states: {
			// 		hover: {
			// 			lineWidth: 0,	// do nothing on hover
			// 		},
			//
			// 	},
			// 	enableMouseTracking: false,
			// 	data: [
			//
			// 		{ x: precipitation.years[0], 
			// 			y: precipitation.linear_snow(precipitation.years[0]) },
			// 		{ x: precipitation.years[precipitation.years.length - 1],
			// 			y: precipitation.linear_snow(precipitation.years[precipitation.years.length - 1]) }
			// 	],
			// },{
			// 	name: 'Linear regression (rain)',
			// 	visible: false,
			// 	marker: {
			// 		enabled: false 
			// 	},
			// 	color: rainColor.color,
			// 	states: {
			// 		hover: {
			// 			lineWidth: 0,	// do nothing on hover
			// 		},
			//
			// 	},
			// 	enableMouseTracking: false,
			// 	data: [
			//
			// 		{ x: precipitation.years[0], 
			// 			y: precipitation.linear_rain(precipitation.years[0]) },
			// 		{ x: precipitation.years[precipitation.years.length - 1],
			// 			y: precipitation.linear_rain(precipitation.years[precipitation.years.length - 1]) }
			// 	],
			// },



		],
	});
};

var renderAbiskoIceGraph = function (ice, id, title) {
	// console.log(title);
	// console.log(ice);
	Highcharts.chart(id, {
		chart: {
			type: 'line'
		},
		title: {
			text: title,
		},
		xAxis: {
			title: {
				text: 'Year',
			},
			crosshair: true,
		},
		yAxis: [{
			title: {
				text: 'Ice break-up / freeze-up [day of year]',
			},
			lineWidth: 1,
			labels: {
				formatter: function () {
					return this.value > 52 ? this.value - 52 : this.value;
				},
			}
		}, {
			title: {
				text: 'Ice time [number of days]',
			},
			lineWidth: 1,
			max: 250,
			min: 80,
			opposite: true,
		}],
		tooltip: {
			shared: true,
			valueDecimals: 0,
			formatter: function () {
				var tooltip = '<span style="font-size: 10px">' + (+this.x-1) + '/' + this.x + '</span><br/>';
				this.points.forEach(point =>
					tooltip += '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' +(point.point.options.week || point.y) + '</b><br/>');
				return tooltip;
			},
		},
		series: [{
			regression: true,
			regressionSettings: {
				type: 'linear',
				color: '#0000ee',
				name: 'Linear regression (freeze-up)',
			},
			yAxis: 0,
			name: 'Freeze-up',
			color: '#0000ee',
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			data: ice.freeze,
		}, 
			// {
			// 	yAxis: 0,
			// 	name: 'Linear regression (freeze-up)',
			// 	marker: { enabled: false },
			// 	color: '#0000ee',
			// 	// linkedTo: ':previous',
			// 	states: { hover: { lineWidth: 0, } },
			// 	enableMouseTracking: false,
			// 	data: ice.freezeLinear,
			// }, 
			{
				regression: true,
				regressionSettings: {
					type: 'linear',
					color: '#ee0000',
					name: 'Linear regression (break-up)',
				},
				yAxis: 0,
				name: 'Break-up',
				color: '#ee0000',
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				data: ice.breakup,
			},{
				name: 'Confidence Interval (moving avg.)',
				type: 'arearange',
				color: '#7777ff',
				data: ice.iceTimeCIMovAvg,
				zIndex: 0,
				fillOpacity: 0.3,
				lineWidth: 0,
				states: { hover: { lineWidthPlus: 0 } },
				marker: { enabled: false },
				yAxis: 1,
				visible: false,
			},
			// 	{
			// 	yAxis: 0,
			// 	name: 'Linear regression (break-up)',
			// 	marker: { enabled: false },
			// 	color: '#ee0000',
			// 	// linkedTo: ':previous',
			// 	states: { hover: { lineWidth: 0, } },
			// 	enableMouseTracking: false,
			// 	data: ice.breakupLinear,
			// },
			{
				regression: true,
				regressionSettings: {
					type: 'linear',
					color: '#00bb00',
					name: 'Linear regression (ice time)',
				},
				yAxis: 1,
				name: 'Ice time',
				color: '#00bb00',
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				data: ice.iceTime,
			},{
				yAxis: 1,
				name: 'Ice time (moving avg.)',
				color: '#cc00cc',
				data: ice.iceTimeMovAvg,
				marker: { enabled: false },
			}],
	});
};

var renderAbiskoSnowGraph = function (snow, id, title) {
	var series = Object.values(snow).map(p => ({
		name: p.period,
		data: p.means.rotate(6).slice(2),
	}));
	Highcharts.chart(id, {
		chart: {
			type: 'line'
		},
		title: {
			text: title,
		},
		xAxis: {
			categories: months().rotate(6).slice(2),
			title: {
				text: 'Month',
			},
			crosshair: true,
		},
		yAxis: {
			title: {
				text: 'Snow depth [cm]',
			},
			lineWidth: 1,
			floor: 0,
		},
		tooltip: {
			shared: true,
			valueSuffix: ' cm',
			valueDecimals: 0,
		},
		series,
	});
};
