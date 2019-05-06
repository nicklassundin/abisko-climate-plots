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
		buttons: {
			contextButton: {
				menuItems: [{
					textKey: 'downloadPDF',
					onclick: function(){
						this.exportChart({
							type: 'application/pdf'
						});
					},
				},
					// {
					// separator: true
					// },
					{
						textKey: 'downloadJPEG',
						onclick: function(){
							this.exportChart({
								type: 'image/jpeg'
							});
						}
					},{
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
					}],
			},
		},
	},
};
Highcharts.setOptions(global_chart_settings);

var renderTemperatureGraph = function (temperatures, id, title) {
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
		}, {
			name: YRL_AVG[l],
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#888888',
			data: temperatures.avg,
			visible: false,
		}, {
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
			name: YRL_AVG[l],
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#888888',
			data: temperatures.avg,
			visible: true,
		}, {
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
			name: MNTH_AVG[l],
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#888888',
			data: temperatures.avg,
			visible: true,
		}, {
			name: MVNG_AVG[l],
			color: '#888888',
			marker: { enabled: false },
			data: temperatures.movAvg,
		}],
	});
};

var renderTemperatureDifferenceGraph = function (temperatures, id, title) {
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
			enabled: false,
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
			name: 'Difference',
			data: temperatures,
			color: 'red',
			negativeColor: 'blue',
		}],
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
			name: WK[l],
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#00aa00',
			data: season.weeks,
			visible: true,
		}, {
			name: MVNG_AVG[l],
			color: '#00aa00',
			marker: { enabled: false },
			data: season.movAvg,
		}],
	});
}

var renderPrecipitationDifferenceGraph = function (precipitation, id, title) {
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
			enabled: false,
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
			name: 'Difference',
			data: precipitation,
			color: 'red',
			negativeColor: 'blue',
		}],
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
			valueSuffix: ' mm',
			valueDecimals: 0,
			headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>' +
			'<span style="color: red">\u25CF</span> Linear regression: <b>' + precipitation.linear + '</b><br />' +
			'<span style="color: white; visibility: hidden">\u25CF</span> Total precipitation: <b>{point.total:.0f} mm</b><br />',
		},
		series: [{
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
		},
			// TODO discuss use fullness Moving averages
			// {
				// name: 'Average precipitation from snow (moving avg.)',
				// color: snowColor.color,
				// visible: false,
				// data: precipitation.snow_movAvg,
			// },
			{
				name: 'Linear regression from snow',
				visible: false,
				marker: {
					enable: false,
				},
				color: rainColor.color,
				states: {
					hober: {
						lineWidth: 0,
					},
				},
				enableMouseTracking: false,
				data: [
					{ x: precipitation.years[0], y: precipitation.linear_snow(precipitation.years[0]) },
					{ x: precipitation.years[precipitation.years.length -1], y: precipitation.linear_snow(precipitation.years[precipitation.years.length-1]) }
				],
			},{
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
			}, 
			// {
				// name: 'Average precipitation from rain',
				// color: rainColor.color,
				// visible: false,
				// data: precipitation.rain_movAvg,
			// },
			{
				name: 'Linear regression from rain',
				visible: false,
				marker: {
					enable: false,
				},
				color: rainColor.color,
				states: {
					hober: {
						lineWidth: 0,
					},
				},
				enableMouseTracking: false,
				data: [
					{ x: precipitation.years[0],
						y: precipitation.linear_rain(precipitation.years[0]) },
					{ x: precipitation.years[precipitation.years.length -1],
						y: precipitation.linear_rain(precipitation.years[precipitation.years.length-1]) }
				],
			},{
				name: 'Linear regression from all sources',
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
			name: 'Linear regression from all sources',
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
		},{
			name: 'Linear regression from snow',
			visible: false,
			marker: {
				enabled: false 
			},
			color: rainColor.color,
			states: {
				hover: {
					lineWidth: 0,	// do nothing on hover
				},

			},
			enableMouseTracking: false,
			data: [

				{ x: precipitation.years[0], 
					y: precipitation.linear_snow(precipitation.years[0]) },
				{ x: precipitation.years[precipitation.years.length - 1],
					y: precipitation.linear_snow(precipitation.years[precipitation.years.length - 1]) }
			],
		},{
			name: 'Linear regression from rain',
			visible: false,
			marker: {
				enabled: false 
			},
			color: rainColor.color,
			states: {
				hover: {
					lineWidth: 0,	// do nothing on hover
				},

			},
			enableMouseTracking: false,
			data: [

				{ x: precipitation.years[0], 
					y: precipitation.linear_rain(precipitation.years[0]) },
				{ x: precipitation.years[precipitation.years.length - 1],
					y: precipitation.linear_rain(precipitation.years[precipitation.years.length - 1]) }
			],
		},



		],
	});
};

var renderAbiskoIceGraph = function (ice, id, title) {
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
					tooltip += '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' + (point.point.options.name || point.y) + '</b><br/>');
				return tooltip;
			},
		},
		series: [{
			yAxis: 0,
			name: 'Freeze-up',
			color: '#0000ee',
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			data: ice.freeze,
		}, {
			yAxis: 0,
			name: 'Linear regression (freezing)',
			marker: { enabled: false },
			color: '#0000ee',
			// linkedTo: ':previous',
			states: { hover: { lineWidth: 0, } },
			enableMouseTracking: false,
			data: ice.freezeLinear,
		}, {
			yAxis: 0,
			name: 'Break',
			color: '#ee0000',
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			data: ice.breakup,
		}, {
			yAxis: 0,
			name: 'Linear regression (breaking)',
			marker: { enabled: false },
			color: '#ee0000',
			// linkedTo: ':previous',
			states: { hover: { lineWidth: 0, } },
			enableMouseTracking: false,
			data: ice.breakupLinear,
		}, {
			yAxis: 1,
			name: 'Ice time',
			color: '#00bb00',
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			data: ice.iceTime,
		}, {
			yAxis: 1,
			name: 'Linear regression (ice time)',
			marker: { enabled: false },
			color: '#00bb00',
			// linkedTo: ':previous',
			states: { hover: { lineWidth: 0, } },
			enableMouseTracking: false,
			data: ice.iceTimeLinear,
		}, {
			yAxis: 1,
			name: 'Ice time (moving avg.)',
			color: '#cc00cc',
			data: ice.iceTimeMovAvg,
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
