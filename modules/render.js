
// global.Highcharts = require('highcharts');
global.Highcharts = require('highcharts-more-node');
// require('highcharts/modules/annotations')(Highcharts)
// require('highcharts/modules/series-label')(Highcharts)
// require('highcharts/modules/series-label')(Highcharts)
// require('highcharts/modules/exporting')(Highcharts)
// require('highcharts/modules/export-data.js')(Highcharts)
// require('highcharts/modules/histogram-bellcurve')(Highcharts)

const highchart_help = require('../config/highcharts_config.js');
const language = require('../config/language.json');
var help = require('./helpers.js');

var constant = require('../config/const.json');
global.baselineLower = constant.baselineLower;
global.baselineUpper = constant.baselineUpper;
global.startYear = constant.startYear;

var charts = highchart_help.charts;

var dateToYear = function(entries){
	return entries.map(each => ({
		y: each.y,
		x: each.x.getFullYear(),
	}))
}


var precipColor = '#550965';

var snowColor = {
	color: '#CDD8F0',
	borderColor: '#5F7CB9',
	hover: '#eeeeff',
};

var rainColor = {
	color: '#1000FB',
	borderColor: '#5F7CB9',
	hover: '#3333ff',
};

// TODO Seperate them to one constructor with general input for reuse
var createBaseline = function(ver=true, change){
	var urlParams = new URLSearchParams(window.location.search);
	var text = language[nav_lang]['baselineform'];
	var createInput = function(name, value, div=document.createElement('div')){
		var submit = change;
		if(submit){
			submit = submit+"('baseline"+name+"')"
		}else{
			submit = "submit(this)"
		}
		var label = document.createElement('label');
		label.setAttribute("for","baselineLower");
		label.innerHTML = text[name.toLowerCase()];
		var input = document.createElement('input');
		input.setAttribute("size","4")
		input.setAttribute("maxlength","4")
		input.setAttribute("name","baseline"+name);
		input.setAttribute("type","text");
		input.setAttribute("value",value);
		input.setAttribute("onClick",onclick="selectText(this)")
		input.setAttribute("onChange",onchange=submit+'(this.value)')
		div.appendChild(label)
		div.appendChild(input)
		return div;
	}
	var form = document.createElement('form');
	form.setAttribute("id",baseline);
	var header = document.createElement('header');
	header.innerHTML = text.title;

	var lower = createInput("Lower", baselineLower);
	if(ver) lower.appendChild(document.createElement('br'));

	var upper = createInput("Upper", baselineUpper,lower);

	var br2 = document.createElement('br');
	form.appendChild(header)
	form.appendChild(lower)
	form.appendChild(upper)
	if(ver)form.appendChild(br2)

	// Hidden option because magic
	var value = urlParams.get('id');
	if(value){
		var id = document.createElement('input');
		id.setAttribute("type","hidden");
		id.setAttribute("name", "id");
		id.setAttribute("value",''+value);
		form.appendChild(id);
	}	
	value = urlParams.get('debug');
	if(value){
		var debug = document.createElement('input');
		debug.setAttribute("type","hidden");
		debug.setAttribute("name", "debug");
		debug.setAttribute("value",''+ value);
		form.appendChild(debug);
	}
	value = urlParams.get('share');
	if(value){
		var share = document.createElement('input');
		share.setAttribute("type","hidden");
		share.setAttribute("name", "share");
		share.setAttribute("value",''+value);
		form.appendChild(share);
	}
	var input = document.createElement('input');
	var input = document.createElement('input');
	input.setAttribute("type","submit")
	if(ver)form.appendChild(input)
	return form;
}




var resetPlot = function(id){
	return function(a){
		return function(b){
			switch(a){
				case "baselineLower": 
					// console.log("Lower")
					baselineLower=b;
					break;
				case "baselineUpper": 
					// console.log("Upper")
					baselineUpper=b;
					break;	
				default: 
					break;
			}
			updatePlot(id.id);
		}
	}
}
var addInput = function(){	
	var input = document.createElement("input");
	input.setAttribute("type", "date");
	return input;
}
var appendChild = function(parentId,element){
	return function(){
		document.getElementById(id).appendChild(element);
	}
}

var plotlines = function(id){
	return plotLines = [{
		color: 'rgb(160, 160, 160)',
		value: baselineUpper,
		width: 1,
		useHTML: true,
		label: {
			useHTML: true,
			text: "<input id="+id+"uppLabel type=text class=input value="+baselineUpper+" maxlength=4 onclick=selectText(this) onchange=updatePlot("+id+","+baselineLower+",this.value)></input>",
			rotation: 0,
			y: 12,
		},
		zIndex: 1,
	},{
		color: 'rgb(160, 160, 160)',
		value: baselineLower,
		width: 1,
		useHTML: true,
		label: {
			useHTML: true,
			text: "<input id="+id+"lowLabel type=text class=input value="+baselineLower+" maxlength=4 onclick=selectText(this) onchange=updatePlot("+id+",this.value,"+baselineUpper+")></input>",
			rotation: 0,
			textAlign: 'left',
			x: -40,
			y: 12,
		},
		zIndex: 5,
	}];
}
var plotBandsDiff = function(id){
	return {
		color: 'rgb(245, 245, 245)',
		from: baselineLower,
		to: baselineUpper,
		label: {
			useHTML: true,
			text: "<div id="+id+"-plotBands-Label>Baseline</div>",
		},
		events: {
			click: function(e){
				var lowLabel = document.getElementById(id+"lowLabel");
				var uppLabel = document.getElementById(id+"uppLabel");
				selectText(lowLabel);
				// document.getElementById(id+"overlay").style.display = "block";
			},
		}
	};
}


var init_HighChart = () => Highcharts.setOptions(highchart_help.highcharts_Settings);
init_HighChart();

// TODO generalize render function

exports.graphs = {
	CO2: function(id){
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'area',
				zoomType: 'x',
			},
			title: {
				text: Highcharts.getOptions().lang.titles[id],
				useHTML: true,
			},
			legend: {
				enabled: false,
			},
			plotOptions: {
				series: {
					marker: {
						enabledThreshold: 0,
						radius: 1,
						states: {
							select: {
								lineColor: "#6666bb",
								lineWidth: 1,
								radius: 5,
							},
							hover: {
								radiusPlus: 5,
							},

						}
					},
					allowPointSelect: true,
					point: {
						events: {
							select: function () {
								var date = new Date(this.category);
								var text = "Date: "+ date.getFullYear() +"-"+ date.getMonth()+"-"+date.getDate() +"<br/>CO"+ ("2".sub())+": " + this.y + ' ppm';
								var chart = this.series.chart;
								if (!chart.lbl) {
									chart.lbl = chart.renderer.label(text, 200, 70,"callout", this.catergory, this.y, useHTML=true)
										.attr({
											padding: 10,
											r: 5,
											fill: Highcharts.getOptions().colors[1],
											zIndex: 5
										})
										.css({
											color: '#FFFFFF'
										})
										.add();
								} else {
									chart.lbl.attr({
										text: text
									});
								}
							},
						}
					}

				}
			},
			dataSrc: undefined,
			xAxis: {
				type: 'datetime',
				title: {
					text: Highcharts.getOptions().lang.years, 
				},
				crosshair: true,
				lineWidth: 1,
				gridLineWidth: 1,
				minorTickInterval: null,
			},
			yAxis: {
				title: {
					text: "CO"+("2".sub()), // TODO localization
					useHTML: true,
				},
				// plotLines: [{
				// value: 0,
				// color: 'rgb(204, 214, 235)',
				// width: 2,
				// }],
				plotLines:[{
					color: '#aaaaaa',
					dashStyle: 'shortDash',
					value: 350,
					width: 2,
					label: {
						text: "350 ppm",
						style: {
							color: '#aaaaaa',
							fontWeight: 'bold',
						}
					},
					zIndex: 2,
				},{
					color: '#aaaaaa',
					dashStyle: 'shortDash',
					value: 400,
					width: 2,
					label: {
						text: "400 ppm",
						style: {
							color: '#aaaaaa',
							fontWeight: 'bold',
						}
					},
					zIndex: 1,
				}],
				tickInterval: 10,
				lineWidth: 1,
			},
			tooltip: {
				shared: true,
				valueSuffix: ' ppm',
				valueDecimals: 2,
			},
			series: [{
				data: [null, null],
			}]
		});
		charts[id].showLoading()	
		return function(data){
			charts[id].hideLoading();
			charts[id].update({
				legend: {
					enabled: true,
				},
				yAxis: {
					max: data.values[data.values.length-1].y+30,
					min: data.values[0].y-10,
				},
				series: [{
					name: "CO"+("2".sub()),
					lineWidth: 2,
					// marker: { radius: 2 },
					states: { hover: { lineWidthPlus: 0 } },
					color: '#5555bb',
					data: data.values,
					turboThreshold: 4000,
					fillOpacity: 0.2,
					marker: {
						states: {
							select: {
								fillColor: 'red',
								lineWidth: 3
							}
						}
					},
					zIndex: 6,
				},
					// {
					// name: Highcharts.getOptions().lang.linReg+"<br/>( R2: "+data.linReg.r2+" )",
					// useHTML: true,
					// data: data.linReg.points, 
					// type: 'line',
					,			// lineWidth: 2,
					// marker: {enabled: false,},
					// states: { hover: { lineWidthPlus: 0 } },
					// color: '#333377',
					// visible: false,
					// }
				]
			})

		}
	},
	Polar: function(id){
		charts[id] = Highcharts.chart(id, {
			chart: {
				polar: true,
				type: 'column' 
				// type: 'line'
				// type: 'area'
				// type: 'bar'
			},
			title: {
				text: "<label id='"+id+"_title'>Precipitation 1910th</label>",
				useHTML: true,
			},
			pane: {
				size: '80%'
			},
			xAxis: {
				categories: ["January", "February", "Mars", "April", "May", "Juni", "Juli", "August", "September", "October", "November", "December"],
				tickmarkPlacement: 'on',
				lineWidth: 0,
				reversed: true,
			},
			yAxis: {
				gridLineInterpolation: 'polygon',
				lineWidth: 0,
				max: 650, 
				// min: 0,
			},
			tooltip: {
				shared: true,
				pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f} mm</b><br/>'
			},
			legend: {
				enabled: false,
			},
			responsive: {
				rules: [{
					condition: {
						maxWidth: 800
					},
					chartOptions: {
						legend: {
							align: 'center',
							verticalAlign: 'bottom',
							layout: 'horizontal'
						},
						pane: {
							size: '70%'
						}
					}
				}]
			},
			plotOptions: {
				column: {
					// stacking: 'percent',	
					stacking: 'normal',
					lineWidth: 0,
					pointPadding: 0,
					animation: false,
				},
				area: {
					// stacking: 'percent',	
					stacking: 'normal',
					lineColor: '#666666',
					animation: false,
					lineWidth: 0,
					marker: {
						enabled: false,
						lineWidth: 0,
						lineColor: '#666666'
					}
				}
			},
			series: Array(107*2).fill(1).map(each => ({ data: [null, null], visible: false }))
		})
		charts[id].onscroll = function (e) {  
			console.log(e)
		} 
		//IE, Opera, Safari
		var years = [];
		var index = 0;
		var delta = 0;
		$('#'+id).bind('mousewheel', function(e){
			delta = delta + e.originalEvent.deltaY;
			if(delta < -100){
				delta = 0;
				if(index < (years.length*2 - 2)){
					$('#' + id).highcharts().series[index].update({
						visible: false, 
					});	
					$('#' + id).highcharts().series[index + 1].update({
						visible: false, 
					});	
					index = index + 2;
					$('#' + id).highcharts().series[index].update({
						visible: true,
					});	
					$('#' + id).highcharts().series[index + 1].update({
						visible: true,
					});	
					charts[id].update({
						title: {
							text: "<label id='"+id+"_title'>Precipitation "+$('#'+id).highcharts().series[index].options.year+"th</label>",
							useHTML: true,
						},
					})
				} 
			}else if(delta > 100){
				delta = 0;
				if(index > 0){
					$('#' + id).highcharts().series[index].update({
						visible: false,
					});	
					$('#' + id).highcharts().series[index + 1].update({
						visible: false,
					});	
					index = index - 2;
					$('#' + id).highcharts().series[index].update({
						visible: true,
					});	
					$('#' + id).highcharts().series[index + 1].update({
						visible: true,
					});
					charts[id].update({
						title: {
							text: "<label id='"+id+"_title'>Precipitation "+$('#'+id).highcharts().series[index].options.year+"th</label>",
							useHTML: true,
						},
					})
				}
			}
			return false;
		});
		charts[id].showLoading();
		return function(data){
			var parseData = [];
			Object.keys(data).map((key, index) => {
				years.push(data[key].snow.x);
				var rain = Array(12).fill(0);
				data[key].rain.values.forEach(each => {
					rain[each.x - 1] = each.y
				})
				parseData.push({
					data: rain,
					name: "Rain for "+data[key].rain.x, 
					year: data[key].rain.x,
					// pointPlacement: 'on',
					stack: data[key].snow.x,
					visible: index < 1,
					color: rainColor.color,
				})
				var snow = Array(12).fill(0);
				data[key].snow.values.forEach(each => {
					snow[each.x - 1] = each.y
				})
				parseData.push({
					data: snow, 
					name: "Snow for "+data[key].snow.x,
					year: data[key].snow.x,
					// pointPlacement: 'on',
					stack: data[key].snow.x,
					visible: index < 1,
					color: snowColor.color,
				})
			})
			charts[id].hideLoading();
			charts[id].update({
				series: parseData
			})
		}
	},
	Temperature: function (id) {
		// console.log(id)
		// console.log(promise)
		// console.log(data.max.max())
		var id_split = id.split('_');

		var div_id = id;
		var id = id_split[0];
		charts[div_id] = Highcharts.chart(div_id, {
			chart: {
				type: 'line',
				zoomType: 'x',
			},
			legend: {
				enabled: false,
			},
			xAxis: {
				title: {
					text: Highcharts.getOptions().lang.years, 
				},
				crosshair: true,
				min: startYear 
			},
			yAxis: {
				title: {
					text: Highcharts.getOptions().lang.temp, 
				},
				plotLines: [{
					value: 0,
					color: 'rgb(204, 214, 235)',
					width: 2,
				}],
				// max: 60,
				// min: -20,
				tickInterval: 1,
				lineWidth: 1,
			},
			tooltip: {
				shared: true,
				valueSuffix: ' °C',
				valueDecimals: 2,
			},
			series: [
				{
					data: [null, null],
				},
				{
					data: [null, null],
				},
				{
					data: [null, null],
				},
				// {
				// 	data: [null, null],
				// },
				// {
				// 	data: [null, null],
				// },
				// {
				// 	data: [null, null],
				// },
			]
		});
		charts[div_id].showLoading();
		return function(data){
			charts[div_id].hideLoading();
			// var meta = data.meta;
			charts[div_id].update({
				title: {
					text: function(){
						var month = '';
						var title = stationName + Highcharts.getOptions().lang.titles[id];
						if(id_split[1]){
							month = ' '+Highcharts.getOptions().lang.months[id_split[1]];
							return title + month;
						} 
						return title; 
					}()
				},
				legend: {
					enabled: true,
				},
				// dataSrc: meta.src,
				series: [{
					name: Highcharts.getOptions().lang.max,
					lineWidth: 0,
					marker: { radius: 2 },
					states: { hover: { lineWidthPlus: 0 } },
					color: '#ff0000',
					data: data.max.max(), 
					visible: false,
					showInLegend: !(typeof data.min === 'undefined'),
				},{
					name: Highcharts.getOptions().lang.min,
					lineWidth: 0,
					marker: { radius: 2 },
					states: { hover: { lineWidthPlus: 0 } },
					color: '#0000ff',
					data: data.min.min(),
					visible: false,
					showInLegend: !(typeof data.min === 'undefined'),
				},
					// {
					// name: 	Highcharts.getOptions().lang.yearlyCI,
					// type: 'arearange',
					// color: '#888888',
					// data: data.avg.plotCI(),
					// zIndex: 0,
					// fillOpacity: 0.3,
					// lineWidth: 0,
					// states: { hover: { lineWidthPlus: 0 } },
					// marker: { enabled: false },
					// visible: false,
					// },
					// {
					// name: Highcharts.getOptions().lang.movAvg,
					// color: '#888888',
					// marker: { enabled: false },
					// data: data.avg.plotMovAvg(),
					// }, 
					// {
					// name: 	Highcharts.getOptions().lang.movAvgCI,
					// type: 'arearange',
					// color: '#7777ff',
					// data: data.avg.plotMovAvgCI(),
					// zIndex: 0,
					// fillOpacity: 0.3,
					// lineWidth: 0,
					// states: { hover: { lineWidthPlus: 0 } },
					// marker: { enabled: false },
					// visible: false,
					// },
					{
						name: language[nav_lang].yearlyAvg,
						regression: true,
						marker: {radius: 2},
						states: {hover: { lineWidthPlus: 0 }},
						lineWidth: 0,
						color: '#888888',
						regressionSettings: {
							type: 'linear',
							color: '#888888',
							// color: '#4444ff',
							// '#888888'
							name: Highcharts.getOptions().lang.linReg,
						},
						data: data.avg.values,
					}],
			});
		}
	},

	TemperatureDifference: function (id) {
		// console.log(temperatures);
		// console.log(temperatures.difference());
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'column'
			},
			// rangeSelector: {
			// selected: 2
			// },
			title: {
				text: Highcharts.getOptions().lang.titles[id],
			},
			subtitle: {
				text: Highcharts.getOptions().lang.subtitles.baseline + baselineLower +" - "+ baselineUpper 
			},
			xAxis: {
				title: {
					text: Highcharts.getOptions().lang.years,
				},
				crosshair: true,
				plotLines: plotlines(id),
				plotBands: plotBandsDiff(id),
				min: startYear,
			},
			yAxis: {
				title: {
					text: Highcharts.getOptions().lang.temp,
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
			series: [{data: [null, null]}]
		})
		charts[id].showLoading();
		return function(temperatures){
			charts[id].hideLoading();
			charts[id].update({
				title: {
					text: Highcharts.getOptions().lang.titles[id] + stationName,
				},
				legend: {
					enabled: true,
				},
				dataSrc: temperatures.src,
				series: [{
					regression: false, // TODO adv options 
					regressionSettings: {
						type: 'linear',
						color: '#aa0000',
						name: Highcharts.getOptions().lang.linReg,
					},
					name: Highcharts.getOptions().lang.diff,
					data: (temperatures.difference!=undefined) ? temperatures.difference() : temperatures.avg.difference(),
					color: 'red',
					negativeColor: 'blue',
				}],
			});
		}
		// $('.highcharts-annotations-labels text').bind('mouseover',function(e){
		// alert("You hover on "+$(this).text())
		// });
	},

	GrowingSeason: function (id) {
		// console.log(season)
		// console.log(season.max())
		// console.log(season.variance())
		// console.log(season.plotCI())
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'line',
				zoomType: 'x',
			},
			title: {
				text: Highcharts.getOptions().lang.titles[id],
			},
			subtitle: {
				text: 'The maximum consecutive weeks with average temperature above freezing.',
			},
			xAxis: {
				title: {
					text: Highcharts.getOptions().lang.years,
				},
				crosshair: true,
				min: startYear,
			},
			yAxis: {
				title: {
					text: Highcharts.getOptions().lang.weeks,
				},
				tickInterval: 1,
				lineWidth: 1,
			},
			tooltip: {
				shared: true,
				valueDecimals: 0,
			},
			legend: {
				enabled: false,
			},
			series: [
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				{data: [null, null]}]
		});
		charts[id].showLoading();
		return function(season){
			charts[id].hideLoading();
			// console.log(season)
			charts[id].update({
				legend: {
					enabled: true,
				},
				dataSrc: season.src,
				series: [{
					regression: false,
					regressionSettings: {
						type: 'linear',
						color: '#008800',
						name: Highcharts.getOptions().lang.linReg,
					},
					name: Highcharts.getOptions().lang.weeks,
					lineWidth: 0,
					marker: { radius: 2 },
					states: { hover: { lineWidthPlus: 0 } },
					color: '#00aa00',
					data: season.values,
					visible: true,
				},
					// { 
					// name: Highcharts.getOptions().lang.ci,
					// type: 'arearange',
					// color: '#005500',
					// data: season.plotCI(),
					// zIndex: 0,
					// fillOpacity: 0.3,
					// lineWidth: 0,
					// states: { hover: { lineWidthPlus: 0 } },
					// marker: { enabled: false },
					// visible: false,
					// }, 
					// {
					// name: Highcharts.getOptions().lang.movAvg,
					// color: '#00aa00',
					// marker: { enabled: false },
					// data: season.plotMovAvg(),
					// },
					// {
					// name: Highcharts.getOptions().lang.movAvgCI,
					// type: 'arearange',
					// color: '#006600',
					// data: season.plotMovAvgCI(),
					// zIndex: 0,
					// fillOpacity: 0.3,
					// lineWidth: 0,
					// states: { hover: { lineWidthPlus: 0 } },
					// marker: { enabled: false },
					// visible: false,
					// }
				],
			});
		}
	},

	PrecipitationDifference: function (id) {
		// console.log(id)
		// console.log(precipitation);
		// console.log(precipitation.total.difference())
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'column'
			},
			subtitle: {
				text: Highcharts.getOptions().lang.subtitles.baseline + ' '+ baselineLower +' - '+baselineUpper,
			},
			xAxis: {
				title: {
					text: 'Year',
				},
				crosshair: true,
				plotBands: plotBandsDiff(id),
				plotLines: plotlines(id),
				min: startYear,
			},
			yAxis: {
				title: {
					text: Highcharts.getOptions().lang.prec,
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
			series: [{data: [null, null]}]
		});
		charts[id].showLoading();
		return function(precipitation){
			charts[id].hideLoading();
			charts[id].update({
				title: {
					text: stationName + ' ' + Highcharts.getOptions().lang.titles[id],
				},
				legend: {
					enabled: true,
				},
				dataSrc: precipitation.src,
				series: [{
					name: Highcharts.getOptions().lang.diff,
					data: precipitation.total.difference(),
					color: 'red',
					negativeColor: 'blue',
					regression: false,
					regressionSettings: {
						type: 'linear',
						color: rainColor.color,
						name: Highcharts.getOptions().lang.linReg,
					},
				}],
			});
		}
	},

	YearlyPrecipitation: function (id) {
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'line'
			},
			xAxis: {
				title: {
					text: Highcharts.getOptions().lang.years,
				},
				crosshair: true,
				min: startYear,
			},
			yAxis: {
				title: {
					text: Highcharts.getOptions().lang.tprec,
				},
				lineWidth: 1,
				floor: 0, // Precipitation can never be negative
			},
			tooltip: {
				shared: true,
				valueSuffix: ' mm',
				valueDecimals: 0,
			},
			legend: {
				enabled: false,
			},
			series: [{data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				{data: [null, null]}],
		})
		charts[id].showLoading();
		return function(precipitation){
			charts[id].hideLoading();
			charts[id].update({
				title: {
					text: language[nav_lang].titles[id] + stationName,
				},
				legend: {
					enabled: true,
				},
				dataSrc: precipitation.src,
				series: [{
					id: 'snow',
					name: Highcharts.getOptions().lang.precSnow,
					type: 'column',
					stack: 'precip',
					stacking: 'normal',
					data: precipitation.snow.values,
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
					// {
					// data: precipitation.snow.linReg.points,
					// type: 'line',
					// color: snowColor.color,
					// name: Highcharts.getOptions().lang.linRegSnow,
					// marker: {
					// 	enabled: false, // Linear regression lines doesn't contain points
					// },
					// states: {
					// 	hover: {
					// 		lineWidth: 0, // Do nothing on hover
					// },
					// },
					// },
					// {
					// id: 'movAvg',
					// name: Highcharts.getOptions().lang.precMovAvg,
					// color: rainColor.color,
					// visible: false,
					// data: precipitation.total.plotMovAvg(),
					// marker: { enabled: false },
					// states: { hover: { lineWidthPlus: 0 } },
					// },
					// {
					// id: 'ciMovAvg',
					// name: Highcharts.getOptions().lang.movAvgCI,
					// type: 'arearange',
					// color: '#000055',
					// data: precipitation.total.plotMovAvgCI(),
					// zIndex: 0,
					// fillOpacity: 0.3,
					// lineWidth: 0,
					// states: { hover: { lineWidthPlus: 0 } },
					// marker: { enabled: false },
					// visible: false,
					// },
					{
						id: 'rain',
						name: Highcharts.getOptions().lang.precRain,
						type: 'column',
						stack: 'precip',
						stacking: 'normal',
						visible: true,
						data: precipitation.rain.values,
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
					// data: precipitation.rain.linReg.points,
					// type: 'line',
					// color: rainColor.color,
					// name: Highcharts.getOptions().lang.linRegRain,
					// marker: {
					// 	enabled: false, // Linear regression lines doesn't contain points
					// },
					// states: {
					// 	hover: {
					// 		lineWidth: 0, // Do nothing on hover
					// 	},
					// },
					// },
					// {
					// type: 'line',
					// name: Highcharts.getOptions().lang.linRegAll,
					// visible: false,
					// // linkedTo: ':previous',
					// color: 'red',
					// marker: {
					// 	enabled: false, // Linear regression lines doesn't contain points
					// },
					// states: {
					// 	hover: {
					// lineWidth: 0, // Do nothing on hover
					// },
					// },
					// enableMouseTracking: false, // No interactivity
					// data: precipitation.total.linReg.points,
					// }
				],
			});
		}
	},

	MonthlyPrecipitation: function (id) {
		// console.log('renderMonthlyPrecipitationGraph')
		var title = id.split('_');
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'line'
			},
			xAxis: {
				title: {
					text: Highcharts.getOptions().lang.years,
				},
				crosshair: true,
				min: startYear,
			},
			yAxis: {
				title: {
					text: Highcharts.getOptions().lang.tprec,
				},
				lineWidth: 1,
				max: 150,
				floor: 0, // Precipitation can never be negative
			},
			tooltip: {
				shared: true,
				valueSuffix: ' mm',
				valueDecimals: 0,
			},
			legend: {
				enabled: false,
			},
			series: [
				{data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				{data: [null, null]}]
		})
		charts[id].showLoading();
		return function(precipitation){
			charts[id].hideLoading();
			// console.log(precipitation)
			charts[id].update({
				title: {
					text: function(){ 
						if(title[1]){
							month = ' '+Highcharts.getOptions().lang.months[title[1]];
							return stationName + ' ' + Highcharts.getOptions().lang.titles[title[0]]+month;
						} 
						return stationName + Highcharts.getOptions().lang.titles[id];
					}()
				},
				dataSrc: precipitation.src,
				legend: {
					enabled: true,
				},
				series: [{
					regression: false,
					regressionSettings: {
						type: 'linear',
						color: snowColor.color,
						name: Highcharts.getOptions().lang.linRegSnow,
					},
					name: Highcharts.getOptions().lang.precSnow,
					type: 'column',
					stack: 'precip',
					stacking: 'normal',
					data: precipitation.snow.values,
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
				},
					// {
					// type: 'line',
					// color: snowColor.color,
					// name: Highcharts.getOptions().lang.linRegSnow,
					// data: precipitation.snow.linReg.points,
					// marker: { enabled: false },
					// },
					{
						regression: false,
						regressionSettings: {
							type: 'linear',
							color:rainColor.color,
							name: Highcharts.getOptions().lang.linRegRain,
							marker: { enabled: false },
						},
						name: Highcharts.getOptions().lang.precRain,
						type: 'column',
						stack: 'precip',
						stacking: 'normal',
						data: precipitation.rain.values,
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
					// type: 'line',
					// color:rainColor.color,
					// name: Highcharts.getOptions().lang.linRegRain,
					// data: precipitation.rain.linReg.points,
					// marker: { enabled: false },
					// },
					// {
					// name: Highcharts.getOptions().lang.movAvgCI,
					// type: 'arearange',
					// color: '#000055',
					// data: precipitation.total.plotMovAvgCI(),
					// zIndex: 0,
					// fillOpacity: 0.3,
					// lineWidth: 0,
					// states: { hover: { lineWidthPlus: 0 } },
					// marker: { enabled: false },
					// visible: false,

					// 		},{
					// 			name: Highcharts.getOptions().lang.precMovAvg,
					// 			visible: false,
					// 			color: rainColor.color,
					// 			data: precipitation.total.plotMovAvg(),
					// 			marker: { enabled: false },
					// 		},{
					// 			name: Highcharts.getOptions().lang.linRegAll,
					// 			visible: false,
					// 			marker: {
					// 				enabled: false, // Linear regression lines doesn't contain points
					// 			},
					// 			color: 'red',
					// 			states: {
					// 				hover: {
					// lineWidth: 0, // Do nothing on hover
					// },
					// },
					// enableMouseTracking: false, // No interactivity
					// data: precipitation.total.linReg.points,
					// }
				],
			});
		}
	},
	AbiskoIceTime: function (id) {
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'line'
			},
			title: {
				text: Highcharts.getOptions().lang.titles[id],
			},
			xAxis: {
				title: {
					text: Highcharts.getOptions().lang.years,
				},
				crosshair: true,
				min: startYear,
			},
			yAxis: [{
				title: {
					text: Highcharts.getOptions().lang.iceTime,
				},
				lineWidth: 1,
				max: 250,
				min: 80,
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
			legend: {
				enabled: false,
			},
			series: [
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				{data: [null, null]}]
		});
		charts[id].showLoading();
		return function(ice){
			charts[id].hideLoading();
			charts[id].update({
				legend: {
					enabled: true,
				},
				dataSrc: ice.src,
				series: [
					// {
					// name: Highcharts.getOptions().lang.movAvgCI,
					// type: 'arearange',
					// color: '#7777ff',
					// data: ice.iceTimeCIMovAvg,
					// zIndex: 0,
					// fillOpacity: 0.3,
					// lineWidth: 0,
					// states: { hover: { lineWidthPlus: 0 } },
					// marker: { enabled: false },
					// yAxis: 1,
					// visible: false,
					// },
					{
						regression: false,
						regressionSettings: {
							type: 'linear',
							color: '#00bb00',
							name: Highcharts.getOptions().lang.linIceTime,
						},
						yAxis: 0,
						name: Highcharts.getOptions().lang.iceTime2,
						color: '#00bb00',
						lineWidth: 0,
						marker: { radius: 2 },
						states: { hover: { lineWidthPlus: 0 } },
						data: ice.iceTime,
					},
					// {
					// yAxis: 1,
					// name: Highcharts.getOptions().lang.movAvgIceTime,
					// color: '#00bb00',
					// data: ice.iceTimeMovAvg,
					// marker: { enabled: false },
					// }
				],
			});
		}
	},
	AbiskoIce: function (id) {
		// console.log(title);
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'line'
			},
			title: {
				text: Highcharts.getOptions().lang.titles[id],
			},
			xAxis: {
				title: {
					text: Highcharts.getOptions().lang.years,
				},
				crosshair: true,
				min: startYear,
			},
			yAxis: [{
				title: {
					text: Highcharts.getOptions().lang.iceSub,
				},
				lineWidth: 1,
				labels: {
					formatter: function () {
						return (this.value > 366 ? this.value - 365 : this.value);
					},
				},
				tickPositions: [100, 150, 200, 250, 300, 365, 400],
				tickInterval: 50,
			}
				// ,{
				// title: {
				// 	text: Highcharts.getOptions().lang.iceTime,
				// },
				// lineWidth: 1,
				// max: 250,
				// min: 80,
				// opposite: true,
				// }
			],
			tooltip: {
				shared: true,
				valueDecimals: 0,
				formatter: function () {
					var tooltip = '<span style="font-size: 10px">' + (+this.x-1) + '/' + this.x + '</span><br/>';
					this.points.forEach(point =>
						tooltip += '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' +(point.point.name || point.y) + '</b><br/>');
					return tooltip;
				},
			},
			legend: {
				enabled: false,
			},
			series: [
				{data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				{data: [null, null]},
				{data: [null, null]}]
		});
		charts[id].showLoading();
		return function(ice){
			// console.log(ice);
			charts[id].hideLoading();
			charts[id].update({
				legend: {
					enabled: true,
				},
				dataSrc: ice.src,
				series: [{
					regression: false,
					regressionSettings: {
						type: 'linear',
						color: '#0000ee',
						name: Highcharts.getOptions().lang.linFrz,
					},
					yAxis: 0,
					name: Highcharts.getOptions().lang.freezeup,
					color: '#0000ee',
					lineWidth: 0,
					marker: { 
						radius: 2,
						symbol: 'circle'
					},
					states: { hover: { lineWidthPlus: 0 } },
					data: ice.freezeDOY,
				},{
					regression: false,
					regressionSettings: {
						type: 'linear',
						color: '#ee0000',
						name: Highcharts.getOptions().lang.linBrk,
					},
					yAxis: 0,
					name: Highcharts.getOptions().lang.breakup,
					color: '#ee0000',
					lineWidth: 0,
					marker: { radius: 2 },
					states: { hover: { lineWidthPlus: 0 } },
					data: ice.breakupDOY,
				},
					// {
					// name: Highcharts.getOptions().lang.movAvgCI,
					// type: 'arearange',
					// color: '#7777ff',
					// data: ice.iceTimeCIMovAvg,
					// zIndex: 0,
					// fillOpacity: 0.3,
					// lineWidth: 0,
					// states: { hover: { lineWidthPlus: 0 } },
					// marker: { enabled: false },
					// yAxis: 1,
					// visible: false,
					// },
					// {
					// 	regression: false,
					// 	regressionSettings: {
					// 		type: 'linear',
					// 		color: '#00bb00',
					// 		name: Highcharts.getOptions().lang.linIceTime,
					// 	},
					// 	yAxis: 1,
					// 	name: Highcharts.getOptions().lang.iceTime2,
					// 	color: '#00bb00',
					// 	lineWidth: 0,
					// marker: { radius: 2 },
					// states: { hover: { lineWidthPlus: 0 } },
					// data: ice.iceTime,
					// },
					// {
					// yAxis: 1,
					// name: Highcharts.getOptions().lang.movAvgIceTime,
					// color: '#00bb00',
					// data: ice.iceTimeMovAvg,
					// marker: { enabled: false },
					// }
				],
			});
		}
	},
	AbiskoSnow: function (id) {
		// console.log(id)
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'line'
			},
			title: {
				text: Highcharts.getOptions().lang.titles[id],
			},
			xAxis: {
				categories: help.months().rotate(6).slice(2),
				title: {
					text: Highcharts.getOptions().lang.month,
				},
				crosshair: true,
			},
			yAxis: {
				title: {
					text: Highcharts.getOptions().lang.snowDepth,
				},
				lineWidth: 1,
				floor: 0,
			},
			tooltip: {
				shared: true,
				valueSuffix: ' cm',
				valueDecimals: 0,
			},
			legend: {
				enabled: false,
			}

		});
		charts[id].showLoading();	
		return function(snow){
			charts[id].hideLoading();
			charts[id].update({
				dataSrc: snow.src,
				legend: {
					enabled: true,
				},
			})
			var series = Object.values(snow).map(p => {	
				return {

					name: language[nav_lang].abiskoSnowDepthPeriod[p.period],
					data: p.means.rotate(6).slice(2),
				}
			});
			series.forEach(each => {
				charts[id].addSeries(each)
			})
		}

	},
	iceThicknessYear: function(id){
		charts[id] = Highcharts.chart(id, {
			chart: {
				zoomType: 'x',
				type: 'column'
			},
			title: {
				text: "Ice Max Thickness measured by year"
			},
			xAxis: {
				title: {
					text: language[nav_lang].years 
				},
				crosshair: true,
				min: startYear,
			},
			yAxis: {
				title: {
					text: "Ice Thickness [cm]" 
				},
				crosshair: true,
				reversed: true,
			},
			tooltip: {
				shared: true,
				valueSuffix: ' cm',
				valueDecimals: 0,
			},
			legend: {
				enabled: false,
			},
			series: [
				{
					data: [null, null],
				},
				{
					data: [null, null],
				},
				{
					data: [null, null],
				},
				// {
				// 	data: [null, null],
				// },
				// {
				// 	data: [null, null],
				// },
				// {
				// 	data: [null, null],
				// },
			]
		})
		charts[id].showLoading();
		return function(data){
			charts[id].hideLoading();
			// console.log(data.total.max())
			charts[id].update({
				series: [{
					yAxis: 0,
					name: "test",
					color: '#0000ee',
					lineWidth: 0,
					marker: { 
						radius: 2,
						symbol: 'circle'
					},
					data: data.total.max().map(each => {
						return {
							x: each.x - 1,
							y: each.y
						}
					}),
				}]
			});

		}
	},
	iceThicknessDate: function(id){
		var startDate = new Date(startYear + "-01-01");
		// console.log(startDate)
		charts[id] = Highcharts.chart(id, {
			title: {
				useHTML: true,
				text: "<label>"+
				"Ice thickness by date across years </label><br>"+
				"<input type='date' value="+
				variables.dateStr()+
				" onclick=selectText(this) "+
				"onchange=updatePlot("+id+","+baselineLower+","+baselineUpper+",this.value)></input>"
			},
			chart: {
				zoomType: 'x',
				type: 'column'
			},
			xAxis: {
				title: {
					text: language[nav_lang].years
				},
				crosshair: true,
				// type: 'datetime',
				// min: startDate, 
				min: startYear,
			},
			yAxis: {
				title: {
					text: "Ice Thickness [cm]" 
				},
				crosshair: true,
				reversed: true,
			},
			legend: {
				enabled: false,
			},
			series: [
				{
					data: [null, null],
				},
				{
					data: [null, null],
				},
				{
					data: [null, null],
				},
				// {
				// 	data: [null, null],
				// },
				// {
				// 	data: [null, null],
				// },
				// {
				// 	data: [null, null],
				// },
			]
		})
		charts[id].showLoading();
		return function(data){
			charts[id].hideLoading();
			charts[id].update({
				tooltip: {
					shared: true,
					valueSuffix: ' cm',
					valueDecimals: 0,
					formatter: function () {
						var tooltip = '<span style="font-size: 10px">' + this.x + '</span><br/>';
						this.points.forEach(point => {
							tooltip += '<span">\u25CF</span> ' + point.series.name + ': <b>' + point.y + '</b><br/><br>'+ 'Closest date: ' + point.point.date +'<br/>';
						});
						return tooltip;
					},
				},
				series: [{
					yAxis: 0,
					name: "test",
					color: '#0000ee',
					lineWidth: 0,
					marker: { 
						radius: 2,
						symbol: 'circle'
					},
					data: data(variables.date),
					states: {
						hover: {
							color: snowColor.hover,
							animation: {
								duration: 0,
							},
						},
					},
					name: 'Ice Thickness',
				}]
			});

		}
	},
	ZoomableGraph: function(data, id, title){
		// console.log(title)
		// console.log(data);
		// charts[id] = Highcharts.chart(id, {
		// 	chart: {
		// 		zoomType: 'x'
		// 	},
		// 	// dataSrc: data.src,
		// 	title: {
		// 		text: title + ' [DUMMY/START]',
		// 	},
		// 	subtitle: {
		// 		text: document.ontouchstart === undefined ?
		// 		'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
		// 	},
		// 	xAxis: {
		// 		type: 'datetime',
		// 		dateTimeLabelFormats: { // don't display the dummy year
		// 			month: '%e. %b',
		// 			year: '%b'
		// 		},
		// 		title: {
		// 			text: 'Date'
		// 		},
		// 	},
		// 	yAxis: {
		// 		title: {
		// 			text: 'Temperatures'
		// 		},
		// 	},
		// 	legend: {
		// 		enabled: false
		// 	},
		// 	plotOptions: {
		// 		area: {
		// 			fillColor: {
		// 				linearGradient: {
		// 					x1: 0,
		// 					y1: 0,
		// 					x2: 0,
		// 					y2: 1
		// 				},
		// 				stops: [
		// 					[0, Highcharts.getOptions().colors[0]],
		// [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
		// ]
		// },
		// marker: {
		// radius: 2
		// },
		// lineWidth: 1,
		// states: {
		// hover: {
		// lineWidth: 1
		// }
		// },
		// threshold: null
		// }
		// },

		// series: [{
		// type: 'line',
		// name: 'Average',
		// data: data,
		// }]
		// });
	},
	Perma: function(id){
		// console.log(id)
		// console.log(data)
		charts[id] = Highcharts.chart(id, {
			chart: {
				zoomType: 'x',
				type: 'column'
			},
			title: {
				text: Highcharts.getOptions().lang.titles[id],
			},
			xAxis: {
				title: {
					text: Highcharts.getOptions().lang.years,
				},
			},
			yAxis: {
				title: {
					text: 'meters'
				},
				reversed: true,
				plotLines: [{
					color: "#88dd88",
					width: 2,
					value: 0,
					zIndex: 5,
					label: {
						text: Highcharts.getOptions().lang.groundlevel
					}
				}],
				min: 0,
				max: 1.5,
			},
			legend: {
				enabled: true
			},
			plotOptions: {
				column: {
					pointPadding: 0,
				},
				series: {
					events: {
						legendItemClick: function(event) {
							var thisSeries = this,
								chart = this.chart;

							if (this.visible === true) {
								this.hide();
								chart.get("highcharts-navigator-series").hide();
							} else {
								this.show();
								chart.series.forEach(function(el, inx) {
									if (el !== thisSeries) {
										el.hide();
									}
								});
								// chart.get("highcharts-navigator-series").setData(thisSeries.options.data, false);
								// chart.get("highcharts-navigator-series").show();
							}
							event.preventDefault();
						}
					}
				}
			},
			series: [{data: [null, null]},{data: [null, null]},{data: [null, null]},{data: [null, null]},{data: [null, null]},{data: [null, null]},{data: [null, null]},{data: [null, null]}],
		});
		charts[id].showLoading();
		return function(data){
			charts[id].hideLoading();
			charts[id].update({
				series: Object.keys(data).map(key => ({
					name: key,
					data: data[key],
					type: 'column',
					color: "#bb9999",
					opacity: 0.5,
					visible: "Torneträsk" == key,
				})),
			});
		}
	}

	//var rend_struct = {
	//	chart: undefined,
	//	config: undefined,
	//	clone: function(){
	//		return Object.assign({}, this);
	//	},
	//	create: function(config){
	//		var result = this.clone();
	//		result.config = config;
	//		return result;
	//	},
	//	init: function(id){
	//		this.chart = Highcharts.chart(id, this.config); 
	//	},
	//	addSeries: function(series){
	//		this.chart.addSeries(series);
	//		return this;
	//	},
	//}
}
