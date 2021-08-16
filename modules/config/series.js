// Series definitions/configuration

exports.series = {
	getPreset: (series, data) => {
		//TODO
	},
	max: (meta, data) => ({
		name: meta.series.max.name,
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
		lineWidth: 0,
		marker: { radius: 2 },
		states: { hover: { lineWidthPlus: 0 } },
		color: meta.series.min.colour,
		data: (data.min != undefined) ? ((data.min.min != undefined) ? data.min.min(meta, data).values : data.min(meta, data).values) : undefined ,
		visible: false,
		tooltip: { valueDecimals: meta.decimals },
		type: meta.series.min.type,
	}),
	extreme: (meta, data, k, s) => ({
		name: meta.series.extreme.name,
		lineWidth: 0,
		marker: { radius: 2 },
		states: { hover: { lineWidthPlus: 0 } },
		color: meta.series[s].colour,
		// data: (data.max != undefined) ? (data.max.max != undefined ? data.max.max(false).values : undefined) : data.total.max(false).values, 
		data: data.max(false).values,
		visible: false,
		tooltip: { valueDecimals: meta.decimals },
		type: meta.series[s].type,
	}),
	avg: (meta, data) => ({
		name: meta.series.avg.name,
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
		type: meta.series.diff.type,
		data: data.difference(),
		color: 'red',
		negativeColor: 'blue',
		visible: true,
		tooltip: { valueDecimals: meta.decimals },
	}),
	last: (meta, data) => ({
		name: meta.series.last.name,
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
		type: meta.series.diff.type,
		data: data.difference(),
		color: 'red',
		negativeColor: 'blue',
		visible: true,
		tooltip: { valueDecimals: meta.decimals },
	}),
	linjer: (meta, data) => ({
		name: meta.series.linjer.name,
		type: meta.series.linjer.typ,
		visible: false,
		tooltip: { valueDecimals: meta.decimals },
		showInLegend: false
	}),
	snow: (meta, data) => ({
		name: meta.series.snow.name,
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
		type: meta.series[k].type,
		color: meta.series[k].colour,
		opacity: 0.9,
		data: data[k].values,
		visible: k == "Torneträsk",
		tooltip: { valueDecimals: meta.decimals },
	}),
	period: (meta, p, type, k) => ({
		name: meta.series[k].name, 
		type: meta.series[k].type,
		lineWidth: 1,
		data: p[k].means.rotate(6).slice(2),
		visible: true,
		tooltip: { valueDecimals: meta.decimals },
	}),
	co2: (meta, data) => ({
		name: meta.series.co2.name,
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
