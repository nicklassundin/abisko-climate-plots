
/***************************************/
/* DATA TRANSFORMATIONS AND STATISTICS */
/***************************************/



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
	min:		function(){
		var min = {};
		var submind = [];
		this.values.forEach(entry => {
			if(entry.min == undefined){
				min = {
					x: this.y,
					y: Math.min(this.values.map(each => each.y)),
				}
				return min;
			}else{
				var tmp = entry.min()
				submin.push(tmp);
			}
		})
		min = Math.min(...submin)
		return min;
	},
	max: function(){
		var max = {};
		var submax = [];
		this.values.forEach(entry => {
			if(entry.max == undefined){
				max = {
					x: this.y,
					y: Math.max(this.values.map(each => each.y)),
				}
				return max;
			}else{
				var tmp = entry.max()
				submax.push(tmp);
			}
		})
		max = Math.min(...submax)
		return max;
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
		return confidenceInterval(this.y, this.variance(), this.count);
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
			var e = confidenceInterval(movAvg[index], variance, count);
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
		var basevalue = mean(this.values.filter(value => 
			(value.x >= lower && value.x <= upper)).map(each => each.y))
		return Array.from(this.values.map(each => ([each.x, each.y - basevalue])))
	},
	build: function(type='mean', lower=baselineLower, upper=baselineUpper){
		var result = this;
		result.type = type;
		var values = result.values.filter(entry => (!isNaN(entry.y) || $.isNumeric(entry.y)));

		result.values = values;
		var count = values.length;
		
		var y;
		if(result.y==undefined){
			switch(type){
				case "mean":
					y = sum(values.map(each => each.y));
					y = y/count;
					break;
				case "max":
					y = Math.max(...values.map(each => each.y))
					break;
				case "min":
					// TODO
					break;
				case "sum":
					y = sum(values.map(each => each.y));
					break;
				default:
					console.log("default")

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
		values = values.filter(entry => !isNaN(entry.y) && $.isNumeric(entry.y));
		result.values = values.filter(each => each.y);
		result.x = x;
		return result;
	},
	map: function(F){
		return struct.create(F(this.values), this.x);	
	}
};

var parseCALM = function(result, src=''){
	var fields = result.meta.fields;
	fields.shift()
	var data = result.data;
	data.splice(0,4)
	data = data.map(function(each){
		each = Object.keys(each).map(key => each[key]);
		var x = parseInt(each.shift());
		var y = mean(each.map(each => parseFloat(each)).filter(function(value){
			return !Number.isNaN(value)
		}));
		return {
			x,
			y,
		}
	})
	return data;
}

var parseSCRIPPS_CO2 = function(result, src=''){
	// TODO
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
	return {
		weekly: data.build(),
	}
}


var parseGISSTEMP = function (result, src='') {
	var fields = result.meta.fields;
	var meta = preSetMeta['default'];
	meta.src = src;
	var temperatures = [];
	// console.log(result)


	result.data.forEach((row) => {
		var year = {};

		fields.forEach(field => year[field.toLowerCase()] = validNumber(row[field]));

		var monthlyTemperatures = months().map(month => year[month]).filter(Number);		
		// console.log(row)
		year.min = Math.min.apply(null, monthlyTemperatures);
		year.max = Math.max.apply(null, monthlyTemperatures);
		year.count = monthlyTemperatures.length;

		if (year.count > 0) {
			year.avg = mean(monthlyTemperatures);

			year.variance = 0;

			if (year.count > 1) {
				year.variance = variance(monthlyTemperatures);
			}

			year.ci = confidenceInterval(year.avg, year.variance, year.count);

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
	return temperatures;
};

var parseGISSTEMPzonalMeans = function (result, src='') {
	var fields = result.meta.fields.map((each) => (each));
	var keys = fields.slice(0);
	var year = keys.shift();
	var data = result.data;
	var build = function(key){
		var str = struct;
		str.values = data.map(each => ({
			x: each['Year'],
			y: each[key],
		}))
		return str;
	}
	temperatures = {
		'64n-90n': build('64N-90N'),
		'nhem': build('NHem'),
		'glob': build('Glob') 
	}
	temperatures.src = src;
	return temperatures;
};

var parseAbiskoCsv = function (result, src='') {
	// console.log('parseAbiskoCsv')
	// console.log(new Date('1950-09-03').getYear())
	// console.log(result)
	var frame = {
		// weeks: {},
		yrly: {},
		monthly: {},
		weekly: {},
		summer: {}, 
		winter: {},	
		meta: {
			src: src,
		}
	}
	var clone = function(obj){
		return Object.assign({},obj);
	}
	const data = {
		precipitation: {
			weeks: {},
			yrly: {},
			monthly: {},
			weekly: {},
			summer: {}, 
			winter: {},	
			meta: {
				src: src,
			}
		}, 
		temperatures: {
			weeks: {},
			yrly: {},
			monthly: {},
			weekly: {},
			summer: {}, 
			winter: {},	
			meta: {
				src: src,
			}
		},
		growingSeason: [],
		insert: function(entries){
			var year = {}
			var result = Object.assign({}, this);
			result.precipitation = {
				// weeks: {},
				yrly: {},
				monthly: {},
				weekly: {},
				summer: {}, 
				winter: {},	
			}
			result.temperatures = {
				// weeks: {},
				yrly: {},
				monthly: {},
				weekly: {},
				summer: {}, 
				winter: {},	
			}
			var set = function(input, key, e, year, month, week, mean=true){
				var result = input;
				const entry = e;

				if(!result.yrly[key]) result.yrly[key] = {};
				if(!result.yrly[key][year]){
					const cont = struct.create([],year,mean);
					result.yrly[key][year] = cont;
				}
				result.yrly[key][year].values.push(entry);

				if(isSummerMonthByIndex(month)) {
					if(!result.summer[key]) result.summer[key] = {};
					if(!result.summer[key][year]){
						const cont = struct.create([],year, mean);
						result.summer[key][year] = cont; 
					} 
					result.summer[key][year].values.push(entry);
				}
				if(isWinterMonthByIndex(month)) {
					if(!result.winter[key]) result.winter[key] = {};
					if(!result.winter[key][year]){
						const cont = struct.create([],year, mean);
						result.winter[key][year] = cont;
					}
					result.winter[key][year].values.push(entry);
				}

				// if(!result.weeks[key]) result.weeks[key] = {};
				// if(!result.weeks[key][year]){
				// 	result.weeks[key][year] = []; 
				// }
				// result.weeks[key][year].push(week)

				// Monthly
				if(!result.monthly[month]) result.monthly[month] = {}
				if(!result.monthly[month][key]) result.monthly[month][key] = {};
				if(!result.monthly[month][key][year]){
					const cont = struct.create([],year, mean);
					result.monthly[month][key][year] = cont;
				} 
				result.monthly[month][key][year].values.push(entry);
				// Weekly
				if(!result.weekly[key]) result.weekly[key] = {};
				if(!result.weekly[key][year]) result.weekly[key][year] = {}; 
				if(!result.weekly[key][year][week]) result.weekly[key][year][week] = struct.create([],week,mean);
				result.weekly[key][year][week].values.push(entry);
													
				return result;					
			}
			var years = []
			var build = function(entries){
				entries.forEach(entry => {
					var date = new Date(entry['Time']);
					var year = date.getFullYear();
					var month = date.getMonth()+1;
					var week = date.getWeekNumber();
					if(!years[year+'']) years[year] = year+'';

					var parseEntry = function(e){
						if(e.y) e.y = parseFloat(e.y.replace(",","."));
						return e;
					}
					var avg =  {
						x: date,
						y: entry['Temp_avg'],
					}
					avg = parseEntry(avg);
					var min = {
						x: date,
						y: entry['Temp_min'],
					} 
					min = parseEntry(min);
					var max = {
						x: date,
						y: entry['Temp_max'],
					}
					max = parseEntry(max);
					var total = {
						x: date,
						y: entry['Precipitation']
					}
					total = parseEntry(total);
					var zero = 0;
					if(total.y==undefined) zero = undefined
					var snow = {
						x: date,
						y: (avg.y < 0) ? total.y : zero
					}
					var rain = {
						x: date,
						y: (avg.y >= 0) ? total.y : zero
					}
					result.precipitation = set(result.precipitation, 'total', total, year, month, week, false);
					result.precipitation = set(result.precipitation, 'snow', snow, year, month, week, false);
					result.precipitation = set(result.precipitation, 'rain', rain, year, month, week, false);
					result.temperatures = set(result.temperatures, 'avg', avg, year, month, week)	
					result.temperatures = set(result.temperatures, 'min', min, year, month, week)	
					result.temperatures = set(result.temperatures, 'max', max, year, month, week)
					return result
				})

				var construct = function(entries, type='mean'){
					const str = [];
					Object.keys(entries).forEach(key => {
						const entry = entries[key];
						str.push(entry.build(type))		
					})
					return struct.create(str).build(type);
				}


				Object.keys(frame).forEach(key => {
					switch(key){
						case 'monthly':
						Object.keys(result.precipitation[key]).forEach(month => {
							result.precipitation[key][month].total = construct(result.precipitation[key][month].total,'sum')
							result.precipitation[key][month].rain = construct(result.precipitation[key][month].rain, 'sum')
							result.precipitation[key][month].snow = construct(result.precipitation[key][month].snow, 'sum')
							result.temperatures[key][month].avg = construct(result.temperatures[key][month].avg)
							result.temperatures[key][month].min = construct(result.temperatures[key][month].min)
							result.temperatures[key][month].max = construct(result.temperatures[key][month].max)
						})
						break;
						case 'weekly':
						var growingSeason = struct.create([],undefined)
						Object.keys(result.temperatures[key].avg).forEach(year => {
							var cons = construct(result.temperatures[key].avg[year]);
							var values = cons.values.map(each => each.y)
							var max = [];
							var t = 0;
							values.forEach(e => {
								if(t > 0 && e < 0){
									max.push(t);
									t = 0;
								}else{
									t = t+1;
								}
							})
							max = max.map(each => ({
								x: parseInt(year),
								y: each
							}))
							growingSeason.values.push(struct.create(max,parseInt(year)).build('max'))
						})
						result.growingSeason = growingSeason.build('max');
						break;
						case 'meta':
							break;
						default:
						result.precipitation[key].total = construct(result.precipitation[key].total, 'sum')
						result.precipitation[key].rain = construct(result.precipitation[key].rain, 'sum')
						result.precipitation[key].snow = construct(result.precipitation[key].snow, 'sum')
						result.temperatures[key].avg = construct(result.temperatures[key].avg)
						result.temperatures[key].min = construct(result.temperatures[key].min)
						result.temperatures[key].max = construct(result.temperatures[key].max)
					}
				})
				return result
			}
			var answer = build(entries);
			return answer
		}
	}

	var respons = data.insert(result.data);
	console.log(respons)
	return respons
}


var parseAbiskoIceData = function (result, src='') {
	var fields = result.meta.fields;
	var data = result.data;
	// console.log(data)
	var iceData = [];
	data.forEach((row) => {
		// console.log(row)
		var winterYear = +row[fields[0]] || undefined;
		var springYear = +row[fields[1]] || undefined;
		var freezeDate = parseDate(row[fields[2]]);
		var freezeWeek = freezeDate.year > 0 ? weekNumber(createDate(freezeDate)) : null;
		var freezeDOY = freezeDate.year > 0 ? dayOfYear(createDate(freezeDate)) : null
		var breakupDate = parseDate(row[fields[3]]);
		var breakupWeek = breakupDate.year > 0 ? weekNumber(createDate(breakupDate)) : null;
		var breakupDOY = breakupDate.year > 0 ? dayOfYear(createDate(breakupDate)) : null
		var iceTime = validNumber(row[fields[4]]) || null;

		if (springYear) {
			iceData[springYear] = {
				breakupDate: breakupDate.year > 0 ? createDate(breakupDate) : null,
				breakupDOY,
				breakupWeek,
				freezeDate: freezeDate.year > 0 ? createDate(freezeDate) : null,
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

	var dateFormat = date => date.getFullYear() + ' ' + monthName(monthByIndex(date.getMonth())) + ' ' + (+date.getDay() + 1);

	var breakupDOY = iceData.map((each, year) => ({
		x: +year,
		y: each.breakupDOY,
		name: each.breakupDate ? dateFormat(each.breakupDate) : null,
		week: each.breakupDate ? weekNumber(each.breakupDate) : null,
	})).filter(each => each.y).filter(each => each.x >= 1909).filter(each => each.name != null);
	// var breakupVar = variance(breakupDOY.map(each=>each.y));

	var freezeDOY = iceData.map((each, year) => ({
		x: +year,
		y: each.freezeDOY,
		name: each.freezeDate ? dateFormat(each.freezeDate) : null,
		week: each.freezeDate ? weekNumber(each.freezeDate) : null,
	})).filter(each => each.y).filter(each => each.x >= 1909).filter(each => each.name != null);
	// var freezeVar = variance(freezeDOY.map(each=>each.y));

	// console.log(breakupDOY);
	// console.log(freezeDOY);
	var breakupLinear = linearRegression(breakupDOY.map(w => w.x), breakupDOY.map(w => w.y));
	var freezeLinear = linearRegression(freezeDOY.map(w => w.x), freezeDOY.map(w => w.y));

	var breakup = breakupDOY.map(each => ({
		x: each.x,
		y: weekNumber(dateFromDayOfYear(each.x, each.y)),
		name: each.name,
	}));

	var freeze = freezeDOY.map(each => {
		var weekNo = weekNumber(dateFromDayOfYear(each.x, each.y));
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
	var equal_weight = confidenceInterval_EQ_ND(iceTime, 10)	

	var iceTimeMovAvg = equal_weight.movAvg;
	var iceTimeMovAvgVar = equal_weight.movAvgVar;
	var iceTimeCIMovAvg = equal_weight.ciMovAvg;
	var iceTimeLinear = linearRegression(iceTime.map(w => w.x), iceTime.map(w => w.y));
	var iceTimeMovAvgLinear = linearRegression(iceTimeMovAvg.map(w => w.x), iceTimeMovAvg.map(w => w.y));

	var yearMax = iceData.length - 1;
	// console.log(data);
	// console.log(breakup);
	return {
		src: src,
		yearMax,
		breakup,
		freeze,
		iceTime,
		iceTimeMovAvg: iceTimeMovAvg.slice(10),
		iceTimeCIMovAvg: iceTimeCIMovAvg.slice(10),
		breakupLinear: [
			{ x: 1915, y: weekNumber(dateFromDayOfYear(1915, Math.round(breakupLinear(1915)))) },
			{ x: yearMax, y: weekNumber(dateFromDayOfYear(yearMax, Math.round(breakupLinear(yearMax)))) }
		],
		freezeLinear: [
			{ x: 1909, y: weekNumber(dateFromDayOfYear(1909, Math.round(freezeLinear(1909)))) },
			{ x: yearMax, y: weekNumber(dateFromDayOfYear(yearMax, Math.round(freezeLinear(yearMax)))) }
		],
		iceTimeLinear: [
			{ x: 1915, y: iceTimeLinear(1915) },
			{ x: yearMax, y: iceTimeLinear(yearMax) }
		],
		iceTimeMovAvgLinear: [
			{ x: 1925, y: iceTimeMovAvgLinear(1925) },
			{ x: yearMax, y: iceTimeMovAvgLinear(yearMax) }
		],
	};
};

var parseAbiskoSnowData = function (result, src='') {
	var data = result.data;
	var fields = result.meta.fields;

	var snow = [];

	data.forEach((row) => {
		var date = parseDate(row[fields[0]]);
		var depthSingleStake = validNumber(row[fields[1]]);
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
	return {
		src: src,
		periodMeans,
		decadeMeans,
	};
};

