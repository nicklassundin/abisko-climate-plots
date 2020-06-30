global.Highcharts = require('highcharts');
require('jquery-contextmenu');
require('highcharts-more')(Highcharts);
require('highcharts/modules/series-label')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data.js')(Highcharts);
require('highcharts/modules/histogram-bellcurve')(Highcharts);
const highchart_help = require('../../config/highcharts_config.js');
var base = require('./base.js')
const formatters = require('./tooltips.js').formatters;
const help = require('../helpers.js');

// require('textarea-markdown');

// var constant = require('../../config/const.json')
// global.baselineLower = constant.baselineLower;
// global.baselineUpper = constant.baselineUpper;
// global.startYear = constant.startYear;

var chart = {
	metaTable: function(id, json, i=0){
			Object.keys(json).forEach(key => {
				$('#'+id).append('<div id="'+id+'_cont"></div>');
				$('#'+id+'_cont').append('<div id="'+id+'_button_'+key+'" class="mini_button">- '+key+'</div><br/>')
				$('#'+id+'_cont').append('<div id="'+id+'_box_'+key+'" class="box"></div>');
				$('#'+id+'_box_'+key).append('<textarea class="json" cols="80">'+JSON.stringify(json[key], undefined, 4)+'</textarea>')
				$('#'+id+'_box_'+key).append('<br/>')
				$("#"+id+'_button_'+key).click(function(){
					$("#"+id+"_box_"+key).slideToggle();
				});
			})
		},

	getMeta: function(define, id){
		var meta = {};
		meta.config = require('../../config/charts/'+define.config+'.json')
		meta.lang = require('../../config/charts/lang/'+nav_lang+'/'+define.lang+'.json');
		meta.dataSource = require('../../config/charts/lang/'+nav_lang+'/dataSource.json')[define.data];
		meta.month = (define.monthly ? require('../../config/charts/monthly.json') : { "month": false })
		meta.set = require('../../config/charts/'+define.set+'.json');
		meta.unitType = define.unitType != undefined ? require('../../config/charts/lang/'+nav_lang+'/units.json')[define.unitType] : {};
		return meta;
	},
	textMorph: function(text, meta){
		var res = "";
		if(text){
			try{
				var res = text.replace("[stationName]", stationName).replace("[month]", meta.month).replace("[baseline]", baselineLower +" - "+ baselineUpper).replace("[CO2]", 'CO'+("2".sub())).replace("[SOME TEXT]", "")
				if(meta.units){
					var res = res.replace("[unit]", meta.units.singular).replace("[units]", meta.units.plural).replace("[interval]", meta.units.interval);
				}
			}catch(error){
				console.log(this.id)
				console.log(text)
				console.log(meta)
				console.log(error)
				throw error;
			}
		}
		var onkeypress="this.style.width = ((this.value.length + 1) * 8) + 'px';"
		var elType = (variables.debug ? "<input class=dbgIn type='text' onkeypress="+onkeypress+" onclick=selectText(this) value='"+text+"'></input>" : res)
		return elType
		// return res
	},
	id: undefined,
	chart: undefined,
	metaRef: undefined,
	metaFiles: undefined,
	meta: undefined,
	data: undefined,
	setup: function(id, metaRef){
		this.id = id;
		this.metaRef = metaRef;
		this.metaFiles = Object.assign({}, metaRef);
		this.metaFiles = this.getMeta(this.metaFiles, id)
		this.meta = Object.values(this.metaFiles).reduce((x, y) => $.extend(true, x, y))
		var meta = this.meta;
		var title = this.title(0);
		var textMorph = this.textMorph;
		this.metaTable('debug_table_'+id, this.metaFiles);
		this.chart = Highcharts.chart(id, {
			dataSrc: '[placeholder]',
			credits: {
				enabled: false
			},
			lang: require('../../config/charts/lang/'+nav_lang+'/menu.json'),
			exporting: {
				chartOptions: {
					// annotationsOptions: undefined,
					// annotations: undefined,
				},
				// showTable: true, // TODO DATA TABLE
				// printMaxWidth: 1200,
				sourceWidth: 900,
				// sourceHeight: 800,
				scale: 8,
				// allowHTML: true,
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
							textKey: 'langOption',
							onclick: function(){
								if(nav_lang=='en') nav_lang='sv';
								else nav_lang='en';
								Highcharts.setOptions({
									lang: require('../../config/charts/lang/'+nav_lang+'/menu.json') 
								})	
								var id = this.renderTo.id.split('_')[0];
								renderInterface.updatePlot(this);
							},
						},{
							textKey: 'showDataTable',
							onclick: function(){
								if(this.options.exporting.showTable) {
									this.dataTableDiv.innerHTML = '';
								};
								this.update({
									exporting: {
										showTable: !this.options.exporting.showTable, 
									},
								});
								// TODO toggle between 'Show data' and 'Hide data'
							},
						},{
							textKey: 'dataCredit',
							onclick: function(){
								if(this.options.dataSrc){
									console.log(meta.data)
									window.location.href = meta.data.src;
								}
							},
						},{
							textKey: 'contribute',
							onclick: function(){
								window.location.href = 'https://github.com/nicklassundin/abisko-climate-plots/wiki';
							},
						}],
					},
				},
			},
			chart: {
				type: meta.type, 
				zoomType: 'x',
			},
			legend: {
				enabled: true,
			},
			xAxis: {
				type: meta.xAxis.type,
				title: {
					useHTML: true,
					text: meta.xAxis.bott, 
				},
				gridLineWidth: meta.xAxis.gridLineWidth,
				categories: (meta.period) ? meta.xAxis.categories : undefined,
				corsshair: true,
				min: (meta.period) ? null : (meta.xAxis.min) ? meta.xAxis.min : startYear,
			},
			tooltip: {
				shared: true,
				valueSuffix: ' '+textMorph(meta.valueSuffix, meta),
				valueDecimals: meta.decimals,
				formatter: (meta.tooltip != undefined) ? formatters[meta.tooltip.type] : undefined
			},
			series: Object.keys(meta.series).map(each => ({
				showInLegend: false,
				data: [null, null],
			}))
		})
		var groups = Object.keys(meta.groups).map(key => ({
			key: key,
			enabled: meta.groups[key].enabled
		}));
		if(Object.keys(meta.groups).map(key => meta.groups[key].enabled).filter(each => each).length > 1){
			var gTitle = this.groupTitle();
			this.switchToGroup(groups[0].key, true, change = false)
			$('#'+id).append(gTitle);
			this.chart.showLoading();
		}
		return new Promise(function(resolve, reject){
			resolve(true);
		})
	},
	title: function(gID){
		var group = this.meta.groups[gID];
		var title = '<label>'+
			this.textMorph(group.title, this.meta)+
			'</label><br>';
		if(group.select != undefined && group.select.enabled){
			title = title + '<label style="font-size: 10px">'+
				group.select.text+
				' </label>'+
				'<input type="date" value='+
				variables.dateStr()+
				' onclick=selectText(this) '+
				'onchange=renderInterface.updatePlot('+this.id+','+baselineLower+','+baselineUpper+',this.value)></input>'
		}
		return title; 
	},
	groupTitle: function(active = 0){
		var id = this.id
		var meta = this.meta;
		var group = Object.keys(meta.groups).filter((key) => meta.groups[key].enabled).map(function(each, index){
			if(index == active){
				return "<button class='tablinks_"+id+" active' id="+index+">"+meta.groups[each].legend+"</button>"
			}else{
				return "<button class='tablinks_"+id+"' id="+index+">"+meta.groups[each].legend+"</button>"
			}
		})
		return "<div id='"+this.id+"_title' class='tab'>" + group.join("") + "</div>"
	},
	initiate: function(data = this.data){
		var id = this.id;
		this.data = data;
		// console.log(id)
		// console.log(data)
		// // console.log((data.max != undefined) ? (data.max.max != undefined ? data.max.max(false).values : undefined) : data.total.max(false).values)
		// console.log((data.max != undefined) ? data.max.max(false) : data.total.max(false))
		var meta = this.meta;
		// console.log(meta)
		var textMorph = this.textMorph;
		var groups = Object.keys(meta.groups).map(key => ({
			key: key,
			enabled: meta.groups[key].enabled
		}));
		var groups = groups.filter(each => each.enabled);
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
				data: (data.max != undefined) ? ((data.max.max != undefined) ? data.max.max().values : data.max().values) : undefined ,
				visible: false,
				type: meta.series.max.type,
			}),
			min: () => ({
				name: meta.series.min.name,
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.min.colour,
				data: (data.min != undefined) ? ((data.min.min != undefined) ? data.min.min().values : data.min().values) : undefined ,
				visible: false,
				type: meta.series.min.type,
			}),
			extreme: () => ({
				name: meta.series.extreme.name,
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.extreme.colour,
				data: (data.max != undefined) ? (data.max.max != undefined ? data.max.max(false).values : undefined) : data.total.max(false).values, 
				visible: false,
				type: meta.series.extreme.type,
			}),
			first: () => ({
				name: meta.series.first.name,
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.first.colour,
				data: data.min.first(),
				visible: false,
				type: meta.series.first.type,
			}),
			last: () => ({
				name: meta.series.last.name,
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.last.colour,
				data: data.min.last(),
				visible: false,
				type: meta.series.last.type,
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
					// type: 'linear',
					// color: meta.series.linjer.colour,
					// name: meta.series.linjer.name,
				},
				visible: true,
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
				data: (data.difference != undefined ?
					data.difference() : 
					(data.avg != undefined ?
						data.avg.difference() : 
						(data.total != undefined ? 
							data.total.difference() : 
							data(variables.date).difference()))),
				color: 'red',
				negativeColor: 'blue',
				visible: true,
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
				data: (data.snow != undefined) ? data.snow.values : undefined,
				visible: true,
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
				data: (data.rain != undefined) ? data.rain.values : undefined,
				color: meta.series.rain.colour,
				borderColor: meta.series.rain.borderColour,
				states: {
					hover: {
						color: meta.series.rain.hoverColour,
						animation: {
							duration: 0,
						}
					}
				},
				visible: true,
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
				data: data,
				visible: true,
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
				data: data.freeze.values,
				visible: true,
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
				data: data.breakup.values,
				visible: true,
			}),
			iceThick: () => ({
				name: meta.series.iceThick.name,
				color: meta.series.iceThick.colour,
				lineWidth: 0,
				marker: {
					radius: 2,
					symbol: 'circle',
				},
				data: (data.total != undefined) ? data.total.max().values : data(date = variables.date).values,
				visible: true,
			}),
			iceThickDiff: () => ({
				name: meta.series.iceThickDiff.name,
				color: meta.series.iceThickDiff.colour,
				lineWidth: 0,
				marker: {
					radius: 2,
					symbol: 'circle',
				},
				data: (data.total != undefined) ? data.total.max().values : data(date = variables.date).difference(),
				visible: true,
			}),
			perma: (p, s, k) => ({
				name: (s.name == undefined) ? k : s.name,
				type: s.type,
				color: s.colour,
				opacity: 0.5,
				data: p.values,
				visible: k == "Torneträsk",
			}),
			period: (p, s) => ({
				name: s.name, 
				type: s.type,
				lineWidth: 1,
				data: p.means.rotate(6).slice(2),
				visible: true,
			}),
			co2: () => ({
				name: textMorph(meta.series.co2.name, meta),
				color: meta.series.co2.colour,
				type: meta.series.co2.type,
				lineWidth: 2,
				states: { hover: { lineWidthPlus: 0 } },
				data: data.values,
				turboThreshold: 4000,
				fillOpacity: 0.2,
				marker: {
					states: {
						select: {
							fillColor: 'red',
							lineWidth: 1,
							radius: 5,
						}
					}
				},
				zIndex: 6,
			})
		}
		this.chart.hideLoading();
		var series = [];
		// TODO clean up
		try{
			Object.keys(meta.series).filter((s) => (meta.series[s].group != undefined) ? meta.groups[meta.series[s].group].enabled : false).forEach(key => {
				try{
					if(meta.period){
						series.push(seriesBuild['period'](data[key], meta.series[key]))
					}else if(meta.groups['0'].perma){
						series.push(seriesBuild['perma'](data[key], meta.series[key], key))
					}else{
						series.push(seriesBuild[key]());
					}
				}catch(error){
					console.log(key);
					console.log(error);
					console.log(meta);
					console.log(data)
					throw error
				}
			})
		}catch(error){
			console.log(meta.groups)
			console.log(meta.series)
			throw error
		}
		this.chart.update({
			series: series
		})

		if(Object.keys(meta.groups).map(key => meta.groups[key].enabled).filter(each => each).length > 1){
			var chart = this;
			$(".tablinks_"+id).click(function(e) {
				$(".tablinks_"+id).toggleClass('active')
				// e.currentTarget.className += " active";
				chart.switchToGroup(e.target.id);
			})
		}
		if(meta.groups['0'].perma){
			this.chart.update({
				plotOptions: {
					pointPadding: 0,
					series: {
						events: {
							legendItemClick: function(event){
								var thisSeries = this,
									chart = this.chart;
								if(this.visible === true) {
									this.hide();
									chart.get("highcharts-navigator-series").hide();
								}else{
									this.show();
									chart.series.forEach(function(el, inx){
										if(el !== thisSeries){
											el.hide();
										}
									});
								}
								event.preventDefault();
							}
						},
					}
				}
			})	
		}
		this.switchToGroup(groups[0].key)	
	},
	switch: function(){
		if(index){
			this.weather();
		}else{
			this.climate();
		}
	},
	switchToGroup: function(gID, changeVisibility = true, change = true){
		var meta = this.meta;
		var id = this.id;
		var title = this.title(gID);
		var textMorph = this.textMorph;
		var group = meta.groups[gID];
		if(change) {
			// Object.keys(meta.series).forEach((key, index) => {
			Object.keys(meta.series).filter((s) => (meta.series[s].group != undefined) ? meta.groups[meta.series[s].group].enabled : false).forEach((key, index) => {
				if(meta.series[key].group == gID){
					$('#' + id).highcharts().series[index].update({
						visible: meta.series[key].visible,
						showInLegend: true,
					})
				}else{
					$('#' + id).highcharts().series[index].update({
						visible: false,
						showInLegend: false,
					})
				}
			})
		}
		var plotLinesX = function(group){
			var res = [];
			if(group.baseline){
				return base.baseline.plotlines(id);
			}
			return null
		}
		var plotLinesY = function(group){
			var res = [];
			if(group.ppm400){
				res.push({
					color: '#aaaaaa',
					dashStyle: 'shortDash',
					value: 400,
					width: 2,
					label: {
						text: '400 ppm',
						style: {
							color: '#aaaaaa',
							fontWeight: 'bold',
						}
					}
				})
			}
			if(group.ppm350){
				res.push({
					color: '#aaaaaa',
					dashStyle: 'shortDash',
					value: 350,
					width: 2,
					label: {
						text: '350 ppm',
						style: {
							color: '#aaaaaa',
							fontWeight: 'bold',
						}
					}
				})
			}
			if(group.perma){
				res.push({
					color: group.yAxis.plotLines.color,
					width: 2,
					value: 0,
					zIndex: 5,
					label: {
						text: group.yAxis.plotLines.text,
					},
				})
			}

			return res.length < 0 ? null : res;
		}
		try{
			this.chart.update({
				title: {
					text: title,
					useHTML: true,
				},
				subtitle: {
					text: (group.subTitle != undefined) ? textMorph(group.subTitle, meta) : "",
				},
				caption: {
					text: textMorph(group.caption, meta),
					useHTML: true,
				},
				xAxis: {
					plotLines: plotLinesX(group),
					plotBands: group.baseline ? base.baseline.plotBandsDiff(id) : null, 
				},
				yAxis: {
					title: {
						text: textMorph(group.yAxis.left, meta), 
						useHTML: true,
					},
					plotLines: [{
						value: 0,
						color: 'rgb(204, 214, 235)',
						width: 2,
					}],
					max: group.yAxis.max,
					min: group.yAxis.min,
					tickInterval: (group.yAxis.left.tickInterval) ? group.yAxis.left.tickInterval : 1,
					lineWidth: 1,
					reversed: group.yAxis.reversed,
					plotLines: plotLinesY(group), 
				}
			})
		}catch(error){
			console.log(group);
			console.log(this.chart)
			throw error
		}
		if(group.pointSelect){
			this.chart.update({
				plotOptions: {
					series: {
						marker: {
							enabledThreshold: 0,
							radius: 1,
							state: {
								select: {
									lineColor: "6666bb",
									lineWidth: 1,
									radius: 5,
								},
								hover: {
									radiusPlus: 20,
								},
							}
						},
						allowPointSelect: true,
						point: {
							events: {
								select: function () {
									var date = new Date(this.category);
									var text = "Date: "+ date.getFullYear() +"-"+ date.getMonth()+"-"+date.getDate() +
										"<br/>CO"+ ("2".sub())+": " + this.y + ' ppm';
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
				}
			});
		}else{
			this.chart.update({
				plotOptions: {
					series: {
						allowPointSelect: true,
					}
				}
			})
		}
	},
	clone: function(){
		return Object.assign({}, this);
	}
}
var render = {
	charts: {},
	setup: function(id, meta){
		try{
		if(meta.month){
			this.charts[id] = new Promise(function(resolve, reject){
				try{
					var months = help.months()
					if(variables.debug) months = [months.shift()];
					var recurMonth = function(mnths){
						var month = mnths.shift()
						var cloneMeta = Object.assign({}, meta, {});
						cloneMeta.month = help.monthName(month);
						var res = {};
						res[month] = chart.clone();
						try{
							if(mnths.length > 0){
								res[month].setup(id+"_"+month, cloneMeta)
								return Object.assign(res, recurMonth(mnths), {});
							}else{
								res[month].setup(id+"_"+month, cloneMeta)
								res.meta = meta;
								return res
							}
						}catch(error){
							console.log({ERROR: error, month: month, meta: meta})
							reject(error)
						}
					}
					rest = recurMonth(months);
					resolve(rest);
				}catch(error){
					console.log({ERROR: error, ID: id, meta: meta});
					reject(error);
				}
			});
		}else{
			this.charts[id] = new Promise(function(resolve, reject){
				try{
					var res = chart.clone() 
					res.setup(id, meta);
					resolve(res);
				}catch(error){
					reject(error)
				}
			})
		}
		}catch(error){
			console.log(id);
			console.log(meta)
			throw error
		}
	},
	initiate: function(id, data){
		this.charts[id].then(function(result){
			if(result.meta.month){
				if(variables.debug){
					result[help.months().shift()].initiate(data['1']);
				}else{

					help.months().forEach((month, index) => {
						result[month].initiate(data[index+1+'']);
					})
				}
			}else{
				result.initiate(data)
			}
		})
	},
	updatePlot: function(id, bl, bu, date){
		try{

			if(date){
				date = date.split("-");
				variables.date = new Date(date[0],Number(date[1])-1,date[2]);
			}
			if(id.renderTo) id=id.renderTo.id;
			if(id.id) id=id.id; // TODO fix why this it gets a div not id
			var low = document.getElementById(id+"lowLabel") 
			var upp = document.getElementById(id+"uppLabel") 
			if(low){
				if(!bl) bl = low.value;
				if(!bu) bl = upp.value;
			} 
			if(bl<bu && bl>=1913) baselineLower=bl;
			if(bu>bl && bu<2019) baselineUpper=bu;
			this.charts[id].then(function(chart){
				if(id.split('_')[1]) id = id.split('_')[0]
				var div = document.getElementById(id);
				chart.chart.destroy();
			})
		}catch(error){
			console.log(id)
			throw error;
		}
		var cont = this;
		this.charts[id].then(function(result){
			cont.setup(id, result.metaRef)
			cont.initiate(id, result.data)
		})
	}
}
global.renderInterface = render;
exports.render = render;
