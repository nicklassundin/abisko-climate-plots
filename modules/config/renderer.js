global.Highcharts = require('highcharts');
require('jquery-contextmenu');
require('highcharts-more')(Highcharts);
require('highcharts/modules/series-label')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data.js')(Highcharts);
require('highcharts/modules/histogram-bellcurve')(Highcharts);
require('highcharts/modules/xrange')(Highcharts);
const highchart_help = require('../../config/highcharts_config.js');
const seriesBuild = require('./series.js').series;
var base = require('./base.js')
const tooltips = require('./tooltips.js');
const formatters = tooltips.formatters;
const dateFormats = tooltips.dateFormats;
const yAxisFormats = tooltips.yAxis;
const help = require('../helpers.js');

// require('textarea-markdown');

// var constant = require('../../config/const.json')
// global.baselineLower = constant.baselineLower;
// global.baselineUpper = constant.baselineUpper;
// global.startYear = constant.startYear;
//

var chart = {
	metaTable: function(id, json, i=0){
		Object.keys(json).forEach(index => {
			var key = Object.keys(this.metaRef)[index];
			if(typeof(this.metaRef[key]) == 'string'){
				$('#'+id).append('<div id="'+id+'_cont"></div>');
				$('#'+id+'_cont').append('<div id="'+id+'_button_'+key+'" class="mini_button">- '+key+'</div><br/>')
				$('#'+id+'_cont').append('<div id="'+id+'_box_'+key+'" class="box"></div>');
				$('#'+id+'_box_'+key).append('<textarea id="'+id+'_box'+key+'_textarea" class="json" cols="80">'+JSON.stringify(json[index], undefined, 4)+'</textarea>')
				$('#'+id+'_box_'+key).append('<br/>')
				$("#"+id+'_button_'+key).click(function(){
					$("#"+id+"_box_"+key).slideToggle();
				});
			}
		})
	},
	getMeta: function(define){
		try{
			var json = function(url){
				return new Promise(function(resolve, reject){
					$.getJSON(hostUrl+'/config/charts/'+url+'.json', function(result){
						resolve(result);	
					});
				})
			}
			var files = {};
			var textMorph = this.textMorph;
			files.config = json(define.config);
			files.dataSource = json('lang/'+nav_lang+'/dataSource')[define.data];
			if(define.subSet) files.subSet = json(define.subSet);
			files.set = json(define.set);
			files.units = new Promise((resolve, reject) => {
				files.set.then(function(set){
					json('lang/'+nav_lang+'/units').then(function(units){
						resolve({ units: set.unitType != undefined ? units[set.unitType] : {} }); 
					})
				})
			})
			files.time = json('lang/'+nav_lang+'/time');
			files.lang = json('lang/'+nav_lang+'/'+define.lang);
			return Promise.all(Object.values(files)).then(function(mF){
				return {
					files: mF,
					aggr: mF.reduce((x, y) => $.extend(true, x, y)),
					text: function(){
						var iter = function(obj, meta=obj){
							var res = {};
							Object.keys(obj).forEach(key => {
								if(typeof(obj[key]) == 'object'){
									res[key] = iter(obj[key], meta)
								}else if(typeof(obj[key]) == 'string'){
									res[key] = textMorph(obj[key], meta) 
								}else{
									res[key] = obj[key];
								}
							})
							return res;
						}
						return iter(this.aggr)
					} 
				}
			})
		}catch(ERROR){
			console.log(files)
			console.log(define)	
			throw ERROR
		}
	},
	textMorph: function(text, meta=this.meta){
		var res = "";
		if(text){
			try{
				// TODO order of month replace for subsets
				var res = text.replace("[stationName]", stationName)

				var set = (meta.subSet ? meta.subSet.enabled : false) ? meta.months[meta.subSet.set] : undefined;
				res = (meta.subSet ? meta.subSet.enabled : false) ? res.replace("[month]", set) : res.replace("[month]", meta.month)
				res = res.replace("[baseline]", baselineLower +" - "+ baselineUpper)
				res = res.replace("[CO2]", 'CO'+("2".sub()))
				res = res.replace("[SOME TEXT]", "")
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
		return res
		// return res
	},
	id: undefined,
	initiated: false,
	chart: undefined,
	metaRef: undefined,
	metaFiles: undefined,
	meta: undefined,
	data: undefined,
	create: function(id, metaRef){
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
				chart.getMeta(metaRef).then((temp) => {
					var meta = temp.aggr;
					if(meta.subSet ? !meta.subSet.set : false){
						meta.subSet.sets = Object.keys(meta.subSet.sets).map(key => { return meta.subSet.sets[key] }).filter(e => typeof e == "string");
						if(variables.debug){
							meta.subSet.sets = [meta.subSet.sets[0]];
						}
						result.sets = meta.subSet.sets;
						meta.subSet.sets.forEach(set => {
							var tmp = res.clone();
							tmp.id = id+'_'+set;
							tmp.metaRef = metaRef;
							tmp.metaFiles = temp.files;
							temp.aggr.subSet.set = set;
							var metaTemp = {}; 
							$.extend(true, metaTemp, temp.text())
							tmp.meta = metaTemp;
							result[set] = tmp;
						})
						resolve(result)
					}else{
						res.id = id;
						res.metaRef = metaRef
						res.metaFiles = temp.files;
						res.meta = temp.text();
						resolve(res)
					}
				})
			})
		}catch(error){
			throw error;
		}
	},
	setup: function(){
		var id = this.id
		this.metaTable('debug_table_'+id, this.metaFiles);
		var title = this.title(0);
		var meta = this.meta
		this.chart = Highcharts.chart(id, {
			dataSrc: '[placeholder]',
			credits: {
				enabled: false
			},
			tooltip: {
				shared: true,
				valueSuffix: ' '+meta.valueSuffix,
				valueDecimals: meta.decimals,
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
		return this
	},
	title: function(gID){
		try{
			var meta = this.meta;
			var group = meta.groups[gID];
			var title = '<label>'+
				group.title+
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
			return title
		}catch(error){
			console.log(gID)
			console.log(this.meta)	
			throw error
		}
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
		var meta = this.meta;	
		// console.log(this.metaRef)
		// console.log(data)
		// console.log(meta)
		var id = this.id;
		if(this.meta.subSet){
			this.data = data[this.meta.subSet.set] 
		}else{
			this.data = data;
		}

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
		this.chart.hideLoading();
		var series = [];
		// TODO clean up
		try{
			Object.keys(meta.series).filter((s) => (meta.series[s].group != undefined) ? meta.groups[meta.series[s].group].enabled : false).forEach(key => {
				try{
					if(meta.subSet) {
						series.push(seriesBuild[meta.series[key].preset](meta, data[meta.subSet.set], key));
					}else{
						series.push(seriesBuild[meta.series[key].preset](meta, data, key));
					}
				}catch(error){
					console.log("Series Error")
					console.log(meta.series[key].preset);
					console.log(error);
					console.log(meta);
					console.log(data)
					throw error
				}
			})
			// console.log(series)
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
		var baseline = function(group){
			var res = [];
			if(group.baseline){
				return {
					plotLines: base.baseline.plotlines(id),
					plotBands: base.baseline.plotBandsDiff(id), 
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
			xAxis: baseline(group) 
		})
		try{
			this.chart.update({
				title: {
					text: title,
					useHTML: true,
				},
				tooltip: {
					formatter: (group.tooltip != undefined) ? formatters[group.tooltip.type] : undefined
				},
				subtitle: {
					text: (group.subTitle != undefined) ? group.subTitle : "",
				},
				caption: {
					text: group.caption,
					useHTML: true,
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
					min: (meta.period) ? null : (group.xAxis.min) ? group.xAxis.min : startYear,
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
					max: (group.yAxis.max != undefined) ? group.yAxis.max : null,
					min: (group.yAxis.min != undefined) ? group.yAxis.min : null,
					tickInterval: (group.yAxis.left.tickInterval) ? group.yAxis.left.tickInterval : 1,
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
		return Object.assign({}, this);
	}
}
var render = {
	charts: {},
	setup: function(id, meta){
		try{
			this.charts[id] = new Promise(function(resolve, reject){
				try{
					var res = chart.create(id, meta) 
					res.then(chrt => {
						chrt.setup(id, meta);
						resolve(res)
					})
				}catch(error){
					reject(error)
				}
			})
		}catch(error){
			console.log(id);
			console.log(meta)
			console.log(this.metaRef)
			throw error
		}
	},
	initiate: function(id, data){
		// console.log(data.Axis('y'))
		this.charts[id].then(function(result){
			try{
				result.initiate(data)
			}catch(error){
				console.log(id)
				console.log(result)
				throw error
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
