
const stats = require('vizchange-stats')


const config = require("../../static/server.config.json");


const configs = JSON.parse(JSON.stringify(stats.configs.production));
configs.dates.start = global.startYear;
configs.dates.end = global.endYear;

const http = require('http');

class Serie {
	constructor(meta, type, key, id, callback){
		this.meta = meta
		this.type = type
		this.key = key
		this.id = id
		this.callback = callback
		this.specs = JSON.parse(JSON.stringify(configs))
		this.specs.coordinates = meta.stationDef.coordinates
		console.log(this.specs.coordinates)
		// TODO for redirect but not precalc
		this.specs.url = `${hostUrl}/data/production/url`;
		// TODO for redirect and precalc
		this.specs['url_calc'] = `${hostUrl}`
		//this.specs.url = `${hostUrl}`;

		switch(type){
			case "avg":
				this.station = meta.stationDef.station
				this.tags = Object.values(meta.tag.data).concat(['shortValues'])
				break
			case "max":
				this.station = meta.stationDef.station
				this.tags = Object.values(meta.tag.data).concat(['max', 'shortValues'])
				break;
			case "min":
				this.station = meta.stationDef.station
				this.tags = Object.values(meta.tag.data).concat(['min', 'shortValues'])
				break;
			case "perma":
				this.tags = ['perma', 'yrly', 'shortValues'];
				this.station = Object.keys(meta.series)[this.callback].toLowerCase();
				break;
			case "period":
				this.station = meta.stationDef.station;
				switch (key) {
					case 'allTime':
						break;
					default:
						this.specs.dates.start = Number(this.key)
						switch (this.meta.tag.render) {
							case 'periodMeans':
								this.specs.dates.end = this.specs.dates.start + 29;
								break;
							default:
								this.specs.dates.end = this.specs.dates.start + 9;
						}
				}
				this.tags = ['snowdepth_single', 'splitDecades', 'shortValues']
				break;
			case "co2":
				this.station = meta.stationDef.station;
				this.tags = ['co2_weekly', 'all', 'shortValues']
				break;
				/*
			case "first":
			case "last":
				this.station = meta.stationDef.station;
				this.tags = Object.values(meta.tag.data).concat(['shortValues']);
				break;
				 */
			case "extreme":

				this.station = meta.stationDef.station
				if (meta.extreme) {
					this.tags = Object.values(meta.tag.data).concat([meta.extreme.type, meta.extreme.lim, 'shortValues']);
				}else{
					this.tags = Object.values(meta.tag.data).concat(['shortValues'])
				}
				break;
			case "diff":
				this.station = meta.stationDef.station;
				this.tags = Object.values(meta.tag.data).concat(['difference'])
				break;
			default:
				this.station = meta.stationDef.station
				this.tags = Object.values(this.meta.tag.data).concat(['shortValues'])
		}
		this.updateTime = (new Date()).getTime();
	}
	get 'serie' () {
		return this[this.type](this.meta, this.type, this.key, this.id)
	}
	async 'data' (st, tgs, ...sr) {
		let station = this.station;
		let tags = this.tags
		let specs = JSON.parse(JSON.stringify(this.specs));
		//let ser = this.ser
		//console.log('station',station)
		//console.log('tags',tags)
		//console.log('sr',sr)
		tags = Object.values(tags)
		let type = tags.shift();
		switch (type) {
			case 'temperatures':
				type = 'temperature' // TODO hotfix
				if(tags[0] === 'monthly') {
					tags.shift()
				}
				break;
			case 'growingSeason':
				// outdated TODO
				type = 'temperature' // TODO hotfix
				tags[0] = tags[0].replace('days', 'growDays');
				tags[0] = tags[0].replace('weeks', 'growWeeks');
				break;
			case 'precipitation':
				switch (sr[0]) {
					case 'snow':
					case 'rain':
						// TODO hotfix tags to series insted in config
						if(tags[0] === 'monthly') {
							tags.shift()
						}
						tags.pop()
						tags = tags.concat(sr)

						break;
					default:
						if(tags[0] === 'monthly') {
							tags.shift()
						}
				}
			default:
		}
		//
		//
		//
		/**
		 tags = tags.join('/')
		 ser = ser.join('/')
		 let url = tags.length <= 0 ? `station/${station}/${type}/${ser}` : `station/${station}/${type}/${tags}/${ser}`;
		 let config = stats.configs.live;
		 config.station = station;
		 config.type = type;
		 */
		// TODO change if needed shortValeus
		specs.station = station;
		specs.type = type;
		specs.baseline.start = global.baselineLower
		specs.baseline.end = global.baselineUpper

		let params = [type].concat(tags)

		//console.log('serie.tags', tags)

		//console.log('serie.params', params)
		//console.log('serie.specs', specs)
		//console.log('serie.tags', tags)



		// TODO switch between pre calc
		//console.log(`${specs.url}/precalculated/${specs.station}/${specs.type}/${params.join('/')}`)
		//return stats.getByParamsPreCalculated(specs, params).then(result => {
		//switch (params[3]+params[4]){
		let key = params[3]
		if(specs.baseline.start !== 1961 || specs.baseline.end !== 1990){
			//key += params[4]
		}
		key += params[4]
		switch (key){
			case 'lastshortValues':
			case 'firstshortValues':
			case 'last':
			case 'first':
				specs.url = specs['url_calc']
				console.log(specs)
				return stats.getByParamsPreCalculated(specs, params).then(result => {
					if(Array.isArray(result.data)) result = result.data
					result = result.map(each => {
						if(typeof each.then === 'function'){
							return each
						}else {
							return Promise.resolve(each)
						}
					})
					return result
				}).then(result => {
					if(result.length > 12){
						result[result.length-10].then(each => {
							if(each.baseline){
								global.baselineValue = Math.floor(each.baseline*100)/100;
							}
						})
					}
					return result.map(each => {
						return each
					})
				})
			case 'firstdifference':
			case 'lastdifference':
				specs.url = specs['url_calc']
				let params1 = JSON.parse(JSON.stringify(params));


				params.pop()
				params.push('baseline')
				params.push('y')

				return stats.getByParamsPreCalculated(specs, params).then(baseline => {
					params1.pop()
					params1.push('shortValues')
					baseline = baseline.data
					let specs1 = JSON.parse(JSON.stringify(this.specs))
					specs1.url = this.specs['url_calc']
					specs1.station = station;
					specs1.type = type;
					global.baselineValue = Math.floor(baseline*100)/100;
					return stats.getByParamsPreCalculated(specs1, params1).then(result => {
						return result.data.map(value => {

							if(value === undefined) return Promise.resolve(undefined)
							value.y -= baseline;
							value.baseline = baseline;
							return Promise.resolve(value)
						})
					})
				})
			default:
				return stats.getByParams(specs, params).then(result => {
					result = result.map(each => {
						if(typeof each.then === 'function'){
							return each
						}else {
							return Promise.resolve(each)
						}
					})
					return result
				}).then(result => {
					if(result.length > 12){
						result[result.length-10].then(each => {
							if(each.baseline){
								global.baselineValue = Math.floor(each.baseline*100)/100;
							}
						})
					}
					return result.map(each => {
						return each
					})
				})
		}


	}
	'preset' (config, serie, meta) {
		const preset = {
			"label": false,
			"lineWidth": 0,
			"marker": {"radius": 2},
			"states": {"hover": {"lineWidthPlus": 0}},
			"visible": false,
			"tooltip": {
				"valueDecimals": (() => (serie.decimals !== undefined ? series.decimals : meta.decimals))()
			}
		};
		$.extend(true, preset, serie, config);

		if(config.name !== undefined) preset.name = config.name;
		preset.className = config.className;
		if (!preset.color) {
			preset.color = config.colour;
		}
		if (config.borderColor) {
			preset.borderColor = config.borderColor;
		}
		preset.type = config.type;

		let complete = () => {
			const incomp = {};
			$.extend(true, incomp, preset)
			if(config.group !== undefined) incomp.visible = (meta.groups[config.group].prime === undefined ? false : meta.groups[config.group].prime) && config.visible;
			if(meta.period) incomp.visible = meta.period
			incomp.promises.then((promises) => {
				Promise.allSettled(promises).then(() => {
					$(`#${this.id}`).highcharts().hideLoading();
					$(`#${this.id}`).highcharts().redraw()
				})
				if(meta.tag.data[1] === 'all'){
					Promise.allSettled(promises).then(all => {
						all = all.map(each => each.value)
						incomp.data = all
						$(`#${this.id}`).highcharts().series[this.callback].update(incomp)
					})
				}else{
					let len = promises.length;
					promises.forEach((each, index) => {
						each.then(point => {
							if(point === undefined || isNaN(point.y)){
							}else{
								len -= 1;
								switch (meta.period) {
									case true:
										point = point.y
										$(`#${this.id}`).highcharts().series[this.callback].data[11-index].update(point)
										break;
									default:
										let toUpdate = (len === 0) || (index % promises.length === 30)
										$(`#${this.id}`).highcharts().series[this.callback].addPoint(point, toUpdate)
								}
							}
						})
					})
				}


				//return Promise.allSettled(promises).then(data => {
				//	incomp.data = data.map(each => each.value).filter(each => each !== undefined);
				//	return incomp;
				//})
			})
			return incomp
		};
		return {
			incomplete: preset,
			complete: complete()
		}
	}
	get "max" () {
		return (meta) => this.preset(
			meta.series.max,
			{
				"promises": this.data(meta.stationDef.station,meta.tag.data, 'max', 'shortValues'),
			},
			meta
		);

	}
	get "min" () {
		return (meta) => this.preset(
			meta.series.min,
			{
				"promises": this.data(meta.stationDef.station,meta.tag.data, 'min', 'shortValues'),
			},
			meta
		);

	}
	get "extreme" () {
		return (meta, s, k) => {
			let tag = "extreme";
			if (meta.extreme) {
				tag += meta.extreme.type;
			}else{
				tag += '-high'
			}
			return this.preset(
				meta.series[k],
				{
					"promises": this.data(meta.stationDef.station,meta.tag.data),
				},
				meta
			);
			/*
			let tag = "extreme";
			if (meta.extreme) {
				tag += meta.extreme.type;
			}
			const config = {};
			$.extend(
				true,
				config,
				meta.series[tag],
				meta.series[s]
			);
			let data = (() => {
				if (meta.extreme) {
					return this.data(meta.stationDef.station,meta.tag.data, 'occurrence', meta.extreme.type, meta.extreme.lim ,'shortValues')
				}
				return this.data(meta.stationDef.station,meta.tag.data,'shortValues');
			})()

			return this.preset(
				config,
				{
					"promises": data,
					"colorKey": 'y',
				},
				meta
			);

			 */
		};
	}
	get "extreme-low" () {
		return this.extreme;
	}
	get "extreme-high" () {
		return this.extreme
	}
	get "avg" () {

		return (meta) => this.preset(
			meta.series.avg,
			{
				"step": "center",
				"marker": {
					"enabled": true,
					"fillColor": meta.series.avg.colour,
					"lineColor": meta.series.avg.borderColour,
					"lineWidth": meta.series.avg.borderColour
						? 1
						: 0,
					"radius": 2
				},
				"promises": this.data(meta.stationDef.station,meta.tag.data, 'shortValues'),

				// "promises": data.avg != undefined
				// ? data.avg.values
				// : data.values
			},
			meta
		);

	}
	get "diff" () {
		return (meta) => this.preset(
			meta.series.diff,
			{

				/*
				 * Regression: false,
				 * ClassName: meta.series.diff.className,
				 * RegressionSettings: {
				 * Type: 'linear',
				 * Color: '#aa0000',
				 * Name: 'DUMMY',
				 * },
				 * Name: meta.series.diff.name,
				 * Type: meta.series.diff.type,
				 */
				"promises": (() => {
					if (meta.extreme) {

						return this.data(meta.stationDef.station,meta.tag.data, 'occurrence', meta.extreme.type, meta.extreme.lim , 'difference')
						// return data.occurrence((e) => meta.extreme.lim > e).difference();

					}
					return this.data(meta.stationDef.station,meta.tag.data,'difference')

					// return data.difference != undefined
					// 	? data.difference()
					// 	: data.avg != undefined
					// 	? data.avg.difference()
					// 	: data.total != undefined
					// 	? data.total.difference()
					// 	: data(variables.date).difference();

				})(),
				"color": "red",
				"negativeColor": "blue",
				"visible": true
				// Tooltip: { valueDecimals: meta.decimals },
			},
			meta
		);
	}
	get "first" () {
		return (meta) => this.preset(
			meta.series.first,
			{
				"keys": ["x", "date"],
				"lineWidth": 0,
				"marker": {"radius": 2},
				"states": {"hover": {"lineWidthPlus": 0}},
				"promises": this.data(meta.stationDef.station,meta.tag.data, 'shortValues')
			},
			meta);
	}
	get "firstDiff" (){
		return this.diff;
	}
	get "last" () {
		return (meta) => this.preset(
			meta.series.last,
			{
				"lineWidth": 0,
				"marker": {"radius": 2},
				"states": {"hover": {"lineWidthPlus": 0}},
				"promises": this.data(meta.stationDef.station,meta.tag.data, 'shortValues'),
			},
			meta);
	}
	get "lastDiff" (){
		return this.diff;
	}
	/*
	"linjer": (meta) => ({
		"name": meta.series.linjer.name,
		"className": meta.series.linjer.className,
		"type": meta.series.linjer.typ,
		"visible": false,
		"tooltip": {"valueDecimals": meta.decimals},
		"showInLegend": false
	})
	*/
	get "snow"(){
		return (meta) => this.preset(
			meta.series.snow,
			{
				"promises": this.data(meta.stationDef.station,meta.tag.data, 'snow', 'shortValues'),
				// "name": meta.series.snow.name,
				// "className": meta.series.snow.className,
				// "type": meta.series.snow.type,
				// "stack": meta.groups[meta.series.snow.group].title,
				"stacking": "normal",
				// "color": meta.series.snow.colour,
				// "promises": data.snow != undefined
				// ? data.snow.values
				// : undefined,
				// "visible": true,
				// "tooltip": {"valueDecimals": meta.decimals},
				// "borderColor": meta.series.snow.borderColour,
				// "states": {
				// "hover": {
				// "color": meta.series.snow.hoverColour,
				// "animation": {
				// "duration": 0
				// }
				// }
				// }
			},
			meta
		);
	}
	get "rain"(){
		return (meta) => this.preset(
			meta.series.rain,
			{
				"promises": this.data(meta.stationDef.station, meta.tag.data, 'rain', 'shortValues'),
				"stacking": "normal"
			},
			meta
		)
		// "name": meta.series.rain.name,
		// "className": meta.series.rain.className,
		// "type": meta.series.rain.type,
		// "stack": meta.groups[meta.series.rain.group].title,
		// "stacking": "normal",
		// "promises": data.rain != undefined
		// ? data.rain.values
		// : undefined,
		// "color": meta.series.rain.colour,
		// "borderColor": meta.series.rain.borderColour,
		// "states": {
		// "hover": {
		// 	"color": meta.series.rain.hoverColour,
		// 	"animation": {
		// 		"duration": 0
		// 	}
		// }
		// },
		// "visible": true,
		// "tooltip": {"valueDecimals": meta.decimals}
	}
	"iceTime" () {
		return (meta) => this.preset(
			meta.series.iceTime,
			{
				"regression": false,
				// "type": meta.series.iceTime.type,
				"regressionSettings": {
					"type": "linear",
					"color": "#00bb00",
					"name": "[placeholder]"
				},
				// "name": meta.series.iceTime.name,
				// "className": meta.series.iceTime.className,
				// "color": meta.series.iceTime.colour,
				"lineWidth": 0,
				"marker": {"radius": 2},
				"states": {"hover": {"lineWidthPlus": 0}},
				"promises": this.data(meta.stationDef.station, meta.tag.data),
				"visible": true,
				"tooltip": {"valueDecimals": meta.decimals}
			},
			meta)
	}
	"freeze" (){
		return (meta) => this.preset(
			meta.series.freeze,
			{
				"promises": this.data(meta.stationDef.station, meta.tag.data, 'shortValues'),
				"regression": false,
				"regressionSettings": {
					"type": "linear",
					"color": "#0000ee",
					"name": "[placeholder]"
				},
				"lineWidth": 0,
				"marker": {
					"enabled": true,
					"fillColor": meta.series.freeze.colour,
					"lineColor": meta.series.freeze.borderColour,
					"lineWidth": 1,
					"radius": 2
				},
				"states": {"hover": {"lineWidthPlus": 0}},
				"visible": true,
				"tooltip": {"valueDecimals": meta.decimals}
			},
			meta
		)
	}
	"breakup"(){
		return (meta) => this.preset(
			meta.series.breakup,
			{
				"promises": this.data(meta.stationDef.station, meta.tag.data, 'shortValues'),
				"stacking": "normal",
				"regression": false,
				"regressionSettings": {
					"type": "linear",
					"color": "#0000ee",
					"name": "[placeholder]"
				},
				"lineWidth": 0,
				"marker": {
					"enabled": true,
					"fillColor": meta.series.breakup.colour,
					"lineColor": meta.series.breakup.borderColour,
					"lineWidth": 1,
					"radius": 2
				},
				"states": {"hover": {"lineWidthPlus": 0}},
				"visible": true
			},
			meta
		)
	}
	get "iceThick" () {
		return (meta) => this.preset(
			meta.series.iceThick,
			{
				// "name": meta.series.iceThick.name,
				// "className": meta.series.iceThick.className,
				// "color": meta.series.iceThick.colour,
				"lineWidth": 0,
				"marker": {
					"radius": 2,
					"symbol": "circle"
				},
				// "promises": this.data(meta.stationDef.station, meta.tag.data, variables.date, 'shortValues'),
				"promises": this.data(meta.stationDef.station, meta.tag.data, 'shortValues'),
				// "promises": data.total != undefined
				// ? data.total.max(
				// 	meta,
				// 	data
				// ).values
				// : data(date = variables.date).values,
				// "visible": true,
				"tooltip": {"valueDecimals": meta.decimals}
			},
			meta)
	}
	get "iceThickDiff" () {
		return (meta) => this.preset(
			meta.series.iceThick,
			{
				// "name": meta.series.iceThickDiff.name,
				// "className": meta.series.iceTickDiff.className,
				// "color": meta.series.iceThickDiff.colour,
				"lineWidth": 0,
				"marker": {
					"radius": 2,
					"symbol": "circle"
				},
				"promises": this.data(meta.stationDef.station, meta.tag.data, 'difference'),
				"visible": true,
				"tooltip": {"valueDecimals": meta.decimals}
			},
			meta)
	}
	get "perma"(){
		return (meta) => {
			return this.preset(
				meta.series[Object.keys(meta.series)[this.callback]],
				{
					"name": Object.keys(meta.series)[this.callback],
					"color": meta.series[Object.keys(meta.series)[this.callback]].colour,
					"className": meta.series[Object.keys(meta.series)[this.callback]].className,
					"promises": this.data(Object.keys(meta.series)[this.callback].toLowerCase()
							.replace('ä','a').replace('å','a').replace('ö','o'),
						meta.tag.data,
						'yrly',
						'shortValues'),
					"visible": Object.keys(meta.series)[this.callback] === "Torneträsk",
					"opacity": 0.9,
				},
				meta)
		}
		// {
		// "type": meta.series[s].type,
		// "promises": data[s].values,
		// "tooltip": {"valueDecimals": meta.decimals}
		// }),
	}
	get "period" (){
		return (meta) => this.preset(
			meta.series[Object.keys(meta.series)[this.callback]],
			{
				"name": meta.series[Object.keys(meta.series)[this.callback]].name,
				"className": meta.series[Object.keys(meta.series)[this.callback]].className,
				"type": meta.series[Object.keys(meta.series)[this.callback]].type,
				"lineWidth": 1,
				"visible": true,
				"data": [0,0,0,0,0,0,0,0,0,0,0,0],
				"promises": this.data(this.station, this.tags),
				"dataSorting": {
					"enabled": true,
					"matchByName": true,
					"sortKey": 'y'
				}
				// "tooltip": {"valueDecimals": meta.decimals}
			},
			meta)
	}
	get "co2" (){
		return (meta) => this.preset(
			meta.series.co2,
			{
				"name": meta.series.co2.name,
				"className": meta.series.co2.className,
				"color": meta.series.co2.colour,
				"type": meta.series.co2.type,
				"lineWidth": 0,
				"states": {"hover": {"lineWidthPlus": 0}},
				"turboThreshold": 4000,
				"fillOpacity": 0.2,
				"label": {
					"enabled": false
				},
				"marker": {
					"radius": 5,
					"lineColor": meta.series.co2.colour,
					"lineWidth": 1,
					"states": {
						"select": {
							"fillColor": "red",
							"lineWidth": 1,
							"radius": 5

						}

					}

				},
				"zIndex": 6,
				"tooltip": {"valueDecimals": meta.decimals},
				"promises": this.data(meta.stationDef.station,meta.tag.data, 'shortValues').then(res => res.map(each => {
					each.x = new Date(each.x)
					return each
				})),
			}
			,meta)
	}
}
module.exports.Serie = Serie
