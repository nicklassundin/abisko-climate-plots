
/***************************************/
/* DATA TRANSFORMATIONS AND STATISTICS */
/***************************************/


// var struct = {
// 		values: 	undefined,
// 		variance: 	undefined,
// 		ci:		undefined,
// 		movAvg: 	undefined,
// 		movAvgCI: 	undefined,	
// };


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
	var data = result.data.slice(44)
	data = data.map(each => parse(each))
	var linReg = regression.linear(data.map((each,index) => [index, each.y]))
	var predict = linReg.predict;
	linReg.predict = function(x){
		var index = data.map(each => each.x).indexOf(x)
		var result = predict(index);
		result[0] = x;
		return result
	}
	return {
		weekly: {
			week: data,
			linReg, 
		}
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
	// console.log(result)
	// console.log(src)
	var fields = result.meta.fields;
	var temperatures = [];
	temperatures['sum64n-90n'] = 0;
	temperatures['sumnhem'] = 0;
	temperatures['sumglob'] = 0;
	var yrlyAvg = [];
	var count = 0;

	result.data.forEach((row) => {
		var year = {};
		fields.forEach(field => year[field.toLowerCase()] = validNumber(row[field]));
		yrlyAvg.push({
			x: year['year'],
			y: year['64n-90n']
		})
		if (withinBaselinePeriod(year.year)) {
			temperatures['sum64n-90n'] += year['64n-90n']||0.0; // TODO resolve why .00 is undefined 
			temperatures['sumnhem'] += year['nhem']||0.0;
			temperatures['sumglob'] += year['glob']||0.0;
			count++;
		}
		if (year.year >= 1913) {
			temperatures.push(year);
		}
	});

	temperatures['avg64n-90n'] = temperatures['sum64n-90n'] / count;
	temperatures['avgnhem'] = temperatures['sumnhem'] / count;
	temperatures['avgglob'] = temperatures['sumglob'] / count;

	var difference = region => temperatures.filter((value) => {
		return value[region] != null;
	}).map(each => ({
		x: each.year,
		y: each[region] - temperatures['avg' + region],
	}));
	var linear_diff = function(data){
		return {
			years: data.map(each => each.x),
			difference: data,
			linear_diff: linearRegression(data.map(each => each.x),data.map(each => each.y)),
		};
	}

	temperatures['64n-90n'] = linear_diff(difference('64n-90n'));
	temperatures['nhem'] = linear_diff(difference('nhem'));
	temperatures['glob'] = linear_diff(difference('glob'));

	var movAvg = movingAverages(yrlyAvg.map(temps => temps.y), 10)
		.map((avg, index) => ({
			x: yrlyAvg[index].x,
			y: avg,
		}))
	var yearVar = variance(yrlyAvg.map(each => each.y));
	var yearCI = yrlyAvg.map(each => ({
		x: each.x, 
		ci: confidenceInterval(each.y, yearVar, yrlyAvg.length),
	})).map(each => ({
		x: each.x,
		low: each.ci.low,
		high: each.ci.high,
	}))
	var yearCIMovAvg = yearCI.map(each => ({ x: each.x }));
	['low', 'high'].forEach(bound =>
		movingAverages(yearCI.map(each => each[bound]), 10)
		.forEach((value, index) => yearCIMovAvg[index][bound] = value));
	temperatures.yrly = {
		avg: yrlyAvg.slice(43), // TODO nicer alignment with Ab charts
		movAvg: movAvg.slice(43),
		ciMovAvg: yearCIMovAvg.slice(43),
		ci: yearCI.slice(43),
	};
	var meta = preSetMeta['default'];
	meta.src = src;
	temperatures.meta = meta;
	temperatures.yrly.meta = meta;
	temperatures['64n-90n'].meta = meta;
	temperatures['nhem'].meta = meta; 
	temperatures['glob'].meta = meta;
	// console.log(temperatures)
	return temperatures;
};

// 1-15
var parseAbiskoCsv = function (result, src='') {
	// console.log('parseAbiskoCsv')
	// console.log(result)
	var rows = result.data;
	var meta = preSetMeta['abiskoTemp'];
	var fields = {
		time: result.meta.fields[0],
		avg: result.meta.fields[1],
		min: result.meta.fields[2],
		max: result.meta.fields[3],
		precip: result.meta.fields[4],
	};
	var data = {};
	var days = [];
	rows.forEach((row) => {
		var date = parseDate(row[fields.time]);
		var avg = parseNumber(row[fields.avg]);
		if(avg)days.push({
			x: Date.UTC(date.year,date.month-1, date.day),
			y: avg,
		})
		var precip = parseNumber(row[fields.precip]);
		var year = data[date.year] = data[date.year] || {
			sum: 0,
			count: 0,
			precip: 0,
			precip_snow: 0,
			precip_rain: 0,
			data: [],
			weeklyTemperatures: [],
			// dailyTemperatures: [],
		};
		if (avg) {
			// allTemperatures.push(avg);
			year.sum += avg;
			year.count++;

			var w = weekNumber(createDate(date));
			var weekly = year.weeklyTemperatures[w] = year.weeklyTemperatures[w] || { sum: [], count: 0 };
			weekly.sum.push(avg);
			weekly.count++;
		}
		if (precip) {
			year.precip += precip;
			if (avg < 0) {
				year.precip_snow += precip;
			} else {
				year.precip_rain += precip;
			}
		}
		year.data.push({
			date, avg,
			min: parseNumber(row[fields.min]),
			max: parseNumber(row[fields.max]),
			precip,
			precip_snow: (avg < 0) ? precip : 0,
			precip_rain: (avg >= 0) ? precip : 0,
		});
	});

	// console.log(allTemperatures);
	// console.log(data);

	var temperatureBaseline = { sum: 0, count: 0 };
	var precipitationBaselineYearly = { sum: 0, count: 0 };
	var precipitationBaselineSummer = { sum: 0, count: 0 };
	var precipitationBaselineWinter = { sum: 0, count: 0 };

	var entries = () => Object.entries(data);
	var keys = () => Object.keys(data);
	var values = () => Object.values(data);

	entries().forEach((entry) => {
		var year = entry[1];
		year.avg = year.sum / (year.count || 1);

		if (withinBaselinePeriod(entry[0])) {
			temperatureBaseline.sum += year.avg;
			temperatureBaseline.count++;
		}
		// pre work for weekly variances
		// var weeklyTemps = year.weeklyTemperatures.map(t => t.sum);
		// var weeklyTempsVar = weeklyTemps.map(t => variance(t));

		year.weeklyTemperatures = year.weeklyTemperatures.map(t => t.sum.reduce((a,b) => a+b) / t.count);
		var isWeekAboveZero = year.weeklyTemperatures.map(t => t > 0);
		var longestPeriod = 0;
		var periods = []
		isWeekAboveZero.reduce((period, aboveZero) => {
			if (aboveZero) {
				period++;
				longestPeriod = Math.max(longestPeriod, period);
				return period;
			} else {
				periods.push(period);	
				return 0;
			}
		}, 0);
		year.growingSeason = {
			max: longestPeriod,
			variance: variance(periods),
			count: periods.length,
		}
		// console.log(year.growingSeason);

		var monthlyTemperatures = [];
		var monthlyPrecip = [];
		var summerTemperatures = { sum: [], count: 0, min: Infinity, max: -Infinity };
		var winterTemperatures = { sum: [], count: 0, min: Infinity, max: -Infinity };
		var summerPrecipitation = { total: [], rain: 0, snow: 0, variance: null, ci: null};
		var winterPrecipitation = { total: [], rain: 0, snow: 0, variance: null, ci: null};

		// Sorts out data into seasonal data sets
		year.data.forEach((each) => {
			var month = +each.date.month;
			var t = monthlyTemperatures[month - 1] = monthlyTemperatures[month - 1] || {
				sum: [], count: 0, min: Infinity, max: -Infinity, temp: [],
			};
			var p = monthlyPrecip[month - 1] = monthlyPrecip[month - 1] || {
				total: [], rain: 0, snow: 0, count: 0,
			};
			if (each.avg) {
				if (isSummerMonthByIndex(month)) {
					summerTemperatures.sum.push(each.avg);
					summerTemperatures.count++;
					if(each.min) summerTemperatures.min = Math.min(summerTemperatures.min, each.min);
					if(each.max) summerTemperatures.max = Math.max(summerTemperatures.max, each.max);
				} else if (isWinterMonthByIndex(month)) {
					winterTemperatures.sum.push(each.avg);
					winterTemperatures.count++;
					if(each.min) winterTemperatures.min = Math.min(winterTemperatures.min, each.min);
					if(each.max) winterTemperatures.max = Math.max(winterTemperatures.max, each.max);

				}
				t.sum.push(each.avg);
				t.count++;
				if(each.min) t.min = Math.min(t.min, each.min);
				if(each.max) t.max = Math.max(t.max, each.max);
			}
			if (each.precip) {
				if (isSummerMonthByIndex(month)) {
					summerPrecipitation.total.push(each.precip);
					summerPrecipitation.snow += each.precip_snow;
					summerPrecipitation.rain += each.precip_rain;
				} else if (isWinterMonthByIndex(month)) {
					winterPrecipitation.total.push(each.precip);
					winterPrecipitation.snow += each.precip_snow;
					winterPrecipitation.rain += each.precip_rain;
				}
				p.total.push(each.precip);
				p.snow += each.precip_snow;
				p.rain += each.precip_rain;
				p.count++;
			}
		});
		var summerPrecVar = Math.sqrt(summerPrecipitation.total.length)*variance(summerPrecipitation.total);// TODO need check internal math
		var summerPrecTotal = summerPrecipitation.total.reduce((a,b) => a+b,0);
		var summerPrecCI = confidenceInterval(summerPrecTotal, summerPrecVar, summerMonths.length); // TODO should not be a constant '6'
		year.summerPrecipitation = {
			total: summerPrecTotal,
			snow: summerPrecipitation.snow,
			rain: summerPrecipitation.rain,
			variance: summerPrecVar,
			ci: null, 
		};
		year.summerPrecipitation.ci = {
			x: entry[0],
			low: summerPrecCI['low'],
			high: summerPrecCI['high'],
		};

		var winterPrecVar = Math.sqrt(summerPrecipitation.total.length)*variance(winterPrecipitation.total); // TODO need check internal math
		var winterPrecTotal = winterPrecipitation.total.reduce((a,b) => a+b,0);
		var winterPrecCI = confidenceInterval(winterPrecTotal, winterPrecVar, winterMonths.length); // TODO should not be a constant '6'
		year.winterPrecipitation = {
			total: winterPrecTotal,
			snow: winterPrecipitation.snow,
			rain: winterPrecipitation.rain,
			variance: winterTempsVar,
			ci: null, 
		};
		year.winterPrecipitation.ci = {
			x: entry[0],
			low: winterPrecCI['low'],
			high: winterPrecCI['high'],
		};


		year.monthlyPrecip = monthlyPrecip.map(month => ({
			total: month.total.reduce((a,b) => a+b),
			rain: month.rain,
			snow: month.snow,
			variance: Math.sqrt(month.total.length)*variance(month.total),// TODO need check internal math
			ci: null,
			n: month.total.length,
		})).map(month => ({
			total: month.total,
			rain: month.rain,
			snow: month.snow,
			variance: month.variance,
			ci: confidenceInterval(month.total, month.variance, month.n),
		}));

		// yearly precipitation
		year.precipCI = confidenceInterval(year.precip, year.monthlyPrecip.map(each => each.variance).reduce((a,b)=>a+b), year.monthlyPrecip.length);


		//
		////

		year.monthlyTemperatures = monthlyTemperatures.map(month => ({
			avg: month.sum.reduce((a,b) => a+b) / month.count,
			min: month.min,
			max: month.max,
			variance: variance(month.sum),
			ci: null,
			n: month.sum.length
		})).map(month => ({
			avg: month.avg,
			min: month.min,
			max: month.max,
			variance: month.variance,
			ci: confidenceInterval(month.avg, month.variance, month.n),
		}));


		var summerTempsAvg = summerTemperatures.sum.reduce((a,b) => a+b,0) / summerTemperatures.count;
		var summerTempsVar = variance(summerTemperatures.sum);
		var summerTempsCI = confidenceInterval(summerTempsAvg, summerTempsVar, 6); // TODO should not be a constant '6'
		year.summerTemperature = {
			avg: summerTempsAvg,
			min: summerTemperatures.min,
			max: summerTemperatures.max,
			variance: summerTempsVar,
			ci: null, 
		};
		year.summerTemperature.ci = {
			x: entry[0],
			low: summerTempsCI['low'],
			high: summerTempsCI['high'],
		};

		var winterTempsAvg = winterTemperatures.sum.reduce((a,b) => a+b,0) / winterTemperatures.count;
		var winterTempsVar = variance(summerTemperatures.sum);
		// console.log(winterTempsAvg);
		// console.log(winterTempsVar);
		var winterTempsCI = confidenceInterval(winterTempsAvg, winterTempsVar, 6); // TODO should not be a constant '6'
		year.winterTemperature = {
			avg: winterTemperatures.sum.reduce((a,b) => a+b,0)/ winterTemperatures.count,
			min: winterTemperatures.min,
			max: winterTemperatures.max,
			variance: winterTempsVar,
			ci: null,
		};
		year.winterTemperature.ci = {
			x: entry[0],
			low: winterTempsCI['low'],
			high: winterTempsCI['high'],
		};


		if (withinBaselinePeriod(entry[0])) {
			precipitationBaselineSummer.sum += summerPrecTotal;
			precipitationBaselineSummer.count++;
			precipitationBaselineWinter.sum += winterPrecTotal;
			precipitationBaselineWinter.count++;
			precipitationBaselineYearly.sum += sum(monthlyPrecip.map(p => sum(p.total))); // TODO fix nicer tangle
			precipitationBaselineYearly.count++;
		}

		year.max = max(year.monthlyTemperatures.map(m => m.avg));
		year.min = min(year.monthlyTemperatures.map(m => m.avg));

		year.variance = 0;
		year.ci = { low: -Infinity, high: Infinity };

		if (year.monthlyTemperatures.length > 1) {
			year.variance = variance(year.monthlyTemperatures.map(m => m.avg));
			year.ci = confidenceInterval(year.avg, year.variance, year.monthlyTemperatures.length);
		}


	});

	var yearly = statistic => entries().map(each => ({
		x: +each[0],
		y: each[1][statistic],
	}));

	var monthlyPrecipByStat = (monthIndex, statistic) => entries().map(each => ({
		x: +each[0],
		y: each[1].monthlyPrecip[monthIndex][statistic],
	}));

	var monthlyTempByStat = (monthIndex, statistic) => entries().map(entry => ({
		x: +entry[0],
		y: entry[1].monthlyTemperatures[monthIndex][statistic],
	}));

	var movingAveragesHighCharts = values => movingAverages(values, 10).map((avg, index) => ({
		x: keys()[index],
		y: avg,
	})).slice(10);

	var years = keys().map(Number);
	var monthlyPrecip = {};
	var monthlyTemps = {};

	months().forEach((month, index) => {
		var p = monthlyPrecip[month] = monthlyPrecip[month] || {};
		p.years = years;
		p.total = monthlyPrecipByStat(index, 'total');
		p.movAvg = movingAveragesHighCharts(p.total.map(each => each.y));
		p.linear = linearRegression(p.years, p.total.map(each => each.y));
		p.total = p.total;

		p.rain = monthlyPrecipByStat(index, 'rain');	
		p.rain_movAvg = movingAveragesHighCharts(p.rain.map(each => each.y)); 
		p.linear_rain_movAvg = linearRegression(p.years, p.rain_movAvg.map(each => each.y));
		p.linear_rain = linearRegression(p.years, p.rain.map(each => each.y));
		p.rain = p.rain;

		// in pregress
		p.variance = monthlyPrecipByStat(index, 'variance');
		p.ci = monthlyPrecipByStat(index, 'ci');
		p.ci = p.ci.map((each) => ({
			x: each.x, 
			low: each.y.low,
			high: each.y.high,
		}));
		p.variance = monthlyPrecipByStat(index, 'variance');
		p.ciMovAvg = p.ci.map(each => ({ x: each.x }));
		['low', 'high'].forEach(bound =>
			movingAverages(p.ci.map(each => each[bound]), 10)
			.forEach((value, index) => p.ciMovAvg[index][bound] = value));
		p.ci = p.ci;
		p.ciMovAvg = p.ciMovAvg.slice(10);

		p.snow = monthlyPrecipByStat(index, 'snow');
		// TODO
		p.snow_movAvg = movingAveragesHighCharts(p.snow.map(each => each.y)); // TODO REFORM
		p.linear_snow = linearRegression(p.years, p.snow.map(each => each.y));
		p.linear_snow_movAvg = linearRegression(p.years, p.snow_movAvg.map(each => each.y));
		p.snow = p.snow;


		var t = monthlyTemps[month] = {};
		t.avg = monthlyTempByStat(index, 'avg');
		t.min = monthlyTempByStat(index, 'min');
		t.max = monthlyTempByStat(index, 'max');
		t.movAvg = movingAveragesHighCharts(t.avg.map(each => each.y));
		t.variance = monthlyTempByStat(index, 'variance');
		t.ci = monthlyTempByStat(index, 'ci');
		t.ci = t.ci.map((each) => ({
			x: each.x,
			low: each.y.low,
			high: each.y.high,
		}));
		t.ciMovAvg = t.ci.map(each => ({ x: each.x }));
		['low', 'high'].forEach(bound =>
			movingAverages(t.ci.map(each => each[bound]), 10)
			.forEach((value, index) => t.ciMovAvg[index][bound] = value));
		t.ci = t.ci;
		t.ciMovAvg = t.ciMovAvg.slice(10);
		t.avg = t.avg;
	});

	// Insert year for all season Temperatures
	var seasonal = (season, statistic) => entries().map(each => ({
		x: +each[0],
		y: each[1][season][statistic],
	}));


	var summerTemps = {
		avg: seasonal('summerTemperature', 'avg'),
		min: seasonal('summerTemperature', 'min'),
		max: seasonal('summerTemperature', 'max'),
		ci: seasonal('summerTemperature','ci').map((each) => (each.y)),
		ciMovAvg: null,
	};

	summerTemps.ciMovAvg = summerTemps.ci.map(each => ({ x: each.x }));
	['low', 'high'].forEach(bound =>
		movingAverages(summerTemps.ci.map(each => each[bound]), 10)
		.forEach((value, index) => summerTemps.ciMovAvg[index][bound] = value));

	var winterTemps = {
		avg: seasonal('winterTemperature', 'avg'),
		min: seasonal('winterTemperature', 'min'),
		max: seasonal('winterTemperature', 'max'),
		ci: seasonal('winterTemperature','ci').map((each) => (each.y)),
		ciMovAvg: null,
	};
	winterTemps.ciMovAvg = winterTemps.ci.map(each => ({ x: each.x }));
	['low', 'high'].forEach(bound =>
		movingAverages(winterTemps.ci.map(each => each[bound]), 10)
		.forEach((value, index) => winterTemps.ciMovAvg[index][bound] = value));



	summerTemps.movAvg = movingAveragesHighCharts(summerTemps.avg.map(each => each.y));
	winterTemps.movAvg = movingAveragesHighCharts(winterTemps.avg.map(each => each.y));



	summerTemps.avg = summerTemps.avg;
	winterTemps.avg = winterTemps.avg;

	// Inserts x: year for all seasons
	var seasonalPrecipByStat = (season, statistic) => entries().map(each => ({
		x: +each[0],
		y: each[1][season][statistic],
	}));
	var seasonalPrecipitation = { summerPrecipitation: {}, winterPrecipitation: {} };
	[
		{ season: 'summerPrecipitation', baseline: precipitationBaselineSummer },
		{ season: 'winterPrecipitation', baseline: precipitationBaselineWinter }
	].forEach((e) => {
		var p = seasonalPrecipitation[e.season];
		p.years = years;
		p.total = seasonalPrecipByStat(e.season, 'total');
		p.snow = seasonalPrecipByStat(e.season, 'snow');
		p.ci = seasonalPrecipByStat(e.season, 'ci').map(each => each.y);
		p.ciMovAvg = p.ci.map(each => ({ x: each.x }));
		['low', 'high'].forEach(bound =>
			movingAverages(p.ci.map(each => each[bound]), 10)
			.forEach((value, index) => p.ciMovAvg[index][bound] = value));

		p.ci = p.ci;
		p.ciMovAvg = p.ciMovAvg.slice(10);
		// TODO fix missing 10 data points
		p.linear_snow = linearRegression(p.years, p.snow.map(each => each.y)); // TODO REFORM

		p.snow_movAvg = movingAveragesHighCharts(p.snow.map(each => each.y)); 
		// p.linear_snow_movAvg = linearRegression(p.years, p.snow_movAvg.map(each => each.y)); 
		p.snow = p.snow;

		p.rain = seasonalPrecipByStat(e.season, 'rain');	
		p.linear_rain = linearRegression(p.years, p.rain.map(each => each.y));

		p.rain_movAvg = movingAveragesHighCharts(p.rain.map(each => each.y)); 
		// p.linear_rain = linearRegression(p.years, p.rain_movAvg.map(each => each.y));
		p.rain = p.rain;	


		p.movAvg = movingAveragesHighCharts(p.total.map(each => each.y));
		p.linear = linearRegression(p.years, p.total.map(each => each.y));
		p.difference = p.total.map(each => ({
			x: each.x,
			y: each.y - (e.baseline.sum / e.baseline.count),
		}));
		p.total = p.total;
		p.linear_diff = linearRegression(years, p.difference.map(each => each.y));
		p.difference = p.difference; 

	});

	var ci = entries().map((each) => ({
		x: +each[0],
		low: each[1].ci.low,
		high: each[1].ci.high,
	}));

	var ciMovAvg = ci.map(each => ({ x: each.x }));
	['low', 'high'].forEach(bound =>
		movingAverages(ci.map(each => each[bound]), 10)
		.forEach((value, index) => ciMovAvg[index][bound] = value));


	// precipitation moving average yearly
	var precipMovAvg = movingAveragesHighCharts(values().map(each => each.precip));

	yrly_diff = yearly('precip').map(each => ({
		x: each.x,
		y: each.y - (precipitationBaselineYearly.sum / precipitationBaselineYearly.count),
	}));



	// Growing Season
	var grwth_weeks = yearly('growingSeason').map(each => ({
		x: each.x,
		y: each.y.max,
		variance: each.y.variance,
		count: each.y.count,
	}));
	// console.log(yearly('growingSeason'));
	// console.log(grwth_weeks);
	// TODO restructure dubble storage of weeks
	var grwthSeason = {
		weeks: grwth_weeks,
		movAvg: movingAveragesHighCharts(grwth_weeks.map(each => each.y)),
		ci: grwth_weeks.map(each => ({
			x: each.x,
			ci: confidenceInterval(each.y,each.variance,each.count),
		})), 
		ciMovAvg: [],
	}
	grwthSeason.ci = grwthSeason.ci.map(each => ({
		x: each.x,
		low: each.ci.low,
		high: each.ci.high,
	}))
	// console.log(grwthSeason);
	grwthSeason.ciMovAvg = grwthSeason.ci.map(each => ({ x: each.x }));
	['low', 'high'].forEach(bound =>
		movingAverages(grwthSeason.ci.map(each => each[bound]), 10)
		.forEach((value, index) => grwthSeason.ciMovAvg[index][bound] = value));

	var precipCI = yearly('precipCI').map(each => ({
		x: each.x,
		low: each.y.low,
		high: each.y.high,
	}));
	var precipCIMovAvg = precipCI.map(each => ({ x: each.x }));
	['low', 'high'].forEach(bound =>
		movingAverages(precipCI.map(each => each[bound]), 10)
		.forEach((value, index) => precipCIMovAvg[index][bound] = value));
	summerTemps.meta = meta;
	winterTemps.meta = meta;

	return {
		meta,
		'days': days,
		temperatures: {
			yrly: {

				meta,
				years,
				avg: yearly('avg'),
				min: yearly('min'),
				max: yearly('max'),
				movAvg: movingAveragesHighCharts(values().map(each => each.avg)),
				ci: ci,
				ciMovAvg: ciMovAvg.slice(10),
				difference: yearly('avg').map(each => ({
					x: each.x,
					y: each.y - (temperatureBaseline.sum / temperatureBaseline.count),
				})),
			},
			monthlyTemps,
			summerTemps,
			winterTemps,
		},

		growingSeason: {
			src: src,
			weeks: grwthSeason.weeks,
			movAvg: grwthSeason.movAvg,
			ci: grwthSeason.ci,
			ciMovAvg: grwthSeason.ciMovAvg.slice(10),
		},
		precipitation: {
			yrly: {
				years: years,
				total: yearly('precip'),
				snow: yearly('precip_snow'),
				// snow_movAvg: precipMovAvg_snow, // TODO
				linear_snow: linearRegression(years, yearly('precip_snow').map(each => each.y)),
				rain: yearly('precip_rain'),
				// rain_movAvg:  precipMovAvg_rain,// TODO
				movAvg: precipMovAvg,

				linear_rain: linearRegression(years, yearly('precip_rain').map(each => each.y)),
				linear: linearRegression(years, yearly('precip').map(each => each.y)),
				ci: precipCI,
				ciMovAvg: precipCIMovAvg.slice(10),
				difference: yrly_diff,
				linear_diff: linearRegression(years, yrly_diff.map(each => each.y)),
			},
			monthlyPrecip,
			summerPrecipitation: seasonalPrecipitation.summerPrecipitation,
			winterPrecipitation: seasonalPrecipitation.winterPrecipitation,
		},
	};
};

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

