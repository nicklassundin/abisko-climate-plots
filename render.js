

/*****************/
/* RENDER GRAPHS */
/*****************/

var renderTemperatureGraph = function (temperatures, id, title) {
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
			name: 'Max',
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#ff0000',
			data: temperatures.max,
			visible: false,
		}, {
			name: 'Min',
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#0000ff',
			data: temperatures.min,
			visible: false,
		}, {
			name: 'Yearly average',
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#888888',
			data: temperatures.avg,
			visible: false,
		}, {
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
		}, {
			name: 'Moving average',
			color: '#888888',
			marker: { enabled: false },
			data: temperatures.movAvg,
		}, {
			name: 'Confidence interval',
			type: 'arearange',
			color: '#7777ff',
			data: temperatures.ciMovAvg,
			zIndex: 0,
			fillOpacity: 0.3,
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: { enabled: false },
		}],


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
					},{
						separator: true
					},{
							textKey: 'downloadJPEG',
						onclick: function(){
							this.exportChart({
								type: 'image/jpeg'
							});
						}
					}],
				},
			},
		},


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
			name: 'Max',
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#ff0000',
			data: temperatures.max,
			visible: false,
		}, {
			name: 'Min',
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#0000ff',
			data: temperatures.min,
			visible: false,
		}, {
			name: 'Yearly average',
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#888888',
			data: temperatures.avg,
			visible: true,
		}, {
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
		}, {
			name: 'Moving average',
			color: '#888888',
			marker: { enabled: false },
			data: temperatures.movAvg,
		}, {
			name: 'Confidence interval',
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
			name: 'Max',
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#ff0000',
			data: temperatures.max,
			visible: false,
		}, {
			name: 'Min',
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#0000ff',
			data: temperatures.min,
			visible: false,
		}, {
			name: 'Monthly average',
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#888888',
			data: temperatures.avg,
			visible: true,
		}, {
			name: 'Moving average',
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
				text: 'Weeks'
			},
			tickInterval: 1,
			lineWidth: 1,
		},
		tooltip: {
			shared: true,
			valueDecimals: 0,
		},
		series: [{
			name: 'Weeks',
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#00aa00',
			data: season.weeks,
			visible: true,
		}, {
			name: 'Moving average',
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
			name: 'Precipitation from snow',
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
			name: 'Precipitation from rain',
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
		}, {
			name: 'Average precipitation',
			color: precipColor,
			data: precipitation.movAvg,
		}, {
			name: 'Linear regression',
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
				{ x: precipitation.years[0], y: precipitation.linear(precipitation.years[0]) },
				{ x: precipitation.years[precipitation.years.length - 1], y: precipitation.linear(precipitation.years[precipitation.years.length - 1]) }
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
			name: 'Precipitation from snow',
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
			name: 'Precipitation from rain',
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
		}, {
			name: 'Average precipitation',
			color: precipColor,
			data: precipitation.movAvg,
		}],
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
			linkedTo: ':previous',
			states: { hover: { lineWidth: 0, } },
			enableMouseTracking: false,
			data: ice.freezeLinear,
		}, {
			yAxis: 0,
			name: 'Break-up',
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
			linkedTo: ':previous',
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
			linkedTo: ':previous',
			states: { hover: { lineWidth: 0, } },
			enableMouseTracking: false,
			data: ice.iceTimeLinear,
		}, {
			yAxis: 1,
			name: 'Ice time (moving average)',
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
