
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
	renderFromData (id, config_id) {
		let config_element = document.querySelector(config_id)
		let config = {}
		config.set = config_element.dataset.set;

		if(config.set === undefined) config.set = document.getElementById("set").value
		config.station = config_element.dataset.name;
		config.id = config_element.dataset.id;
		config.coordinates = {}
		config.coordinates.latitude = Number(config_element.dataset.latitude)
		config.coordinates.longitude = Number(config_element.dataset.longitude)

		config.hostUrl = config_element.dataset.hostUrl
		if(config.hostUrl === undefined) config.hostUrl = window.location.origin

		this.render(document.getElementById(id), config)
	},
	render (element, config) {
		global.hostUrl = config.hostUrl

		config.plot = sets[config.set]
			? sets[config.set]
			: [config.set];
		config.plot = config.plot.pop();

		config.id = `${config.station}_${config.plot}`
		let stationType = stationTypeMap[config.station];
		if(stationType === undefined) {
			stationType = {
				'stationName': config.station,
				'stationType': {
					'data': config.id,
					'config': config.station
				}
			}
		}
		$.extend(
			true,
			config,
			stationType
		);


		const container = document.createElement("div");
		container.setAttribute(
			"id",
			`mark_${config.id}`
		);
		element.appendChild(container);

		// TODO stream line preconfig by merging and standardizing configuration
		meta.getMeta(config).then((cfg) => {
			$(() => {
				cfg.files.config.contex = config.context === undefined
					? true
					: config.context;
				if (config.override
					? !config.override.axislim
					: false) {
					Object.keys(cfg.files.config.groups).forEach((key) => {
						if (!cfg.files.config.groups[key].yAxis) {
							cfg.files.config.groups[key].yAxis = {};
						}
						cfg.files.config.groups[key].yAxis.min = undefined;
						cfg.files.config.groups[key].yAxis.max = undefined;
					});
				}
				charts.build(
					cfg,
					container
				);
			});
		});
	}
};

