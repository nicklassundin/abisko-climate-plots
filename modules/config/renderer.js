global.Highcharts = require('highcharts');
require('jquery-contextmenu');
require('highcharts-more')(Highcharts);
require('highcharts/modules/series-label')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data.js')(Highcharts);
require('highcharts/modules/histogram-bellcurve')(Highcharts);
require('highcharts/modules/xrange')(Highcharts);
// const highchart_help = require('./highcharts/config.js');
const seriesBuild = require('./series.js').series;
var base = require('./highcharts_config/base.js')
const tooltips = require('./formatters/tooltips.js');
const formatters = tooltips.formatters;
const dateFormats = tooltips.dateFormats;
const axisFormats = require('./formatters/axis.js');
const yAxisFormats = axisFormats.yAxis;
const help = require('../helpers.js');

var chart = {
	id: undefined,
	initiated: false,
	chart: undefined,
	metaRef: undefined,
	metaFiles: undefined,
	meta: undefined,
	data: undefined,
	create: function(meta, old){
		// TODO save what can be done
		if(old) this.gID = old.gID		
		//


		this.metaRef = meta;
		var metaRef = this.metaRef;
		var id = metaRef.files.stationDef.id;
		this.id = id;
		try{
			var result = {
				sets: undefined,
				setup: function(){
					this.sets.forEach(key => {
						this[key].setup();
					})
				},
				initiate: function(data){
					this.sets.forEach(key => {
						this[key].initiate(data);
					})
				}
			}
			var res = this.clone();
			return new Promise((resolve, reject) => {
				var meta = metaRef.aggr();
				res.chart = Highcharts.chart(id, {
					lang: meta.menu, 
					credits: {
						enabled: false,
						href: null,
						text: meta.menu.dataCredit+': <br/>'+meta.dataSource.meta.desc+'<br/>'+meta.dataSource.meta.downloadDate+'<br/>'
						// +meta.dataSource.meta.citation
						,
						position: {
							y: -35,
						}
					},
					chart: {
						// styledMode: true,
					}
				});
				res.chart.showLoading();
				res.id = id;
				res.metaRef = metaRef
				res.metaFiles = meta.files;
				res.meta = {}
				$.extend(true, res.meta, metaRef.text())
				res.setup()
				resolve(res)
				// }

			})
		}catch(error){
			throw error;
		}
	},
	setup: function(){
		var id = this.id
		var title = this.title(0);
		var meta = this.meta
		var cM = (m) => {
			return meta.context || !(meta.context === undefined) ? m : null;
		}
		this.chart.update({
			navigation: {
				buttonOptions: {
					// enabled: meta.contex
				}
			},
			credits: {
				enabled: false
			},
			tooltip: {
				shared: true,
				valueSuffix: ' '+meta.valueSuffix,
				// valueDecimals: meta.decimals,
			},
			exporting: {
				chartOptions: {
					// annotationsOptions: undefined,
					// annotations: undefined,
				},
				// showTable: true, // TODO DATA TABLE
				// printMaxWidth: 1200,
				// sourceWidth: 900,
				sourceWidth: 700*1.2,
				sourceHeight: 350*1.2,
				scale: 8,
				filename: 'id',
				allowHTML: true,
				tableCaption: '',
				showTable: false,
				buttons: {
					contextButton: {
						menuItems: [
							cM({
								textKey: 'downloadPDF',
								onclick: function(){
									this.exportChart({
										type: 'application/pdf'
									});
								},
								// enabled: meta.contex,
							}),
							cM({
								textKey: 'downloadJPEG',
								onclick: function(){
									this.exportChart({
										type: 'image/jpeg'
									});
								},
								enabled: meta.contex,
							}), cM('downloadSVG'), 'viewFullscreen', cM('printChart'),cM({
								separator: true,
								enabled: meta.contex,
							}),cM({
								textKey: 'langOption',
								onclick: function(){
									if(nav_lang=='en') nav_lang='sv';
									else nav_lang='en';
									Highcharts.setOptions({
										lang: meta.menu, 
									})	
									var id = this.renderTo.id.split('_')[0];
									renderInterface.updatePlot(this);
								},
								enabled: meta.contex,
							}),{
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
							},cM({
								textKey: 'dataCredit',
								onclick: function(){
									try{
										window.open(meta.dataSource.meta.src);
									}catch(error){
										console.log(meta);
										throw error
									}
								},
								enabled: meta.contex,
							})],
					},
				},
			},
			chart: {
				type: meta.type, 
				zoomType: 'x',
			},
			legend: {
				enabled: false 
			},
			// series: Object.keys(meta.series).map(each => ({
			// showInLegend: false,
			// data: [null, null],
			// }))
		})
		this.chart.showLoading();
		// this.chart.redraw();
		if(Object.keys(meta.groups).map(key => meta.groups[key].enabled).filter(each => each).length > 1){
			var gTitle = this.groupTitle(this.gID);
			this.switchToGroup(this.gID ,true, change = false)
			$('#'+id).append(gTitle);
		}
		return this
	},
	title: function(gID){
		try{
			var meta = this.meta;
			var group = meta.groups[gID];
			var title = group.title;
			return title
		}catch(error){
			console.log(gID)
			console.log(this.meta)
			console.log(this)
			throw error
		}
	},
	groupTitle: function(active){
		var id = this.id
		var meta = this.meta;

		if(!active){

			active = parseInt(Object.keys(meta.groups).filter(k => meta.groups[k].enabled ).shift())
			if(active > 0){
				active = parseInt(Object.keys(meta.groups).filter(k => meta.groups[k].prime).shift())
				if(!active) active = 2;
			} 
		}

		var group = Object.keys(meta.groups).filter((key) => meta.groups[key].enabled).map(function(each){
			var index = parseInt(each)
			if(index == active){
				return "<button class='tablinks_"+id+" active' id="+index+">"+meta.groups[each].legend+"</button>"
			}else{
				return "<button class='tablinks_"+id+"' id="+index+">"+meta.groups[each].legend+"</button>"
			}
		})
		return "<div id='"+this.id+"_title' class='tab'>" + group.join("") + "</div>"
	},
	initiate: function(data = this.data){
		var meta = this.meta;	
		var id = this.id;
		// if(this.meta.subset){
		// data = data[this.meta.subset.set] 
		// this.data = data[this.meta.subset.set] 
		// }else{
		this.data = data;
		// }
		// console.log(this.data)
		// console.log(this.meta)

		var groups = Object.keys(meta.groups).filter(s => {
			return meta.groups[s].enabled == undefined ? false : meta.groups[s].enabled;
		}).map(key => ({
			key: key,
			enabled: meta.groups[key].enabled
		}));
		var groups = groups.filter(each => each.enabled);
		// $('#'+id).bind('mousewheel', function(e){
		// 	delta = delta + e.originalEvent.deltaY;
		// 	if(delta < -100){
		// 		delta = 0;
		// 	}else if(delta > 100){
		// 		delta = 0;
		// 		switchFocus.climate();
		// 	}
		// 	return false;
		// });
		var series = [];
		// TODO clean up
		Object.keys(meta.series).filter(k => {
			var g = meta.series[k].group
			return meta.series[k].visible != undefined && meta.groups[g].enabled
		}).forEach(key => {
			var s = meta.series[key].preset
			try{
				if(meta.selector){
					series.push(seriesBuild[s](meta, data.values[98], s, key));
				}else{
					series.push(seriesBuild[s](meta, data, s, key));
				}
			}catch(error){
				// console.log(meta)
				console.log(data)
				// console.log(s)
				// console.log(key)
				console.log(meta.series)
				throw error
			}
		})
		series.forEach((serie) => {
			var width = $('#'+id)[0].offsetWidth;
			if(serie.marker){
				serie.marker.radius = serie.marker.radius*width/800;
			} 
			this.chart.addSeries(serie)
		})
		if(Object.keys(meta.groups).map(key => meta.groups[key].enabled).filter(each => each).length > 1){
			var chart = this;
			$(".tablinks_"+id).click(function(e) {
				$(".tablinks_"+id).toggleClass('active')
				chart.switchToGroup(e.target.id);
				return false
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
		this.switchToGroup(this.gID)
		this.chart.redraw();
		this.chart.hideLoading();
	},
	switchToGroup: function(gID, changeVisibility = true, change = true){
		var meta = this.meta;
		var id = this.id;
		// TODO save
		if(!gID) gID = this.gID;
		if(!gID){
			gID = parseInt(Object.keys(meta.groups).filter(k => meta.groups[k].prime).shift());
		}
		if(!gID){
			gID = parseInt(Object.keys(meta.groups).filter(k => meta.groups[k].enabled).shift());
		}
		this.gID = gID;
		var title = this.title(gID);
		var group = meta.groups[gID];
		var series_count = 0;

		if(change) {
			Object.keys(meta.series).filter(s => {
				var g = meta.series[s].group
				return meta.series[s].visible != undefined && meta.groups[g].enabled
			}).forEach((key, index) => {
				if(meta.series[key].group == gID){
					$('#' + id).highcharts().series[index].update({
						visible: meta.series[key].visible,
						showInLegend: true,
					}, false)
					series_count += 1;
				}else{
					$('#' + id).highcharts().series[index].update({
						visible: false,
						showInLegend: false,
					}, false)
				}
			})
		}
		var baseline = function(group){
			var res = [];
			if(group.baseline){
				return {
					plotLines: base.plotLines.baseline(id),
					plotBands: base.plotBands.diff(id), 
				}
			}
			return {
				plotLines: null,
				plotBands: null,
			}
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
		this.chart.update({
			xAxis: baseline(group),
		})
		if(group.tooltip){
			this.chart.update({
				tooltip: {
					formatter: formatters(meta)[group.tooltip.type ? group.tooltip.type : 'default']
				},
			})
		}
		try{
			// console.log(meta.menu.dataCredit)
			// console.log(meta)
			this.chart.update({
				title: {
					text: title,
					useHTML: true,
				},
				legend: {
					enabled: series_count > 1 
				},
				subtitle: {
					text: '<label class="subtitle>"'+((group.subTitle != undefined) ? group.subTitle : "")+'</label>',
					useHTML: true,
				},
				caption: {
					// text: '<label class="caption">'+group.caption+'</label>',
					text: group.caption,
					useHTML: true,
					align: 'left',
				},
				xAxis: {
					type: group.xAxis.type,
					title: {
						useHTML: true,
						text: group.xAxis.bott, 
					},
					gridLineWidth: group.xAxis.gridLineWidth,
					categories: (meta.period) ? group.xAxis.categories : undefined,
					corsshair: true,
					min: meta.noAxisLim = ? null : (meta.period) ? null : (group.xAxis.min) ? group.xAxis.min : startYear,
					tickInterval: group.xAxis.ticketInterval
				},
				yAxis: {
					title: {
						text: group.yAxis.left, 
						useHTML: true,
					},
					plotLines: [{
						value: 0,
						color: 'rgb(204, 214, 235)',
						width: 2,
					}],
					max: meta.noAxisLim ? null : (group.yAxis.max != undefined) ? group.yAxis.max : null,
					min: meta.noAxisLim ? null : (group.yAxis.min != undefined) ? group.yAxis.min : null,
					tickInterval: (group.yAxis.ticketInterval) ? group.yAxis.ticketInterval : 1,
					lineWidth: 1,
					reversed: group.yAxis.reversed,
					plotLines: plotLinesY(group), 
					labels: {
						formatter: yAxisFormats[group.yAxis.formatter]
					}
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
						point: {
							events: {
								select: function (e) {
									// console.log(e)
									// console.log(this)
								}
							}
						}
					}
				}
			})
		}
	},
	clone: function(){
		return $.extend(true, {}, this);
	}
}
// TODO merge into main function above
var render = {
	charts: {},
	setup: function(meta, old){
		var id = meta.files.stationDef.id
		try{
			this.charts[id] = chart.create(meta, old) 
			// console.log(this.charts[id])
		}catch(error){
			console.log(id);
			throw error
		}
		// Update radius TODO

		this.charts[id].then((Obj) => {
			var divID = Obj.id;
			window.onresize = function (event) {
				var currWidth = $('#'+divID)[0].offsetWidth;
				// Catch 1st width
				if (render.charts[id].lastWidth === undefined) {
					render.charts[id].lastWidth = currWidth;
				}
				// Is it wider or not and by how much?
				var ratio = currWidth / render.charts[id].lastWidth;
				var chart = $('#'+divID).highcharts();

				chart.series.forEach(function (v, i, a) {
					if(chart.series[i].options.marker){
						var currRadius = chart.series[i].options.marker.radius;
						var newRadius;
						if(ratio == 1) newRadius = currRadius;
						else newRadius = currRadius*ratio;
						a[i].update({
							marker: {
								radius: newRadius
							}
						});
					}
				});
				render.charts[id].lastWidth = currWidth;
			};
		})
		//////
	},
	initiate: function(id, data){
		try{
			this.charts[id].then(function(result){
				result.initiate(data)
			})
		}catch(error){
			throw error
		}
	},
	updatePlot: function(id, bl, bu, date){
		if(id.id) id=id.id; // TODO fix why this it gets a div not id
		try{
			if(date){
				date = date.split("-");
				variables.date = new Date(date[0],Number(date[1])-1,date[2]);
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
				var div = document.getElementById(id);
				if(!div){
					id = id.split('_')[0]
					div = document.getElementById(id);
				}
				chart.chart.destroy();
			})
		}catch(error){
			console.log(id)
			throw error;
		}
		var cont = this;
		this.charts[id].then(function(result){
			cont.setup(result.metaRef, result)
			cont.initiate(id, result.data)
		})
	}
}
global.renderInterface = render;
exports.render = render;
