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
const Serie = require("./serie.js").Serie
const base = require("./highcharts_config/base.js");
const tooltips = require("./formatters/tooltips.js"),
    {formatters} = tooltips;
const axisFormats = require("./formatters/axis.js"),
    yAxisFormats = axisFormats.yAxis;
class Chart {
    constructor(meta, old) {
        // TODO save what can be done
        if (old) {
            this.gID = old.gID;
        }
        this.metaRef = meta;
        const {metaRef} = this,
            {id} = metaRef.files.stationDef;
        this.id = id;
        this.metaFiles = meta.files;
        this.meta = {};
        $.extend(
            true,
            this.meta,
            metaRef.text()
        );
        meta = this.meta
        this.chart = Highcharts.chart(
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
                    animation: false,
                    Width: window.innerWidth,
                    StyledMode: true,
                }
            }
        );
        this.setup();
        this.chart.showLoading();
    }
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

                                        //console.log(meta);
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
                false
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

    }
    "title" (gID) {
        try {
            const {meta} = this,
                group = meta.groups[gID],
                {title} = group;
            return title;

        } catch (error) {

            //console.log(gID);
            //console.log(this.meta);
            //console.log(this);
            throw error;

        }

    }
    'updateSeries' (bl = global.baselineLower, bu = global.baselineUpper) {
        global.baselineLower = bl;
        global.baselineUpper = bu;
        let {meta} = this;
        let config = []
        while (this.chart.series.length) {
            config.push(this.chart.series[0].visible)
            this.chart.series[0].remove();
        }
        this.chart.redraw();
        return Object.keys(meta.series).filter((k) => {
            const g = meta.series[k].group;
            return meta.series[k].visible != undefined && meta.groups[g].enabled;
        }).map((key, index) => {
            const s = meta.series[key].preset;
            try {
                //	if(config[index] !== undefined) meta.series[index].prime = config[index]
                let serie = (new Serie(meta, s, key, id, index)).serie
                let complete = serie.complete

                // TODO should be inside class Serie
                if (complete.marker) {
                    const width = $(`#${id}`)[0].offsetWidth;
                    complete.marker.radius = complete.marker.radius * width / 800;
                }
                this.chart.addSeries(complete)

                /*
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

                 */


                //this.chart.addSeries(serie.incomplete);
                //series.push(serie.complete)
                /*
                serie.complete.then(ser => {
                    const width = $(`#${id}`)[0].offsetWidth;
                    if (ser.marker) {
                        ser.marker.radius = ser.marker.radius * width / 800;
                    }
                    $(`#${id}`).highcharts().series[index].update(ser)
                })
                 */
            } catch (error) {
                // //console.log("meta",meta)
                // //console.log("data",data);
                // //console.log("key",key);
                // //console.log("series",series);
                throw error;

            }

        });
    }
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
        const group = Object.keys(meta.groups).filter((key) => meta.groups[key].enabled).sort((a, b) => {
            if( meta.groups[a].prime){
                return -1
            }else if(meta.groups[b].prime){
                return 1
            }
            return 0
            return a
        }).map((each) => {
            //console.log(meta.groups[each].legend)
            const index = parseInt(each);
            if (index == active) {

                return `<button class='tablinks_${id} active' id=${index}>${meta.groups[each].legend}</button>`;

            }

            return `<button class='tablinks_${id}' id=${index}>${meta.groups[each].legend}</button>`;

        });
        return `<div id='${this.id}_title' class='tab'>${group.join("")}</div>`;

    }
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
         * //console.log(this.data)
         * //console.log(this.meta)
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
         * //console.log(meta.series)
         */
        this.updateSeries()
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
                ////console.log(renderInterface.charts[id])
                renderInterface.charts[id].metaRef.files.set.extreme.lim = parseInt(e.target.value);
                renderInterface.updatePlot(id);
                return false;
            });
        }
        if (meta.groups["0"].perma) {
            this.chart.update({
                "plotOptions": {
                    "pointPadding": 0,
                    "series": {
                        animation: {
                            duration: 0
                        },
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
        this.switchToGroup(this.gID)
    }
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
                 * //console.log({key, index})
                 * //console.log(meta.series[key])
                 */
                try {
                    if (meta.series[key].group == gID) {
                        ////console.log(meta.series[key])
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
                    //console.log(key);
                    //console.log(meta.series[key]);
                    //console.log(index);
                    //console.log($(`#${id}`).highcharts().series);
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
                /*
                if(group.baseline) {
                    res.push({
                        "color": "#aaaaaa",
                        "dashStyle": "shortDash",
                        "value": global.temperature.baseline,
                        "width": 2,
                        "label": {
                            "text": `baseline: ${global.temperature.baseline}`,
                            "style": {
                                "color": "#aaaaaa",
                                "fontWeight": "bold"
                            }
                        }
                    });
                }
                 */
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
            //console.log('tooltip', group.tooltip.type
                ? group.tooltip.type
                : "default")
            this.chart.update({
                "tooltip": {
                    "formatter": formatters(meta)[group.tooltip.type
                        ? group.tooltip.type
                        : "default"]
                }
            });
        }
        try {
            ////console.log('meta', meta)
            ////console.log('group', group)
            ////console.log(group.xAxis.categories)
            ////console.log('meta.period', meta.period)
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
                    "reversed": meta.period,
                    "type": group.xAxis.type,
                    "title": {
                        "useHTML": true,
                        "text": group.xAxis.bott
                    },
                    "gridLineWidth": group.xAxis.gridLineWidth,
                    "categories": meta.period ? Object.values(group.xAxis.categories).filter(each => typeof each === 'string').reverse() : undefined,
                    "crosshair": true,
                    "max": meta.period ? 11 : (group.xAxis.type === undefined ? 2025 : null),
                    "min": meta.period ? 2 : group.xAxis.min ? group.xAxis.min : startYear,
                    "tickInterval": group.xAxis.ticketInterval
                },
                "yAxis": {
                    "title": {
                        "text": group.yAxis.left,
                        "useHTML": true
                    },
                    /*
                    "plotLines": [
                        {
                            "value": 0,
                            "color": "rgb(204, 214, 235)",
                            "width": 2
                        }
                    ],
                     */
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
            //console.log(group);
            //console.log(this.chart);
            throw error;
        }
        if (group.pointSelect) {
            this.chart.update({
                "plotOptions": {
                    "series": {
                        "marker": {
                            "enabledThreshold": 0,
                            "radius": 1,
                            // "lineColor": null,
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
                                            true
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
                                     * //console.log(e)
                                     * //console.log(this)
                                     */
                                }
                            }
                        }
                    }
                }
            });

        }
        $('.baselineValue').text(global.baselineValue)
    }
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

            this.charts[id] = new Chart(
                meta,
                old
            );
            // //console.log(this.charts[id])

        } catch (error) {

            //console.log(id);
            throw error;

        }
        // Update radius TODO

        // this.charts[id].then((Obj) => {
        let Obj = this.charts[id]

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

        // });
        // ////

    },
    "initiate" (id, data) {
        try {
            ////console.log('id', id)
            this.charts[id].initiate(data);
            // .then((result) => {

            // result.initiate(data);

            // });

        } catch (error) {

            throw error;

        }

    },
    'updateSeries' (id, bl, bu, date){
        if (id.id) {
            id = id.id;
        }
        if (bl < bu && bl >= 1913) {
            global.baselineLower = bl;
        }
        if (bu > bl && bu < 2019) {
            global.baselineUpper = bu;
        }
        this.charts[id].updateSeries(bl, bu, date)
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
            let div = document.getElementById(id);
            if (!div) {
                id = id.split("_")[0];
                div = document.getElementById(id);
            }
            this.charts[id].chart.destroy()
        } catch (error) {
            //console.log(id);
            throw error;
        }
        const cont = this;
        cont.setup(
            this.charts[id].metaRef,
            this.charts[id]
        );
        cont.initiate(
            id,
            this.charts[id].data
        );

    }
};
global.renderInterface = render;
exports.render = render;
