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
//

var chart = {
	metaTable: function(id, json, i=0){
		if($('#'+id+'_cont').length > 0){
			Object.keys(json).forEach(key => {
				//TODO
				// $('#'+id+'_box_'+key+'_textarea').html(JSON.stringify(json[key], undefined, 4));
			})
		}else{

			Object.keys(json).forEach(key => {
				$('#'+id).append('<div id="'+id+'_cont"></div>');
				$('#'+id+'_cont').append('<div id="'+id+'_button_'+key+'" class="mini_button">- '+key+'</div><br/>')
				$('#'+id+'_cont').append('<div id="'+id+'_box_'+key+'" class="box"></div>');
				$('#'+id+'_box_'+key).append('<textarea id="'+id+'_box'+key+'_textarea" class="json" cols="80">'+JSON.stringify(json[key], undefined, 4)+'</textarea>')
				$('#'+id+'_box_'+key).append('<br/>')
				$("#"+id+'_button_'+key).click(function(){
					$("#"+id+"_box_"+key).slideToggle();
				});
			})
		}
	},
	getMeta: function(define){
		var json = function(url){
			return new Promise(function(resolve, reject){
				$.getJSON(hostUrl+'/config/charts/'+url+'.json', function(result){
					resolve(result);	
				});
			})
		}
		var files = {};
		files.config = json(define.config);
		files.lang = json('lang/'+nav_lang+'/'+define.lang);
		files.dataSource = json('lang/'+nav_lang+'/dataSource')[define.data];
		if(define.monthly) files.month = json('monthly');
		files.set = json(define.set);
		files.units = json('lang/'+nav_lang+'/units');
		files.set.then(function(set){
			files.units.then(function(units){
				meta.units = set.unitType != undefined ? units[set.unitType] : undefined; 
			})
		})
		files.time = json('lang/'+nav_lang+'/time');
		return Promise.all(Object.values(files)).then(function(mF){
			return {
				files: mF,
				aggr: mF.reduce((x, y) => $.extend(true, x, y))
			}
		})
	},
	textMorph: function(text, meta=this.meta){
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
			return new Promise((resolve, reject) => {
				var result = this.clone();
				result.id = id;
				result.metaRef = metaRef
				var meta = chart.getMeta(metaRef).then((temp) => {
					result.metaFiles = temp.files;
					result.meta = temp.aggr
					resolve(result)
				})
			})
		}catch(error){
			throw error;
		}
	},
	setup: function(id){
		this.metaTable('debug_table_'+id, this.metaFiles);
		var textMorph = this.textMorph;
		var title = this.title(0);
		var meta = this.meta
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
			tooltip: {
				shared: true,
				valueSuffix: ' '+textMorph(meta.valueSuffix),
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
		return this
	},
	title: function(gID){
		try{
			var meta = this.meta;
			var group = meta.groups[gID];
			var title = '<label>'+
				this.textMorph(group.title)+
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
		// console.log(data)
		var id = this.id;
		this.data = data;
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
				name: textMorph(meta.series.max.name, meta),
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.max.colour,
				data: (data.max != undefined) ? ((data.max.max != undefined) ? data.max.max().values : data.max().values) : undefined ,
				visible: false,
				type: meta.series.max.type,
			}),
			min: () => ({
				name: textMorph(meta.series.min.name, meta),
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.min.colour,
				data: (data.min != undefined) ? ((data.min.min != undefined) ? data.min.min().values : data.min().values) : undefined ,
				visible: false,
				type: meta.series.min.type,
			}),
			extreme: () => ({
				name: textMorph(meta.series.extreme.name, meta),
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.extreme.colour,
				data: (data.max != undefined) ? (data.max.max != undefined ? data.max.max(false).values : undefined) : data.total.max(false).values, 
				visible: false,
				type: meta.series.extreme.type,
			}),
			first: () => ({
				name: textMorph(meta.series.first.name, meta),
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.first.colour,
				data: data.min.first(),
				visible: false,
				type: meta.series.first.type,
			}),
			last: () => ({
				name: textMorph(meta.series.last.name, meta),
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.last.colour,
				data: data.min.last(),
				visible: false,
				type: meta.series.last.type,
			}),
			avg: () => ({
				name: textMorph(meta.series.avg.name, meta),
				lineWidth: 0,
				regression: true,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				color: meta.series.avg.colour,
				data: (data.avg != undefined) ? data.avg.values : data.values,
				regressionSettings: {
					// type: 'linear',
					// color: meta.series.linjer.colour,
					// name: textMorph(meta.series.linjer.name,
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
				name: textMorph(meta.series.diff.name, meta),
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
				name: textMorph(meta.series.linjer.name, meta),
				type: meta.series.linjer.typ,
				visible: false,
				showInLegend: false
			}),
			snow: () => ({
				name: textMorph(meta.series.snow.name, meta),
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
				name: textMorph(meta.series.rain.name, meta),
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
				name: textMorph(meta.series.iceTime.name, meta),
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
				name: textMorph(meta.series.freeze.name, meta),
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
				name: textMorph(meta.series.breakup.name, meta),
				color: meta.series.breakup.colour,
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				data: data.breakup.values,
				visible: true,
			}),
			iceThick: () => ({
				name: textMorph(meta.series.iceThick.name, meta),
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
				name: textMorph(meta.series.iceThickDiff.name, meta),
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
				name: textMorph((s.name == undefined) ? k : s.name, meta),
				type: s.type,
				color: s.colour,
				opacity: 0.9,
				data: p.values,
				visible: k == "Torneträsk",
			}),
			period: (p, s) => ({
				name: textMorph(s.name, meta), 
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
				subtitle: {
					text: (group.subTitle != undefined) ? textMorph(group.subTitle) : "",
				},
				caption: {
					text: textMorph(group.caption),
					useHTML: true,
				},
				xAxis: {
					type: textMorph(group.xAxis.type),
					title: {
						useHTML: true,
						text: textMorph(group.xAxis.bott), 
					},
					gridLineWidth: group.xAxis.gridLineWidth,
					categories: (meta.period) ? group.xAxis.categories : undefined,
					corsshair: true,
					min: (meta.period) ? null : (group.xAxis.min) ? group.xAxis.min : startYear,
				},
				yAxis: {
					title: {
						text: textMorph(group.yAxis.left), 
						useHTML: true,
					},
					plotLines: [{
						value: 0,
						color: 'rgb(204, 214, 235)',
						width: 2,
					}],
					max: group.yAxis.max ? group.yAxis.max : null,
					min: group.yAxis.min ? group.yAxis.min : null,
					tickInterval: (group.yAxis.left.tickInterval) ? group.yAxis.left.tickInterval : 1,
					lineWidth: 1,
					reversed: group.yAxis.reversed,
					plotLines: plotLinesY(group), 
					labels: {
						formatter: function(){
							return this.value;
						}
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
			if(meta.monthly){
				this.charts[id] = new Promise(function(resolve, reject){
					try{

						// TODO
						var months = help.months()
						// DEBUG only one example for speedup
						if(variables.debug) months = [months.shift()];
						var monthChart = function(month){
							try{
								return new Promise((resolve, reject) => {

									var cloneMeta = Object.assign({}, meta, {});
									cloneMeta.month = help.monthName(month);
									var chrt = chart.create(id+'_'+month, cloneMeta)
									chrt.then(plot => {
										plot.setup(id+"_"+month, cloneMeta)
										resolve(plot)
									})
								})
							}catch(error){
								console.log({ERROR: error, month: month, meta: meta})
								reject(error)
							}
						}
						var rest = {
							meta: meta,
						}
						months.forEach(month => {
							rest[month] = monthChart(month);
						})
						resolve(rest);
					}catch(error){
						console.log({ERROR: error, ID: id, meta: meta});
						reject(error);
					}
				});
			}else{
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
			}
		}catch(error){
			console.log(id);
			console.log(meta)
			throw error
		}
	},
	initiate: function(id, data){
		// console.log(data.Axis('y'))
		this.charts[id].then(function(result){
			try{
				if(result.meta.monthly){
					var months = help.months();
					if(variables.debug) months = [months.shift()];
					months.forEach((month, index) => {
						result[month].then(plot => {
							plot.initiate(data[index+1+'']);
						})
					})
				}else{
					result.initiate(data)
				}
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
