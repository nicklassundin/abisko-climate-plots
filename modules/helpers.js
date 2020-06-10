const regression = require('regression')


Date.prototype.getWeekNumber = function(date=this){
	var d = new Date(Date.UTC(date.getFullYear(), this.getMonth(), this.getDate()));
	var dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
	return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};

// (function (w) {

// 	w.URLSearchParams = w.URLSearchParams || function (searchString) {
// 		var self = this;
// 		self.searchString = searchString;
// 		self.get = function (name) {
// 			var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(self.searchString);
// 			if (results == null) {
// 				return null;
// 			}
// 			else {
// 				return decodeURI(results[1]) || 0;
// 			}
// 		};
// 	}

// })(window)


{

	exports.isFirstHalfYear = function(month){
		return month < 7
	}


	// TODO maybe reuse for new baseline better way to do it?!
	// $('#baseline').submit((e) => {
	// 	e.preventDefault();
	// 	var lower = +e.target[0].value;
	// 	var upper = +e.target[1].value;
	// 	if (!lower || !upper) {
	// 		alert('Something went wrong!');
	// 		return;
	// 	} else if (lower < 1913) {
	// 		alert("Lower limit must be above 1913!");
	// 		return;
	// 	} else if (lower >= upper) {
	// 		alert("Lower limit cant be larger or equal to upper limit!");
	// 		return;
	// 	} else if (upper > 2017) {
	// 		alert("Upper limit must be below 2017!");
	// 		return;
	// 	}
	//
	// 	baselineLower = lower;
	// 	baselineUpper = upper;
	// 	parseZonal();
	// 	parseAbisko();
	// });

	var useWebWorker = true;

	var months = () => ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
	exports.months = months;
	var t = {
		t05: [0, 12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.160, 2.145 , 2.131, 2.120, 2.110, 2.101, 2.093, 2.086],
	}

	var monthByIndex = index => months()[index];
	exports.monthByIndex = monthByIndex;
	var monthName = month => ({
		jan: 'January', feb: 'February', mar: 'March', apr: 'April', may: 'May', jun: 'June',
		jul: 'July', aug: 'August', sep: 'September', oct: 'October', nov: 'November', dec: 'December'
	})[month];
	exports.monthName = monthName;

	var summerMonths = ['jun', 'jul', 'aug', 'sep'];
	var winterMonths = ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may'];
	var summerRange = monthName(summerMonths[0]) + ' to ' + monthName(summerMonths[summerMonths.length-1]);
	var winterRange = monthName(winterMonths[0]) + ' to ' + monthName(winterMonths[summerMonths.length-1]);

	var isSummerMonth = month => summerMonths.includes(month);
	var isWinterMonth = month => winterMonths.includes(month);

	// var isSummerMonthByIndex = month => isSummerMonth(monthByIndex(month));
	exports.isSummerMonthByIndex = month => isSummerMonth(monthByIndex(month));
	// exports.isSummerMonthByIndex = isSummerMonthByIndex;
	// var isWinterMonthByIndex = month => isWinterMonth(monthByIndex(month));
	exports.isWinterMonthByIndex = month => isWinterMonth(monthByIndex(month));
	// exports.isWinterMonthByIndex = isWinterMonthByIndex;
	var seasons = {
			spring: ['mar', 'apr', 'may'],
			summer: ['jun', 'jul', 'aug'],
			autumn: ['sep', 'oct', 'nov'],
			winter: ['dec', 'jan', 'feb']
	}
	exports.seasons = seasons;
	exports.getSeasonByIndex = month => {
		return Object.keys(seasons).filter(key => seasons[key].includes(monthByIndex(month)))[0]
	}

	var sum = values => values.reduce((sum, current) => sum + current, 0);
	exports.sum = sum;
	var min = values => values.reduce((min, current) => Math.min(min, current), Infinity);

	var max = values => values.reduce((max, current) => Math.max(max, current), -Infinity);

	var average = (values) => {
		if (values.length === 0) return 0;
		return sum(values) / values.length;
	};

	exports.mean = average;

	var movingAverage = (values, index, number) => average(values.slice(Math.max(index - number, 0), index));

	var movingAverages = (values, number) => values.map((_, index) => movingAverage(values, index, number));

	var varianceMovAvg = (values, number) => values.map((_, index) => variance(values.slice(Math.max(index - number,0)).map(each => each.y)));

	var difference = (values, baseline) => values.map(value => value - baseline);

	var sumSquareDistance = (values, mean) => values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0);

	var variance = values => sumSquareDistance(values, average(values)) / (values.length - 1);


	var confidenceInterval = (mean, variance, count, td=t['t05']) => {
		var zs =[0, 12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.160, 2.145 , 2.131, 2.120, 2.110, 2.101, 2.093, 2.086];
		var z = zs[count-1]||zs[zs.length-1]
		var ci = z * Math.sqrt(variance / count);
		return {
			low: mean - ci,
			high: mean + ci
		};
	};
	exports.confidenceInterval = confidenceInterval;

	// equally weighted averages normal distribution 
	var confidenceInterval_EQ_ND = (values, count) => {
		var movAvg = movingAverages(values.map(each => each.y), count).map((avg, i) => ({
			x: values[i].x,
			y: avg,
		}));
		var movAvgVar = varianceMovAvg(values, count);
		var ciMovAvg = movAvg.map((_,index) => ({
			x: movAvg[index].x,
			y: confidenceInterval(movAvg[index].y, movAvgVar[index], count),
		})).map(each => ({
			x: each.x,
			low: each.y.low,
			high: each.y.high,
		}));
		return ({
			movAvg: movAvg,
			movAvgVar: movAvgVar,
			ciMovAvg: ciMovAvg,
		})
	}
	exports.confidenceInterval_EQ_ND = confidenceInterval_EQ_ND;



	// exports.baselineLower = 1961;
	// exports.baselineUpper = 1990;

	exports.withinBaselinePeriod = year => year >= baselineLower && year <= baselineUpper;


	// TODO currying
	var getDiff = function(values){
		var result = values.filter(each => withinBaselinePeriod(each.x));
		var count = result.length;
		console.log(result)
		var sum = result.map(each => each.y).reduce((a,b) => a+b,0);
		return sum/count;
	}


	var validNumber = (string) => {
		var number = +string;
		return (number) ? number : undefined;
	};
	exports.validNumber = validNumber;
	var parseDate = (string) => {
		var date = string.split('-');
		if (date.length < 3) date[1] = date[2] = 0;
		return {
			year: +date[0],
			month: +date[1],
			day: +date[2],
		};
	};
	exports.parseDate = parseDate;

	var isLeapYear = year => ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);

	var createDate = date => new Date(date.year, date.month-1, date.day);
	exports.createDate = createDate;
	var weekNumber = (date) => {
		var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
		d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
		var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
	};
	exports.weekNumber = weekNumber;
	var dayOfYear = (date) => {
		var start = new Date(date.getFullYear(), 0, 0);
		var diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
		var oneDay = 1000 * 60 * 60 * 24;
		return Math.floor(diff / oneDay);
	};
	exports.dayOfYear = dayOfYear;

	var dateFromDayOfYear = (year, dayOfYear) => new Date(year, 0, dayOfYear);
	exports.dateFromDayOfYear = dateFromDayOfYear;
	var parseNumber = string => parseFloat(string.replace(',', '.')) || undefined;

	var linearRegression = (xs, ys) => {
		var data = xs.map((x, index) => [x, ys[index]]);
		var result = regression.linear(data);
		var gradient = result.equation[0];
		var intercept = result.equation[1];
		var linear = x => gradient * x + intercept;
		linear.toString = () => gradient + ' x ' + (intercept >= 0 ? '+' : '-') + Math.abs(intercept);
		linear.r2 = result.r2;
		return linear;
	};
	exports.linearRegression = linearRegression;
	Array.prototype.rotate = (function () {
		var unshift = Array.prototype.unshift,
			splice = Array.prototype.splice;

		return function (count) {
			var len = this.length >>> 0,
				count = count >> 0;

			unshift.apply(this, splice.call(this, count % len, len));
			return this;
		};
	})();
}
