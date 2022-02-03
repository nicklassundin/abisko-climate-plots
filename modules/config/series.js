// Series definitions/configuration



var getData = function(station, tags, ...ser){
	console.log('station',station)
	console.log('tags',tags)
	console.log('ser',ser)
	tags = Object.values(tags)
	var type = tags.shift();
	if(type === 'temperatures') type = 'temperature' // TODO hotfix
	if(type === 'growingSeason'){
		type = 'temperature' // TODO hotfix
		tags[0] = tags[0].replace('days', 'growDays');
		tags[0] = tags[0].replace('weeks', 'growWeeks');
	}
	if(station === 'CALM'){
		sdfsdfsd
		station = station.toLowerCase()
		// 	console.log('station',station)
		// return Promise.resolve(null)
	}
	tags = tags.join('/')
	ser = ser.join('/')
	var url = tags.length <= 0 ? `station/${station}/${type}/${ser}` : `station/${station}/${type}/${tags}/${ser}`;
	console.log("URL",url)
	// console.log("ser",ser)
	return new Promise((res, rej) => {
		$.getJSON(url, function(result) {
			result = result.data;
			if(result.values && typeof result.values != 'function') result = result.values 
			if(result.ERROR) res(undefined);
			res(Object.values(result))
		})
			.done(function(result) {
				// res(result.data)
			}).fail(function(error) {
				// console.log( "error",error);
				throw error
			})


		// Highcharts.each(
		// 	data,
		// 	(point, i) => {
		// 		data[i] = [
		// 			point,
		// 			`rgb(255,${Math.floor(point * 255 / max)}, 0)`
		// 		];
		// 	}
		// );
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
		return (meta, data, k, s) => {
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
			console.log(meta.extreme)
			return this.getPreset(
				config,
				{
					"data": (() => {
						if (meta.extreme) {
							return getData(meta.stationDef.station,meta.tag.data, 'occurence', meta.extreme.type, meta.extreme.lim ,'shortValues')
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

						return getData(meta.stationDef.station,meta.tag.data, 'occurence', meta.extreme.type, meta.extreme.lim , 'difference', 'shortValues')
						return data.occurrence((e) => meta.extreme.lim > e).difference();

					}
					return getData(meta.stationDef.station,meta.tag.data,'difference', 'shortValues')

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
				"data": getData(meta.stationDef.station,meta.tag.data, 'first', 'shortValues'),
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
				"data": getData(meta.stationDef.station,meta.tag.data, 'last', 'shortValues'),
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
