// Series definitions/configuration



var getData = function(station, tags, ...ser){
	// console.log('station',station)
	// console.log('tags',tags)
	// console.log('ser',ser)
	tags = Object.values(tags)
	var type = tags.shift();
	if(type === 'temperatures') type = 'temperature' // TODO hotfix
	if(type === 'growingSeason'){
		type = 'temperature' // TODO hotfix
		tags[0] = tags[0].replace('days', 'growDays');
		tags[0] = tags[0].replace('weeks', 'growWeeks');
	}
	if(station === 'CALM'){
		// sdfsdfsd
		station = station.toLowerCase()
		// 	console.log('station',station)
		// return Promise.resolve(null)
	}
	//
	//
	//
	//
	tags = tags.join('/')
	ser = ser.join('/')
	var url = tags.length <= 0 ? `station/${station}/${type}/${ser}` : `station/${station}/${type}/${tags}/${ser}`;
	console.log("URL",url)
	// console.log("ser",ser)
	return new Promise((res, rej) => {
		$.getJSON(url, function(result) {
			result = result.data;
			// console.log(data)

			if(result.values && typeof result.values != 'function') result = result.values 
			if(result.ERROR) rej(undefined);
			result = Object.values(result)
			// console.log("result",result)
			res(result.map(each => {
				// TODO replace with hexa instead simple 0-255 code
				if(each.colors != undefined){
					if(tags.includes('high')){
						each.color = each.colors.red
					}else{
						each.color = each.colors.blue;
					}	
					delete each.colors
				}
				return each
			}))
		})
			.done(function(result) {
			}).fail(function(error) {
				// console.log( "error",error);
				throw error
			})


	}) 
}


exports.series = {
	"getPreset": (config, serie, meta) => {
		// console.log("config",config)
		// console.log("serie",serie)
		// console.log("meta",meta)
		const preset = {
			"label": false,
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
		if(config.name != undefined) preset.name = config.name;
		preset.className = config.className;
		if (!preset.color) {
			preset.color = config.colour;
		}
		if (config.borderColor) {
			preset.borderColor = config.borderColor;
		}
		preset.type = config.type;

		var complete = () => {	
			var incomp = {};
			$.extend(true, incomp, preset)
			return new Promise((res, rej) => {
				if(typeof incomp.data.then === 'function'){
					incomp.data.then(reso => {
						incomp.data = reso;
						// console.log(incomp)
						res(incomp)		
					})
				}else{
					res(incomp)
				}
			})
		}
		console.log('preset',preset)
		return {
			incomplete: preset, 
			complete: complete()
		}

	},
	get "max" () {

		return (meta, data, k, s) => this.getPreset(
			meta.series.max,
			{
				"data": getData(meta.stationDef.station,meta.tag.data, 'max', 'shortValues'),
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
				"data": getData(meta.stationDef.station,meta.tag.data, 'min', 'shortValues'),
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
		return (meta, depricated, k, s) => {
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

					return getData(meta.stationDef.station,meta.tag.data, 'occurrence', meta.extreme.type, meta.extreme.lim ,'shortValues')
				}
				return getData(meta.stationDef.station,meta.tag.data,'shortValues');
			})()

			return this.getPreset(
				config,
				{
					"data": data
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
				"data": getData(meta.stationDef.station,meta.tag.data, 'shortValues'),
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
					if (meta.extreme) {

						return getData(meta.stationDef.station,meta.tag.data, 'occurrence', meta.extreme.type, meta.extreme.lim , 'difference', `{"lower":${baselineLower},"upper":${baselineUpper}}`)
						// return data.occurrence((e) => meta.extreme.lim > e).difference();

					}
					return getData(meta.stationDef.station,meta.tag.data,'difference', `{"lower":${baselineLower},"upper":${baselineUpper}}`)

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

	},
	get "first" () {
		return (meta, data, k, s) => this.getPreset(
			meta.series.first,
			{
				"lineWidth": 0,
				"marker": {"radius": 2},
				"states": {"hover": {"lineWidthPlus": 0}},
				"data": getData(meta.stationDef.station,meta.tag.data, 'shortValues')
			},
			meta);
	},
	get "firstDiff" (){
		return this.diff;
	},
	get "last" () {
		return (meta, data, k, s) => this.getPreset(
			meta.series.last,
			{
				"lineWidth": 0,
				"marker": {"radius": 2},
				"states": {"hover": {"lineWidthPlus": 0}},
				"data": getData(meta.stationDef.station,meta.tag.data, 'shortValues'),
			},
			meta);
	},
	get "lastDiff" (){
		return this.diff;
	},
	"linjer": (meta, data) => ({
		"className": "series-linjer",
		"name": meta.series.linjer.name,
		"className": meta.series.linjer.className,
		"type": meta.series.linjer.typ,
		"visible": false,
		"tooltip": {"valueDecimals": meta.decimals},
		"showInLegend": false
	}),
	get "snow"(){
		return (meta, data, k, s) => this.getPreset(
			meta.series.snow,
			{
				"data": getData(meta.stationDef.station,meta.tag.data, 'changeY', 'snow', 'shortValues'),
				// "name": meta.series.snow.name,
				// "className": meta.series.snow.className,
				// "type": meta.series.snow.type,
				// "stack": meta.groups[meta.series.snow.group].title,
				"stacking": "normal",
				// "color": meta.series.snow.colour,
				// "data": data.snow != undefined
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
	},
	get "rain"(){
		return (meta, data, k, s) => this.getPreset(
			meta.series.rain,
			{
				"data": getData(meta.stationDef.station, meta.tag.data, 'shortValues'),
				"stacking": "normal"
			},
			meta
		)
		// "name": meta.series.rain.name,
		// "className": meta.series.rain.className,
		// "type": meta.series.rain.type,
		// "stack": meta.groups[meta.series.rain.group].title,
		// "stacking": "normal",
		// "data": data.rain != undefined
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
	},
	"iceTime" () {

		return (meta, data, k, s) => this.getPreset(
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
				"data": getData(meta.stationDef.station, meta.tag.data),
				"visible": true,
				"tooltip": {"valueDecimals": meta.decimals}
			},
			meta)
	},
	"freeze" (){
		return (meta, data, k, s) => this.getPreset(
			meta.series.freeze,
			{
				"data": getData(meta.stationDef.station, meta.tag.data, 'shortValues'),
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
	},
	"breakup"(){
		return (meta, data, k, s) => this.getPreset(
			meta.series.breakup,
			{
				"data": getData(meta.stationDef.station, meta.tag.data, 'shortValues'),
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
	},
	get "iceThick" () {
		return (meta, data, k, s) => this.getPreset(
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
				// "data": getData(meta.stationDef.station, meta.tag.data, variables.date, 'shortValues'),
				"data": getData(meta.stationDef.station, meta.tag.data, 'shortValues'),
				// "data": data.total != undefined
				// ? data.total.max(
				// 	meta,
				// 	data
				// ).values
				// : data(date = variables.date).values,
				// "visible": true,
				"tooltip": {"valueDecimals": meta.decimals}
			},
			meta)
	},
	get "iceThickDiff" () {
		return (meta, data, k, s) => this.getPreset(
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
				"data": getData(meta.stationDef.station, meta.tag.data, 'difference', `{"lower":${baselineLower},"upper":${baselineUpper}}`),
				"visible": true,
				"tooltip": {"valueDecimals": meta.decimals}
			},
			meta)
	},
	get "perma"(){
		return (meta, data, k, s) => this.getPreset(
			meta.series[s],
			{
				"name": s,
				"color": meta.series[s].colour,
				"className": meta.series[s].className,
				"data": getData(s.toLowerCase()
					.replace('ä','a').replace('å','a').replace('ö','o'), 
					meta.tag.data,
					'yrly',
					'shortValues'),
				"visible": k == "Torneträsk",
				"opacity": 0.9,
			},
			meta)
		// {
		// "type": meta.series[s].type,
		// "data": data[s].values,
		// "tooltip": {"valueDecimals": meta.decimals}
		// }),
	}, 
	get "period" (){
		return (meta, data, k, s) => this.getPreset(
			meta.series[s],
			{
				"name": meta.series[s].name,
				"className": meta.series[s].className,
				"type": meta.series[s].type,
				"lineWidth": 1,
				"data": getData(meta.stationDef.station,meta.tag.data, s, 'yValues'),
				"visible": true,
				// "tooltip": {"valueDecimals": meta.decimals}
			},
			meta)
	}, 
	get "co2" (){
		return (meta, data, k, s) => this.getPreset(
			meta.series[s],
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
				"data": getData(meta.stationDef.station,meta.tag.data, 'shortValues').then(res => res.map(each => {
					each.x = new Date(each.x)
					return each
				})),
			}
			,meta)
	}
};
