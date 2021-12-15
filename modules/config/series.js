// Series definitions/configuration



var getData = function(station, tags, ...ser){
	// console.log('tags',tags)
	// console.log('ser',ser)
	tags = Object.values(tags)
	var type = tags.shift();
	tags = tags.join('/')
	ser = ser.join('/')
	if(type === 'temperatures') type = 'temperature' // TODO hotfix
	var url = `station/${station}/${type}/${tags}/${ser}`;
	return new Promise((res, rej) => {
		$.getJSON(url, function(result) {
			console.log('url', url)
			console.log('data',result)
			result = result.data;
			if(result.values && typeof result.values != 'function') result = result.values 
			res(result)	
		})
			.done(function(result) {
				// res(result.data)
			}).fail(function(error) {
				// console.log( "error",error);
				throw error
			})
	}) 
}


exports.series = {
	"getPreset": (config, serie, meta) => {
		// console.log('meta:', meta)
		/*
		 * Console.log("getPreset")
		 * Console.log(config)
		 * Console.log(serie)
		 * Console.log(meta)
		 */
		const preset = {
			"lineWidth": 0,
			"marker": {"radius": 2},
			"states": {"hover": {"lineWidthPlus": 0}},
			"visible": false,
			"tooltip": {
				"valueDecimals": (() => (serie.decimals != undefined ? series.decimals : meta.decimals))()
			}
		};
		$.extend(
			true,
			preset,
			serie,
			config
		);
		preset.name = config.name;
		preset.className = config.className;
		if (!preset.color) {

			preset.color = config.colour;

		}
		if (config.borderColor) {

			preset.borderColor = config.borderColor;

		}
		preset.type = config.type;

		/*
		 * Console.log(preset)
		 * Console.log("preset end")
		 */
		// return new Promise((res, rej) => {
		// 	if(typeof preset.data.then === 'function'){

		// 		preset.data.then(reso => {
		// 			preset.data = reso;
		// 			res(preset)		
		// 		})
		// 	}else{
		// 		res(preset)
		// 	}
		// })
		var complete = () => {	
			var incomp = {};
			$.extend(true, incomp, preset)
			return new Promise((res, rej) => {
				if(typeof incomp.data.then === 'function'){
					incomp.data.then(reso => {
						incomp.data = reso;
						res(incomp)		
					})
				}else{
					res(incomp)
				}
			})
		}
		return {
			incomplete: preset, 
			complete: complete()
		}

	},
	get "max" () {

		return (meta, data, k, s) => this.getPreset(
			meta.series.max,
			{
				"data": getData(meta.stationDef.station,meta.tag.data, 'max', true, 'values'),
				// "data": data.max != undefined
				// ? data.max.max != undefined
				// ? data.max.max(
				// 	meta,
				// 	data
				// ).values
				// : data.max(
				// meta,
				// data
				// ).values
				// : undefined
				// Type: meta.series.max.type,
			},
			meta
		);

	},
	get "min" () {
		return (meta, data, k, s) => this.getPreset(
			meta.series.min,
			{
				"data": getData(meta.stationDef.station,meta.tag.data, 'min', true, 'values'),
				// "data": data.min != undefined
				//     ? data.min.min != undefined
				//         ? data.min.min(
				//             meta,
				//             data
				//         ).values
				//         : data.min(
				//             meta,
				//             data
				//         ).values
				//     : undefined
			},
			meta
		);

	},
	get "extreme" () {
		return (meta, data, k, s) => {
			Highcharts.each(
				data,
				(point, i) => {
					data[i] = [
						point,
						`rgb(255,${Math.floor(point * 255 / max)}, 0)`
					];
				}
			);
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
			return this.getPreset(
				config,
				{
					"data": (() => {

						if (meta.extreme) {

							if (meta.extreme.type == "high") {
								return data.occurrence((e) => meta.extreme.lim < e).values;
							}
							return data.occurrence((e) => meta.extreme.lim > e).values;
						}
						return data.values;
					})()
				},
				meta
			);
		};
	},
	get "extreme-low" () {
		return this.extreme;
    	},
	get "extreme-high" () {
		return this.extreme
	},
	get "avg" () {

		return (meta, data, k, s) => this.getPreset(
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
				"data": getData(meta.stationDef.station,meta.tag.data),
				// "data": data.avg != undefined
				// ? data.avg.values
				// : data.values
			},
			meta
		);

	},
	get "diff" () {

		return (meta, data, k, s) => this.getPreset(
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
				"data": (() => {
					return getData(meta.stationDef.station,meta.tag.data,'avg','difference')
					if (meta.extreme) {

						if (meta.extreme.type == "high") {

							return data.occurrence((e) => meta.extreme.lim < e).difference();

						}
						return data.occurrence((e) => meta.extreme.lim > e).difference();

					}
					return data.difference != undefined
						? data.difference()
						: data.avg != undefined
						? data.avg.difference()
						: data.total != undefined
						? data.total.difference()
						: data(variables.date).difference();

				})(),
				"color": "red",
				"negativeColor": "blue",
				"visible": true
				// Tooltip: { valueDecimals: meta.decimals },
			},
			meta
		);

	},
	"first": (meta, data) => ({
		"name": meta.series.first.name,
		"className": meta.series.first.className,
		"lineWidth": 0,
		"marker": {"radius": 2},
		"states": {"hover": {"lineWidthPlus": 0}},
		"color": meta.series.first.colour,
		"data": data.values,
		"visible": false,
		"tooltip": {"valueDecimals": meta.decimals},
		"type": meta.series.first.type
	}),
	"firstDiff": (meta, data) => ({
		// TODO outdated
		"regression": false,
		"regressionSettings": {
			"type": "linear",
			"color": "#aa0000",
			"name": "DUMMY"
		},
		"name": meta.series.diff.name,
		"className": meta.series.diff.className,
		"type": meta.series.diff.type,
		"data": data.difference(),
		"color": "red",
		"negativeColor": "blue",
		"visible": true,
		"tooltip": {"valueDecimals": meta.decimals}
	}),
	"last": (meta, data) => ({
		"name": meta.series.last.name,
		"className": meta.series.last.className,
		"lineWidth": 0,
		"marker": {"radius": 2},
		"states": {"hover": {"lineWidthPlus": 0}},
		"color": meta.series.last.colour,
		"data": data.values,
		"visible": false,
		"tooltip": {"valueDecimals": meta.decimals},
		"type": meta.series.last.type
	}),
	"lastDiff": (meta, data) => ({
		// TODO outdated
		"regression": false,
		"regressionSettings": {
			"type": "linear",
			"color": "#aa0000",
			"name": "DUMMY"
		},
		"name": meta.series.diff.name,
		"className": meta.series.diff.className,
		"type": meta.series.diff.type,
		"data": data.difference(),
		"color": "red",
		"negativeColor": "blue",
		"visible": true,
		"tooltip": {"valueDecimals": meta.decimals}
	}),
	"linjer": (meta, data) => ({
		"className": "series-linjer",
		"name": meta.series.linjer.name,
		"className": meta.series.linjer.className,
		"type": meta.series.linjer.typ,
		"visible": false,
		"tooltip": {"valueDecimals": meta.decimals},
		"showInLegend": false
	}),
	"snow": (meta, data) => ({
		"name": meta.series.snow.name,
		"className": meta.series.snow.className,
		"type": meta.series.snow.type,
		"stack": meta.groups[meta.series.snow.group].title,
		"stacking": "normal",
		"color": meta.series.snow.colour,
		"data": data.snow != undefined
		? data.snow.values
		: undefined,
		"visible": true,
		"tooltip": {"valueDecimals": meta.decimals},
		"borderColor": meta.series.snow.borderColour,
		"states": {
			"hover": {
				"color": meta.series.snow.hoverColour,
				"animation": {
					"duration": 0
				}
			}
		}
	}),
	"rain": (meta, data) => ({
		"name": meta.series.rain.name,
		"className": meta.series.rain.className,
		"type": meta.series.rain.type,
		"stack": meta.groups[meta.series.rain.group].title,
		"stacking": "normal",
		"data": data.rain != undefined
		? data.rain.values
		: undefined,
		"color": meta.series.rain.colour,
		"borderColor": meta.series.rain.borderColour,
		"states": {
			"hover": {
				"color": meta.series.rain.hoverColour,
				"animation": {
					"duration": 0
				}
			}
		},
		"visible": true,
		"tooltip": {"valueDecimals": meta.decimals}
	}),
	"iceTime": (meta, data) => ({
		"regression": false,
		"type": meta.series.iceTime.type,
		"regressionSettings": {
			"type": "linear",
			"color": "#00bb00",
			"name": "[placeholder]"
		},
		"name": meta.series.iceTime.name,
		"className": meta.series.iceTime.className,
		"color": meta.series.iceTime.colour,
		"lineWidth": 0,
		"marker": {"radius": 2},
		"states": {"hover": {"lineWidthPlus": 0}},
		data,
		"visible": true,
		"tooltip": {"valueDecimals": meta.decimals}
	}),
	"freeze": (meta, data) => ({
		"regression": false,
		"type": meta.series.freeze.type,
		"regressionSettings": {
			"type": "linear",
			"color": "#0000ee",
			"name": "[placeholder]"
		},
		"name": meta.series.freeze.name,
		"className": meta.series.freeze.className,
		"color": meta.series.freeze.colour,
		"lineWidth": 0,
		"marker": {
			"enabled": true,
			"fillColor": meta.series.freeze.colour,
			"lineColor": meta.series.freeze.borderColour,
			"lineWidth": 1,
			"radius": 2
		},
		"states": {"hover": {"lineWidthPlus": 0}},
		"data": data.avg != undefined
		? data.avg.values
		: data.values,
		"visible": true,
		"tooltip": {"valueDecimals": meta.decimals}
	}),
	"breakup": (meta, data) => ({
		"regression": false,
		"type": meta.series.breakup.type,
		"className": meta.series.breakup.className,
		"regressionSettings": {
			"type": "linear",
			"color": "#0000ee",
			"name": "[placeholder]"
		},
		"name": meta.series.breakup.name,
		"color": meta.series.breakup.colour,
		"lineWidth": 0,
		"marker": {
			"enabled": true,
			"fillColor": meta.series.breakup.colour,
			"lineColor": meta.series.breakup.borderColour,
			"lineWidth": 1,
			"radius": 2
		},
		"states": {"hover": {"lineWidthPlus": 0}},
		"data": data.breakup.values,
		"visible": true
	}),
	"iceThick": (meta, data) => ({
		"name": meta.series.iceThick.name,
		"className": meta.series.iceThick.className,
		"color": meta.series.iceThick.colour,
		"lineWidth": 0,
		"marker": {
			"radius": 2,
			"symbol": "circle"
		},
		"data": data.total != undefined
		? data.total.max(
			meta,
			data
		).values
		: data(date = variables.date).values,
		"visible": true,
		"tooltip": {"valueDecimals": meta.decimals}
	}),
	"iceThickDiff": (meta, data) => ({
		"name": meta.series.iceThickDiff.name,
		"className": meta.series.iceTickDiff.className,
		"color": meta.series.iceThickDiff.colour,
		"lineWidth": 0,
		"marker": {
			"radius": 2,
			"symbol": "circle"
		},
		"data": data.total != undefined
		? data.total.max(
			meta,
			data
		).values
		: data(date = variables.date).difference(),
		"visible": true,
		"tooltip": {"valueDecimals": meta.decimals}
	}),
	"perma": (meta, data, k, s) => ({
		"name": meta.series[s].name == undefined
		? s
		: meta.series[k].name,
		"className": meta.series[s].className,
		"type": meta.series[s].type,
		"color": meta.series[s].colour,
		"opacity": 0.9,
		"data": data[s].values,
		"visible": k == "Torneträsk",
		"tooltip": {"valueDecimals": meta.decimals}
	}),
	"period": (meta, data, k, s) => ({
		"name": meta.series[s].name,
		"className": meta.series[s].className,
		"type": meta.series[s].type,
		"lineWidth": 1,
		"data": data[s].means.rotate(6).slice(2),
		"visible": true,
		"tooltip": {"valueDecimals": meta.decimals}
	}),
	"co2": (meta, data) => ({
		"name": meta.series.co2.name,
		"className": meta.series.co2.className,
		"color": meta.series.co2.colour,
		"type": meta.series.co2.type,
		"lineWidth": 2,
		"states": {"hover": {"lineWidthPlus": 0}},
		"data": data.values,
		"turboThreshold": 4000,
		"fillOpacity": 0.2,
		"label": {
			"enabled": false
		},
		"marker": {
			"states": {
				"select": {
					"fillColor": "red",
					"lineWidth": 1,
					"radius": 5
				}
			}
		},
		"zIndex": 6,
		"tooltip": {"valueDecimals": meta.decimals}
	})
};
