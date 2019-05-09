
/***************************************/
/* DATA TRANSFORMATIONS AND STATISTICS */
/***************************************/

var parseGISSTEMP = function (result) {
	var fields = result.meta.fields;
	var temperatures = [];

	result.data.forEach((row) => {
		var year = {};

		fields.forEach(field => year[field.toLowerCase()] = validNumber(row[field]));

		var monthlyTemperatures = months().map(month => year[month]).filter(Number);
		// console.log(monthlyTemperatures);
		// var month = monthlyTemperatures.map(each => ({
			// temp: each,
			// variance(each),
		// }));


		year.min = min(monthlyTemperatures);
		year.max = max(monthlyTemperatures);
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
		})).slice(10);
	});
	temperatures.movAvg = movingAverages(temperatures.map(temps => temps.avg), 10)
		.map((avg, index) => ({
			x: temperatures[index].year,
			y: avg,
		})).slice(10);

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

	temperatures.ci = temperatures.ci.slice(10);
	temperatures.ciMovAvg = temperatures.ciMovAvg.slice(10);
	return temperatures;
};

var parseGISSTEMPzonalMeans = function (result) {
	var fields = result.meta.fields;
	var temperatures = [];
	temperatures['sum64n-90n'] = 0;
	temperatures['sumnhem'] = 0;
	temperatures['sumglob'] = 0;
	var count = 0;

	result.data.forEach((row) => {
		var year = {};

		fields.forEach(field => year[field.toLowerCase()] = validNumber(row[field]));

		if (withinBaselinePeriod(year.year)) {
			temperatures['sum64n-90n'] += year['64n-90n'];
			temperatures['sumnhem'] += year['nhem'];
			temperatures['sumglob'] += year['glob'];
			count++;
		}
		if (year.year >= 1913) {
			temperatures.push(year);
		}
	});

	temperatures['avg64n-90n'] = temperatures['sum64n-90n'] / count;
	temperatures['avgnhem'] = temperatures['sumnhem'] / count;
	temperatures['avgglob'] = temperatures['sumglob'] / count;

	var difference = region => temperatures.map(each => ({
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



	return temperatures;
};

// 1-15
var parseAbiskoCsv = function (result) {
	var rows = result.data;

	var fields = {
		time: result.meta.fields[0],
		avg: result.meta.fields[1],
		min: result.meta.fields[2],
		max: result.meta.fields[3],
		precip: result.meta.fields[4],
	};

	var data = {};

	rows.forEach((row) => {
		var date = parseDate(row[fields.time]);
		var avg = parseNumber(row[fields.avg]);
		var precip = parseNumber(row[fields.precip]);

		var year = data[date.year] = data[date.year] || {
			sum: 0,
			count: 0,
			precip: 0,
			precip_snow: 0,
			precip_rain: 0,
			data: [],
			weeklyTemperatures: [],
		};
		if (avg) {
			year.sum += avg;
			year.count++;

			var w = weekNumber(createDate(date));
			var weekly = year.weeklyTemperatures[w] = year.weeklyTemperatures[w] || { sum: 0, count: 0 };
			weekly.sum += avg;
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

		year.weeklyTemperatures = year.weeklyTemperatures.map(t => t.sum / t.count);

		var isWeekAboveZero = year.weeklyTemperatures.map(t => t > 0);
		var longestPeriod = 0;

		isWeekAboveZero.reduce((period, aboveZero) => {
			if (aboveZero) {
				period++;
				longestPeriod = Math.max(longestPeriod, period);
				return period;
			} else {
				return 0;
			}
		}, 0);

		year.growingSeason = longestPeriod;

		var monthlyTemperatures = [];
		var monthlyPrecipitation = [];
		var summerTemperatures = { sum: [], count: 0, min: Infinity, max: -Infinity };
		var winterTemperatures = { sum: [], count: 0, min: Infinity, max: -Infinity };
		var summerPrecipitation = { total: 0, rain: 0, snow: 0 };
		var winterPrecipitation = { total: 0, rain: 0, snow: 0 };

		// Sorts out data into seasonal data sets
		year.data.forEach((each) => {
			var month = +each.date.month;
			var t = monthlyTemperatures[month - 1] = monthlyTemperatures[month - 1] || {
				sum: 0, count: 0, min: Infinity, max: -Infinity, temp: [],
			};
			var p = monthlyPrecipitation[month - 1] = monthlyPrecipitation[month - 1] || {
				total: 0, rain: 0, snow: 0,
			};
			if (each.avg) {
				if (isSummerMonthByIndex(month)) {
					summerTemperatures.sum.push(each.avg);
					summerTemperatures.count++;
					summerTemperatures.min = Math.min(summerTemperatures.min, each.avg);
					summerTemperatures.max = Math.max(summerTemperatures.max, each.avg);
				} else if (isWinterMonthByIndex(month)) {
					winterTemperatures.sum.push(each.avg);
					winterTemperatures.count++;
					winterTemperatures.min = Math.min(winterTemperatures.min, each.avg);
					winterTemperatures.max = Math.max(winterTemperatures.max, each.avg);
				
				}
				t.sum += each.avg;
				t.count++;
				t.min = Math.min(t.min, each.avg);
				t.max = Math.max(t.max, each.avg);
				t.temp.push(each.avg);
			}
			if (each.precip) {
				if (isSummerMonthByIndex(month)) {
					summerPrecipitation.total += each.precip;
					summerPrecipitation.snow += each.precip_snow;
					summerPrecipitation.rain += each.precip_rain;
				} else if (isWinterMonthByIndex(month)) {
					winterPrecipitation.total += each.precip;
					winterPrecipitation.snow += each.precip_snow;
					winterPrecipitation.rain += each.precip_rain;
				}
				p.total += each.precip;
				p.snow += each.precip_snow;
				p.rain += each.precip_rain;
			}
		});
		
		year.monthlyTemperatures = monthlyTemperatures.map(month => ({
			avg: month.sum / month.count,
			min: month.min,
			max: month.max,
			variance: variance(month.temp),
			ci: null,
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


		year.monthlyPrecipitation = monthlyPrecipitation;
		year.summerPrecipitation = summerPrecipitation;
		year.winterPrecipitation = winterPrecipitation;
		if (withinBaselinePeriod(entry[0])) {
			precipitationBaselineSummer.sum += summerPrecipitation.total;
			precipitationBaselineSummer.count++;
			precipitationBaselineWinter.sum += winterPrecipitation.total;
			precipitationBaselineWinter.count++;
			precipitationBaselineYearly.sum += sum(monthlyPrecipitation.map(p => p.total));
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
	
		// TODO monthly variance sort out from
	});

	var yearly = statistic => entries().map(each => ({
		x: +each[0],
		y: each[1][statistic],
	}));

	var monthlyPrecipByStat = (monthIndex, statistic) => entries().map(each => ({
		x: +each[0],
		y: each[1].monthlyPrecipitation[monthIndex][statistic],
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
	var monthlyPrecipitation = {};
	var monthlyTemps = {};

	months().forEach((month, index) => {
		var p = monthlyPrecipitation[month] = monthlyPrecipitation[month] || {};
		p.years = years.slice(10);
		p.total = monthlyPrecipByStat(index, 'total');
		p.movAvg = movingAveragesHighCharts(p.total.map(each => each.y));
		p.linear = linearRegression(p.years, p.total.map(each => each.y));
		p.total = p.total.slice(10);

		p.rain = monthlyPrecipByStat(index, 'rain');	
		p.rain_movAvg = movingAveragesHighCharts(p.rain.map(each => each.y)); 
		p.linear_rain_movAvg = linearRegression(p.years, p.rain_movAvg.map(each => each.y));
		p.linear_rain = linearRegression(p.years, p.rain.map(each => each.y));
		p.rain = p.rain.slice(10);


		p.snow = monthlyPrecipByStat(index, 'snow');
		// TODO
		p.snow_movAvg = movingAveragesHighCharts(p.snow.map(each => each.y)); // TODO REFORM
		p.linear_snow = linearRegression(p.years, p.snow.map(each => each.y));
		p.linear_snow_movAvg = linearRegression(p.years, p.snow_movAvg.map(each => each.y));
		p.snow = p.snow.slice(10);


		var t = monthlyTemps[month] = {};
		t.avg = monthlyTempByStat(index, 'avg');
		t.min = monthlyTempByStat(index, 'min').slice(10);
		t.max = monthlyTempByStat(index, 'max').slice(10);
		t.movAvg = movingAveragesHighCharts(t.avg.map(each => each.y));
		t.variance = monthlyTempByStat(index, 'variance');
		t.ci = monthlyTempByStat(index, 'ci');
		t.avg = t.avg.slice(10);
	});
	var seasonal = (season, statistic) => entries().map(each => ({
		x: +each[0],
		y: each[1][season][statistic],
	}));
	
	
	var summerTemps = {
		avg: seasonal('summerTemperature', 'avg'),
		min: seasonal('summerTemperature', 'min').slice(10),
		max: seasonal('summerTemperature', 'max').slice(10),
		ci: seasonal('summerTemperature','ci').map((each) => (each.y)),
		ciMovAvg: null,
	};

	summerTemps.ciMovAvg = summerTemps.ci.map(each => ({ x: each.x }));
	['low', 'high'].forEach(bound =>
		movingAverages(summerTemps.ci.map(each => each[bound]), 10)
		.forEach((value, index) => summerTemps.ciMovAvg[index][bound] = value));

	var winterTemps = {
		avg: seasonal('winterTemperature', 'avg'),
		min: seasonal('winterTemperature', 'min').slice(10),
		max: seasonal('winterTemperature', 'max').slice(10),
		ci: seasonal('winterTemperature','ci').map((each) => (each.y)),
		ciMovAvg: null,
	};
	winterTemps.ciMovAvg = winterTemps.ci.map(each => ({ x: each.x }));
	['low', 'high'].forEach(bound =>
		movingAverages(winterTemps.ci.map(each => each[bound]), 10)
		.forEach((value, index) => winterTemps.ciMovAvg[index][bound] = value));



	summerTemps.movAvg = movingAveragesHighCharts(summerTemps.avg.map(each => each.y));
	winterTemps.movAvg = movingAveragesHighCharts(winterTemps.avg.map(each => each.y));
	


	summerTemps.avg = summerTemps.avg.slice(10);
	winterTemps.avg = winterTemps.avg.slice(10);

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
		p.years = years.slice(10);
		p.total = seasonalPrecipByStat(e.season, 'total');
		p.snow = seasonalPrecipByStat(e.season, 'snow');


		// TODO fix missing 10 data points
		p.linear_snow = linearRegression(p.years, p.snow.map(each => each.y)); // TODO REFORM

		p.snow_movAvg = movingAveragesHighCharts(p.snow.map(each => each.y)); 
		// p.linear_snow_movAvg = linearRegression(p.years, p.snow_movAvg.map(each => each.y)); 
		p.snow = p.snow.slice(10);

		p.rain = seasonalPrecipByStat(e.season, 'rain');	
		p.linear_rain = linearRegression(p.years, p.rain.map(each => each.y));

		p.rain_movAvg = movingAveragesHighCharts(p.rain.map(each => each.y)); 
		// p.linear_rain = linearRegression(p.years, p.rain_movAvg.map(each => each.y));
		p.rain = p.rain.slice(10);	


		p.movAvg = movingAveragesHighCharts(p.total.map(each => each.y));
		p.linear = linearRegression(p.years, p.total.map(each => each.y));
		p.difference = p.total.map(each => ({
			x: each.x,
			y: each.y - (e.baseline.sum / e.baseline.count),
		}));
		p.total = p.total.slice(10);
		p.linear_diff = linearRegression(years, p.difference.map(each => each.y));
		p.difference = p.difference.slice(10);
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

	var precipMovAvg = movingAveragesHighCharts(values().map(each => each.precip));

	
	yrly_diff = yearly('precip').map(each => ({
		x: each.x,
		y: each.y - (precipitationBaselineYearly.sum / precipitationBaselineYearly.count),
	}));

	// console.log(yearly('precip'));
	// console.log(yrly_diff);
	// console.log(monthlyPrecipitation);
	// console.log(winterTemps);
	// console.log(summerTemps);
	// console.log(monthlyTemps);
	// console.log(ci);
	return {
		temperatures: {
			years,
			avg: yearly('avg').slice(10),
			min: yearly('min').slice(10),
			max: yearly('max').slice(10),
			movAvg: movingAveragesHighCharts(values().map(each => each.avg)),
			ci: ci.slice(10),
			ciMovAvg: ciMovAvg.slice(10),


			monthlyTemps,
			summerTemps,
			winterTemps,

			difference: yearly('avg').map(each => ({
				x: each.x,
				y: each.y - (temperatureBaseline.sum / temperatureBaseline.count),
			})),
		},
		growingSeason: {
			weeks: yearly('growingSeason').slice(10),
			movAvg: movingAveragesHighCharts(yearly('growingSeason').map(each => each.y)),
		},
		precipitation: {
			yearlyPrecipitation: {
				years: years.slice(10),
				total: yearly('precip').slice(10),
				snow: yearly('precip_snow').slice(10),
				// snow_movAvg: precipMovAvg_snow, // TODO
				linear_snow: linearRegression(years.slice(10), yearly('precip_snow').map(each => each.y)),
				rain: yearly('precip_rain').slice(10),
				// rain_movAvg:  precipMovAvg_rain,// TODO
				movAvg: precipMovAvg,
				linear_rain: linearRegression(years.slice(10), yearly('precip_rain').map(each => each.y)),
				linear: linearRegression(years.slice(10), yearly('precip').map(each => each.y)),
				difference: yrly_diff.slice(10),
				linear_diff: linearRegression(years.slice(10), yrly_diff.map(each => each.y)),
			},
			monthlyPrecipitation,
			summerPrecipitation: seasonalPrecipitation.summerPrecipitation,
			winterPrecipitation: seasonalPrecipitation.winterPrecipitation,
		}
	};
};

var parseAbiskoIceData = function (result) {
	var fields = result.meta.fields;
	var data = result.data;

	var iceData = [];
	data.forEach((row) => {
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

	var freezeDOY = iceData.map((each, year) => ({
		x: +year,
		y: each.freezeDOY,
		name: each.freezeDate ? dateFormat(each.freezeDate) : null,
		week: each.freezeDate ? weekNumber(each.freezeDate) : null,
	})).filter(each => each.y).filter(each => each.x >= 1909).filter(each => each.name != null);
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

	var iceTime = yearly('iceTime');

	var calculateMovingAverages = (values) => movingAverages(values.map(v => v.y), 10).map((avg, i) => ({
		x: values[i].x, y: avg,
	})).slice(10);

	var iceTimeMovAvg = calculateMovingAverages(iceTime);
	var iceTimeLinear = linearRegression(iceTime.map(w => w.x), iceTime.map(w => w.y));
	var iceTimeMovAvgLinear = linearRegression(iceTimeMovAvg.map(w => w.x), iceTimeMovAvg.map(w => w.y));

	var yearMax = iceData.length - 1;
	// console.log(data);
	// console.log(freeze);
	return {
		yearMax,
		breakup,
		freeze,
		iceTime,
		iceTimeMovAvg,
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

var parseAbiskoSnowData = function (result) {
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
		periodMeans,
		decadeMeans,
	};
};

