const $ = require("jquery");

const Papa = require("papaparse");
// const help = require("../../helpers.js");
const help = require('climate-plots-helper');

const {createDiv} = require("../charts/struct.js"),

	renderer = require("../renderer.js").render;

/*
 * TODO Demo
 *  var demo = require('../../../data/demo.js').data;
 */


// Wander down the data structure with tag input example: [high, medium, low]
var tagApply = function (data, tags) {

	if (Array.isArray(tags) && tags.length == 1) {

		tags = tags[0];

	}
	return new Promise((res, rej) => {

		const result = data;
		if (data.then) {

			data.then((d) => {

				res(tagApply(
					d,
					tags
				));

			});

		} else if (Array.isArray(tags)) {

			const tag = tags.shift();
			res(tagApply(
				result[tag],
				tags
			));

		} else {

			// Res(result[tags.replace('[stationName]', station)])
			res(result[tags]);

		}

	}).catch((error) => {

		/*
		 * Console.log(tags)
		 * Console.log(data)
		 */
		throw error;

	});

};

// /
// /////

// Var merged = require('../../../static/modules.config.charts.merge.json');
const container = {},

	// /////

	struct = {
		"type": undefined,
		"config": undefined,
		"html" (config) {

			const {id} = config.files.stationDef,
				{subset} = config.files;

			/*
			 * If(subset){
			 * Subset = subset.subset;
			 * Var div = document.createElement("div");
			 * Subset.sets.forEach(month => {
			 * Div.appendChild(createDiv(id+'_'+month));
			 * })
			 * }else{
			 */
			return createDiv(
				config,
				false
			);

			/*
			 * }
			 * Return div
			 */

		},
		"build" (config, div) {

			this.config = config;
			const {ref} = config.files,
				{id} = ref;
			this.metaRef[id] = config;
			const {stationType} = config.files.stationDef,
				{type} = config.files.ref;
			this.type = type;
			div.appendChild(this.html(config));
			if (!container[type]) {

				container[type] = this.create(
					id,
					config
				);

			}
			container[type].contFunc(
				false,
				id,
				container[type].metaRef[id]
			);
			container[type].init(id);
			return container[type];

		},
		"file": undefined,
		"filePath": undefined,
		"preset": undefined,
		"cached": {},
		"parser": undefined,
		"render": renderer,
		"metaRef": {},
		"contFunc" (reset = false, id, config) {
			id = config.files.stationDef.id;
			if (!this.metaRef[id]) {
				this.metaRef[id] = config;
			}
			return this;
		},
		"init" (id) {
			let tag = this.metaRef[id].files.ref.tag.data,
				// Var render = this.render;
				meta = this.metaRef[id],
				st_id = meta.files.stationDef.id;
			this.render.setup(meta);
			if (!Array.isArray(tag)) {

				tag = [tag];

			}
			this.render.initiate(
				st_id
			);

			return this;

		},
		"clone" () {

			return {...this};

		},
		"create" (id, config) {

			/*
			 * Console.log(id)
			 * Console.log(config)
			 */
			if (!this.metaRef[id]) {

				this.metaRef[id] = {};
				$.extend(
					true,
					this.metaRef[id],
					config
				);

			}
			let cfg = config.files.config.parse,
				{file} = cfg,
				{preset} = cfg,
				{local} = cfg,
				// Console.log(file)
				res = this.clone();
			res.metRef = this.metaRef[id];
			const station = config.files.stationDef.stationType.data;
			// res.filePath = (files) => files.map((x) => filePath.station(
			// x,
			// station
			// ));
			res.preset = preset;
			// res.reader = Papa.parse;
			return res;

		}
	};
exports.struct = struct;
