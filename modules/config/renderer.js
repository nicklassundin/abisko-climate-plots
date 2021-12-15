global.Highcharts = require("highcharts");
require("jquery-contextmenu");
// Require('highcharts/modules/highcharts-more')(Highcharts);
require("highcharts/highcharts-more");
// Require('highcharts/modules/annotations.js')(Highcharts);
require("highcharts/modules/series-label")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/export-data.js")(Highcharts);
require("highcharts/modules/histogram-bellcurve")(Highcharts);
require("highcharts/modules/xrange")(Highcharts);

// Const highchart_help = require('./highcharts/config.js');
const seriesBuild = require("./series.js").series;
const base = require("./highcharts_config/base.js");
const tooltips = require("./formatters/tooltips.js"),
	{formatters} = tooltips,
	{dateFormats} = tooltips;
const axisFormats = require("./formatters/axis.js"),
	yAxisFormats = axisFormats.yAxis;
const help = require('climate-plots-helper'),

	chart = {
		"id": undefined,
		"initiated": false,
		"chart": undefined,
		"metaRef": undefined,
		"metaFiles": undefined,
		"meta": undefined,
		"data": undefined,
		"create" (meta, old) {

			// TODO save what can be done
			if (old) {

				this.gID = old.gID;

			}
			//


			this.metaRef = meta;
			const {metaRef} = this,
				{id} = metaRef.files.stationDef;
			this.id = id;
			try {

				const result = {
					"sets": undefined,
					"setup" () {

						this.sets.forEach((key) => {

							this[key].setup();

						});

					},
					"initiate" (data) {

						this.sets.forEach((key) => {

							this[key].initiate(data);

						});

					}
				},
					res = this.clone();
				return new Promise((resolve, reject) => {

					const meta = metaRef.aggr();
					res.chart = Highcharts.chart(
						id,
						{
							"lang": meta.menu,
							"credits": {
								"enabled": false,
								"href": null,
								"text": `${meta.menu.dataCredit}: <br/>${meta.dataSource.meta.desc}<br/>${meta.dataSource.meta.downloadDate}<br/>`, // +meta.dataSource.meta.citation

								"position": {
									"y": -35
								}
							},
							"chart": {

								Width: window.innerWidth,
								StyledMode: true,
							}
						}
					);
					res.chart.showLoading();
					res.id = id;
					res.metaRef = metaRef;
					res.metaFiles = meta.files;
					res.meta = {};
					$.extend(
						true,
						res.meta,
						metaRef.text()
					);
					res.setup();
					resolve(res);
					// }

				});

			} catch (error) {

				throw error;

			}

		},
		"setup" () {
			const {id} = this,
				title = this.title(0),
				{meta} = this;
			const cM = (m) => ((meta.stationDef.context || !(meta.stationDef.context === undefined)) ? null : m)
			this.chart.update({
				"navigation": {
					"buttonOptions": {
						// Enabled: meta.contex
					}
				},
				"credits": {
					"enabled": false
				},
				"tooltip": {
					"shared": true,
					"valueSuffix": ` ${meta.valueSuffix}`
					// ValueDecimals: meta.decimals,
				},
				"exporting": {
					"chartOptions": {

						/*
						 * AnnotationsOptions: undefined,
						 * Annotations: undefined,
						 */
					},

					/*
					 * ShowTable: true, // TODO DATA TABLE
					 * PrintMaxWidth: 1200,
					 * SourceWidth: 900,
					 */
					"sourceWidth": 700 * 1.2,
					"sourceHeight": 350 * 1.2,
					"scale": 8,
					"filename": "id",
					"allowHTML": true,
					"tableCaption": "",
					"showTable": false,
					"buttons": {
						"contextButton": {
							"menuItems": [
								cM({
									"textKey": "downloadPDF",
									"onclick" () {

										this.exportChart({
											"type": "application/pdf"
										});

									}
									// Enabled: meta.contex,
								}),
								cM({
									"textKey": "downloadJPEG",
									"onclick" () {

										this.exportChart({
											"type": "image/jpeg"
										});

									},
									"enabled": meta.contex
								}),
								cM("downloadSVG"),
								"viewFullscreen",
								cM("printChart"),
								cM({
									"separator": true,
									"enabled": meta.contex
								}),
								cM({
									"textKey": "langOption",
									"onclick" () {

										if (nav_lang == "en") {

											nav_lang = "sv";

										} else {

											nav_lang = "en";

										}
										Highcharts.setOptions({
											"lang": meta.menu
										});
										const id = this.renderTo.id.split("_")[0];
										renderInterface.updatePlot(this);

									},
									"enabled": meta.contex
								}),
								{
									"textKey": "showDataTable",
									"onclick" () {

										if (this.options.exporting.showTable) {

											this.dataTableDiv.innerHTML = "";

										}
										this.update({
											"exporting": {
												"showTable": !this.options.exporting.showTable
											}
										});
										// TODO toggle between 'Show data' and 'Hide data'

									}
								},
								cM({
									"textKey": "dataCredit",
									"onclick" () {

										try {

											window.open(meta.dataSource.meta.src);

										} catch (error) {

											console.log(meta);
											throw error;

										}

									},
									"enabled": meta.contex
								})
							]
						}
					}
				},
				"chart": {
					"type": meta.type,
					"zoomType": "x"
				},
				"legend": {
					"enabled": false
				}

				/*
				 * Series: Object.keys(meta.series).map(each => ({
				 * ShowInLegend: false,
				 * Data: [null, null],
				 * }))
				 */
			});
			this.chart.showLoading();
			// This.chart.redraw();
			if (Object.keys(meta.groups).map((key) => meta.groups[key].enabled).
				filter((each) => each).length > 1) {

				const gTitle = this.groupTitle(this.gID);
				this.switchToGroup(
					this.gID,
					true,
					change = false
				);
				if (meta.extreme) {

					const ext_menu = Object.keys(meta.extreme.sublim).map((key) => {

						const val = meta.extreme.sublim[key];
						if (meta.extreme.lim == val) {

							return `<button class='ext_menu_${id} active' value=${val}>${val} ${meta.valueSuffix} </button>`;

						}

						return `<button class='ext_menu_${id}' value=${val}>${val} ${meta.valueSuffix}</button>`;

					});
					$(`#${id}`).append(`<div>${
						ext_menu.join("")
					}</div>`);

				}
				$(`#${id}`).append(gTitle);

			}
			return this;

		},
		"title" (gID) {

			try {

				const {meta} = this,
					group = meta.groups[gID],
					{title} = group;
				return title;

			} catch (error) {

				console.log(gID);
				console.log(this.meta);
				console.log(this);
				throw error;

			}

		},
		"groupTitle" (active) {

			const {id} = this,
				{meta} = this;

			if (!active) {

				active = parseInt(Object.keys(meta.groups).filter((k) => meta.groups[k].enabled).
					shift());
				if (active > 0) {

					active = parseInt(Object.keys(meta.groups).filter((k) => meta.groups[k].prime).
						shift());
					if (!active) {

						active = 2;

					}

				}

			}

			const group = Object.keys(meta.groups).filter((key) => meta.groups[key].enabled).
				map((each) => {

					const index = parseInt(each);
					if (index == active) {

						return `<button class='tablinks_${id} active' id=${index}>${meta.groups[each].legend}</button>`;

					}

					return `<button class='tablinks_${id}' id=${index}>${meta.groups[each].legend}</button>`;

				});
			return `<div id='${this.id}_title' class='tab'>${group.join("")}</div>`;

		},
		"initiate" (data = this.data) {

			const {meta} = this,
				{id} = this;

			/*
			 * If(this.meta.subset){
			 * Data = data[this.meta.subset.set]
			 * This.data = data[this.meta.subset.set]
			 * }else{
			 */
			this.data = data;

			/*
			 * }
			 * Console.log(this.data)
			 * Console.log(this.meta)
			 */

			var groups = Object.keys(meta.groups).filter((s) => (meta.groups[s].enabled == undefined ? false : meta.groups[s].enabled)).
				map((key) => ({
					key,
					"enabled": meta.groups[key].enabled
				})),
				groups = groups.filter((each) => each.enabled),

				/*
				 * $('#'+id).bind('mousewheel', function(e){
				 * 	Delta = delta + e.originalEvent.deltaY;
				 * 	If(delta < -100){
				 * 		Delta = 0;
				 * 	}else if(delta > 100){
				 * 		Delta = 0;
				 * 		SwitchFocus.climate();
				 * 	}
				 * 	Return false;
				 * });
				 */
				series = [];

			/*
			 * TODO clean up
			 * Console.log(meta.series)
			 */
			Object.keys(meta.series).filter((k) => {

				const g = meta.series[k].group;
				return meta.series[k].visible != undefined && meta.groups[g].enabled;

			}).
				forEach((key, index) => {

					// Console.log(key)
					const s = meta.series[key].preset;
					// Console.log(seriesBuild[s](meta, data, s, key));
					try {
						const serie = (meta.selector ?
							seriesBuild[s](
								meta,
								data.values[98],
								s,
								key) :  seriesBuild[s](
									meta,
									data,
									s,
									key
								))


						this.chart.addSeries(serie.incomplete);
						series.push(serie.complete)
						serie.complete.then(ser => {
							const width = $(`#${id}`)[0].offsetWidth;
							if (ser.marker) {
								ser.marker.radius = ser.marker.radius * width / 800;
							}

							$(`#${id}`).highcharts().series[index].update(ser)
						})	
					} catch (error) {

						// Console.log(meta)
						console.log(data);
						// Console.log(s)
						console.log(key);
						console.log(series);
						console.log(meta.series);
						throw error;

					}

				});
			if (Object.keys(meta.groups).map((key) => meta.groups[key].enabled).
				filter((each) => each).length > 1) {

				const chart = this;
				$(`.tablinks_${id}`).click((e) => {

					$(`.tablinks_${id}`).toggleClass("active");
					chart.switchToGroup(e.target.id);
					return false;

				});

			}
			if (meta.extreme) {

				$(`.ext_menu_${id}`).click((e) => {

					$(`.ext_menu_${id}`).toggleClass("active");
					// Console.log(renderInterface.charts[id])
					renderInterface.charts[id] = renderInterface.charts[id].then((ch) => new Promise((res, rej) => {

						// Console.log(ch)
						ch.metaRef.files.set.extreme.lim = parseInt(e.target.value);
						res(ch);

					}));
					renderInterface.updatePlot(id);
					return false;

				});

			}
			if (meta.groups["0"].perma) {

				this.chart.update({
					"plotOptions": {
						"pointPadding": 0,
						"series": {
							"events": {
								"legendItemClick" (event) {

									const thisSeries = this,
										{chart} = this;
									if (this.visible === true) {

										this.hide();
										chart.get("highcharts-navigator-series").hide();

									} else {

										this.show();
										chart.series.forEach((el, inx) => {

											if (el !== thisSeries) {

												el.hide();

											}

										});

									}
									event.preventDefault();

								}
							}
						}
					}
				});

			}
			var complete = () => {
				console.log("switchGroup")
				this.switchToGroup(this.gID);
				this.chart.redraw();
				this.chart.hideLoading();
			}
			Promise.all(series).then(() => {
				complete()
			})

		},
		"switchToGroup" (gID, changeVisibility = true, change = true) {

			const {meta} = this,
				{id} = this;
			// TODO save
			if (!gID) {

				gID = this.gID;

			}
			if (!gID) {

				gID = parseInt(Object.keys(meta.groups).filter((k) => meta.groups[k].prime).
					shift());

			}
			if (!gID) {

				gID = parseInt(Object.keys(meta.groups).filter((k) => meta.groups[k].enabled).
					shift());

			}
			this.gID = gID;
			let title = this.title(gID),
				group = meta.groups[gID],
				series_count = 0;
			if (change) {

				Object.keys(meta.series).filter((s) => {

					const g = meta.series[s].group;
					return meta.series[s].visible != undefined && meta.groups[g].enabled;

				}).
					forEach((key, index) => {

						/*
						 * Console.log({key, index})
						 * Console.log(meta.series[key])
						 */
						try {

							if (meta.series[key].group == gID) {

								$(`#${id}`).highcharts().series[index].update(
									{
										"visible": meta.series[key].visible,
										"showInLegend": true
									},
									false
								);
								series_count += 1;

							} else {

								$(`#${id}`).highcharts().series[index].update(
									{
										"visible": false,
										"showInLegend": false
									},
									false
								);

							}

						} catch (error) {

							console.log(key);
							console.log(meta.series[key]);
							console.log(index);
							console.log($(`#${id}`).highcharts().series);
							throw error;

						}

					});

			}
			const baseline = function (group) {

				const res = [];
				if (group.baseline) {

					return {
						"plotLines": base.plotLines.baseline(id),
						"plotBands": base.plotBands.diff(id)
					};

				}
				return {
					"plotLines": null,
					"plotBands": null
				};

			},
				plotLinesY = function (group) {

					const res = [];
					if (group.ppm400) {

						res.push({
							"color": "#aaaaaa",
							"dashStyle": "shortDash",
							"value": 400,
							"width": 2,
							"label": {
								"text": "400 ppm",
								"style": {
									"color": "#aaaaaa",
									"fontWeight": "bold"
								}
							}
						});

					}
					if (group.ppm350) {

						res.push({
							"color": "#aaaaaa",
							"dashStyle": "shortDash",
							"value": 350,
							"width": 2,
							"label": {
								"text": "350 ppm",
								"style": {
									"color": "#aaaaaa",
									"fontWeight": "bold"
								}
							}
						});

					}
					if (group.perma) {

						res.push({
							"color": group.yAxis.plotLines.color,
							"width": 2,
							"value": 0,
							"zIndex": 5,
							"label": {
								"text": group.yAxis.plotLines.text
							}
						});

					}

					return res.length < 0
						? null
						: res;

				};
			this.chart.update({
				"xAxis": baseline(group)
			});
			if (group.tooltip) {

				this.chart.update({
					"tooltip": {
						"formatter": formatters(meta)[group.tooltip.type
							? group.tooltip.type
							: "default"]
					}
				});

			}
			try {

				/*
				 * Console.log(meta.menu.dataCredit)
				 * Console.log(meta)
				 */
				this.chart.update({
					"title": {
						"text": title,
						"useHTML": true
					},
					"legend": {
						"enabled": series_count > 1
					},
					"subtitle": {
						"text": `<label class="subtitle">${group.subTitle != undefined
								? group.subTitle
								: ""}</label>`,
						"useHTML": true
					},
					"caption": {
						// Text: '<label class="caption">'+group.caption+'</label>',
						"text": group.caption,
						"useHTML": true,
						"align": "left"
					},
					"xAxis": {
						"type": group.xAxis.type,
						"title": {
							"useHTML": true,
							"text": group.xAxis.bott
						},
						"gridLineWidth": group.xAxis.gridLineWidth,
						"categories": meta.period
						? group.xAxis.categories
						: undefined,
						"corsshair": true,
						"min": meta.period
						? null
						: group.xAxis.min
						? group.xAxis.min
						: startYear,
						"tickInterval": group.xAxis.ticketInterval
					},
					"yAxis": {
						"title": {
							"text": group.yAxis.left,
							"useHTML": true
						},
						"plotLines": [
							{
								"value": 0,
								"color": "rgb(204, 214, 235)",
								"width": 2
							}
						],
						"max": group.yAxis.max != undefined
						? group.yAxis.max
						: null,
						"min": group.yAxis.min != undefined
						? group.yAxis.min
						: null,
						"tickInterval": group.yAxis.ticketInterval
						? group.yAxis.ticketInterval
						: 1,
						"lineWidth": 1,
						"reversed": group.yAxis.reversed,
						"plotLines": plotLinesY(group),
						"labels": {
							"formatter": yAxisFormats[group.yAxis.formatter]
						}
					}
				});

			} catch (error) {

				console.log(group);
				console.log(this.chart);
				throw error;

			}
			if (group.pointSelect) {

				this.chart.update({
					"plotOptions": {
						"series": {
							"marker": {
								"enabledThreshold": 0,
								"radius": 1,
								"state": {
									"select": {
										"lineColor": "6666bb",
										"lineWidth": 1,
										"radius": 5
									},
									"hover": {
										"radiusPlus": 20
									}
								}
							},
							"allowPointSelect": true,
							"point": {
								"events": {
									"select" () {

										const date = new Date(this.category),
											text = `Date: ${date.getFullYear()}-${date.getMonth()}-${date.getDate()
											}<br/>CO${"2".sub()}: ${this.y} ppm`,
											{chart} = this.series;
										if (!chart.lbl) {

											chart.lbl = chart.renderer.label(
												text,
												200,
												70,
												"callout",
												this.catergory,
												this.y,
												useHTML = true
											).
												attr({
													"padding": 10,
													"r": 5,
													"fill": Highcharts.getOptions().colors[1],
													"zIndex": 5
												}).
												css({
													"color": "#FFFFFF"
												}).
												add();

										} else {

											chart.lbl.attr({
												text
											});

										}

									}
								}
							}
						}
					}
				});

			} else {

				this.chart.update({
					"plotOptions": {
						"series": {
							"allowPointSelect": true,
							"point": {
								"events": {
									"select" (e) {

										/*
										 * Console.log(e)
										 * Console.log(this)
										 */
									}
								}
							}
						}
					}
				});

			}

		},
		"clone" () {

			return $.extend(
				true,
				{},
				this
			);

		}
	};
// TODO merge into main function above
var render = {
	"charts": {},
	"setup" (meta, old) {

		const {id} = meta.files.stationDef;
		try {

			this.charts[id] = chart.create(
				meta,
				old
			);
			// Console.log(this.charts[id])

		} catch (error) {

			console.log(id);
			throw error;

		}
		// Update radius TODO

		this.charts[id].then((Obj) => {

			const divID = Obj.id;
			window.onresize = function (event) {

				const currWidth = $(`#${divID}`)[0].offsetWidth;
				// Catch 1st width
				if (render.charts[id].lastWidth === undefined) {

					render.charts[id].lastWidth = currWidth;

				}
				// Is it wider or not and by how much?
				const ratio = currWidth / render.charts[id].lastWidth,
					chart = $(`#${divID}`).highcharts();

				chart.series.forEach((v, i, a) => {

					if (chart.series[i].options.marker) {

						let currRadius = chart.series[i].options.marker.radius,
							newRadius;
						if (ratio == 1) {

							newRadius = currRadius;

						} else {

							newRadius = currRadius * ratio;

						}
						a[i].update({
							"marker": {
								"radius": newRadius
							}
						});

					}

				});
				render.charts[id].lastWidth = currWidth;

			};

		});
		// ////

	},
	"initiate" (id, data) {

		try {

			this.charts[id].then((result) => {

				result.initiate(data);

			});

		} catch (error) {

			throw error;

		}

	},
	"updatePlot" (id, bl, bu, date) {

		if (id.id) {

			id = id.id;

		} // TODO fix why this it gets a div not id
		try {

			if (date) {

				date = date.split("-");
				variables.date = new Date(
					date[0],
					Number(date[1]) - 1,
					date[2]
				);
				variables.date = new Date(
					date[0],
					Number(date[1]) - 1,
					date[2]
				);

			}
			if (id.renderTo) {

				id = id.renderTo.id;

			}
			if (id.id) {

				id = id.id;

			} // TODO fix why this it gets a div not id
			const low = document.getElementById(`${id}lowLabel`),
				upp = document.getElementById(`${id}uppLabel`);
			if (low) {

				if (!bl) {

					bl = low.value;

				}
				if (!bu) {

					bl = upp.value;

				}

			}
			if (bl < bu && bl >= 1913) {

				baselineLower = bl;

			}
			if (bu > bl && bu < 2019) {

				baselineUpper = bu;

			}
			this.charts[id].then((chart) => {

				let div = document.getElementById(id);
				if (!div) {

					id = id.split("_")[0];
					div = document.getElementById(id);

				}
				chart.chart.destroy();

			});

		} catch (error) {

			console.log(id);
			throw error;

		}
		const cont = this;
		this.charts[id].then((result) => {

			cont.setup(
				result.metaRef,
				result
			);
			cont.initiate(
				id,
				result.data
			);

		});

	}
};
global.renderInterface = render;
exports.render = render;
