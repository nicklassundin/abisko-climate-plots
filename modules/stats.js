
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
	filter:		function(f, type=this.type){
		var value = [];
		if(this.values[0].filter){
			this.values.forEach(entry => {
				value.push(entry.filter(f, type));
			})
			return value;

		}else{
			return  {
				y: f(...this.values.map(each => each.y)),
				x: this.x,
			}

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
	min: function(){
		return this.filter(Math.min, 'min');
	},
	max: function(){
		return this.filter(Math.max, 'max');
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
	linReg: 	undefined,
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
		if(result.y==undefined){
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
		result.linReg = regression.linear(values.map((each,index) => [index, each.y]))
		result.linReg.points = values.map((each, index) => ([each.x, result.linReg.points[index][1]]))
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
		result.values = values.filter(each => each.y);
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
		decades: {},
		monthly: {},
		weekly: {},
		summer: {}, 
		winter: {},
		customPeriod: {},
		meta: {
			src: src,
		}
	}
	const data = {
		weeks: {},
		yrly: {},
		decades: {},
		monthly: {},
		weekly: {},
		summer: {}, 
		winter: {},	
		customPeriod: {},
		meta: {
			src: src,
		},
		insert: function(entries){
			var result = Object.assign({}, frame);
			// TODO build to general function to be use for all functions
			var set = function(entry, key, date, year, month, week){
				var decade = year - year % 10;
				if(!result.yrly) result.yrly = {};
				if(!result.yrly[key]) result.yrly[key] = {};
				if(!result.yrly[key][year]){
					const cont = struct.create([],year,type);
					result.yrly[key][year] = cont;
				}
				result.yrly[key][year].values.push(entry);

				if(help.isSummerMonthByIndex(month)) {
					if(!result.summer) result.summer = {};
					if(!result.summer[key]) result.summer[key] = {};
					if(!result.summer[key][year]){
						const cont = struct.create([],year, type);
						result.summer[key][year] = cont; 
					} 
					result.summer[key][year].values.push(entry);
				}
				if(help.isWinterMonthByIndex(month)) {
					if(!result.winter) result.winter = {};
					if(!result.winter[key]) result.winter[key] = {};
					if(!result.winter[key][year]){
						const cont = struct.create([],year, type);
						result.winter[key][year] = cont;
					}
					result.winter[key][year].values.push(entry);
				}


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
					keys.forEach(key => {
						var date = new Date(entry[key].x);
						var year = date.getFullYear();
						var month = date.getMonth()+1;
						var week = date.getWeekNumber();
						if(!years[year+'']) years[year] = year+'';

						values = set(entry[key], key, date, year, month, week);
					})
				})
				var construct = function(entries, x){
					const str = [];
					// console.log(entries)
					Object.keys(entries).forEach(key => {
						const entry = entries[key];
						str.push(entry.build(type))		
					})
					return struct.create(str, x).build(type);
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
						case 'yrly':
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
						case 'summer':
							keys.forEach(tkey => {
								values[key][tkey] = construct(values[key][tkey])
							})
							break;
						case 'winter':
							keys.forEach(tkey => {
								values[key][tkey] = construct(values[key][tkey])
							})
							break;
						default:
					}
				})
				return values
			}
			var answer = build(entries);
			return answer
		}
	}

	var respons = data.insert(values);
	//console.log("resolved Abisko");
	//console.log(respons)
	parseAbiskoCached = respons;
	return respons
}
var byDate = parseByDate;


exports.parsers = {
	CALM: function(result, src=''){
		result = result[0];
		var fields = result.meta.fields;
		fields.shift()
		var data = result.data;
		data.splice(0,4)
		data = data.map(function(each){
			each = Object.keys(each).map(key => each[key]);
			var x = parseInt(each.shift());
			var y = help.mean(each.map(each => parseFloat(each)).filter(function(value){
				return !Number.isNaN(value)
			}));
			return {
				x,
				y,
			}
		})
		return new Promise(function(resolve, reject){
			resolve(data)
		})
	},
	SCRIPPS_CO2: function(result, src=''){
		// TODO
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
		return new Promise(function(resolve, reject){
			resolve({
				weekly: data.build()
			})
		})
	},
	GISSTEMP: function (result, src='') {
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
		return new Promise(function(resolve, reject){
			resolve(temperatures)
		})
	},
	GISSTEMPzonalMeans: function (result, src='') {
		// console.log(result)
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
		return new Promise(function(resolve, reject){
			resolve(temperatures)
		})
	},
	AbiskoCsv: function (result, src='') {
		result = result[0]
		var blocks = { precipitation: [], temperatures: [] };
		result.data.forEach(entry => {
			var parseEntry = function(y){
				if(y != undefined){
					y = parseFloat(y.replace(",","."));
				}else{
					y = undefined;
				}
				return y;
			}
			var zero = 0;
			var date = entry['Time'];
			var avg = parseEntry(entry['Temp_avg']);
			var total =parseEntry(entry['Precipitation']);
			if(total==undefined) zero = undefined

			blocks.temperatures.push({
				avg:{
					x: date,
					y: avg, 
				},
				min: {
					x: date,
					y: parseEntry(entry['Temp_min']),
				}, 
				max: {
					x: date,
					y: parseEntry(entry['Temp_max']),
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
		blocks.temperatures = parseByDate(blocks.temperatures);
		blocks.precipitation = parseByDate(blocks.precipitation, 'sum');
		blocks.growingSeason = struct.create(Object.keys(blocks.temperatures.weekly).map(year =>  blocks.temperatures.weekly[year].avg.sequence())).build();

		parseAbiskoCached = blocks
		return new Promise(function(resolve, reject){
			resolve(blocks)
		})
	},
	AbiskoIceData: function (result, src='') {
		result = result[0]
		var fields = result.meta.fields;
		var data = result.data;
		// console.log(data)
		var iceData = [];
		data.forEach((row) => {
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

			if (springYear) {
				iceData[springYear] = {
					breakupDate: breakupDate.year > 0 ? help.createDate(breakupDate) : null,
					breakupDOY,
					breakupWeek,
					freezeDate: freezeDate.year > 0 ? help.createDate(freezeDate) : null,
					freezeDOY: freezeDOY + (freezeDOY < 50 ? 365 : 0),
					freezeWeek: freezeWeek + (freezeWeek < 20 ? 52 : 0),
					iceTime,
				};
			}
		});

		var yearly = (statistic) => iceData.map((each, year) => ({
			x: +year,
			y: each[statistic],
		})).filter(each => each.y).filter(each => each.x >= 1909);

		var dateFormat = date => date.getFullYear() + ' ' + help.monthName(help.monthByIndex(date.getMonth())) + ' ' + (+date.getDay() + 1);

		var breakupDOY = iceData.map((each, year) => ({
			x: +year,
			y: each.breakupDOY,
			name: each.breakupDate ? dateFormat(each.breakupDate) : null,
			week: each.breakupDate ? help.weekNumber(each.breakupDate) : null,
		})).filter(each => each.y).filter(each => each.x >= 1909).filter(each => each.name != null);
		// var breakupVar = variance(breakupDOY.map(each=>each.y));

		var freezeDOY = iceData.map((each, year) => ({
			x: +year,
			y: each.freezeDOY,
			name: each.freezeDate ? dateFormat(each.freezeDate) : null,
			week: each.freezeDate ? help.weekNumber(each.freezeDate) : null,
		})).filter(each => each.y).filter(each => each.x >= 1909).filter(each => each.name != null);
		// var freezeVar = variance(freezeDOY.map(each=>each.y));

		// console.log(breakupDOY);
		// console.log(freezeDOY);
		var breakupLinear = help.linearRegression(breakupDOY.map(w => w.x), breakupDOY.map(w => w.y));
		var freezeLinear = help.linearRegression(freezeDOY.map(w => w.x), freezeDOY.map(w => w.y));

		var breakup = breakupDOY.map(each => ({
			x: each.x,
			y: help.weekNumber(help.dateFromDayOfYear(each.x, each.y)),
			name: each.name,
		}));

		var freeze = freezeDOY.map(each => {
			var weekNo = help.weekNumber(help.dateFromDayOfYear(each.x, each.y));
			return {
				x: each.x,
				y: weekNo + (weekNo < 10 ? 52 : 0),
				name: each.name,
			}
		});
		var calculateMovingAverages = (values) => movingAverages(values.map(v => v.y), 10).map((avg, i) => ({
			x: values[i].x, 
			y: avg,
		}))


		var iceTime = yearly('iceTime');

		// equal weighted confidence interval
		var equal_weight = help.confidenceInterval_EQ_ND(iceTime, 10)	

		var iceTimeMovAvg = equal_weight.movAvg;
		var iceTimeMovAvgVar = equal_weight.movAvgVar;
		var iceTimeCIMovAvg = equal_weight.ciMovAvg;
		var iceTimeLinear = help.linearRegression(iceTime.map(w => w.x), iceTime.map(w => w.y));
		var iceTimeMovAvgLinear = help.linearRegression(iceTimeMovAvg.map(w => w.x), iceTimeMovAvg.map(w => w.y));

		var yearMax = iceData.length - 1;
		// console.log(data);
		// console.log(breakup);
		return new Promise(function(resolve, reject){

		resolve({
			src: src,
			yearMax,
			breakupDOY,
			breakup,
			freezeDOY,
			freeze,
			iceTime,
			iceTimeMovAvg: iceTimeMovAvg.slice(10),
			iceTimeCIMovAvg: iceTimeCIMovAvg.slice(10),
			breakupLinear: [
				{ x: 1915, y: help.weekNumber(help.dateFromDayOfYear(1915, Math.round(breakupLinear(1915)))) },
				{ x: yearMax, y: help.weekNumber(help.dateFromDayOfYear(yearMax, Math.round(breakupLinear(yearMax)))) }
			],
			freezeLinear: [
				{ x: 1909, y: help.weekNumber(help.dateFromDayOfYear(1909, Math.round(freezeLinear(1909)))) },
				{ x: yearMax, y: help.weekNumber(help.dateFromDayOfYear(yearMax, Math.round(freezeLinear(yearMax)))) }
			],
			iceTimeLinear: [
				{ x: 1915, y: iceTimeLinear(1915) },
				{ x: yearMax, y: iceTimeLinear(yearMax) }
			],
			iceTimeMovAvgLinear: [
				{ x: 1925, y: iceTimeMovAvgLinear(1925) },
				{ x: yearMax, y: iceTimeMovAvgLinear(yearMax) }
			],
		})
		})
	},
	AbiskoSnowData: function (result, src='') {
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

		data.forEach((row) => {
			var date = help.parseDate(row[fields[0]]);
			var depthSingleStake = help.validNumber(row[fields[1]]);
			if (date.year && depthSingleStake) {
				var year = snow[date.year] = snow[date.year] || [];
				var month = year[date.month] = year[date.month] || { sum: 0, count: 0 };
				month.sum += depthSingleStake;
				month.count++;
			}
		});

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
		return new Promise(function(resolve, reject){
			resolve({
				src: src,
				periodMeans,
				decadeMeans,
			})
		})
	},
	smhiTemp: function(result, src=''){
		// console.log(result)
		var precipitation = result[1];
		result = result[0];
		var parse = function(entry){
			// var x = (new Date(entry[0])).getTime();
			var x = entry[0];
			var y = parseFloat(entry[1]);
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
		var values = Object.values(result.data.map(each => {
			temp = [each["Datum"], each["Lufttemperatur"]]
			return parse(temp);
		}));
		// console.log(values)
		// var temperatures = parseByDate(values)

		// console.log(values)
		return new Promise(function(resolve, reject){
			resolve({
				precipitation: undefined,
				temperatures: parseByDate(values)
			})
		})

	}

}
