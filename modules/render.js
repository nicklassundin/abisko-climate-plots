// const Highcharts = require(['highcharts'], function(Highcharts){
// return Highcharts
// });
const highchart_help = require('../config/highcharts_config.js');
const language = require('../config/language.json');
var help = require('./helpers.js');

var baseline = require('../config/const.json');
global.baselineLower = baseline.baselineLower;
global.baselineUpper = baseline.baselineUpper;

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
			document.getElementById(id.id+"overlay").style.display = "none";
			updatePlot(id.id);
		}
	}
}

var baselineUI = function(id) {
	return annotations = [{
		labelOptions: {
			verticalAlign: 'top',
			crop: false,
			// shape: 'connector',
			y: 0,
			borderRadius: 5,
			backgroundColor: 'rgb(245, 245, 245)',
			borderWidth: 1,
			borderColor: '#AAA'
			// distance: 20,
		},
		draggable: 'x',
		labels: [{
			text: createBaseline(false,submit="resetPlot("+id+")").innerHTML,
			point: {
				xAxis: 0,
				yAxis: 10,
				x: baselineLower - (baselineLower-baselineUpper)/2,
				y: 2,
			},
			useHTML: true,
			style: {
				// width: '100%',
				// fontSize: '70%'
				opacity: .4,
			},
		}],
		events: {
			afterUpdate: function(e){
				var mov = parseInt(e.target.options.labels[0].x/12);
				if(!mov) mov = 0; 
				var dif = baselineUpper-baselineLower;
				var mid = baselineLower +dif/2+mov;
				if(2019-dif/2 < mid) mid = 2019-dif/2;
				if(1913+dif/2 > mid) mid = 1913+dif/2;
				baselineLower = parseInt(mid - dif/2);
				baselineUpper = parseInt(mid + dif/2);
				updatePlot(this)(id);
			},
			// TODO events for filling out form
			mouseover: function(e){
				// console.log(e.target.options.labels[0])
			},
			mouseclick: function(e){
				console.log(e)
			}
		}
	}];
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
		// console.log(id)
		// console.log(data)
		// var meta = data.meta;
		var overlay = document.getElementById(id+"overlay");
		var form = document.createElement("form");
		var div = document.createElement("div");
		div.setAttribute("id", id+"overlay"+"-input");
		div.appendChild(addInput());

		// var add = document.createElement("button")
		// add.innerHTML = "add"
		// add.setAttribute("onclick","appendChild("+id+"overlay"+"-input,addInput())");

		var submit = document.createElement("input")
		submit.setAttribute("type", "submit");
		var br = document.createElement("br");

		form.appendChild(div);
		form.appendChild(br);
		form.appendChild(br);
		form.appendChild(submit);
		// overlay.appendChild(add);
		overlay.appendChild(form);
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'area',
				zoomType: 'x',
			},
			title: {
				text: this.Highcharts.getOptions().lang.titles[id],
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
					text: this.Highcharts.getOptions().lang.years, 
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
					// name: this.Highcharts.getOptions().lang.linReg+"<br/>( R2: "+data.linReg.r2+" )",
					// useHTML: true,
					// data: data.linReg.points, 
					// type: 'line',
					// lineWidth: 2,
					// marker: {enabled: false,},
					// states: { hover: { lineWidthPlus: 0 } },
					// color: '#333377',
					// visible: false,
					// }
				]
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
					text: this.Highcharts.getOptions().lang.years, 
				},
				crosshair: true,
				min: 1912,
			},
			yAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.temp, 
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
						var title = stationName + this.Highcharts.getOptions().lang.titles[id];
						if(id_split[1]){
							month = ' '+this.Highcharts.getOptions().lang.months[id_split[1]];
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
					name: this.Highcharts.getOptions().lang.max,
					lineWidth: 0,
					marker: { radius: 2 },
					states: { hover: { lineWidthPlus: 0 } },
					color: '#ff0000',
					data: data.max.max(), 
					visible: false,
					showInLegend: !(typeof data.min === 'undefined'),
				},{
					name: this.Highcharts.getOptions().lang.min,
					lineWidth: 0,
					marker: { radius: 2 },
					states: { hover: { lineWidthPlus: 0 } },
					color: '#0000ff',
					data: data.min.min(),
					visible: false,
					showInLegend: !(typeof data.min === 'undefined'),
				},
					// {
					// name: 	this.Highcharts.getOptions().lang.yearlyCI,
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
					// name: this.Highcharts.getOptions().lang.movAvg,
					// color: '#888888',
					// marker: { enabled: false },
					// data: data.avg.plotMovAvg(),
					// }, 
					// {
					// name: 	this.Highcharts.getOptions().lang.movAvgCI,
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
							name: this.Highcharts.getOptions().lang.linReg,
						},
						data: data.avg.values,
					}],
			});
		}
	},

	TemperatureDifference: function (id) {
		// console.log(temperatures);
		// console.log(temperatures.difference());
		var overlay = document.getElementById(id+"overlay");
		overlay.appendChild(createBaseline(false,submit="resetPlot("+id+")"));
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'column'
			},
			// rangeSelector: {
			// selected: 2
			// },
			title: {
				text: this.Highcharts.getOptions().lang.titles[id],
			},
			subtitle: {
				text: this.Highcharts.getOptions().lang.subtitles.baseline + baselineLower +" - "+ baselineUpper 
			},
			// annotations: baselineUI(id),
			xAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.years,
				},
				crosshair: true,
				plotLines: plotlines(id),
				plotBands: plotBandsDiff(id),
				min: 1913,
			},
			yAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.temp,
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
				text: this.Highcharts.getOptions().lang.titles[id] + stationName,
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
						name: this.Highcharts.getOptions().lang.linReg,
					},
					name: this.Highcharts.getOptions().lang.diff,
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
				text: this.Highcharts.getOptions().lang.titles[id],
			},
			subtitle: {
				text: 'The maximum consecutive weeks with average temperature above freezing.',
			},
			xAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.years,
				},
				crosshair: true,
			},
			yAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.weeks,
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
						name: this.Highcharts.getOptions().lang.linReg,
					},
					name: this.Highcharts.getOptions().lang.weeks,
					lineWidth: 0,
					marker: { radius: 2 },
					states: { hover: { lineWidthPlus: 0 } },
					color: '#00aa00',
					data: season.values,
					visible: true,
				},
					// { 
					// name: this.Highcharts.getOptions().lang.ci,
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
					// name: this.Highcharts.getOptions().lang.movAvg,
					// color: '#00aa00',
					// marker: { enabled: false },
					// data: season.plotMovAvg(),
					// },
					// {
					// name: this.Highcharts.getOptions().lang.movAvgCI,
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
			title: {
				text: this.Highcharts.getOptions().lang.titles[id],
			},
			subtitle: {
				text: this.Highcharts.getOptions().lang.subtitles.baseline + ' '+ baselineLower +' - '+baselineUpper,
			},
			xAxis: {
				title: {
					text: 'Year',
				},
				crosshair: true,
				plotBands: plotBandsDiff(id),
				plotLines: plotlines(id),
			},
			yAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.prec,
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
				legend: {
					enabled: true,
				},
				dataSrc: precipitation.src,
				// annotations: baselineUI(id),
				series: [{
					name: this.Highcharts.getOptions().lang.diff,
					data: precipitation.total.difference(),
					color: 'red',
					negativeColor: 'blue',
					regression: false,
					regressionSettings: {
						type: 'linear',
						color: rainColor.color,
						name: this.Highcharts.getOptions().lang.linReg,
					},
				}],
			});
		}
	},

	YearlyPrecipitation: function (id) {
		var title = language[nav_lang].titles[id];
		if(typeof title == 'function') title = title();
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'line'
			},
			title: {
				text: title 
			},
			xAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.years,
				},
				crosshair: true,
			},
			yAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.tprec,
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
				legend: {
					enabled: true,
				},
				dataSrc: precipitation.src,
				series: [{
					id: 'snow',
					name: this.Highcharts.getOptions().lang.precSnow,
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
					// name: this.Highcharts.getOptions().lang.linRegSnow,
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
					// name: this.Highcharts.getOptions().lang.precMovAvg,
					// color: rainColor.color,
					// visible: false,
					// data: precipitation.total.plotMovAvg(),
					// marker: { enabled: false },
					// states: { hover: { lineWidthPlus: 0 } },
					// },
					// {
					// id: 'ciMovAvg',
					// name: this.Highcharts.getOptions().lang.movAvgCI,
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
						name: this.Highcharts.getOptions().lang.precRain,
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
					// name: this.Highcharts.getOptions().lang.linRegRain,
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
					// name: this.Highcharts.getOptions().lang.linRegAll,
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
		// console.log(id)
		var title = id.split('_');
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'line'
			},
			title: {
				text: function(){ 
					if(title[1]){
						month = ' '+this.Highcharts.getOptions().lang.months[title[1]];
						return this.Highcharts.getOptions().lang.titles[title[0]]+month;
					} 
					return this.Highcharts.getOptions().lang.titles[id];
				}()
			},
			xAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.years,
				},
				crosshair: true,
			},
			yAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.tprec,
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
				dataSrc: precipitation.src,
				legend: {
					enabled: true,
				},
				series: [{
					regression: false,
					regressionSettings: {
						type: 'linear',
						color: snowColor.color,
						name: this.Highcharts.getOptions().lang.linRegSnow,
					},
					name: this.Highcharts.getOptions().lang.precSnow,
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
					// name: this.Highcharts.getOptions().lang.linRegSnow,
					// data: precipitation.snow.linReg.points,
					// marker: { enabled: false },
					// },
					{
						regression: false,
						regressionSettings: {
							type: 'linear',
							color:rainColor.color,
							name: this.Highcharts.getOptions().lang.linRegRain,
							marker: { enabled: false },
						},
						name: this.Highcharts.getOptions().lang.precRain,
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
					// name: this.Highcharts.getOptions().lang.linRegRain,
					// data: precipitation.rain.linReg.points,
					// marker: { enabled: false },
					// },
					// {
					// name: this.Highcharts.getOptions().lang.movAvgCI,
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
					// 			name: this.Highcharts.getOptions().lang.precMovAvg,
					// 			visible: false,
					// 			color: rainColor.color,
					// 			data: precipitation.total.plotMovAvg(),
					// 			marker: { enabled: false },
					// 		},{
					// 			name: this.Highcharts.getOptions().lang.linRegAll,
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
		// console.log(title);
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'line'
			},
			title: {
				text: this.Highcharts.getOptions().lang.titles[id],
			},
			xAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.years,
				},
				crosshair: true,
			},
			yAxis: [{
				title: {
					text: this.Highcharts.getOptions().lang.iceTime,
				},
				lineWidth: 1,
				max: 250,
				min: 80,
				// opposite: true,
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
			// console.log(ice);
			charts[id].hideLoading();
			charts[id].update({
				legend: {
					enabled: true,
				},
				dataSrc: ice.src,
				series: [
					// {
					// name: this.Highcharts.getOptions().lang.movAvgCI,
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
							name: this.Highcharts.getOptions().lang.linIceTime,
						},
						yAxis: 0,
						name: this.Highcharts.getOptions().lang.iceTime2,
						color: '#00bb00',
						lineWidth: 0,
						marker: { radius: 2 },
						states: { hover: { lineWidthPlus: 0 } },
						data: ice.iceTime,
					},
					// {
					// yAxis: 1,
					// name: this.Highcharts.getOptions().lang.movAvgIceTime,
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
				text: this.Highcharts.getOptions().lang.titles[id],
			},
			xAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.years,
				},
				crosshair: true,
			},
			yAxis: [{
				title: {
					text: this.Highcharts.getOptions().lang.iceSub,
				},
				lineWidth: 1,
				labels: {
					formatter: function () {
						return this.value > 52 ? this.value - 52 : this.value;
					},
				}
			}, {
				title: {
					text: this.Highcharts.getOptions().lang.iceTime,
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
						name: this.Highcharts.getOptions().lang.linFrz,
					},
					yAxis: 0,
					name: this.Highcharts.getOptions().lang.freezeup,
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
						name: this.Highcharts.getOptions().lang.linBrk,
					},
					yAxis: 0,
					name: this.Highcharts.getOptions().lang.breakup,
					color: '#ee0000',
					lineWidth: 0,
					marker: { radius: 2 },
					states: { hover: { lineWidthPlus: 0 } },
					data: ice.breakupDOY,
				},
					// {
					// name: this.Highcharts.getOptions().lang.movAvgCI,
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
							name: this.Highcharts.getOptions().lang.linIceTime,
						},
						yAxis: 1,
						name: this.Highcharts.getOptions().lang.iceTime2,
						color: '#00bb00',
						lineWidth: 0,
						marker: { radius: 2 },
						states: { hover: { lineWidthPlus: 0 } },
						data: ice.iceTime,
					},
					// {
					// yAxis: 1,
					// name: this.Highcharts.getOptions().lang.movAvgIceTime,
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
		// console.log(Object.values(snow))
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'line'
			},
			title: {
				text: this.Highcharts.getOptions().lang.titles[id],
			},
			xAxis: {
				categories: help.months().rotate(6).slice(2),
				title: {
					text: this.Highcharts.getOptions().lang.month,
				},
				crosshair: true,
			},
			yAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.snowDepth,
				},
				lineWidth: 1,
				floor: 0,
			},
			tooltip: {
				shared: true,
				valueSuffix: ' cm',
				valueDecimals: 0,
			},
			// series: [
			// 	{data: [null, null]}
			// ],
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
			var series = Object.values(snow).map(p => charts[id].addSeries({
				name: language[nav_lang].abiskoSnowDepthPeriod[p.period],
				data: p.means.rotate(6).slice(2),
			}));
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
				// plotBackgroundColor: "#ddddff",
			},
			// dataSrc: data.src,
			title: {
				text: this.Highcharts.getOptions().lang.titles[id],
			},
			xAxis: {
				title: {
					// text: 'Year'
					text: this.Highcharts.getOptions().lang.years,
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
						text: this.Highcharts.getOptions().lang.groundlevel
					}
				}]
			},
			legend: {
				enabled: false
			},
			series: [{data: [null, null]}],
		});
		charts[id].showLoading();
		return function(data){
			charts[id].hideLoading();
			charts[id].update({
				series: [{
					data: data.map(each => ({
						x: each.x,
						y: each.y,
					})),
					name: 'Histogram',
					type: 'histogram',
					color: "#bb9999",
					opacity: 0.5,
				}]
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
