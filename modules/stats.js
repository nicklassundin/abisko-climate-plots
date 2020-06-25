
const help = require('./helpers.js');
const regression = require('regression')



var struct = {
	type: 'mean',
	meta: 		{
		fields: [],
		src: '',
	},
	values: 	[],
	x: 		undefined,
	y: 		undefined,
	count:		undefined,
	filter: function(f, type=this.type, abs = true){
		var value = [];
		if(this.values[0].filter && abs){
			this.values.forEach(entry => {
				value.push(entry.filter(f, type));
			})
			return value;

		}else{
			return f(this);
		}
		// return struct.create(value, this.x, this.meta.src ).build(type);
	},
	split: function(f){
		if(this.values[0].split){
			return struct.create(this.values.map(each => {
				return each.split(f);
			}), this.x, src)
		}else{
			return struct.create(f(this.values), this.x, src)	
		}
	},
	min: function(abs = true){
		if(this.values[0].filter){
			return struct.create(this.values.map(each => each.filter((entry) => {
				return {
					y: Math.min(...entry.values.map(each => each.y)),
					x: entry.x
				}
			}, 'min', abs))).build();
		}else{
			return struct.create(this.filter((entry) => {
				return {
					y: Math.min(...entry.values.map(each => each.y)),
					x: entry.x
				}
			}, 'min', abs)).build()
		}
	},
	max: function(abs = false){
		if(this.values[0].filter){
			return struct.create(this.values.map(each => each.filter((entry) => {
				return {
					y: Math.max(...entry.values.map(each => each.y)),
					x: entry.x
				}

			}, 'max', abs))).build()
		}else{
			return struct.create(this.filter((entry) => {
				return {
					y: Math.max(...entry.values.map(each => each.y)),
					x: entry.x
				}

			}, 'max', abs)).build()
		}
	},
	last: function(f = (e) => { return e.y <= 0 }, type=this.type){
		var res = this.filter((entry) => {
			var values = entry.values.filter(f);
			return {
				y: help.dayOfYear(new Date(Math.max(...Object.values(values).map(each => new Date(each.x).getTime())))),
				x: entry.x
			}
		})
		res.splice(-1, 1);
		return res;
	},
	first: function(f = (e) => { return e.y <= 0 }, type=this.type){
		var res = this.filter((entry) => {
			var values = entry.values.filter(f);
			return {
				y: help.dayOfYear(new Date(Math.min(...Object.values(values).map(each => new Date(each.x).getTime())))),
				x: entry.x
			}
		})
		res.shift();
		return res;
	},
	sequence: function(f=(e)=>{ return e < 0 }){
		var values = this.values.map(each => each.y)
		var max = [];
		var t = 0;
		values.forEach(e => {
			if( t > 0 && f(e)){
				max.push(t);
				t = 0;
			}else{
				t = t+1;
			}
		})
		max = max.map(each => ({
			x: this.x,
			y: each
		}))
		return struct.create(max,this.x).build('max')
	},
	variance: function(){
		switch(this.type){
			case "sum":
				return this.count*variance(this.values.map(each => each.y))	
				break;
			default:
				return variance(this.values.map(each => each.y))
		}
	},
	ci: function(){
		return help.confidenceInterval(this.y, this.variance(), this.count);
	},
	plotCI: function(){
		var result = [];
		var e = this.ci()
		var y = this.y;
		this.values.forEach(each => {
			if(each.ci) {
				e = each.ci();
				y = each.y
			}
			result.push({
				x: each.x,
				high: e.high+(each.y-y),
				low: e.low+(each.y-y),
			})
		})
		return result;
	},
	closest: function(date){
		const oneDay = 24 * 60 * 60 * 1000;
		var distance = new Array();
		this.values.forEach(each => {
			var temp = new Date(each.x);
			var end = new Date(temp.getYear() + 1900, 11, 31);
			var start = new Date(temp.getYear() + 1900, 0, 1);
			var days = Math.round(Math.abs((start - end) / oneDay));
			var degree = 360 / days;
			date = new Date(temp.getYear() + 1900, date.getMonth(), date.getDate())
			var dis = Math.round(Math.abs((date - temp) / oneDay));
			var degrees = dis * degree;
			// if(degrees > 180) degrees = 360 - degrees;
			distance.push(Math.round(degrees / degree));
		})
		var min = Math.min.apply(null, distance);
		// console.log(distance)
		var values = this.values;
		var result = {
			data: undefined,
			interval: {
				y: {
					hi: undefined,
					lo: undefined
				}
			}
		}
		distance.forEach(function(value, index){
			if(value == min){
				result.data = values[index]; 
			}
		})
		return result
	},
	movAvg: undefined,
	plotMovAvg: function(){
		if(this.movAvg!=undefined) return this.movAvg
		var movAvg = movingAverages(this.values.map(each => each.y), 10);
		var result = [];
		var variance = this.variance();
		var count = this.count;
		this.values.forEach((each, index) => {
			if(each.variance) variance = each.variance();
			if(each.count) count = each.count;
			var e = help.confidenceInterval(movAvg[index], variance, count);
			result.push({
				y: movAvg[index],
				x: each.x,
				high: e.high,
				low: e.low,
			})
		})
		return result.slice(10);
	},
	plotMovAvgCI: function(){
		if(this.movAvg==undefined) this.movAvg = this.plotMovAvg();
		return this.movAvg;				
	},
	linReg: function(){
		var result = regression.linear(this.values.map((each,index) => [index, each.y]))	
		result.linReg.points = values.map((each, index) => ([each.x, result.linReg.points[index][1]]))
		return result; 
	},
	difference: function(lower=baselineLower, upper=baselineUpper){
		// console.log([lower, upper])
		var basevalue = help.mean(this.values.filter(value => 
			(value.x >= lower && value.x <= upper)).map(each => each.y))
		return Array.from(this.values.map(each => ([each.x, each.y - basevalue])))
	},
	build: function(type=this.type, lower=baselineLower, upper=baselineUpper){
		var result = this;
		result.type = type;
		var values = result.values.filter(entry => (!isNaN(entry.y) || $.isNumeric(entry.y)));
		// this.values = this.values.map(each => {
		// if(each.build){
		// return each.build(type, lower, upper);
		// }else{
		// return each;
		// }
		// })
		result.values = values;
		var count = values.length;

		var y;
		if(result.y == undefined){
			switch(type){
				case "mean":
					y = help.sum(values.map(each => each.y));
					y = y/count;
					break;
				case "max":
					y = Math.max(...values.map(each => each.y));
					break;
				case "min":
					y = Math.min(...values.map(each => each.y));
					break;
				case "sum":
					y = help.sum(values.map(each => each.y));
					break;
				default:
					console.log("default: "+type)

			}
			result.y = y;
		}

		result.count = count;
		// result.linReg = regression.linear(values.map((each,index) => [index, each.y]))
		// result.linReg.points = values.map((each, index) => ([each.x, result.linReg.points[index][1]]))
		return result;
	},
	clone: function(){
		return Object.assign({values: []},this);
	},
	create: function(values, x=undefined, src=''){
		var result = struct.clone();
		result.meta.src = src;
		try{
			values = values.filter(entry => !isNaN(entry.y) && $.isNumeric(entry.y));
		}catch(err){
			return undefined;
		}
		result.values = values.filter(each => each.y || each.y == 0);
		result.x = x;
		return result;
	},
	map: function(F){
		return struct.create(F(this.values), this.x);	
	},
};
exports.struct = struct;

var parseByDate = function (values, type='mean', src='', custom) {
	// console.log(values)
	var keys = Object.keys(values[0])
	var frame = {
		weeks: {},
		yrly: {},
		yrlyFull: {},
		yrlySplit: {},
		decades: {},
		monthly: {},
		weekly: {},
		spring: {},
		summer: {},
		autumn: {},
		winter: {},
		customPeriod: {},
		meta: {
			src: src,
		}
	}
	const data = {
		weeks: {},
		yrly: {},
		yrlyFull: {},
		yrlySplit: {},
		decades: {},
		monthly: {},
		weekly: {},
		spring: {},
		summer: {}, 
		autumn: {},
		winter: {},	
		customPeriod: {},
		meta: {
			src: src,
		},
		insert: function(entries){
			var result = Object.assign({}, frame);
			// TODO build to general function to be use for all functions
			var set = function(entry, key, date, year, month, week){
				// console.log(entry)
				var decade = year - year % 10;
				if(!result.yrly) result.yrly = {};
				if(!result.yrly[key]) result.yrly[key] = {};
				if(!result.yrly[key][year]){
					const cont = struct.create([],year,type);
					result.yrly[key][year] = cont;
				}
				result.yrly[key][year].values.push(entry);

				// split year over 6 month
				var splitYear = year;
				if(help.isFirstHalfYear(month)){
					splitYear = year - 1;	
				}	
				if(!result.yrlySplit) result.yrlySplit = {};
				if(!result.yrlySplit[key]) result.yrlySplit[key] = {}
				if(!result.yrlySplit[key][splitYear]){
					const cont = struct.create([], splitYear, type);
					result.yrlySplit[key][splitYear] = cont;
				}
				result.yrlySplit[key][splitYear].values.push(entry);

				var season = help.getSeasonByIndex(month-1);
				if(!result[season]) result[season] = {};
				if(!result[season][key]) result[season][key] = {};
				if(!result[season][key][year]){
					const cont = struct.create([],year, type);
					result[season][key][year] = cont; 
				} 
				result[season][key][year].values.push(entry);
				// Yearly Full split over winter
				if(!result.yrlyFull) result.yrlyFull = {}
				if(!result.yrlyFull[decade]) result.yrlyFull[decade] = {}
				if(!result.yrlyFull[decade][key]) result.yrlyFull[decade][key] = {}
				if(!result.yrlyFull[decade][key][month]){
					const cont = struct.create([],month, type);
					result.yrlyFull[decade][key][month] = cont;
				} 
				result.yrlyFull[decade][key][month].values.push(entry);

				// Monthly
				if(!result.monthly) result.monthly = {}
				if(!result.monthly[month]) result.monthly[month] = {}
				if(!result.monthly[month][key]) result.monthly[month][key] = {}
				if(!result.monthly[month][key][year]){
					const cont = struct.create([],year, type);
					result.monthly[month][key][year] = cont;
				} 
				result.monthly[month][key][year].values.push(entry);
				// Weekly
				if(!result.weekly) result.weekly = {};
				if(!result.weekly[year]) result.weekly[year] = {};
				if(!result.weekly[year][key]) result.weekly[year][key] = {}; 
				if(!result.weekly[year][key][week]) result.weekly[year][key][week] = struct.create([],week,type);
				result.weekly[year][key][week].values.push(entry);
				// Week
				if(!result.weeks) result.weeks = {};
				if(!result.weeks[key]) result.weeks[key] = {};
				if(!result.weeks[key][year]) result.weeks[key][year] = {}; 
				if(!result.weeks[key][year][week]){
					const cont = struct.create([], week, type);
					result.weeks[key][year][week] = cont;
				} 
				result.weeks[key][year][week].values.push(entry);
				// Decades
				if(!result.decades) result.decades = {};
				if(!result.decades[key]) result.decades[key] = {};
				if(!result.decades[key][decade]) result.decades[key][decade] = struct.create([],decade,type);
				result.decades[key][decade].values.push(entry);

				// custom period
				if(custom){
					if(!result.customPeriod) result.customPeriod = {};
					if(!result.customPeriod[key]) result.customPeriod[key] = {};
					var pkey = custom(date);
					if(pkey) {
						if(!result.customPeriod[key][pkey]) result.customPeriod[key][pkey] = struct.create([],pkey,type);
						result.customPeriod[key][pkey].values.push(entry);
					}
				}

				return result;					
			}
			var years = []
			var build = function(entries){
				var values = {};
				entries.forEach(entry => {
					var date = undefined; 
					keys.forEach(key => {
						// console.log(entry(key).x)
						var date = new Date(entry[key].x);
						var year = date.getFullYear();
						// console.log(year)
						var month = date.getMonth()+1;
						var week = date.getWeekNumber();
						if(!years[year+'']) years[year] = year+'';

						values = set(entry[key], key, date, year, month, week);
					})
				})
				var construct = function(bValues, x){
					const str = [];

					try{
						Object.keys(bValues).forEach(key => {
							const entry = bValues[key];
							if(entry.build){
								str.push(entry.build(type))	
							}else{
								str.push(construct(entry, parseInt(key)))
							}
						})
						return struct.create(str, x).build(type);
					}catch(error){
						console.log(bValues)
						console.log(str)
						console.log(x)
						console.log(struct.create(str, x))
						throw error
					}
				}
				// console.log(values.decades)
				Object.keys(frame).forEach(key => {
					switch(key){
						case 'monthly':
							Object.keys(values[key]).forEach(month => {
								keys.forEach(tkey => {
									values[key][month][tkey] = construct(values[key][month][tkey], parseInt(month))
								})
							})
							break;
						case 'weekly':
							Object.keys(values[key]).forEach(year => {
								keys.forEach(tkey => {
									values[key][year][tkey] = construct(values[key][year][tkey], parseInt(year));
								})
							})
							break;
						case 'weeks':
							// TODO
							keys.forEach(tkey => {
								// console.log(key)
								// console.log(tkey)
								// console.log(values[key][tkey])
								values[key][tkey] = construct(values[key][tkey])
							})
							break;
						case 'yrly':
							keys.forEach(tkey => {
								values[key][tkey] = construct(values[key][tkey])
							})
							break;
						case 'yrlyFull': 
							Object.keys(values[key]).forEach(year => {
								keys.forEach(tkey => {
									values[key][year][tkey] = construct(values[key][year][tkey], parseInt(year));
								})
							})
							break;
						case 'yrlySplit':
							keys.forEach(tkey => {
								values[key][tkey] = construct(values[key][tkey])
							})
							break;
						case 'decades':
							Object.keys(values[key]).forEach(tkey => {
								values[key][tkey] = struct.create(Object.keys(values[key][tkey]).map(decade => {
									return values[key][tkey][decade] = values[key][tkey][decade].build(type);
								})).build(type);
							}) 
							break;
						case 'customPeriod': 
							Object.keys(values[key]).forEach(tkey => {
								values[key][tkey] = struct.create(Object.keys(values[key][tkey]).map(decade => {
									return values[key][tkey][decade] = values[key][tkey][decade].build(type);
								})).build(type);
							})
							break;
						case 'meta':
							break;
						default:
							keys.forEach(tkey => {
								if(values[key][tkey]){
									values[key][tkey] = construct(values[key][tkey], help.seasons[key])
								}
							})
							break;
					}
				})
				return values
			}
			var answer = build(entries);
			return answer
		}
	}
	return data.insert(values);
}
var byDate = parseByDate;


exports.parsers = {
	CALM: function(result, src=''){
		return new Promise(function(resolve, reject){
			result = result[0];
			var fields = result.meta.fields;
			fields.shift()
			var data = result.data;
			data.splice(0,4)
			var stations = { avg: {} };

			data.forEach(function(each){
				Object.keys(each).forEach(key => {
					if(key != ""){
						if(!stations[key]){
							stations[key] = [];
						}
						var entry = {
							x: Number(each[""]),
							y: !Number.isNaN(Number(each[key])) ? Number(each[key]) : undefined 
						}
						stations[key].push(entry)
						if(!stations['avg'][each[""]]){
							stations['avg'][each[""]] = [];
						}
						if(entry.y){
							stations['avg'][each[""]].push({
								x: Number(each[""]),
								y: !Number.isNaN(Number(each[key])) ? Number(each[key]) : undefined 
							})
						}
					}
				})
			})

			stations['avg'] = Object.keys(stations['avg']).map(year => ({
				x: Number(year),
				y: (stations['avg'][year].map(each => each.y)).reduce((a, b) => a + b, 0)/stations['avg'][year].length
			}))
			Object.keys(stations).forEach(key => {
				stations[key] = struct.create(stations[key]).build()
			})
			resolve(stations)
		})
	},
	SCRIPPS_CO2: function(result, src=''){
		// TODO
		return new Promise(function(resolve, reject){
			result = result[0];
			var parse = function(entry){
				var x = (new Date(entry[0])).getTime();
				var y = parseFloat(entry[1]);
				return {
					x: x,
					y: y,
				}
			}
			var data = struct;
			data.values = Object.values(result.data.slice(44).map(each => parse(each)));
			resolve({
				weekly: data.build()
			})
		})
	},
	GISSTEMP: function (result, src='') {
		return new Promise(function(resolve, reject){
			result = result[0];
			var fields = result.meta.fields;
			var meta = preSetMeta['default'];
			meta.src = src;
			var temperatures = [];
			console.log(result)


			result.data.forEach((row) => {
				var year = {};

				fields.forEach(field => year[field.toLowerCase()] = help.validNumber(row[field]));

				var monthlyTemperatures = months().map(month => year[month]).filter(Number);		
				// console.log(row)
				year.min = Math.min.apply(null, monthlyTemperatures);
				year.max = Math.max.apply(null, monthlyTemperatures);
				year.count = monthlyTemperatures.length;

				if (year.count > 0) {
					year.avg = help.mean(monthlyTemperatures);

					year.variance = 0;

					if (year.count > 1) {
						year.variance = variance(monthlyTemperatures);
					}

					year.ci = help.confidenceInterval(year.avg, year.variance, year.count);

					temperatures.push(year);
				}
			});
			temperatures = temperatures.slice(33);
			['min', 'max', 'avg'].forEach((statistic) => {
				temperatures[statistic] = temperatures.map(temps => ({
					x: temps.year,
					y: temps[statistic],
				}));
			});
			temperatures.movAvg = movingAverages(temperatures.map(temps => temps.avg), 10)
				.map((avg, index) => ({
					x: temperatures[index].year,
					y: avg,
				}));

			temperatures.ci = temperatures.map(temps => ({
				x: temps.year,
				low: temps.ci.low,
				high: temps.ci.high,
			}));

			temperatures.ciMovAvg = temperatures.ci.map(each => ({ x: each.x }));

			['low', 'high'].forEach((bound) => {
				movingAverages(temperatures.ci.map(each => each[bound]), 10)
					.forEach((value, index) => temperatures.ciMovAvg[index][bound] = value);
			});
			temperatures.meta = meta;
			temperatures.src = src;
			temperatures.ciMovAvg = temperatures.ciMovAvg.slice(10);
			resolve(temperatures)
		})
	},
	GISSTEMPzonalMeans: function (result, src='') {
		return new Promise(function(resolve, reject){
			result = result[0]
			var fields = result.meta.fields.map((each) => (each));
			var keys = fields.slice(0);
			var year = keys.shift();
			var data = result.data;
			var build = function(key){
				var str = struct.create;
				return struct.create(data.map(each => ({
					x: each['Year'],
					y: each[key],
				}))).build()
			}
			temperatures = {
				'64n-90n': build('64N-90N'),
				'nhem': build('NHem'),
				'glob': build('Glob') 
			}
			temperatures.src = src;
			// console.log(tempe ratures)
			resolve(temperatures)
		})
	},
	AbiskoCsv: function (result, src='') {
		return new Promise(function(resolve, reject){
			var blocks = { precipitation: [], temperatures: [] };
			var parseEntry = function(y){
				if(y != undefined){
					y = parseFloat(y.replace(",","."));
				}else{
					y = undefined;
				}
				return y;
			}

			var insertToBlocks = function(data){
				try{
					data.forEach(entry => {
						var zero = 0;
						var date = entry.date; 
						var avg = entry.avg;
						var min = entry.min;
						var max = entry.max;
						var total = entry.total; 
						if(total==undefined) zero = undefined
						blocks.temperatures.push({
							avg:{
								x: date,
								y: avg, 
							},
							min: {
								x: date,
								y: min
							}, 
							max: {
								x: date,
								y: max
							},

						});
						blocks.precipitation.push({

							total: {
								x: date,
								y: total, 
							},
							snow: {
								x: date,
								y: (avg < 0) ? total : zero
							},
							rain: {
								x: date,
								y: (avg >= 0) ? total : zero
							}
						});
					})
				}catch(e){
					console.log(data)
				}
			}
			insertToBlocks(result[0].data.map(entry => ({
				date: entry['Time'],
				avg: parseEntry(entry['Temp_avg']),
				total: parseEntry(entry['Precipitation']),
				min: parseEntry(entry['Temp_min']),
				max: parseEntry(entry['Temp_max'])
			})))
			var res = {};
			result[2].data.forEach(entry => {
				res[entry['Time']] = entry['Precipitation']
			})
			insertToBlocks(result[1].data.map(entry => ({
				date: entry['Time(UTC)'],
				avg: parseEntry(entry['AirTemperature (°C)']),
				total: parseEntry(res[entry['Time(UTC)']]),
				min: parseEntry(entry['Minimim_AirTemperature']),
				max: parseEntry(entry['Maximum_AirTemperature'])
			})));
			blocks.temperatures = parseByDate(blocks.temperatures);
			blocks.precipitation = parseByDate(blocks.precipitation, 'sum');
			blocks.growingSeason = struct.create(Object.keys(blocks.temperatures.weekly).map(year =>  blocks.temperatures.weekly[year].avg.sequence())).build();
			blocks.growingSeasonDays = struct.create(Object.keys(blocks.temperatures.yrly.avg.values).map(year =>  blocks.temperatures.yrly.avg.values[year].sequence())).build();
			parseAbiskoCached = blocks
			// console.log(blocks)
			resolve(blocks)
		})
	},
	AbiskoIceData: function (result, src='') {
		return new Promise(function(resolve, reject){
			result = result[0]
			var fields = result.meta.fields;
			var data = result.data;
			// console.log(data)
			var iceData = [];
			data.forEach((row) => {
				function isLeapYear(year) {
					return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
				}
				// console.log(row)
				var winterYear = +row[fields[0]] || undefined;
				var springYear = +row[fields[1]] || undefined;
				var freezeDate = help.parseDate(row[fields[2]]);
				var freezeWeek = freezeDate.year > 0 ? help.weekNumber(help.createDate(freezeDate)) : null;
				var freezeDOY = freezeDate.year > 0 ? help.dayOfYear(help.createDate(freezeDate)) : null
				var breakupDate = help.parseDate(row[fields[3]]);
				var breakupWeek = breakupDate.year > 0 ? help.weekNumber(help.createDate(breakupDate)) : null;
				var breakupDOY = breakupDate.year > 0 ? help.dayOfYear(help.createDate(breakupDate)) : null
				var iceTime = help.validNumber(row[fields[4]]) || null;

				var yearDays = (isLeapYear(freezeDate.year) ? 366 : 365);
				if (springYear) {
					iceData[springYear] = {
						breakupDate: breakupDate.year > 0 ? help.createDate(breakupDate) : null,
						breakupDOY: breakupDOY,
						breakupWeek,
						freezeDate: freezeDate.year > 0 ? help.createDate(freezeDate) : null,
						freezeDOY: freezeDOY + (freezeDOY < breakupDOY ? yearDays : 0),
						// freezeDOY: freezeDOY,
						// freezeWeek: freezeWeek + (freezeWeek < breakupWeek ? 52 : 0),
						freezeWeek: freezeWeek,
						iceTime,
					};
				}
			});

			var yearly = (statistic) => iceData.map((each, year) => ({
				x: +year,
				y: each[statistic],
			})).filter(each => each.y).filter(each => each.x >= 1909);

			var dateFormat = date => (date.getFullYear() + ' ' + help.monthName(help.monthByIndex(date.getMonth())) + ' ' + date.getDate());

			var breakupDOY = struct.create(iceData.map((each, year) => ({
				x: +year,
				y: each.breakupDOY,
				name: each.breakupDate ? dateFormat(each.breakupDate) : null,
				week: each.breakupDate ? help.weekNumber(each.breakupDate) : null,
				date: each.breakupDate,
			})).filter(each => each.y).filter(each => each.x >= 1909).filter(each => each.name != null)).build();

			var freezeDOY = struct.create(iceData.map((each, year) => ({
				x: +year,
				y: each.freezeDOY,
				name: each.freezeDate ? dateFormat(each.freezeDate) : null,
				week: each.freezeDate ? help.weekNumber(each.freezeDate) : null,
				date: each.freezeDate,
			})).filter(each => each.y).filter(each => each.x >= 1909).filter(each => each.name != null)).build();
			var breakup = {
				week: breakupDOY.map(each => ({
					x: each.x,
					y: each.date, 
					name: each.name,
				})),
				date: breakupDOY.map(each => ({
					x: each.x,
					y: each.date,
					name: each.name,
				}))
			}


			var freeze = {
				week: freezeDOY.map(each => {
					var weekNo = help.weekNumber(help.dateFromDayOfYear(each.x, each.y));
					return {
						x: each.x,
						y: weekNo + (weekNo < 10 ? 52 : 0),
						name: each.name,
					}
				}),
				date: freezeDOY.map(each => ({
					x: each.x,
					y: each.date, 
					name: each.name,
				}))
			}
			var calculateMovingAverages = (values) => movingAverages(values.map(v => v.y), 10).map((avg, i) => ({
				x: values[i].x, 
				y: avg,
			}))


			var iceTime = struct.create(yearly('iceTime')).build();

			// equal weighted confidence interval
			// var equal_weight = help.confidenceInterval_EQ_ND(iceTime, 10)	

			// var iceTimeMovAvgVar = equal_weight.movAvgVar;
			// var iceTimeCIMovAvg = equal_weight.ciMovAvg;
			// var iceTimeLinear = help.linearRegression(iceTime.map(w => w.x), iceTime.map(w => w.y));
			// var iceTimeMovAvgLinear = help.linearRegression(iceTimeMovAvg.map(w => w.x), iceTimeMovAvg.map(w => w.y));

			var yearMax = iceData.length - 1;
			// console.log(data);
			// console.log(breakup);

			resolve({
				src: src,
				yearMax,
				breakup,
				freeze,
				DOY: {
					breakup: breakupDOY,
					freeze: freezeDOY,
				},
				iceTime,
			})
		})
	},
	AbiskoLakeThickness: function(result, src=''){
		return new Promise(function(resolve, reject){
			var data = result[0].data;
			var rawData = new Array();
			data.forEach(each => {
				var res = {
					y: Number(each['Hela istäcket']),
					x: each['Datum']
				}
				rawData.push(res)
			})
			data = rawData.map(each => {
				var temp = {
					'total': each
				}
				return temp;
			})
			var parseData = parseByDate(data)
			yrly = parseData.yrlySplit;
			// console.log(yrly)
			var dateSelect = function(date){
				var close = new Array();
				yrly.total.values.forEach(each => {
					var res = each.closest(date);
					var resDate = new Date(res.data.x);
					var xYear = resDate.getFullYear();
					if(help.isFirstHalfYear(resDate.getMonth()+1)){
						xYear = xYear - 1;
					}
					close.push({ 
						x: xYear, 
						y: res.data.y,
						date: res.data.x
					})
				})
				return struct.create(close).build(); 
			}
			resolve({'yrly': yrly, 'date': dateSelect })
		})
	},
	AbiskoSnowData: function (result, src='') {
		return new Promise(function(resolve, reject){
			result = result[0];
			var data = result.data;
			var fields = result.meta.fields;
			var periods = [
				//{ start: 1913, end: 1930 },
				{ start: 1931, end: 1960 },
				{ start: 1961, end: 1990 },
				{ start: 1991, end: Infinity },
				{ start: -Infinity, end: Infinity },
			];

			var decades = [
				//{ start: 1931, end: 1940, },
				//{ start: 1941, end: 1950, },
				//{ start: 1951, end: 1960, },
				{ start: 1961, end: 1970, },
				{ start: 1971, end: 1980, },
				{ start: 1981, end: 1990, },
				{ start: 1991, end: 2000, },
				{ start: 2001, end: 2010, },
				{ start: 2011, end: Infinity },
				{ start: -Infinity, end: Infinity }, // entire period
			];

			var snow = [];

			var all = {
				singleStake: [],
			};
			data.forEach((row) => {
				var date = help.parseDate(row[fields[0]]);
				var depthSingleStake = help.validNumber(row[fields[1]]);
				if (date.year && depthSingleStake) {
					all.singleStake.push({
						avg: {
							y: depthSingleStake,
							x: row[fields[0]] 
						}
					})
					var year = snow[date.year] = snow[date.year] || [];
					var month = year[date.month] = year[date.month] || { sum: 0, count: 0 };
					month.sum += depthSingleStake;
					month.count++;
				}
			});

			all.singleStake = parseByDate(all.singleStake);
			snow.forEach((year) => {
				for (var i = 1; i <= 12; i++) {
					var m = year[i];
					year[i] = m ? m.sum / m.count : null;
				}
			});


			var periodMeans = {};
			var decadeMeans = {};

			var calculateMeans = (periods, periodMeans) => {
				periods.forEach((period) => {
					var key = period.start === -Infinity ? 'allTime' : period.start.toString();
					var means = periodMeans[key] = {
						period,
						means: [],
					};
					means.period.toString = () => {
						var start = means.period.start,
							end = means.period.end;
						if (key === 'allTime') return 'Entire period';
						return 'From ' + start + ' to ' + (end === Infinity ? 'present' : end);
					};
					snow.filter((_, year) => year >= period.start && year <= period.end).forEach((year) => {
						year.forEach((depth, month) => {
							if (depth) {
								var m = means.means[month - 1] = means.means[month - 1] || { sum: 0, count: 0 };
								m.sum += depth;
								m.count++;
							}
						});
					});
					for (var i = 0; i < 12; i++) {
						var m = means.means[i];
						means.means[i] = m ? m.sum / m.count : NaN;
					}
				});
			};

			calculateMeans(periods, periodMeans);
			calculateMeans(decades, decadeMeans);
			// console.log({periodMeans, decadeMeans})
			AbiskoSnowCached = {src: src, periodMeans, decadeMeans,}
			resolve({
				src: src,
				periodMeans,
				decadeMeans,
				snowDepth: all
			})
		})
	},
	smhiTemp: function(result, src=''){
		return new Promise(function(resolve, reject){
			var avgs = {};
			var parse = function(entry){
				var x = entry[0];
				var y = parseFloat(entry[1]);
				avgs[x] = y;
				return {
					avg: {
						x: x,
						y: y,
					},
					max: {
						x: x,
						y: y,
					},
					min: {
						x: x,
						y: y,
					},
				}
			}
			var temperature = Object.values(result[0].data.map(each => {
				var temp = [each["Representativt dygn"], each["Lufttemperatur"]]
				return parse(temp);
			}));
			var parsePrecip = function(entry){
				// var x = (new Date(entry[0])).getTime();
				var total = parseFloat(entry[1]);
				var zero = 0;
				var date = entry[0];
				if(total==undefined) zero = undefined;
				var avg = avgs[date];
				return {
					total: {
						x: date,
						y: total,
					},
					snow: {
						x: date,
						y: (avg < 0) ? total : zero,
					},
					rain: {
						x: date,
						y: (avg >= 0) ? total : zero,
					},
				}
			}
			var precipitation = Object.values(result[1].data.map(each => {
				var prec = [each["Representativt dygn"], each["Nederbördsmängd"]]
				return parsePrecip(prec);
			}));
			var blocks = {};
			blocks.precipitation = parseByDate(precipitation, 'sum');
			blocks.temperatures = parseByDate(temperature);
			resolve({
				precipitation: blocks.precipitation,
				temperatures: blocks.temperatures,
				growingSeason: struct.create(Object.keys(blocks.temperatures.weekly).map(year =>  blocks.temperatures.weekly[year].avg.sequence())).build()
			})
		})

	}

}
