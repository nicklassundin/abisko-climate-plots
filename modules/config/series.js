// Series definitions/configuration

exports.series = {
	getPreset: (series, data) => {
		//TODO
	},
	max: (meta, data) => ({
		name: meta.series.max.name,
		className: meta.series.max.className,
		lineWidth: 0,
		marker: { radius: 2 },
		states: { hover: { lineWidthPlus: 0 } },
		color: meta.series.max.colour,
		data: (data.max != undefined) ? ((data.max.max != undefined) ? data.max.max(meta, data).values : data.max(meta, data).values) : undefined ,
		visible: false,
		tooltip: { valueDecimals: meta.decimals },
		type: meta.series.max.type,
	}),
	min: (meta, data) => ({
		name: meta.series.min.name,
		className: meta.series.min.className,
		lineWidth: 0,
		marker: { radius: 2 },
		states: { hover: { lineWidthPlus: 0 } },
		color: meta.series.min.colour,
		data: (data.min != undefined) ? ((data.min.min != undefined) ? data.min.min(meta, data).values : data.min(meta, data).values) : undefined ,
		visible: false,
		tooltip: { valueDecimals: meta.decimals },
		type: meta.series.min.type,
	}),
	extreme: (meta, data, k, s) => {
		var tag = "extreme";
		if(meta.extreme) tag = tag+meta.extreme.type

		return {
			name: meta.series[tag].name,
			className: meta.series[s].className,
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: meta.series[s].colour,
			// data: (data.max != undefined) ? (data.max.max != undefined ? data.max.max(false).values : undefined) : data.total.max(false).values, 
			// data: data.max(false).values,
			data: (() => {
				if(meta.extreme){
					if(meta.extreme.type == "high"){
						return data.occurrence((e => meta.extreme.lim < e)).values
					}else{
						return data.occurrence((e => meta.extreme.lim > e)).values
					}
				}else{
					return data.values
				}
			})(),
			visible: false,
			tooltip: { 
				valueDecimals: (() => {
					return (meta.series[s].decimals != undefined ? meta.series[s].decimals : meta.decimals) 
				})()
			},
			type: meta.series[s].type,
		}
	},
	avg: (meta, data) => ({
		name: meta.series.avg.name,
		className: meta.series.avg.className,
		lineWidth: 0,
		regression: true,
		step: 'center',
		// marker: { radius: 2 },
		marker: { 
			enabled: true,
			fillColor: meta.series.avg.colour,
			lineColor: meta.series.avg.borderColour,
			lineWidth: meta.series.avg.borderColour ? 1 : 0,
			radius: 2 
		},
		states: { hover: { lineWidthPlus: 0 } },
		color: meta.series.avg.colour,
		data: (data.avg != undefined) ? data.avg.values : data.values,
		regressionSettings: {
			// type: 'linear',
			// color: meta.series.linjer.colour,
			// name: (meta.series.linjer.name,
		},
		visible: true,
		tooltip: { valueDecimals: meta.decimals },
		type: meta.series.avg.type,
		// type: 'xrange'
	}),
	diff: (meta, data) => ({
		regression: false,
		className: meta.series.diff.className,
		regressionSettings: {
			type: 'linear',
			color: '#aa0000',
			name: 'DUMMY',
		},
		name: meta.series.diff.name,
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
		tooltip: { valueDecimals: meta.decimals },
	}),
	first: (meta, data) => ({
		name: meta.series.first.name,
		className: meta.series.first.className,
		lineWidth: 0,
		marker: { radius: 2 },
		states: { hover: { lineWidthPlus: 0 } },
		color: meta.series.first.colour,
		data: data.values,
		visible: false,
		tooltip: { valueDecimals: meta.decimals },
		type: meta.series.first.type,
	}),
	firstDiff: (meta, data) => ({
		// TODO outdated
		regression: false,
		regressionSettings: {
			type: 'linear',
			color: '#aa0000',
			name: 'DUMMY',
		},
		name: meta.series.diff.name,
		className: meta.series.diff.className,
		type: meta.series.diff.type,
		data: data.difference(),
		color: 'red',
		negativeColor: 'blue',
		visible: true,
		tooltip: { valueDecimals: meta.decimals },
	}),
	last: (meta, data) => ({
		name: meta.series.last.name,
		className: meta.series.last.className,
		lineWidth: 0,
		marker: { radius: 2 },
		states: { hover: { lineWidthPlus: 0 } },
		color: meta.series.last.colour,
		data: data.values,
		visible: false,
		tooltip: { valueDecimals: meta.decimals },
		type: meta.series.last.type,
	}),
	lastDiff: (meta, data) => ({
		// TODO outdated
		regression: false,
		regressionSettings: {
			type: 'linear',
			color: '#aa0000',
			name: 'DUMMY',
		},
		name: meta.series.diff.name,
		className: meta.series.diff.className,
		type: meta.series.diff.type,
		data: data.difference(),
		color: 'red',
		negativeColor: 'blue',
		visible: true,
		tooltip: { valueDecimals: meta.decimals },
	}),
	linjer: (meta, data) => ({
		className: 'series-linjer',
		name: meta.series.linjer.name,
		className: meta.series.linjer.className,
		type: meta.series.linjer.typ,
		visible: false,
		tooltip: { valueDecimals: meta.decimals },
		showInLegend: false
	}),
	snow: (meta, data) => ({
		name: meta.series.snow.name,
		className: meta.series.snow.className,
		type: meta.series.snow.type,
		stack: meta.groups[meta.series.snow.group].title,
		stacking: 'normal',
		color: meta.series.snow.colour,
		data: (data.snow != undefined) ? data.snow.values : undefined,
		visible: true,
		tooltip: { valueDecimals: meta.decimals },
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
	rain: (meta, data) => ({
		name: meta.series.rain.name,
		className: meta.series.rain.className,
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
		tooltip: { valueDecimals: meta.decimals },
	}),
	iceTime: (meta, data) => ({
		regression: false,
		type: meta.series.iceTime.type,
		regressionSettings: {
			type: 'linear',
			color: '#00bb00',
			name: '[placeholder]',
		},
		name: meta.series.iceTime.name,
		className: meta.series.iceTime.className,
		color: meta.series.iceTime.colour,
		lineWidth: 0,
		marker: { radius: 2 },
		states: { hover: { lineWidthPlus: 0 } },
		data: data,
		visible: true,
		tooltip: { valueDecimals: meta.decimals },
	}),
	freeze: (meta, data) => ({
		regression: false,
		type: meta.series.freeze.type,
		regressionSettings: {
			type: 'linear',
			color: '#0000ee',
			name: '[placeholder]',
		},
		name: meta.series.freeze.name,
		className: meta.series.freeze.className,
		color: meta.series.freeze.colour,
		lineWidth: 0,
		marker: { 
			enabled: true,
			fillColor: meta.series.freeze.colour,
			lineColor: meta.series.freeze.borderColour,
			lineWidth: 1,
			radius: 2 
		},
		states: { hover: { lineWidthPlus: 0 } },
		data: (data.avg != undefined) ? data.avg.values : data.values,
		visible: true,
		tooltip: { valueDecimals: meta.decimals },
	}),
	breakup: (meta, data) => ({
		regression: false,
		type: meta.series.breakup.type,
		className: meta.series.breakup.className,
		regressionSettings: {
			type: 'linear',
			color: '#0000ee',
			name: '[placeholder]',
		},
		name: meta.series.breakup.name,
		color: meta.series.breakup.colour,
		lineWidth: 0,
		marker: {
			enabled: true,
			fillColor: meta.series.breakup.colour,
			lineColor: meta.series.breakup.borderColour,
			lineWidth: 1,
			radius: 2
		},
		states: { hover: { lineWidthPlus: 0 } },
		data: data.breakup.values,
		visible: true,
	}),
	iceThick: (meta, data) => ({
		name: meta.series.iceThick.name,
		className: meta.series.iceThick.className,
		color: meta.series.iceThick.colour,
		lineWidth: 0,
		marker: {
			radius: 2,
			symbol: 'circle',
		},
		data: (data.total != undefined) ? data.total.max(meta, data).values : data(date = variables.date).values,
		visible: true,
		tooltip: { valueDecimals: meta.decimals },
	}),
	iceThickDiff: (meta, data) => ({
		name: meta.series.iceThickDiff.name,
		className: meta.series.iceTickDiff.className,
		color: meta.series.iceThickDiff.colour,
		lineWidth: 0,
		marker: {
			radius: 2,
			symbol: 'circle',
		},
		data: (data.total != undefined) ? data.total.max(meta, data).values : data(date = variables.date).difference(),
		visible: true,
		tooltip: { valueDecimals: meta.decimals },
	}),
	perma: (meta, data, type, k) => ({
		name: (meta.series[k].name == undefined) ? k : meta.series[k].name,
		className: meta.series[k].className,
		type: meta.series[k].type,
		color: meta.series[k].colour,
		opacity: 0.9,
		data: data[k].values,
		visible: k == "Torneträsk",
		tooltip: { valueDecimals: meta.decimals },
	}),
	period: (meta, p, type, k) => ({
		name: meta.series[k].name, 
		className: meta.series[k].className,
		type: meta.series[k].type,
		lineWidth: 1,
		data: p[k].means.rotate(6).slice(2),
		visible: true,
		tooltip: { valueDecimals: meta.decimals },
	}),
	co2: (meta, data) => ({
		name: meta.series.co2.name,
		className: meta.series.co2.className,
		color: meta.series.co2.colour,
		type: meta.series.co2.type,
		lineWidth: 2,
		states: { hover: { lineWidthPlus: 0 } },
		data: data.values,
		turboThreshold: 4000,
		fillOpacity: 0.2,
		label: {
			enabled: false,
		},
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
		tooltip: { valueDecimals: meta.decimals },
	}),
}
