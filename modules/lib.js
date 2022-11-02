
console.log("Visual Change Library Restart");
const $ = require("jquery");
global.queryString = require("query-string");
global.nav_lang = "en";
const constant = require("../static/const.json");
global.startYear = constant.startYear;
global.endYear = constant.endYear;
global.baselineLower = constant.baselineLower;
global.baselineUpper = constant.baselineUpper;

/*
 * Global.station = 159880;
 * global.station = 188790;
 * global.stationName = "";
 */
global.hostUrl = undefined;

const today = new Date();
global.variables = {
	"date": new Date(
		today.getFullYear() - 1,
		11,
		24
	),
	"dateStr" () {

		return `${this.date.getYear() + 1900}-${this.date.getMonth() + 1}-${this.date.getDate()}`;

	},
	"metas": {}
};

const charts = require("./config/dataset/struct.js").struct;
const sets = require("../static/preset.json");
// exports.stats = require("./stats/config.js");

const {meta} = require("./config/metaMngr.js");

const stationTypeMap = require("../static/charts/stationTypeMap.json");
lib = {
	"chart" (element) {
		this.renderSets(element, element.set, element.station, element.url)		
	},
	"renderChart" (div, type, url = window.location.origin) {
		// if (type.startYear) {
			// console.log(type.startYear)

// 			startYear = null;

		// }
		if (hostUrl) {
			if (url) {
				hostUrl = url;
			} else {
				hostUrl = window.location.origin;
			}
		}
		meta.getMeta(type).then((cfg) => {
			$(() => {
				cfg.files.config.contex = type.context === undefined
					? true
					: type.context;
				if (type.override
					? !type.override.axislim
					: false) {
					Object.keys(cfg.files.config.groups).forEach((key) => {
						if (!cfg.files.config.groups[key].yAxis) {
							cfg.files.config.groups[key].yAxis = {};
						}
						cfg.files.config.groups[key].yAxis.min = undefined;
						cfg.files.config.groups[key].yAxis.max = undefined;
					});
				}
				const chrt = charts.build(
					cfg,
					div
				);
			});
		});
	},
	"renderSets" (
		div,
		set = new URL(window.location.href).searchParams.get("set"),
		id = new URL(window.location.href).searchParams.get("station"),
		url = window.location.origin
	) {
		if (url) {
			hostUrl = url;
		} else {
			hostUrl = window.location.origin;
		}
		variables.debug = new URL(window.location.href).searchParams.get("debug") == "true";
		if (variables.debug) {
			const debug = document.createElement("div");
			debug.setAttribute(
				"class",
				"debug"
			);
			debug.innerHTML = `set: ${set}</br> station: ${id}`;
			div.appendChild(debug);

		}
		let ids = sets[set]
			? sets[set]
			: [set];
		if (!Array.isArray(ids)) {
			ids = Object.values(ids);
		} else {
			ids = ids.map((each) => ({
				"station": id,
				"plot": each
			}));
		}
		ids.forEach((type) => {
			const container = document.createElement("div");
			type.id = `${type.station}_${type.plot}`;
			$.extend(
				true,
				type,
				stationTypeMap[type.station]
			);
			container.setAttribute(
				"id",
				`mark_${type.id}`
			);
			if (variables.debug) {
				const debug = document.createElement("div");
				debug.setAttribute(
					"class",
					"debug"
				);
				debug.setAttribute(
					"id",
					`debug_${type}`
				);
				debug.innerHTML = `type: ${type}</br> station: ${id}`;
				const table = document.createElement("table");
				table.setAttribute(
					"class",
					"debug"
				);
				table.setAttribute(
					"id",
					`debug_table_${type.id}`
				);
				debug.appendChild(table);
				container.appendChild(debug);

			}
			div.appendChild(container);
			this.renderChart(
				container,
				type,
				url
			);

		});

	}
};

