
const help = require('./../helpers.js');
const regression = require('regression')
const parser = require('./struct.js');
var struct = parser.struct;
var parseByDate = parser.parseByDate;

var parsers = {
	TempPrec:  function (blocks){
		return new Promise(function(resolve, reject){
			blocks.temperatures = parseByDate(blocks.temperatures);
			blocks.precipitation = parseByDate(blocks.precipitation, 'sum');
			blocks.growingSeason = {
				weeks: struct.create(
					blocks.temperatures.weeks.avg.values.map(each => each.sequence())).build(),
				days: struct.create(Object.keys(blocks.temperatures.yrly.avg.values).map(year =>  blocks.temperatures.yrly.avg.values[year].sequence())).build(),
				first: blocks.temperatures.yrlySplit.min.first(),
				last: blocks.temperatures.yrlySplit.min.last(),
			}
			parseAbiskoCached = blocks
			resolve(blocks)
		})
	},
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
							y: !Number.isNaN(Number(each[key])) ? Number(each[key]): undefined 
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
			// console.log(temperatures)
			resolve(temperatures)
		})
	},
	AbiskoCsv: function (result) {
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
		return parsers.TempPrec(blocks)
	},
	AbiskoIceData: function (result) {
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
	AbiskoLakeThickness: function(result){
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
	AbiskoSnowData: function (result) {
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
			AbiskoSnowCached = {periodMeans, decadeMeans,}
			resolve({
				periodMeans,
				decadeMeans,
				snowDepth: all
			})
		})
	},
	smhiTemp: function(result){
		// console.log(result)
		var blocks = {};
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
		blocks.temperatures = Object.values(result[0].data.map(each => {
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
		blocks.precipitation = Object.values(result[1].data.map(each => {
			var prec = [each["Representativt dygn"], each["Nederbördsmängd"]]
			return parsePrecip(prec);
		}));
		console.log(blocks)
		return parsers.TempPrec(blocks)
	}

}
exports.parsers = parsers;
