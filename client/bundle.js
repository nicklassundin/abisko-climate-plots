(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const language = require('./language.json');
const lib = require('../modules/lib.js')

if(!nav_lang) nav_lang = 'en';

var charts = {};
exports.charts = charts;

var updatePlot = function(id, bl, bu){
	if(id.id) id=id.id; // TODO fix why this it gets a div not id
	if(id.renderTo) id=id.renderTo.id;
	var low = document.getElementById(id+"lowLabel") 
	var upp = document.getElementById(id+"uppLabel") 
	if(low){
		if(!bl) bl = low.value;
		if(!bu) bl = upp.value;
	} 
	if(bl<bu && bl>=1913) baselineLower=bl;
	if(bu>bl && bu<2019) baselineUpper=bu;
	var chart = charts[id]
	if(id.split('_')[1]) id = id.split('_')[0]
	var div = document.getElementById(id);
	chart.destroy();
	return lib.buildChart(div,window.location.search,ids=id,reset=true)
}
exports.updatePlot = updatePlot;

var preSetMeta = {
	'abiskoTemp': {
		src: 'https://www.arcticcirc.net/',
		vis: {
			movAvgCI: false,
			max: false,
			min: false,
		},
		color: {
			yrlyReg: '#888888',	
		},
	},
	'default': {
		src: undefined,
		vis: {
			movAvgCI: true,
			max: true,
			min: true,
		},
		color: {
			yrlyReg: '#4444ff',
		},

	}
}

exports.highcharts_Settings = {
	dataSrc: '',
	lang: language[nav_lang],
	chart: {
		events: {
			// dblclick: function () {
			// console.log('dbclick on chart')
			// },
			// click: function () {
			// console.log('click on chart')
			// },
			contextmenu: function () {
				console.log('right click on chart')
			}
		},
	},
	exporting: {
		chartOptions: {
			// annotationsOptions: undefined,
			// annotations: undefined,
		},
		// showTable: true, // TODO DATA TABLE
		// printMaxWidth: 1200,
		sourceWidth: 1800,
		sourceHeight: 900,
		scale: 8,
		// allowHTML: true,
		buttons: {
			contextButton: {
				menuItems: [{
					textKey: 'downloadPDF',
					onclick: function(){
						this.exportChart({
							type: 'application/pdf'
						});
					},
				},{
					textKey: 'downloadJPEG',
					onclick: function(){
						this.exportChart({
							type: 'image/jpeg'
						});
					}
				},'downloadSVG','viewFullscreen','printChart',{
					separator: true,
				},{
					textKey: 'langOption',
					onclick: function(){
						if(nav_lang=='en') nav_lang='sv';
						else nav_lang='en';
						Highcharts.setOptions({
							lang: language[nav_lang],
						})	
						var id = this.renderTo.id.split('_')[0];
						updatePlot(this);
					},
				},{
					textKey: 'showDataTable',
					onclick: function(){
						if(this.options.exporting.showTable) {
							this.dataTableDiv.innerHTML = '';
						};
						this.update({
							exporting: {
								showTable: !this.options.exporting.showTable, 
							},
						});
						// TODO toggle between 'Show data' and 'Hide data'
					},
				},{
					textKey: 'dataCredit',
					onclick: function(){
						if(this.options.dataSrc){
							window.location.href = this.options.dataSrc // TODO link to exact dataset with entry in data to href
						}
					},
				},{
					textKey: 'contribute',
					onclick: function(){
						window.location.href = 'https://github.com/nicklassundin/abisko-climate-plots/wiki';
					},
				}],
			},
		},
	},
};

},{"../modules/lib.js":4,"./language.json":2}],2:[function(require,module,exports){
module.exports={
	"en": {
		"baselineform": {
			"title": "Range for baseline",
			"lower": "Lower limit",
			"upper": "Upper limit"
		},
		"dataCredit": "Data source",
		"contribute": "Contribute - Github [dummy]",
		"showDataTable": "Show/hide data",
		"langOption": "Svenska",
		"shortMonths": ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
		"downloadJPEG": "Download as JPEG",
		"downloadPDF": "Download as PDF",
		"downloadSVG": "Download as SVG",
		"diff": "Difference",
		"groundlevel": "Ground level",
		"months": {
			"jan": "January",
			"feb": "February",
			"mar": "March",
			"apr": "April",
			"may": "May",
			"jun": "June",
			"jul": "July",
			"aug": "August",
			"sep": "September",
			"oct": "October",
			"nov": "November",
			"dec": "December"
		},
		"yearlyAvg": "Yearly average",
		"monthlyAvg": "Monthly average",
		"ci": "Confidence interval",
		"min": "Min",
		"max": "Max",
		"weeks": "weeks",
		"years": "years",
		"temp": "Temperature [°C]",
		"yearlyCI": "Confidence interval (yearly avg.)",
		"movAvg": "Moving average",
		"movAvgCI": "Confidence interval (moving avg.)",
		"precMovAvg": "Moving average precipitation",
		"precSnow": "Precipitation from snow",
		"precRain": "Precipitation from rain",
		"precAvg": "Total average precipitation",
		"prec": "Precipitation [mm]",
		"tprec": "Total Precipitation [mm]",
		"freezeup": "Freeze-up",
		"breakup": "Break-up",
		"iceTime": "Ice time",
		"iceTimeMovAvg": "Ice time (moving avg.)",
		"githubwiki": "https://github.com/nicklassundin/abisko-climate-plots/wiki",
		"linReg": "Linear regression",
		"linRegSnow": "Linear regression (snow)",
		"linRegAll": "Linear regression (all)",
		"linRegRain": "Linear regression (rain)",
		"linFrz": "Linear regression (freeze-up)",
		"linBrk": "Linear regression (break-up)",
		"linIceTime": "Linear regression (ice time)",
		"iceSub": "Ice break-up / freeze-up [day of year]",
		"iceTime": "Ice time [number of days]",
		"movAvgIceTime": "Ice time (moving avg.)",
		"iceTime2": "Ice time",
		"snowDepth": "Snow depth [cm]",
		"month": "Month",
		"abiskoSnowDepthPeriod": {
			"From 1961 to 1970": "From 1961 to 1970",
			"From 1971 to 1980": "From 1971 to 1980",
			"From 1981 to 1990": "From 1981 to 1990",
			"From 1991 to 2000": "From 1991 to 2000",
			"From 2001 to 2010": "From 2001 to 2010",
			"From 2011 to present": "From 2011 to present",
			"Entire period": "Entire period",
			"From 1931 to 1960": "From 1931 to 1960",
			"From 1961 to 1990": "From 1961 to 1990",
			"From 1991 to present": "From 1991 to present"
		},
		"titles": {
			"northernHemisphere": "Northern Hemisphere temperatures",
			"globalTemperatures": "Global temperatures",
			"temperatureDifference1": "Temperature difference for Arctic (64N-90N)",
			"temperatureDifference2": "Temperature difference for Northern Hemisphere",
			"temperatureDifference3": "Global teperature difference",
			"arcticTemperatures": "PLACE HOLDER",
			"abiskoLakeIce": "Torneträsk Freeze-up and break-up of lake ice vs ice time",
			"abiskoSnowDepthPeriodMeans": "Monthly mean snow depth for Abisko",
			"abiskoSnowDepthPeriodMeans2": "Monthly mean snow depth for Abisko",
			"AbiskoTemperatures": "Abisko temperatures",
			"AbiskoTemperaturesSummer": "Abisko temperatures for June to September",
			"AbiskoTemperaturesWinter": "Abisko temperatures for October to January",
			"temperatureDifferenceAbisko": "Temperature difference for Abisko",
			"monthlyAbiskoTemperatures": "Abisko temperatures for ",
			"yearlyPrecipitation": "Yearly precipitation",
			"summerPrecipitation": "Precipitation for June to September",
			"winterPrecipitation": "Precipitation for October to January",
			"yearlyPrecipitationDifference": "Precipitation difference",
			"summerPrecipitationDifference": "Precipitation difference for June to September",
			"winterPrecipitationDifference": "Precipitation difference for October to January",
			"monthlyPrecipitation": "Abisko Precipitation for ",
			"growingSeason": "Growing season",
			"weeklyCO2": "Averages global CO2 in atmosphere",
			"permaHistogramCALM": "Permafrost active layer depth",
			"smhiTemp": "Temperatures for "
		},
		"subtitles": {
			"baseline": "Difference between yearly average and average for "
		}
	},
	"sv":{
		"baselineform": {
			"title": "Intervalet för baslinjen",
			"lower": "Lägre gränsen",
			"upper": "Övre gränsen"
		},
		"dataCredit": "Data källa",
		"contribute": "Bidra mjukvara - Github [dummy]",
		"showDataTable": "Visa/göm data",
		"langOption": "English",
		"shortMonths": ["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Aug","Sep","Okt","Nov","Dec"],
		"downloadJPEG": "Ladda ner som JPEG",
		"downloadPDF": "Ladda ner som PDF",
		"downloadSVG": "Ladda ner som SVG",
		"diff": "Skillnad",
		"viewFullscreen": "Visa i fullskärm",
		"resetZoom": "Återställ zoom",
		"printChart": "Skriv ut",
		"months": ["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"],
		"groundlevel": "Mark nivå",
		"months": {
			"jan": "Januari",
			"feb": "Februari",
			"mar": "Mars",
			"apr": "April",
			"may": "Maj",
			"jun": "Juni",
			"jul": "Juli",
			"aug": "Augusti",
			"sep": "September",
			"oct": "Oktober",
			"nov": "November",
			"dec": "December"
		},
		"yearlyAvg": "Årligt medelvärde",
		"monthlyAvg": "Månligt medelvärde",
		"ci": "Konfidence interval",
		"weeks": "veckor",
		"years": "År",
		"temp": "Temperatur [°C]",
		"yearlyCI": "Konfidence interval (Årligt medelvärde)",
		"movAvg": "Rörligt medelvärde",
		"movAvgCI": "Konfidence interval (rörligt medelvärde)",
		"precMovAvg": "Rörligt medelvärde utfällning",
		"prec": "Utfällning [mm]",
		"precSnow": "Utfällning från snö",
		"precRain": "Utfällning från regn",
		"precAvg": "Total genomsnittlig utfällning",
		"tprec": "Total Utfällning [mm]",
		"freezeup": "Isläggning",
		"breakup": "Islossning",
		"iceTime": "Is tid",
		"iceTimeMovAvg": "Is tid (rörligt medelvärde)",
		"githubwiki": "https://github.com/nicklassundin/abisko-climate-plots/wiki",
		"linReg": "Linjär regression",
		"linRegSnow": "Linjär regression av snö",
		"linRegAll": "Linjär regression alla källor",
		"linRegRain": "Linjär regression av regn",
		"linFrz": "Linjär regression (isläggning)",
		"linBrk": "Linjär regression (islossning)",
		"linIceTime": "Linjär regression (is tid)",
		"iceSub": "Islossning / Isläggning [dag om året]",
		"iceTime": "Is tider [antal dagar per år]",
		"movAvgIceTime": "Is tid (rörligt genomsnitt)",
		"iceTime2": "Is tid",
		"snowDepth": "Snö djup [cm]",
		"month": "Månad",
		"abiskoSnowDepthPeriod": {
			"From 1961 to 1970": "Från 1961 till 1970",
			"From 1971 to 1980": "Från 1971 till 1980",
			"From 1981 to 1990": "Från 1981 till 1990",
			"From 1991 to 2000": "Från 1991 till 2000",
			"From 2001 to 2010": "Från 2001 till 2010",
			"From 2011 to present": "Från 2011 till nutid",
			"Entire period": "Hela perioden",
			"From 1931 to 1960" : "Från 1931 till 1960",
			"From 1961 to 1990" : "Från 1961 till 1990",
			"From 1991 to present": "Från 1991 till nutid"
		},
		"titles": {
			"northernHemisphere": "Northern Hemisphere temperatures",
			"globalTemperatures": "Global temperaturer",
			"temperatureDifference1": "Temperatur skillnaden för Arctic (64N-90N)",
			"temperatureDifference2": "Temperatur skillnaden för Nordliga Hemisfären",
			"temperatureDifference3": "Global temperatur skillnaden",
			"arcticTemperatures": "PLACE HOLDER",
			"abiskoLakeIce": "Torneträsk isläggning och islossning",
			"abiskoSnowDepthPeriodMeans": "Månatlig genomsnittligt snö djup för Abisko",
			"abiskoSnowDepthPeriodMeans2": "Månatlig genomsnittligt snö djup för Abisko",
			"AbiskoTemperatures": "Abisko temperaturer",
			"AbiskoTemperaturesSummer": "Abisko temperaturer för Juni till September",
			"AbiskoTemperaturesWinter": "Abisko temperaturer för Oktober till Januari", 
			"temperatureDifferenceAbisko": "Temperatur skillnad för Abisko",
			"monthlyAbiskoTemperatures": "Abisko temperaturer för ",
			"yearlyPrecipitation": "Årligt utfällning",
			"summerPrecipitation": "Utfällning för Juni till September",
			"winterPrecipitation": "Utfällning för Oktober till Januari", 
			"yearlyPrecipitationDifference": "Utfällnings skillnaden",
			"summerPrecipitationDifference": "Precipitation skillnaden för Juni till September",
			"winterPrecipitationDifference": "Precipitation skillnaden för Oktober till Januari",
			"monthlyPrecipitation": "Abisko utfällning för ",
		"growingSeason": "Växande säsonger",
		"weeklyCO2": "Globalt genomsnittligt CO2 i atmosfären",
		"permaHistogramCALM": "Permafrost aktivt lager djup",
		"smhiTemp": "Temperaturer för "
		},
		"subtitles": {
			"baseline":  "Skillnad mellan årligt genomsnitt och genomsnitt för perioden "
		}
	}
}

},{}],3:[function(require,module,exports){
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

	var createDate = date => new Date(date.year, date.month-1, date.day-1);
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

},{"regression":10}],4:[function(require,module,exports){
var $ = require('jquery')
const renders = require('./render.js').graphs;
const Papa = require('papaparse');
const parse = require('./stats.js').parsers;
const help = require('./helpers.js')
updatePlot = require('../config/highcharts_config.js').updatePlot;

var months = help.months;

var mark = function(id="mark",par=window.location.search) {
	var param = (''+par);
	var mark = document.getElementById(id+param);
	if(!mark) mark = document.getElementById(id);

	var container = document.createElement("div")
	container.setAttribute('id','cont'+param);
	mark.appendChild(bpage(container,par=window.location.seach));
}


// var baselineLower = help.baselineLower;
// var baselineUpper = help.baselineUpper;

// var requestChart = function(id, lang=nav_lang, div){
// 	nav_lang = lang;
// 	div.appendChild(RendF[id].html());
// 	rendF[id].func();
// }
// exports.requestChart = requestChart;

var monthlyFunc = (render) => function(id, title, src="") {
	var result = [];
	months().forEach((month, index) =>  
		result.push(render(id+"_"+month, title+" "+help.monthName(month))));	
	return function(data){
		result.forEach((func, index) => func(data[index+1+'']));	
	}
};

exports.charts = {
	draw: function(ids, div){
		this.redraw = function() {ids.forEach(id => {
			div.appendChild(rendF[id].html());
			rendF[id].func();
		})
			this.redraw();	
		}
	},
	redraw: undefined 
}


var dataset_struct = {
	src: undefined,
	file: undefined,
	preset: undefined,
	cached: {},
	rawData: {},
	parser: undefined, 
	render: undefined,
	reader: Papa.parse,
	contFunc: function(reset=false, page=''){	
		if(Object.keys(this.rawData).length > 0) return false
		if(reset) this.cached = {};
		if(this.rawData)
			var ref = this;
		this.file.forEach(file => {
			function data(file){
				return new Promise(function(resolve, reject){
					ref.preset.complete = function(result){
						resolve(ref.parser(result, ref.src));
					};
					ref.reader('/'+file, ref.preset)
				}).catch(function(error){
					console.log("FAILED TO LOAD DATA")
					console.log(error);
				})
			};
			if(!this.rawData[file]) this.rawData[file] = data(file);
		})
	},
	init: function(id, tag, renderTag=tag){
		// console.log(id)
		// console.log(tag)
		// console.log(this)
		var render = this.render;
		// console.log(renders)
		// console.log(this)
		var rawData = this.rawData;
		// console.log(rawData)	
		// var promise = path();
		var promise = rawData[Object.keys(rawData)[0]];
		// console.log(promise)

		new Promise(function(resolve, reject){
			// console.log(render)
			// console.log(renderTag)
			if(tag) render = tagApply(render, renderTag);
			resolve(render);
		}).then(function(result){
			render = result(id)
			promise.then(function(data){
				var result = data
				if(tag){
					result = tagApply(data, tag);
				}
				render(result);
				return data
			})
		}).catch(function(err){
			console.log(err)
		});
	},
	clone: function(){
		return Object.assign({}, this);
	},
	create: function(src, file, preset, parser, render, reader = Papa.parse){
		var res = this.clone();
		res.rawData = {};
		res.cached = {};
		if(Array.isArray(file)){
			res.file = file;
		}else{
			res.file = [file];
		}
		res.src = src;
		res.preset = preset;
		res.parser = parser;
		res.render = render;
		res.reader = reader;
		return res;
	},
}

var config = {
	//// gisstemp:{
	// 	preset: function(complete){
	// 		return {
	// 			// //worker: useWebWorker,
	// 			header: true,
	// 			delimiter: ',',
	// 			download: true,
	// 			skipEmptyLines: true,
	// 			dynamicTyping: true,
	// 			comments: 'Station',
	// 			complete: complete, 
	// 		};	
	// 	},
	// 	cached: undefined,
	// 	parser: parseGISSTEMP,
	// },

	zonal: dataset_struct.create(
		src = 'https://nicklassundin.github.io/abisko-climate-plots/', 
		// TODO place holder for later database
		file = "data/ZonAnn.Ts.csv",
		preset = {
			//worker: useWebWorker,
			header: true,
			delimiter: ',',
			download: true,
			skipEmptyLines: true,
			dynamicTyping: true,
		},
		parser = parse.GISSTEMPzonalMeans,
		render = {
			'64n-90n': renders.TemperatureDifference,
			'nhem': renders.TemperatureDifference,
			'glob': renders.TemperatureDifference,
		},
		reader = Papa.parse),
	abisko: dataset_struct.create(
		src = '',
		file = "data/ANS_Temp_Prec.csv",
		preset = {
			//worker: useWebWorker,
			header: true,
			//delimiter: ';',
			download: true,
			skipEmptyLines: true,
			dynamicTyping: false,
		},
		parser = parse.AbiskoCsv,
		render = {
			'temperatures': {
				'yrly': renders.Temperature,
				'summer': renders.Temperature,
				'winter': renders.Temperature,
				'monthly': monthlyFunc(renders.Temperature),
				'difference': renders.TemperatureDifference,
			},

			'precipitation':{
				'yrly': renders.YearlyPrecipitation,
				'summer': renders.YearlyPrecipitation,
				'winter': renders.YearlyPrecipitation,
				'monthly': monthlyFunc(renders.MonthlyPrecipitation),
				'difference': renders.PrecipitationDifference,
			},
			'growingSeason': renders.GrowingSeason,

		},
		reader = Papa.parse),
	tornetrask: dataset_struct.create(
		src = '',
		file = "data/Tornetrask_islaggning_islossning.csv",
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.AbiskoIceData,
		render = renders.AbiskoIce,
		reader = Papa.parse),
	tornetrask_iceTime: dataset_struct.create(
		src = '',
		file = "data/Tornetrask_islaggning_islossning.csv",
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.AbiskoIceData,
		render = renders.AbiskoIceTime,
		reader = Papa.parse),
	abiskoSnowDepth: dataset_struct.create(
		src = '',
		file = "data/ANS_SnowDepth.csv",
		preset = {
			//worker: useWebWorker, TODO BUG waiting for response
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.AbiskoSnowData,
		render = {
			'periodMeans': renders.AbiskoSnow,
			'decadeMeans': renders.AbiskoSnow,
		},
		reader = Papa.parse),
	weeklyCO2: dataset_struct.create(
		src ='',
		file = "data/weekly_in_situ_co2_mlo.csv",
		preset = {
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.SCRIPPS_CO2,
		render = {
			'weekly': renders.CO2,
			'monthly': renders.CO2,
		},
		reader = Papa.parse),

	permaHistogramCALM: dataset_struct.create(
		src = '',
		file = "data/CALM.csv",
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		parser = parse.CALM,
		render = renders.Perma,
		reader = Papa.parse),
	smhiTemp: dataset_struct.create(
		src = '',
		file = [
			"data/"+station+"/temperature.csv"
		],
		preset = {
			header: true,
			download: true,
			skipEmptyLines: true,
			beforeFirstChunk: function(result){
				// console.log(result)
				result = result.split("\n")
				var line = result.findIndex(x => x.indexOf("Tidsutsnitt:") > -1)  
				result.splice(0,line);
				result = result.join("\r\n");
				return result
			}
		},
		parser = parse.smhiTemp,
		render = {
			yrly: renders.Temperature,
		}),
}

// wander down the data structure with tag input example: [high, medium, low]
var tagApply = function(data, tag){
	var result = data;
	try{
		tag.forEach(each => {
			result = result[each];
		})	
	}catch(err){
		// console.log(err)
		result = result[tag]
	}
	return result;
}

selectText = function(e){
	if(e === document.activeElement){
		e.blur();
	}else{
		e.focus();
		e.select();
	}
};
// exports.selectText = selectText;

var copy = function() {
	var body = doc,
		html = document.documentElement;
	var height = Math.max( body.scrollHeight, body.offsetHeight, 
		html.clientHeight, html.scrollHeight, html.offsetHeight );
	var href = (""+window.location).split('share=true').join('share=false');
	input.setAttribute('value', "<iframe src='"+href+"' width='100%' height='"+height+"' frameBorder=''0'></iframe>") // TODO ifram
	var copyText = document.getElementById("input");
	copyText.select();
	document.execCommand("copy");
	alert(copyText.value);
}

var getID = function(param=urlParams){
	var id = param.get('id');
	if(id){
		id = id.split(',');
	}else{
		id = ['AbiskoTemperatures',
			'AbiskoTemperaturesSummer',
			'AbiskoTemperaturesWinter',
			'monthlyAbiskoTemperatures',
			'growingSeason',
			'temperatureDifferenceAbisko',
			'temperatureDifference1',
			'temperatureDifference2',
			'temperatureDifference3',
			'yearlyPrecipitation',
			'summerPrecipitation',
			'winterPrecipitation',
			'monthlyPrecipitation',
			'yearlyPrecipitationDifference',
			'summerPrecipitationDifference',
			'winterPrecipitationDifference',
			'abiskoSnowDepthPeriodMeans',
			'abiskoSnowDepthPeriodMeans2',
			'abiskoLakeIce',
			'weeklyCO2',
			'permaHistogramCALM',
		];
	}
	return id
}

var urlParams = new URLSearchParams(window.location.search);
var baseline = null;
var baselineForm = undefined;


var buildChart = function(doc, id, reset=false){
	var call = function(id){
		return new Promise(function(resolve,reject){
			try{
				resolve(true);
				doc.appendChild(rendF[id].html(debug, doc));	
				rendF[id].func(reset);
			}catch(err){
				reject(err)
			}
		})
	}

	var sequence = function(array){
		var target = array.shift();
		if(target){
			call(target).then(function(){
				sequence(array);
			}).catch(function(err){
				// TODO Improve quality
				var div = document.createElement("div");
				div.innerHTML = "[PLACEHOLDER ERROR] - Sorry we couldn't deliver the graph you deserved, if you have block adder on try turning in off. "
				var error = document.createElement("div");
				error.innerHTML = err;
				doc.appendChild(div)
				doc.appendChild(error)
				console.log("failed to render: "+target)
			})
		}
	};	
	var debug = urlParams.get('debug');
	if(!Array.isArray(ids)) ids = [ids];
	sequence(ids)

	if(urlParams.get('share')=='true'){
		var input = document.createElement("input");
		input.setAttribute('id', 'input');
		input.setAttribute('type', 'text');
		var body = doc;
		var html = document.documentElement;
		var height = Math.max( body.scrollHeight, body.offsetHeight, 
			html.clientHeight, html.scrollHeight, html.offsetHeight );
		input.setAttribute('value', "<iframe src='"+window.location+"&share=false"+"' width='100%' height='"+height+"'></iframe>") // TODO ifram
		doc.appendChild(input);
		var cp = document.createElement("button");
		cp.innerHTML = 'Copy link';
		cp.setAttribute('onclick', "copy()");
		doc.appendChild(cp);
	}
	// disable context menu TODO event handler maybe
	doc.oncontextmenu = function(){
		return false;
	};
	return doc
}
exports.buildChart = buildChart;

var createDiv = function(id, no=null){
	var div = document.createElement('div');
	div.setAttribute("id",id);
	var overlay = document.createElement('div');
	overlay.setAttribute("id", id+"overlay");
	overlay.setAttribute("class","overlay");
	var fig = document.createElement('figure');
	if(no){
		var remove = getID().filter(each => each!=id.split('_')[0]);
		if(remove){
			var del = document.createElement('a');
			del.setAttribute('href', getUrl(uid=remove))
			del.innerHTML = 'remove ';
			fig.appendChild(del);
		}

		var a = document.createElement('a');
		a.innerHTML = 'no: '+no;
		fig.appendChild(a);

		var aID = document.createElement('a');
		aID.innerHTML = ' id: '+id;
		fig.appendChild(aID);
	}
	fig.appendChild(div);
	fig.appendChild(overlay);
	return fig
}

rendF = {
	// TODO
	// build: function(rendID, sub){
	// 		config[id].contFunc(reset);
	// 		config[id].init(rendID, sub);
	// 	}

	// 'northernHemisphere': {
	// 	func: function(reset=false) {
	// 		functorGISSTEMP('data/NH.Ts.csv',renderTemperature,'https://data.giss.nasa.gov/gistemp/')('northernHemisphere','Northern Hemisphere temperatures');
	// 	},
	// 	html: function(debug=false, doc){
	// 		var no = 16;
	// 		if(!debug) no = debug;
	// 		return createDiv('northernHemisphere', no);

	// 	},
	// },
	// 'globalTemperatures': {
	// 	func: function(reset=false){
	// 		functorGISSTEMP('data/GLB.Ts.csv',renderTemperature, 'https://data.giss.nasa.gov/gistemp/')('globalTemperatures','Global temperatures');
	// 	},
	// 	html: function(debug=false, doc){
	// 		var no = 17;
	// 		if(!debug) no = debug;
	// 		return createDiv('globalTemperatures', no);

	// 	},
	// },
	'temperatureDifference1': {
		func: function(reset=false){
			config['zonal'].contFunc(reset);
			config['zonal'].init('temperatureDifference1','64n-90n')
			// contFunc(reset,'zonal', 'data/ZonAnn.Ts.csv','https:data.giss.nasa.gov/gistemp/')('temperatureDifference1','64n-90n')
		},
		html: function(debug=false, doc){
			var no = 20;
			if(!debug) no = debug;
			return createDiv('temperatureDifference1', no);

		},
	},
	'temperatureDifference2': {
		func: function(reset=false){
			config['zonal'].contFunc(reset);
			config['zonal'].init('temperatureDifference2','nhem');
			// contFunc(reset,'zonal', 'data/ZonAnn.Ts.csv','https:data.giss.nasa.gov/gistemp/')('temperatureDifference2','nhem');
		},
		html: function(debug=false, doc){
			var no = 21;
			if(!debug) no = debug;
			return createDiv('temperatureDifference2', no);

		},
	},
	'temperatureDifference3': {
		func: function(reset=false){
			config['zonal'].contFunc(reset);
			config['zonal'].init('temperatureDifference3', 'glob');
		},
		html: function(debug=false, doc){
			var no = 22;
			if(!debug) no = debug;
			return createDiv('temperatureDifference3', no);

		},
	},
	'arcticTemperatures': {
		func: function(reset=false){alert("PLACE HOLDER")}, 
		html: function(debug=false, doc){
			var no = 16.1;
			if(!debug) no = debug;
			return createDiv('arcticTemperatures', no);

		},
	},
	'abiskoLakeIce':{
		func: function(reset=false){
			// contFunc(reset,'tornetrask', "data/Tornetrask_islaggning_islossning.csv", "https://www.arcticcirc.net/")('abiskoLakeIce')
			config['tornetrask'].contFunc(reset);
			config['tornetrask'].init('abiskoLakeIce')
		},
		html: function(debug=false, doc){
			var no = 43;
			if(!debug) no = debug;
			return createDiv('abiskoLakeIce', no);

		},
	}, 
	'abiskoLakeIceTime':{
		func: function(reset=false){
			// contFunc(reset,'tornetrask', "data/Tornetrask_islaggning_islossning.csv", "https://www.arcticcirc.net/")('abiskoLakeIce')
			config['tornetrask_iceTime'].contFunc(reset);
			config['tornetrask_iceTime'].init('abiskoLakeIceTime')
		},
		html: function(debug=false, doc){
			var no = 43;
			if(!debug) no = debug;
			return createDiv('abiskoLakeIceTime', no);

		},
	}, 
	'abiskoSnowDepthPeriodMeans':{
		func: function(reset=false) {
			config['abiskoSnowDepth'].contFunc(reset);
			config['abiskoSnowDepth'].init("abiskoSnowDepthPeriodMeans", "periodMeans")
		},

		html: function(debug=false, doc){
			var no = 41;
			if(!debug) no = debug;
			return createDiv('abiskoSnowDepthPeriodMeans', no)
		},
	},
	'abiskoSnowDepthPeriodMeans2':{
		func: function(reset=false) {
			config['abiskoSnowDepth'].contFunc(reset);
			config['abiskoSnowDepth'].init("abiskoSnowDepthPeriodMeans2","decadeMeans")
		},
		html: function(debug=false, doc){
			var no = 42;
			if(!debug) no = debug;
			return createDiv('abiskoSnowDepthPeriodMeans2',no)
		},
	},
	'AbiskoTemperatures':{
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('AbiskoTemperatures',['temperatures','yrly']);
			// contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('AbiskoTemperatures',['temperatures','yrly']);
		},
		html: function(debug=false, doc){
			var no = 1;
			if(!debug) no = debug;
			return createDiv('AbiskoTemperatures', no);
		},

	}, 
	'AbiskoTemperaturesSummer': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('AbiskoTemperaturesSummer', ['temperatures','summer']);
		},
		html: function(debug=false, doc){
			var no = 2;
			if(!debug) no = debug;
			return createDiv('AbiskoTemperaturesSummer', no);
		},
	}, 
	'AbiskoTemperaturesWinter': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('AbiskoTemperaturesWinter', ['temperatures','winter']);
		},
		html: function(debug=false, doc){
			var no = 3;
			if(!debug) no = debug;
			return createDiv('AbiskoTemperaturesWinter', no);

		},
	},
	'temperatureDifferenceAbisko': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('temperatureDifferenceAbisko', ['temperatures','yrly'],['temperatures','difference'])
			// contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('temperatureDifferenceAbisko', ['temperatures','yrly'],['temperatures','difference'])
		},
		html: function(debug=false, doc){
			var no = 19;
			if(!debug) no = debug;
			return createDiv('temperatureDifferenceAbisko', no);

		},
	},
	'monthlyAbiskoTemperatures': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('monthlyAbiskoTemperatures', ['temperatures','monthly'])
			// contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('monthlyAbiskoTemperatures', ['temperatures','monthly'])
		},
		html: function(debug=false, doc){
			var no = 4;
			var div = document.createElement("div");
			div.setAttribute("id","monthlyAbiskoTemperatures");
			if(debug){
				months().forEach((month, index) => {
					div.appendChild(createDiv('monthlyAbiskoTemperatures_'+month, no+index))
				})

			}else{
				months().forEach((month, index) => {
					div.appendChild(createDiv('monthlyAbiskoTemperatures_'+month));
				})

			}
			return div;

		},
	}, 
	'yearlyPrecipitation': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('yearlyPrecipitation', ['precipitation','yrly'])
			// contFunc(reset,"abisko",csv.abisko.temp,csv.abisko.src)('yearlyPrecipitation', ['precipitation','yrly'])
		},
		html: function(debug=false, doc){
			var no = 23;
			if(!debug) no = debug;
			return createDiv('yearlyPrecipitation', no);

		},
	}, 
	'summerPrecipitation': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('summerPrecipitation', ['precipitation','summer'])
		},
		html: function(debug=false, doc){
			var no = 24;
			if(!debug) no = debug;
			return createDiv('summerPrecipitation', no);

		},
	}, 
	'winterPrecipitation': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('winterPrecipitation', ['precipitation','winter'])
		},
		html: function(debug=false, doc){
			var no = 25;
			if(!debug) no = debug;
			return createDiv('winterPrecipitation', no);

		},
	}, 
	'yearlyPrecipitationDifference': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('yearlyPrecipitationDifference', ['precipitation','yrly'], ['precipitation','difference']);
		},
		html: function(debug=false, doc){
			var no = 38;
			if(!debug) no = debug;
			return createDiv('yearlyPrecipitationDifference', no);

		},
	}, 
	'summerPrecipitationDifference': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('summerPrecipitationDifference', ['precipitation','summer'], ['precipitation','difference']);
		},
		html: function(debug=false, doc){
			var no = 39;
			if(!debug) no = debug;
			return createDiv('summerPrecipitationDifference', no);

		},
	}, 
	'winterPrecipitationDifference': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('winterPrecipitationDifference', ['precipitation','winter'],['precipitation','difference']);
		},
		html: function(debug=false, doc){
			var no = 40;
			if(!debug) no = debug;
			return createDiv('winterPrecipitationDifference', no);

		},
	}, 
	'monthlyPrecipitation': {
		func: function(reset=false){
			config['abisko'].contFunc(reset);
			config['abisko'].init('monthlyPrecipitation', ['precipitation','monthly'])
		},
		html: function(debug=false, doc){
			var no = 26;
			var div = document.createElement('div');
			div.setAttribute("id", "monthlyPrecipitation")
			if(debug){
				months().forEach((month, index) => {
					div.appendChild(createDiv('monthlyPrecipitation_'+month, no+index));
				})

			}else{
				months().forEach((month, index) => {
					div.appendChild(createDiv('monthlyPrecipitation_'+month))
				})

			}
			return div

		},
	}, 
	'growingSeason': {
		func: function(reset=false){

			config['abisko'].contFunc(reset);
			config['abisko'].init('growingSeason', 'growingSeason')
		},
		html: function(debug=false, doc){
			var no = 18;
			if(!debug) no = debug;
			return createDiv('growingSeason', no);

		}
	},
	'weeklyCO2': {
		func: function(reset=false){
			config['weeklyCO2'].contFunc(reset);
			config['weeklyCO2'].init('weeklyCO2', 'weekly')
		},
		html: function(debug=false, doc){
			var no = 44;
			if(!debug) no = debug;
			return createDiv('weeklyCO2', no);
		}
	},
	'permaHistogramCALM': {
		func: function(reset=false){
			config['permaHistogramCALM'].contFunc(reset);
			config['permaHistogramCALM'].init('permaHistogramCALM','')
		},
		html: function(debug=false, doc){
			var no = 45;
			if(!debug) no = debug;
			return createDiv("permaHistogramCALM", no);
		}
	},
	'smhiTemp': {
		func: function(reset=false){
			config['smhiTemp'].contFunc(reset)
			config['smhiTemp'].init('smhiTemp', 'yrly');
		},
		html: function(debug=false, doc){
			var no = 46;
			if(!debug) no = debug;
			return createDiv("smhiTemp", no);
		}
	}
}

},{"../config/highcharts_config.js":1,"./helpers.js":3,"./render.js":5,"./stats.js":6,"jquery":8,"papaparse":9}],5:[function(require,module,exports){
// const Highcharts = require(['highcharts'], function(Highcharts){
// 	return Highcharts
// });
const highchart_help = require('../config/highcharts_config.js');
const language = require('../config/language.json');
const lib = require('./lib.js')
const Highcharts = require('highcharts');
var help = require('./helpers.js');

var baseline = null;
// var baselineLower = help.baselineLower;
// var baselineUpper = help.baselineUpper;

var charts = highchart_help.charts;

var dateToYear = function(entries){
	return entries.map(each => ({
		y: each.y,
		x: each.x.getFullYear(),
	}))
}


var precipColor = '#550965';

var snowColor = {
	color: '#CDD8F0',
	borderColor: '#5F7CB9',
	hover: '#eeeeff',
};

var rainColor = {
	color: '#1000FB',
	borderColor: '#5F7CB9',
	hover: '#3333ff',
};


var updatePlot = highchart_help.updatePlot;

// TODO Seperate them to one constructor with general input for reuse
var createBaseline = function(ver=true, change){
	var urlParams = new URLSearchParams(window.location.search);
	var text = language[nav_lang]['baselineform'];
	var createInput = function(name, value, div=document.createElement('div')){
		var submit = change;
		if(submit){
			submit = submit+"('baseline"+name+"')"
		}else{
			submit = "submit(this)"
		}
		var label = document.createElement('label');
		label.setAttribute("for","baselineLower");
		label.innerHTML = text[name.toLowerCase()];
		var input = document.createElement('input');
		input.setAttribute("size","4")
		input.setAttribute("maxlength","4")
		input.setAttribute("name","baseline"+name);
		input.setAttribute("type","text");
		input.setAttribute("value",value);
		input.setAttribute("onClick",onclick="selectText(this)")
		input.setAttribute("onChange",onchange=submit+'(this.value)')
		div.appendChild(label)
		div.appendChild(input)
		return div;
	}
	var form = document.createElement('form');
	form.setAttribute("id",baseline);
	var header = document.createElement('header');
	header.innerHTML = text.title;

	var lower = createInput("Lower", baselineLower);
	if(ver) lower.appendChild(document.createElement('br'));

	var upper = createInput("Upper", baselineUpper,lower);

	var br2 = document.createElement('br');
	form.appendChild(header)
	form.appendChild(lower)
	form.appendChild(upper)
	if(ver)form.appendChild(br2)

	// Hidden option because magic
	var value = urlParams.get('id');
	if(value){
		var id = document.createElement('input');
		id.setAttribute("type","hidden");
		id.setAttribute("name", "id");
		id.setAttribute("value",''+value);
		form.appendChild(id);
	}	
	value = urlParams.get('debug');
	if(value){
		var debug = document.createElement('input');
		debug.setAttribute("type","hidden");
		debug.setAttribute("name", "debug");
		debug.setAttribute("value",''+ value);
		form.appendChild(debug);
	}
	value = urlParams.get('share');
	if(value){
		var share = document.createElement('input');
		share.setAttribute("type","hidden");
		share.setAttribute("name", "share");
		share.setAttribute("value",''+value);
		form.appendChild(share);
	}
	var input = document.createElement('input');
	var input = document.createElement('input');
	input.setAttribute("type","submit")
	if(ver)form.appendChild(input)
	return form;
}




var resetPlot = function(id){
	return function(a){
		return function(b){
			switch(a){
				case "baselineLower": 
					// console.log("Lower")
					baselineLower=b;
					break;
				case "baselineUpper": 
					// console.log("Upper")
					baselineUpper=b;
					break;	
				default: 
					break;
			}
			document.getElementById(id.id+"overlay").style.display = "none";
			updatePlot(id.id);
		}
	}
}

var baselineUI = function(id) {
	return annotations = [{
		labelOptions: {
			verticalAlign: 'top',
			crop: false,
			// shape: 'connector',
			y: 0,
			borderRadius: 5,
			backgroundColor: 'rgb(245, 245, 245)',
			borderWidth: 1,
			borderColor: '#AAA'
			// distance: 20,
		},
		draggable: 'x',
		labels: [{
			text: createBaseline(false,submit="resetPlot("+id+")").innerHTML,
			point: {
				xAxis: 0,
				yAxis: 10,
				x: baselineLower - (baselineLower-baselineUpper)/2,
				y: 2,
			},
			useHTML: true,
			style: {
				// width: '100%',
				// fontSize: '70%'
				opacity: .4,
			},
		}],
		events: {
			afterUpdate: function(e){
				var mov = parseInt(e.target.options.labels[0].x/12);
				if(!mov) mov = 0; 
				var dif = baselineUpper-baselineLower;
				var mid = baselineLower +dif/2+mov;
				if(2019-dif/2 < mid) mid = 2019-dif/2;
				if(1913+dif/2 > mid) mid = 1913+dif/2;
				baselineLower = parseInt(mid - dif/2);
				baselineUpper = parseInt(mid + dif/2);
				updatePlot(this)(id);
			},
			// TODO events for filling out form
			mouseover: function(e){
				// console.log(e.target.options.labels[0])
			},
			mouseclick: function(e){
				console.log(e)
			}
		}
	}];
}

var addInput = function(){	
	var input = document.createElement("input");
	input.setAttribute("type", "date");
	return input;
}
var appendChild = function(parentId,element){
	return function(){
		document.getElementById(id).appendChild(element);
	}
}

var plotlines = function(id){
	return plotLines = [{
		color: 'rgb(160, 160, 160)',
		value: baselineUpper,
		width: 1,
		useHTML: true,
		label: {
			useHTML: true,
			text: "<input id="+id+"uppLabel type=text class=input value="+baselineUpper+" maxlength=4 onclick=selectText(this) onchange=updatePlot("+id+","+baselineLower+",this.value)></input>",
			rotation: 0,
			y: 12,
		},
		zIndex: 1,
	},{
		color: 'rgb(160, 160, 160)',
		value: baselineLower,
		width: 1,
		useHTML: true,
		label: {
			useHTML: true,
			text: "<input id="+id+"lowLabel type=text class=input value="+baselineLower+" maxlength=4 onclick=selectText(this) onchange=updatePlot("+id+",this.value,"+baselineUpper+")></input>",
			rotation: 0,
			textAlign: 'left',
			x: -40,
			y: 12,
		},
		zIndex: 5,
	}];
}
var plotBandsDiff = function(id){
	return {
		color: 'rgb(245, 245, 245)',
		from: baselineLower,
		to: baselineUpper,
		label: {
			useHTML: true,
			text: "<div id="+id+"-plotBands-Label>Baseline</div>",
		},
		events: {
			click: function(e){
				var lowLabel = document.getElementById(id+"lowLabel");
				var uppLabel = document.getElementById(id+"uppLabel");
				selectText(lowLabel);
				// document.getElementById(id+"overlay").style.display = "block";
			},
		}
	};
}


var init_HighChart = () => Highcharts.setOptions(highchart_help.highcharts_Settings);
init_HighChart();

// TODO generalize render function

exports.graphs = {
	CO2: function(id){
		// console.log(id)
		// console.log(data)
		// var meta = data.meta;
		var overlay = document.getElementById(id+"overlay");
		var form = document.createElement("form");
		var div = document.createElement("div");
		div.setAttribute("id", id+"overlay"+"-input");
		div.appendChild(addInput());

		// var add = document.createElement("button")
		// add.innerHTML = "add"
		// add.setAttribute("onclick","appendChild("+id+"overlay"+"-input,addInput())");

		var submit = document.createElement("input")
		submit.setAttribute("type", "submit");
		var br = document.createElement("br");

		form.appendChild(div);
		form.appendChild(br);
		form.appendChild(br);
		form.appendChild(submit);
		// overlay.appendChild(add);
		overlay.appendChild(form);
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'area',
				zoomType: 'x',
			},
			title: {
				text: this.Highcharts.getOptions().lang.titles[id],
				useHTML: true,
			},
			legend: {
				enabled: false,
			},
			plotOptions: {
				series: {
					marker: {
						enabledThreshold: 0,
						radius: 1,
						states: {
							select: {
								lineColor: "#6666bb",
								lineWidth: 1,
								radius: 5,
							},
							hover: {
								radiusPlus: 5,
							},

						}
					},
					allowPointSelect: true,
					point: {
						events: {
							select: function () {
								var date = new Date(this.category);
								var text = "Date: "+ date.getFullYear() +"-"+ date.getMonth()+"-"+date.getDate() +"<br/>CO"+ ("2".sub())+": " + this.y + ' ppm';
								var chart = this.series.chart;
								if (!chart.lbl) {
									chart.lbl = chart.renderer.label(text, 200, 70,"callout", this.catergory, this.y, useHTML=true)
										.attr({
											padding: 10,
											r: 5,
											fill: Highcharts.getOptions().colors[1],
											zIndex: 5
										})
										.css({
											color: '#FFFFFF'
										})
										.add();
								} else {
									chart.lbl.attr({
										text: text
									});
								}
							},
						}
					}

				}
			},
			dataSrc: undefined,
			xAxis: {
				type: 'datetime',
				title: {
					text: this.Highcharts.getOptions().lang.years, 
				},
				crosshair: true,
				lineWidth: 1,
				gridLineWidth: 1,
				minorTickInterval: null,
			},
			yAxis: {
				title: {
					text: "CO"+("2".sub()), // TODO localization
					useHTML: true,
				},
				// plotLines: [{
				// value: 0,
				// color: 'rgb(204, 214, 235)',
				// width: 2,
				// }],
				plotLines:[{
					color: '#aaaaaa',
					dashStyle: 'shortDash',
					value: 350,
					width: 2,
					label: {
						text: "350 ppm",
						style: {
							color: '#aaaaaa',
							fontWeight: 'bold',
						}
					},
					zIndex: 2,
				},{
					color: '#aaaaaa',
					dashStyle: 'shortDash',
					value: 400,
					width: 2,
					label: {
						text: "400 ppm",
						style: {
							color: '#aaaaaa',
							fontWeight: 'bold',
						}
					},
					zIndex: 1,
				}],
				tickInterval: 10,
				lineWidth: 1,
			},
			tooltip: {
				shared: true,
				valueSuffix: ' ppm',
				valueDecimals: 2,
			},
			series: [{
				data: [null, null],
			}]
		});
		charts[id].showLoading()	
		return function(data){
			charts[id].hideLoading();
			charts[id].update({
				legend: {
					enabled: true,
				},
				yAxis: {
					max: data.values[data.values.length-1].y+30,
					min: data.values[0].y-10,
				},
				series: [{
					name: "CO"+("2".sub()),
					lineWidth: 2,
					// marker: { radius: 2 },
					states: { hover: { lineWidthPlus: 0 } },
					color: '#5555bb',
					data: data.values,
					turboThreshold: 4000,
					fillOpacity: 0.2,
					marker: {
						states: {
							select: {
								fillColor: 'red',
								lineWidth: 3
							}
						}
					},
					zIndex: 6,
				},
					// {
					// name: this.Highcharts.getOptions().lang.linReg+"<br/>( R2: "+data.linReg.r2+" )",
					// useHTML: true,
					// data: data.linReg.points, 
					// type: 'line',
					// lineWidth: 2,
					// marker: {enabled: false,},
					// states: { hover: { lineWidthPlus: 0 } },
					// color: '#333377',
					// visible: false,
					// }
				]
			})

		}
	},
	Temperature: function (id) {
		// console.log(id)
		// console.log(promise)
		// console.log(data.max.max())
		var title = id.split('_');

		var div_id = id;
		var id = title[0];
		charts[div_id] = Highcharts.chart(div_id, {
			chart: {
				type: 'line',
				zoomType: 'x',
			},
			legend: {
				enabled: false,
			},
			title: {
				text: function(){
					var month = '';
					if(title[1]){
						month = ' '+this.Highcharts.getOptions().lang.months[title[1]];
						return this.Highcharts.getOptions().lang.titles[id]+month;
					} 
					return this.Highcharts.getOptions().lang.titles[id];
				}()
			},
			xAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.years, 
				},
				crosshair: true,
				min: 1912,
			},
			yAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.temp, 
				},
				plotLines: [{
					value: 0,
					color: 'rgb(204, 214, 235)',
					width: 2,
				}],
				// max: 60,
				// min: -20,
				tickInterval: 1,
				lineWidth: 1,
			},
			tooltip: {
				shared: true,
				valueSuffix: ' °C',
				valueDecimals: 2,
			},
			series: [
				{
					data: [null, null],
				},
				{
					data: [null, null],
				},
				{
					data: [null, null],
				},
				// {
				// 	data: [null, null],
				// },
				// {
				// 	data: [null, null],
				// },
				// {
				// 	data: [null, null],
				// },
			]
		});
		charts[div_id].showLoading();
		return function(data){
			charts[div_id].hideLoading();
			// var meta = data.meta;
			charts[div_id].update({
				legend: {
					enabled: true,
				},
				// dataSrc: meta.src,
				series: [{
					name: this.Highcharts.getOptions().lang.max,
					lineWidth: 0,
					marker: { radius: 2 },
					states: { hover: { lineWidthPlus: 0 } },
					color: '#ff0000',
					data: data.max.max(), 
					visible: false,
					showInLegend: !(typeof data.min === 'undefined'),
				},{
					name: this.Highcharts.getOptions().lang.min,
					lineWidth: 0,
					marker: { radius: 2 },
					states: { hover: { lineWidthPlus: 0 } },
					color: '#0000ff',
					data: data.min.min(),
					visible: false,
					showInLegend: !(typeof data.min === 'undefined'),
				},
					// {
					// name: 	this.Highcharts.getOptions().lang.yearlyCI,
					// type: 'arearange',
					// color: '#888888',
					// data: data.avg.plotCI(),
					// zIndex: 0,
					// fillOpacity: 0.3,
					// lineWidth: 0,
					// states: { hover: { lineWidthPlus: 0 } },
					// marker: { enabled: false },
					// visible: false,
					// },
					// {
					// name: this.Highcharts.getOptions().lang.movAvg,
					// color: '#888888',
					// marker: { enabled: false },
					// data: data.avg.plotMovAvg(),
					// }, 
					// {
					// name: 	this.Highcharts.getOptions().lang.movAvgCI,
					// type: 'arearange',
					// color: '#7777ff',
					// data: data.avg.plotMovAvgCI(),
					// zIndex: 0,
					// fillOpacity: 0.3,
					// lineWidth: 0,
					// states: { hover: { lineWidthPlus: 0 } },
					// marker: { enabled: false },
					// visible: false,
					// },
					{
						name: language[nav_lang].yearlyAvg,
						regression: true,
						marker: {radius: 2},
						states: {hover: { lineWidthPlus: 0 }},
						lineWidth: 0,
						color: '#888888',
						regressionSettings: {
							type: 'linear',
							color: '#888888',
							// color: '#4444ff',
							// '#888888'
							name: this.Highcharts.getOptions().lang.linReg,
						},
						data: data.avg.values,
					}],
			});
		}
	},

	TemperatureDifference: function (id) {
		// console.log(temperatures);
		// console.log(temperatures.difference());
		var overlay = document.getElementById(id+"overlay");
		overlay.appendChild(createBaseline(false,submit="resetPlot("+id+")"));
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'column'
			},
			// rangeSelector: {
			// selected: 2
			// },
			title: {
				text: this.Highcharts.getOptions().lang.titles[id],
			},
			subtitle: {
				text: this.Highcharts.getOptions().lang.subtitles.baseline + baselineLower +" - "+ baselineUpper 
			},
			// annotations: baselineUI(id),
			xAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.years,
				},
				crosshair: true,
				plotLines: plotlines(id),
				plotBands: plotBandsDiff(id),
				min: 1913,
			},
			yAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.temp,
				},
				lineWidth: 1,
				min: -2,
				max: 3,
				tickInterval: 1,
			},
			tooltip: {
				shared: true,
				valueSuffix: ' °C',
				valueDecimals: 2,
			},
			legend: {
				enabled: false,
			},
			series: [{data: [null, null]}]
		})
		charts[id].showLoading();
		return function(temperatures){
			charts[id].hideLoading();
			charts[id].update({
				legend: {
					enabled: true,
				},
				dataSrc: temperatures.src,
				series: [{
					regression: false, // TODO adv options 
					regressionSettings: {
						type: 'linear',
						color: '#aa0000',
						name: this.Highcharts.getOptions().lang.linReg,
					},
					name: this.Highcharts.getOptions().lang.diff,
					data: (temperatures.difference!=undefined) ? temperatures.difference() : temperatures.avg.difference(),
					color: 'red',
					negativeColor: 'blue',
				}],
			});
		}
		// $('.highcharts-annotations-labels text').bind('mouseover',function(e){
		// alert("You hover on "+$(this).text())
		// });
	},

	GrowingSeason: function (id) {
		// console.log(season)
		// console.log(season.max())
		// console.log(season.variance())
		// console.log(season.plotCI())
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'line',
				zoomType: 'x',
			},
			title: {
				text: this.Highcharts.getOptions().lang.titles[id],
			},
			subtitle: {
				text: 'The maximum consecutive weeks with average temperature above freezing.',
			},
			xAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.years,
				},
				crosshair: true,
			},
			yAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.weeks,
				},
				tickInterval: 1,
				lineWidth: 1,
			},
			tooltip: {
				shared: true,
				valueDecimals: 0,
			},
			legend: {
				enabled: false,
			},
			series: [
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				{data: [null, null]}]
		});
		charts[id].showLoading();
		return function(season){
			charts[id].hideLoading();
			// console.log(season)
			charts[id].update({
				legend: {
					enabled: true,
				},
				dataSrc: season.src,
				series: [{
					regression: false,
					regressionSettings: {
						type: 'linear',
						color: '#008800',
						name: this.Highcharts.getOptions().lang.linReg,
					},
					name: this.Highcharts.getOptions().lang.weeks,
					lineWidth: 0,
					marker: { radius: 2 },
					states: { hover: { lineWidthPlus: 0 } },
					color: '#00aa00',
					data: season.values,
					visible: true,
				},
					// { 
					// name: this.Highcharts.getOptions().lang.ci,
					// type: 'arearange',
					// color: '#005500',
					// data: season.plotCI(),
					// zIndex: 0,
					// fillOpacity: 0.3,
					// lineWidth: 0,
					// states: { hover: { lineWidthPlus: 0 } },
					// marker: { enabled: false },
					// visible: false,
					// }, 
					// {
					// name: this.Highcharts.getOptions().lang.movAvg,
					// color: '#00aa00',
					// marker: { enabled: false },
					// data: season.plotMovAvg(),
					// },
					// {
					// name: this.Highcharts.getOptions().lang.movAvgCI,
					// type: 'arearange',
					// color: '#006600',
					// data: season.plotMovAvgCI(),
					// zIndex: 0,
					// fillOpacity: 0.3,
					// lineWidth: 0,
					// states: { hover: { lineWidthPlus: 0 } },
					// marker: { enabled: false },
					// visible: false,
					// }
				],
			});
		}
	},

	PrecipitationDifference: function (id) {
		// console.log(id)
		// console.log(precipitation);
		// console.log(precipitation.total.difference())
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'column'
			},
			title: {
				text: this.Highcharts.getOptions().lang.titles[id],
			},
			subtitle: {
				text: this.Highcharts.getOptions().lang.subtitles.baseline + ' '+ baselineLower +' - '+baselineUpper,
			},
			xAxis: {
				title: {
					text: 'Year',
				},
				crosshair: true,
				plotBands: plotBandsDiff(id),
				plotLines: plotlines(id),
			},
			yAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.prec,
				},
				lineWidth: 1,
				//min: -2,
				//max: 3,
				tickInterval: 1,
			},
			tooltip: {
				shared: true,
				valueSuffix: ' mm',
				valueDecimals: 2,
			},
			legend: {
				enabled: false,
			},
			series: [{data: [null, null]}]
		});
		charts[id].showLoading();
		return function(precipitation){
			charts[id].hideLoading();
			charts[id].update({
				legend: {
					enabled: true,
				},
				dataSrc: precipitation.src,
				// annotations: baselineUI(id),
				series: [{
					name: this.Highcharts.getOptions().lang.diff,
					data: precipitation.total.difference(),
					color: 'red',
					negativeColor: 'blue',
					regression: false,
					regressionSettings: {
						type: 'linear',
						color: rainColor.color,
						name: this.Highcharts.getOptions().lang.linReg,
					},
				}],
			});
		}
	},

	YearlyPrecipitation: function (id) {
		// console.log(precipitation)
		var title = language[nav_lang].titles[id];
		if(typeof title == 'function') title = title();
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'line'
			},
			title: {
				text: title 
			},
			xAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.years,
				},
				crosshair: true,
			},
			yAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.tprec,
				},
				lineWidth: 1,
				floor: 0, // Precipitation can never be negative
			},
			tooltip: {
				shared: true,
				valueSuffix: ' mm',
				valueDecimals: 0,
			},
			legend: {
				enabled: false,
			},
			series: [{data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				{data: [null, null]}],
		})
		charts[id].showLoading();
		return function(precipitation){
			charts[id].hideLoading();
			charts[id].update({
				legend: {
					enabled: true,
				},
				dataSrc: precipitation.src,
				series: [{
					id: 'snow',
					name: this.Highcharts.getOptions().lang.precSnow,
					type: 'column',
					stack: 'precip',
					stacking: 'normal',
					data: precipitation.snow.values,
					color: snowColor.color,
					visible: true,
					borderColor: snowColor.borderColor,
					states: {
						hover: {
							color: snowColor.hover,
							animation: {
								duration: 0,
							},
						},
					},
				},
					// {
					// data: precipitation.snow.linReg.points,
					// type: 'line',
					// color: snowColor.color,
					// name: this.Highcharts.getOptions().lang.linRegSnow,
					// marker: {
					// 	enabled: false, // Linear regression lines doesn't contain points
					// },
					// states: {
					// 	hover: {
					// 		lineWidth: 0, // Do nothing on hover
					// },
					// },
					// },
					// {
					// id: 'movAvg',
					// name: this.Highcharts.getOptions().lang.precMovAvg,
					// color: rainColor.color,
					// visible: false,
					// data: precipitation.total.plotMovAvg(),
					// marker: { enabled: false },
					// states: { hover: { lineWidthPlus: 0 } },
					// },
					// {
					// id: 'ciMovAvg',
					// name: this.Highcharts.getOptions().lang.movAvgCI,
					// type: 'arearange',
					// color: '#000055',
					// data: precipitation.total.plotMovAvgCI(),
					// zIndex: 0,
					// fillOpacity: 0.3,
					// lineWidth: 0,
					// states: { hover: { lineWidthPlus: 0 } },
					// marker: { enabled: false },
					// visible: false,
					// },
					{
						id: 'rain',
						name: this.Highcharts.getOptions().lang.precRain,
						type: 'column',
						stack: 'precip',
						stacking: 'normal',
						visible: true,
						data: precipitation.rain.values,
						color: rainColor.color,
						borderColor: rainColor.borderColor,
						states: {
							hover: {
								color: rainColor.hover,
								animation: {
									duration: 0,
								},
							},
						},
					},
					// {
					// data: precipitation.rain.linReg.points,
					// type: 'line',
					// color: rainColor.color,
					// name: this.Highcharts.getOptions().lang.linRegRain,
					// marker: {
					// 	enabled: false, // Linear regression lines doesn't contain points
					// },
					// states: {
					// 	hover: {
					// 		lineWidth: 0, // Do nothing on hover
					// 	},
					// },
					// },
					// {
					// type: 'line',
					// name: this.Highcharts.getOptions().lang.linRegAll,
					// visible: false,
					// // linkedTo: ':previous',
					// color: 'red',
					// marker: {
					// 	enabled: false, // Linear regression lines doesn't contain points
					// },
					// states: {
					// 	hover: {
					// lineWidth: 0, // Do nothing on hover
					// },
					// },
					// enableMouseTracking: false, // No interactivity
					// data: precipitation.total.linReg.points,
					// }
				],
			});
		}
	},

	MonthlyPrecipitation: function (id) {
		// console.log('renderMonthlyPrecipitationGraph')
		// console.log(id)
		var title = id.split('_');
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'line'
			},
			title: {
				text: function(){ 
					if(title[1]){
						month = ' '+this.Highcharts.getOptions().lang.months[title[1]];
						return this.Highcharts.getOptions().lang.titles[title[0]]+month;
					} 
					return this.Highcharts.getOptions().lang.titles[id];
				}()
			},
			xAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.years,
				},
				crosshair: true,
			},
			yAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.tprec,
				},
				lineWidth: 1,
				max: 150,
				floor: 0, // Precipitation can never be negative
			},
			tooltip: {
				shared: true,
				valueSuffix: ' mm',
				valueDecimals: 0,
			},
			legend: {
				enabled: false,
			},
			series: [
				{data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				{data: [null, null]}]
		})
		charts[id].showLoading();
		return function(precipitation){
			charts[id].hideLoading();
			// console.log(precipitation)
			charts[id].update({
				dataSrc: precipitation.src,
				legend: {
					enabled: true,
				},
				series: [{
					regression: false,
					regressionSettings: {
						type: 'linear',
						color: snowColor.color,
						name: this.Highcharts.getOptions().lang.linRegSnow,
					},
					name: this.Highcharts.getOptions().lang.precSnow,
					type: 'column',
					stack: 'precip',
					stacking: 'normal',
					data: precipitation.snow.values,
					color: snowColor.color,
					borderColor: snowColor.borderColor,
					states: {
						hover: {
							color: snowColor.hover,
							animation: {
								duration: 0,
							},
						},
					},
				},
					// {
					// type: 'line',
					// color: snowColor.color,
					// name: this.Highcharts.getOptions().lang.linRegSnow,
					// data: precipitation.snow.linReg.points,
					// marker: { enabled: false },
					// },
					{
						regression: false,
						regressionSettings: {
							type: 'linear',
							color:rainColor.color,
							name: this.Highcharts.getOptions().lang.linRegRain,
							marker: { enabled: false },
						},
						name: this.Highcharts.getOptions().lang.precRain,
						type: 'column',
						stack: 'precip',
						stacking: 'normal',
						data: precipitation.rain.values,
						color: rainColor.color,
						borderColor: rainColor.borderColor,
						states: {
							hover: {
								color: rainColor.hover,
								animation: {
									duration: 0,
								},
							},
						},
					},
					// {
					// type: 'line',
					// color:rainColor.color,
					// name: this.Highcharts.getOptions().lang.linRegRain,
					// data: precipitation.rain.linReg.points,
					// marker: { enabled: false },
					// },
					// {
					// name: this.Highcharts.getOptions().lang.movAvgCI,
					// type: 'arearange',
					// color: '#000055',
					// data: precipitation.total.plotMovAvgCI(),
					// zIndex: 0,
					// fillOpacity: 0.3,
					// lineWidth: 0,
					// states: { hover: { lineWidthPlus: 0 } },
					// marker: { enabled: false },
					// visible: false,

					// 		},{
					// 			name: this.Highcharts.getOptions().lang.precMovAvg,
					// 			visible: false,
					// 			color: rainColor.color,
					// 			data: precipitation.total.plotMovAvg(),
					// 			marker: { enabled: false },
					// 		},{
					// 			name: this.Highcharts.getOptions().lang.linRegAll,
					// 			visible: false,
					// 			marker: {
					// 				enabled: false, // Linear regression lines doesn't contain points
					// 			},
					// 			color: 'red',
					// 			states: {
					// 				hover: {
					// lineWidth: 0, // Do nothing on hover
					// },
					// },
					// enableMouseTracking: false, // No interactivity
					// data: precipitation.total.linReg.points,
					// }
				],
			});
		}
	},
	AbiskoIceTime: function (id) {
		// console.log(title);
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'line'
			},
			title: {
				text: this.Highcharts.getOptions().lang.titles[id],
			},
			xAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.years,
				},
				crosshair: true,
			},
			yAxis: [{
				title: {
					text: this.Highcharts.getOptions().lang.iceTime,
				},
				lineWidth: 1,
				max: 250,
				min: 80,
				// opposite: true,
			}],
			tooltip: {
				shared: true,
				valueDecimals: 0,
				formatter: function () {
					var tooltip = '<span style="font-size: 10px">' + (+this.x-1) + '/' + this.x + '</span><br/>';
					this.points.forEach(point =>
						tooltip += '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' +(point.point.options.week || point.y) + '</b><br/>');
					return tooltip;
				},
			},
			legend: {
				enabled: false,
			},
			series: [
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				{data: [null, null]}]
		});
		charts[id].showLoading();
		return function(ice){
			// console.log(ice);
			charts[id].hideLoading();
			charts[id].update({
				legend: {
					enabled: true,
				},
				dataSrc: ice.src,
				series: [
					// {
					// name: this.Highcharts.getOptions().lang.movAvgCI,
					// type: 'arearange',
					// color: '#7777ff',
					// data: ice.iceTimeCIMovAvg,
					// zIndex: 0,
					// fillOpacity: 0.3,
					// lineWidth: 0,
					// states: { hover: { lineWidthPlus: 0 } },
					// marker: { enabled: false },
					// yAxis: 1,
					// visible: false,
					// },
					{
						regression: false,
						regressionSettings: {
							type: 'linear',
							color: '#00bb00',
							name: this.Highcharts.getOptions().lang.linIceTime,
						},
						yAxis: 0,
						name: this.Highcharts.getOptions().lang.iceTime2,
						color: '#00bb00',
						lineWidth: 0,
						marker: { radius: 2 },
						states: { hover: { lineWidthPlus: 0 } },
						data: ice.iceTime,
					},
					// {
					// yAxis: 1,
					// name: this.Highcharts.getOptions().lang.movAvgIceTime,
					// color: '#00bb00',
					// data: ice.iceTimeMovAvg,
					// marker: { enabled: false },
					// }
				],
			});
		}
	},
	AbiskoIce: function (id) {
		// console.log(title);
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'line'
			},
			title: {
				text: this.Highcharts.getOptions().lang.titles[id],
			},
			xAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.years,
				},
				crosshair: true,
			},
			yAxis: [{
				title: {
					text: this.Highcharts.getOptions().lang.iceSub,
				},
				lineWidth: 1,
				labels: {
					formatter: function () {
						return this.value > 52 ? this.value - 52 : this.value;
					},
				}
			}, {
				title: {
					text: this.Highcharts.getOptions().lang.iceTime,
				},
				lineWidth: 1,
				max: 250,
				min: 80,
				opposite: true,
			}],
			tooltip: {
				shared: true,
				valueDecimals: 0,
				formatter: function () {
					var tooltip = '<span style="font-size: 10px">' + (+this.x-1) + '/' + this.x + '</span><br/>';
					this.points.forEach(point =>
						tooltip += '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' +(point.point.options.week || point.y) + '</b><br/>');
					return tooltip;
				},
			},
			legend: {
				enabled: false,
			},
			series: [
				{data: [null, null]},
				// {data: [null, null]},
				// {data: [null, null]},
				{data: [null, null]},
				{data: [null, null]}]
		});
		charts[id].showLoading();
		return function(ice){
			// console.log(ice);
			charts[id].hideLoading();
			charts[id].update({
				legend: {
					enabled: true,
				},
				dataSrc: ice.src,
				series: [{
					regression: false,
					regressionSettings: {
						type: 'linear',
						color: '#0000ee',
						name: this.Highcharts.getOptions().lang.linFrz,
					},
					yAxis: 0,
					name: this.Highcharts.getOptions().lang.freezeup,
					color: '#0000ee',
					lineWidth: 0,
					marker: { radius: 2 },
					states: { hover: { lineWidthPlus: 0 } },
					data: ice.freezeDOY,
				},{
					regression: false,
					regressionSettings: {
						type: 'linear',
						color: '#ee0000',
						name: this.Highcharts.getOptions().lang.linBrk,
					},
					yAxis: 0,
					name: this.Highcharts.getOptions().lang.breakup,
					color: '#ee0000',
					lineWidth: 0,
					marker: { radius: 2 },
					states: { hover: { lineWidthPlus: 0 } },
					data: ice.breakupDOY,
				},
					// {
					// name: this.Highcharts.getOptions().lang.movAvgCI,
					// type: 'arearange',
					// color: '#7777ff',
					// data: ice.iceTimeCIMovAvg,
					// zIndex: 0,
					// fillOpacity: 0.3,
					// lineWidth: 0,
					// states: { hover: { lineWidthPlus: 0 } },
					// marker: { enabled: false },
					// yAxis: 1,
					// visible: false,
					// },
					{
						regression: false,
						regressionSettings: {
							type: 'linear',
							color: '#00bb00',
							name: this.Highcharts.getOptions().lang.linIceTime,
						},
						yAxis: 1,
						name: this.Highcharts.getOptions().lang.iceTime2,
						color: '#00bb00',
						lineWidth: 0,
						marker: { radius: 2 },
						states: { hover: { lineWidthPlus: 0 } },
						data: ice.iceTime,
					},
					// {
					// yAxis: 1,
					// name: this.Highcharts.getOptions().lang.movAvgIceTime,
					// color: '#00bb00',
					// data: ice.iceTimeMovAvg,
					// marker: { enabled: false },
					// }
				],
			});
		}
	},
	AbiskoSnow: function (id) {
		// console.log(id)
		// console.log(Object.values(snow))
		charts[id] = Highcharts.chart(id, {
			chart: {
				type: 'line'
			},
			title: {
				text: this.Highcharts.getOptions().lang.titles[id],
			},
			xAxis: {
				categories: help.months().rotate(6).slice(2),
				title: {
					text: this.Highcharts.getOptions().lang.month,
				},
				crosshair: true,
			},
			yAxis: {
				title: {
					text: this.Highcharts.getOptions().lang.snowDepth,
				},
				lineWidth: 1,
				floor: 0,
			},
			tooltip: {
				shared: true,
				valueSuffix: ' cm',
				valueDecimals: 0,
			},
			// series: [
			// 	{data: [null, null]}
			// ],
			legend: {
				enabled: false,
			}

		});
		charts[id].showLoading();	
		return function(snow){
			charts[id].hideLoading();
			charts[id].update({
				dataSrc: snow.src,
				legend: {
					enabled: true,
				},
			})
			var series = Object.values(snow).map(p => charts[id].addSeries({
				name: language[nav_lang].abiskoSnowDepthPeriod[p.period],
				data: p.means.rotate(6).slice(2),
			}));
		}

	},
	ZoomableGraph: function(data, id, title){
		// console.log(title)
		// console.log(data);
		// charts[id] = Highcharts.chart(id, {
		// 	chart: {
		// 		zoomType: 'x'
		// 	},
		// 	// dataSrc: data.src,
		// 	title: {
		// 		text: title + ' [DUMMY/START]',
		// 	},
		// 	subtitle: {
		// 		text: document.ontouchstart === undefined ?
		// 		'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
		// 	},
		// 	xAxis: {
		// 		type: 'datetime',
		// 		dateTimeLabelFormats: { // don't display the dummy year
		// 			month: '%e. %b',
		// 			year: '%b'
		// 		},
		// 		title: {
		// 			text: 'Date'
		// 		},
		// 	},
		// 	yAxis: {
		// 		title: {
		// 			text: 'Temperatures'
		// 		},
		// 	},
		// 	legend: {
		// 		enabled: false
		// 	},
		// 	plotOptions: {
		// 		area: {
		// 			fillColor: {
		// 				linearGradient: {
		// 					x1: 0,
		// 					y1: 0,
		// 					x2: 0,
		// 					y2: 1
		// 				},
		// 				stops: [
		// 					[0, Highcharts.getOptions().colors[0]],
		// [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
		// ]
		// },
		// marker: {
		// radius: 2
		// },
		// lineWidth: 1,
		// states: {
		// hover: {
		// lineWidth: 1
		// }
		// },
		// threshold: null
		// }
		// },

		// series: [{
		// type: 'line',
		// name: 'Average',
		// data: data,
		// }]
		// });
	},
	Perma: function(id){
		// console.log(id)
		// console.log(data)
		charts[id] = Highcharts.chart(id, {
			chart: {
				zoomType: 'x',
				// plotBackgroundColor: "#ddddff",
			},
			// dataSrc: data.src,
			title: {
				text: this.Highcharts.getOptions().lang.titles[id],
			},
			xAxis: {
				title: {
					// text: 'Year'
					text: this.Highcharts.getOptions().lang.years,
				},
			},
			yAxis: {
				title: {
					text: 'meters'
				},
				reversed: true,
				plotLines: [{
					color: "#88dd88",
					width: 2,
					value: 0,
					zIndex: 5,
					label: {
						text: this.Highcharts.getOptions().lang.groundlevel
					}
				}]
			},
			legend: {
				enabled: false
			},
			series: [{data: [null, null]}],
		});
		charts[id].showLoading();
		return function(data){
			charts[id].hideLoading();
			charts[id].update({
				series: [{
					data: data.map(each => ({
						x: each.x,
						y: each.y,
					})),
					name: 'Histogram',
					type: 'histogram',
					color: "#bb9999",
					opacity: 0.5,
				}]
			});
		}
	}

	//var rend_struct = {
	//	chart: undefined,
	//	config: undefined,
	//	clone: function(){
	//		return Object.assign({}, this);
	//	},
	//	create: function(config){
	//		var result = this.clone();
	//		result.config = config;
	//		return result;
	//	},
	//	init: function(id){
	//		this.chart = Highcharts.chart(id, this.config); 
	//	},
	//	addSeries: function(series){
	//		this.chart.addSeries(series);
	//		return this;
	//	},
	//}
}

},{"../config/highcharts_config.js":1,"../config/language.json":2,"./helpers.js":3,"./lib.js":4,"highcharts":7}],6:[function(require,module,exports){

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
		return data;
	},
	SCRIPPS_CO2: function(result, src=''){
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
	},
	GISSTEMP: function (result, src='') {
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
		return temperatures;
	},
	GISSTEMPzonalMeans: function (result, src='') {
		// console.log(result)
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
		return temperatures;
	},
	AbiskoCsv: function (result, src='') {
		console.log(result)
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
		return blocks
	},
	AbiskoIceData: function (result, src='') {
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
		return {
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
		};
	},
	AbiskoSnowData: function (result, src='') {
		var data = result.data;
		var fields = result.meta.fields;

		//	var custom = function(date){
		//		var tmp = [
		//			//{ start: 1931, end: 1940, },
		//			//{ start: 1941, end: 1950, },
		//			//{ start: 1951, end: 1960, },
		//			{ start: 1961, end: 1970, },
		//			{ start: 1971, end: 1980, },
		//			{ start: 1981, end: 1990, },
		//			{ start: 1991, end: 2000, },
		//			{ start: 2001, end: 2010, },
		//			{ start: 2011, end: Infinity },
		//			// { start: -Infinity, end: Infinity }, // entire period
		//		];
		//		var year = parseInt(date.getFullYear());
		//		var p = undefined;
		//		tmp.forEach(period => {
		//			if(parseInt(period.start) <= year && parseInt(period.end) >= year){
		//				p = ("From "+period.start+" to "+period.end); 
		//			} 
		//		})
		//		return p;
		//	}
		//	var values = parseByDate(data.map((row) => {
		//		var date;
		//		var entry = {};
		//		Object.keys(row).forEach(key => {
		//			switch(key){
		//				case 'Time':
		//					date = new Date(row[key]);
		//					break;
		//				default:
		//					if(key!="" && key!='Time'){
		//						entry[key] = {
		//							x: date,
		//							y: parseFloat(row[key]),
		//						}

		//					}
		//			}	
		//		})
		//		return entry;
		//	}), 'mean', '', custom=custom)
		//	console.log(values)
		//	var result = {
		//		periods: [],
		//		decades: [],
		//	};


		//	///
		//	//
		//	//
		//	//
		//	//
		//	//
		//

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
		return {
			src: src,
			periodMeans,
			decadeMeans,
		};
	},
	smhiTemp: function(result, src=''){
		// console.log(result)
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
			resolve(parseByDate(values))
		})

	}

}

},{"./helpers.js":3,"regression":10}],7:[function(require,module,exports){
/*
 Highcharts JS v7.2.1 (2019-10-31)

 (c) 2009-2018 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(P,M){"object"===typeof module&&module.exports?(M["default"]=M,module.exports=P.document?M(P):M):"function"===typeof define&&define.amd?define("highcharts/highcharts",function(){return M(P)}):(P.Highcharts&&P.Highcharts.error(16,!0),P.Highcharts=M(P))})("undefined"!==typeof window?window:this,function(P){function M(c,f,F,G){c.hasOwnProperty(f)||(c[f]=G.apply(null,F))}var I={};M(I,"parts/Globals.js",[],function(){var c="undefined"!==typeof P?P:"undefined"!==typeof window?window:{},f=c.document,
F=c.navigator&&c.navigator.userAgent||"",G=f&&f.createElementNS&&!!f.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,z=/(edge|msie|trident)/i.test(F)&&!c.opera,B=-1!==F.indexOf("Firefox"),t=-1!==F.indexOf("Chrome"),v=B&&4>parseInt(F.split("Firefox/")[1],10);return{product:"Highcharts",version:"7.2.1",deg2rad:2*Math.PI/360,doc:f,hasBidiBug:v,hasTouch:!!c.TouchEvent,isMS:z,isWebKit:-1!==F.indexOf("AppleWebKit"),isFirefox:B,isChrome:t,isSafari:!t&&-1!==F.indexOf("Safari"),isTouchDevice:/(Mobile|Android|Windows Phone)/.test(F),
SVG_NS:"http://www.w3.org/2000/svg",chartCount:0,seriesTypes:{},symbolSizes:{},svg:G,win:c,marginNames:["plotTop","marginRight","marginBottom","plotLeft"],noop:function(){},charts:[],dateFormats:{}}});M(I,"parts/Utilities.js",[I["parts/Globals.js"]],function(c){function f(a,d){return parseInt(a,d||10)}function F(a){return"string"===typeof a}function G(a){a=Object.prototype.toString.call(a);return"[object Array]"===a||"[object Array Iterator]"===a}function z(a,d){return!!a&&"object"===typeof a&&(!d||
!G(a))}function B(a){return z(a)&&"number"===typeof a.nodeType}function t(a){var d=a&&a.constructor;return!(!z(a,!0)||B(a)||!d||!d.name||"Object"===d.name)}function v(a){return"number"===typeof a&&!isNaN(a)&&Infinity>a&&-Infinity<a}function C(a){return"undefined"!==typeof a&&null!==a}function H(a,d,e){var b;F(d)?C(e)?a.setAttribute(d,e):a&&a.getAttribute&&((b=a.getAttribute(d))||"class"!==d||(b=a.getAttribute(d+"Name"))):n(d,function(d,e){a.setAttribute(e,d)});return b}function y(a,d){var e;a||(a=
{});for(e in d)a[e]=d[e];return a}function h(){for(var a=arguments,d=a.length,e=0;e<d;e++){var b=a[e];if("undefined"!==typeof b&&null!==b)return b}}function n(a,d,e){for(var b in a)Object.hasOwnProperty.call(a,b)&&d.call(e||a[b],a[b],b,a)}c.timers=[];var q=c.charts,g=c.doc,b=c.win;c.error=function(a,d,e,l){var g=v(a),h=g?"Highcharts error #"+a+": www.highcharts.com/errors/"+a+"/":a.toString(),p=function(){if(d)throw Error(h);b.console&&console.log(h)};if("undefined"!==typeof l){var u="";g&&(h+="?");
c.objectEach(l,function(a,d){u+="\n"+d+": "+a;g&&(h+=encodeURI(d)+"="+encodeURI(a))});h+=u}e?c.fireEvent(e,"displayError",{code:a,message:h,params:l},p):p()};c.Fx=function(a,d,e){this.options=d;this.elem=a;this.prop=e};c.Fx.prototype={dSetter:function(){var a=this.paths[0],d=this.paths[1],e=[],b=this.now,g=a.length;if(1===b)e=this.toD;else if(g===d.length&&1>b)for(;g--;){var c=parseFloat(a[g]);e[g]=isNaN(c)||"A"===d[g-4]||"A"===d[g-5]?d[g]:b*parseFloat(""+(d[g]-c))+c}else e=d;this.elem.attr("d",e,
null,!0)},update:function(){var a=this.elem,d=this.prop,e=this.now,b=this.options.step;if(this[d+"Setter"])this[d+"Setter"]();else a.attr?a.element&&a.attr(d,e,null,!0):a.style[d]=e+this.unit;b&&b.call(a,e,this)},run:function(a,d,e){var l=this,g=l.options,h=function(a){return h.stopped?!1:l.step(a)},p=b.requestAnimationFrame||function(a){setTimeout(a,13)},u=function(){for(var a=0;a<c.timers.length;a++)c.timers[a]()||c.timers.splice(a--,1);c.timers.length&&p(u)};a!==d||this.elem["forceAnimate:"+this.prop]?
(this.startTime=+new Date,this.start=a,this.end=d,this.unit=e,this.now=this.start,this.pos=0,h.elem=this.elem,h.prop=this.prop,h()&&1===c.timers.push(h)&&p(u)):(delete g.curAnim[this.prop],g.complete&&0===Object.keys(g.curAnim).length&&g.complete.call(this.elem))},step:function(a){var d=+new Date,e=this.options,b=this.elem,g=e.complete,c=e.duration,p=e.curAnim;if(b.attr&&!b.element)a=!1;else if(a||d>=c+this.startTime){this.now=this.end;this.pos=1;this.update();var u=p[this.prop]=!0;n(p,function(a){!0!==
a&&(u=!1)});u&&g&&g.call(b);a=!1}else this.pos=e.easing((d-this.startTime)/c),this.now=this.start+(this.end-this.start)*this.pos,this.update(),a=!0;return a},initPath:function(a,d,e){function b(a){for(A=a.length;A--;){var d="M"===a[A]||"L"===a[A];var e=/[a-zA-Z]/.test(a[A+3]);d&&e&&a.splice(A+1,0,a[A+1],a[A+2],a[A+1],a[A+2])}}function g(a,d){for(;a.length<h;){a[0]=d[h-a.length];var e=a.slice(0,r);[].splice.apply(a,[0,0].concat(e));w&&(e=a.slice(a.length-r),[].splice.apply(a,[a.length,0].concat(e)),
A--)}a[0]="M"}function c(a,d){for(var e=(h-a.length)/r;0<e&&e--;)x=a.slice().splice(a.length/m-r,r*m),x[0]=d[h-r-e*r],k&&(x[r-6]=x[r-2],x[r-5]=x[r-1]),[].splice.apply(a,[a.length/m,0].concat(x)),w&&e--}d=d||"";var p=a.startX,u=a.endX,k=-1<d.indexOf("C"),r=k?7:3,x,A;d=d.split(" ");e=e.slice();var w=a.isArea,m=w?2:1;k&&(b(d),b(e));if(p&&u){for(A=0;A<p.length;A++)if(p[A]===u[0]){var K=A;break}else if(p[0]===u[u.length-p.length+A]){K=A;var J=!0;break}else if(p[p.length-1]===u[u.length-p.length+A]){K=
p.length-A;break}"undefined"===typeof K&&(d=[])}if(d.length&&v(K)){var h=e.length+K*m*r;J?(g(d,e),c(e,d)):(g(e,d),c(d,e))}return[d,e]},fillSetter:function(){c.Fx.prototype.strokeSetter.apply(this,arguments)},strokeSetter:function(){this.elem.attr(this.prop,c.color(this.start).tweenTo(c.color(this.end),this.pos),null,!0)}};c.merge=function(){var a,d=arguments,e={},b=function(a,d){"object"!==typeof a&&(a={});n(d,function(e,k){!z(e,!0)||t(e)||B(e)?a[k]=d[k]:a[k]=b(a[k]||{},e)});return a};!0===d[0]&&
(e=d[1],d=Array.prototype.slice.call(d,2));var g=d.length;for(a=0;a<g;a++)e=b(e,d[a]);return e};c.clearTimeout=function(a){C(a)&&clearTimeout(a)};c.css=function(a,d){c.isMS&&!c.svg&&d&&"undefined"!==typeof d.opacity&&(d.filter="alpha(opacity="+100*d.opacity+")");y(a.style,d)};c.createElement=function(a,d,e,b,L){a=g.createElement(a);var l=c.css;d&&y(a,d);L&&l(a,{padding:"0",border:"none",margin:"0"});e&&l(a,e);b&&b.appendChild(a);return a};c.extendClass=function(a,d){var e=function(){};e.prototype=
new a;y(e.prototype,d);return e};c.pad=function(a,d,e){return Array((d||2)+1-String(a).replace("-","").length).join(e||"0")+a};c.relativeLength=function(a,d,e){return/%$/.test(a)?d*parseFloat(a)/100+(e||0):parseFloat(a)};c.wrap=function(a,d,e){var b=a[d];a[d]=function(){var a=Array.prototype.slice.call(arguments),d=arguments,l=this;l.proceed=function(){b.apply(l,arguments.length?arguments:d)};a.unshift(b);a=e.apply(this,a);l.proceed=null;return a}};c.datePropsToTimestamps=function(a){n(a,function(d,
e){z(d)&&"function"===typeof d.getTime?a[e]=d.getTime():(z(d)||G(d))&&c.datePropsToTimestamps(d)})};c.formatSingle=function(a,d,e){var b=/\.([0-9])/,g=c.defaultOptions.lang;/f$/.test(a)?(e=(e=a.match(b))?e[1]:-1,null!==d&&(d=c.numberFormat(d,e,g.decimalPoint,-1<a.indexOf(",")?g.thousandsSep:""))):d=(e||c.time).dateFormat(a,d);return d};c.format=function(a,d,e){for(var b="{",g=!1,h,p,u,k,r=[],x;a;){b=a.indexOf(b);if(-1===b)break;h=a.slice(0,b);if(g){h=h.split(":");p=h.shift().split(".");k=p.length;
x=d;for(u=0;u<k;u++)x&&(x=x[p[u]]);h.length&&(x=c.formatSingle(h.join(":"),x,e));r.push(x)}else r.push(h);a=a.slice(b+1);b=(g=!g)?"}":"{"}r.push(a);return r.join("")};c.getMagnitude=function(a){return Math.pow(10,Math.floor(Math.log(a)/Math.LN10))};c.normalizeTickInterval=function(a,d,e,b,g){var l=a;e=h(e,1);var p=a/e;d||(d=g?[1,1.2,1.5,2,2.5,3,4,5,6,8,10]:[1,2,2.5,5,10],!1===b&&(1===e?d=d.filter(function(a){return 0===a%1}):.1>=e&&(d=[1/e])));for(b=0;b<d.length&&!(l=d[b],g&&l*e>=a||!g&&p<=(d[b]+
(d[b+1]||d[b]))/2);b++);return l=c.correctFloat(l*e,-Math.round(Math.log(.001)/Math.LN10))};c.stableSort=function(a,d){var b=a.length,l,g;for(g=0;g<b;g++)a[g].safeI=g;a.sort(function(a,b){l=d(a,b);return 0===l?a.safeI-b.safeI:l});for(g=0;g<b;g++)delete a[g].safeI};c.correctFloat=function(a,d){return parseFloat(a.toPrecision(d||14))};c.animObject=function(a){return z(a)?c.merge(a):{duration:a?500:0}};c.timeUnits={millisecond:1,second:1E3,minute:6E4,hour:36E5,day:864E5,week:6048E5,month:24192E5,year:314496E5};
c.numberFormat=function(a,d,b,l){a=+a||0;d=+d;var e=c.defaultOptions.lang,g=(a.toString().split(".")[1]||"").split("e")[0].length,p=a.toString().split("e");if(-1===d)d=Math.min(g,20);else if(!v(d))d=2;else if(d&&p[1]&&0>p[1]){var u=d+ +p[1];0<=u?(p[0]=(+p[0]).toExponential(u).split("e")[0],d=u):(p[0]=p[0].split(".")[0]||0,a=20>d?(p[0]*Math.pow(10,p[1])).toFixed(d):0,p[1]=0)}var k=(Math.abs(p[1]?p[0]:a)+Math.pow(10,-Math.max(d,g)-1)).toFixed(d);g=String(f(k));u=3<g.length?g.length%3:0;b=h(b,e.decimalPoint);
l=h(l,e.thousandsSep);a=(0>a?"-":"")+(u?g.substr(0,u)+l:"");a+=g.substr(u).replace(/(\d{3})(?=\d)/g,"$1"+l);d&&(a+=b+k.slice(-d));p[1]&&0!==+a&&(a+="e"+p[1]);return a};Math.easeInOutSine=function(a){return-.5*(Math.cos(Math.PI*a)-1)};c.getStyle=function(a,d,e){if("width"===d)return d=Math.min(a.offsetWidth,a.scrollWidth),e=a.getBoundingClientRect&&a.getBoundingClientRect().width,e<d&&e>=d-1&&(d=Math.floor(e)),Math.max(0,d-c.getStyle(a,"padding-left")-c.getStyle(a,"padding-right"));if("height"===d)return Math.max(0,
Math.min(a.offsetHeight,a.scrollHeight)-c.getStyle(a,"padding-top")-c.getStyle(a,"padding-bottom"));b.getComputedStyle||c.error(27,!0);if(a=b.getComputedStyle(a,void 0))a=a.getPropertyValue(d),h(e,"opacity"!==d)&&(a=f(a));return a};c.inArray=function(a,d,b){return d.indexOf(a,b)};c.find=Array.prototype.find?function(a,d){return a.find(d)}:function(a,d){var b,l=a.length;for(b=0;b<l;b++)if(d(a[b],b))return a[b]};c.keys=Object.keys;c.offset=function(a){var d=g.documentElement;a=a.parentElement||a.parentNode?
a.getBoundingClientRect():{top:0,left:0};return{top:a.top+(b.pageYOffset||d.scrollTop)-(d.clientTop||0),left:a.left+(b.pageXOffset||d.scrollLeft)-(d.clientLeft||0)}};c.stop=function(a,b){for(var d=c.timers.length;d--;)c.timers[d].elem!==a||b&&b!==c.timers[d].prop||(c.timers[d].stopped=!0)};n({map:"map",each:"forEach",grep:"filter",reduce:"reduce",some:"some"},function(a,b){c[b]=function(b){return Array.prototype[a].apply(b,[].slice.call(arguments,1))}});c.addEvent=function(a,b,e,l){void 0===l&&(l=
{});var d=a.addEventListener||c.addEventListenerPolyfill;var g="function"===typeof a&&a.prototype?a.prototype.protoEvents=a.prototype.protoEvents||{}:a.hcEvents=a.hcEvents||{};c.Point&&a instanceof c.Point&&a.series&&a.series.chart&&(a.series.chart.runTrackerClick=!0);d&&d.call(a,b,e,!1);g[b]||(g[b]=[]);g[b].push({fn:e,order:"number"===typeof l.order?l.order:Infinity});g[b].sort(function(a,b){return a.order-b.order});return function(){c.removeEvent(a,b,e)}};c.removeEvent=function(a,b,e){function d(b,
d){var e=a.removeEventListener||c.removeEventListenerPolyfill;e&&e.call(a,b,d,!1)}function g(e){var l;if(a.nodeName){if(b){var k={};k[b]=!0}else k=e;n(k,function(a,b){if(e[b])for(l=e[b].length;l--;)d(b,e[b][l].fn)})}}var h;["protoEvents","hcEvents"].forEach(function(l,c){var k=(c=c?a:a.prototype)&&c[l];k&&(b?(h=k[b]||[],e?(k[b]=h.filter(function(a){return e!==a.fn}),d(b,e)):(g(k),k[b]=[])):(g(k),c[l]={}))})};c.fireEvent=function(a,b,e,l){var d;e=e||{};if(g.createEvent&&(a.dispatchEvent||a.fireEvent)){var c=
g.createEvent("Events");c.initEvent(b,!0,!0);y(c,e);a.dispatchEvent?a.dispatchEvent(c):a.fireEvent(b,c)}else e.target||y(e,{preventDefault:function(){e.defaultPrevented=!0},target:a,type:b}),function(b,l){void 0===b&&(b=[]);void 0===l&&(l=[]);var k=0,r=0,g=b.length+l.length;for(d=0;d<g;d++)!1===(b[k]?l[r]?b[k].order<=l[r].order?b[k++]:l[r++]:b[k++]:l[r++]).fn.call(a,e)&&e.preventDefault()}(a.protoEvents&&a.protoEvents[b],a.hcEvents&&a.hcEvents[b]);l&&!e.defaultPrevented&&l.call(a,e)};c.animate=function(a,
b,e){var d,g="",h,p;if(!z(e)){var u=arguments;e={duration:u[2],easing:u[3],complete:u[4]}}v(e.duration)||(e.duration=400);e.easing="function"===typeof e.easing?e.easing:Math[e.easing]||Math.easeInOutSine;e.curAnim=c.merge(b);n(b,function(k,l){c.stop(a,l);p=new c.Fx(a,e,l);h=null;"d"===l?(p.paths=p.initPath(a,a.d,b.d),p.toD=b.d,d=0,h=1):a.attr?d=a.attr(l):(d=parseFloat(c.getStyle(a,l))||0,"opacity"!==l&&(g="px"));h||(h=k);h&&h.match&&h.match("px")&&(h=h.replace(/px/g,""));p.run(d,h,g)})};c.seriesType=
function(a,b,e,l,g){var d=c.getOptions(),p=c.seriesTypes;d.plotOptions[a]=c.merge(d.plotOptions[b],e);p[a]=c.extendClass(p[b]||function(){},l);p[a].prototype.type=a;g&&(p[a].prototype.pointClass=c.extendClass(c.Point,g));return p[a]};c.uniqueKey=function(){var a=Math.random().toString(36).substring(2,9),b=0;return function(){return"highcharts-"+a+"-"+b++}}();c.isFunction=function(a){return"function"===typeof a};b.jQuery&&(b.jQuery.fn.highcharts=function(){var a=[].slice.call(arguments);if(this[0])return a[0]?
(new (c[F(a[0])?a.shift():"Chart"])(this[0],a[0],a[1]),this):q[H(this[0],"data-highcharts-chart")]});return{arrayMax:function(a){for(var b=a.length,e=a[0];b--;)a[b]>e&&(e=a[b]);return e},arrayMin:function(a){for(var b=a.length,e=a[0];b--;)a[b]<e&&(e=a[b]);return e},attr:H,defined:C,destroyObjectProperties:function(a,b){n(a,function(d,l){d&&d!==b&&d.destroy&&d.destroy();delete a[l]})},discardElement:function(a){var b=c.garbageBin;b||(b=c.createElement("div"));a&&b.appendChild(a);b.innerHTML=""},erase:function(a,
b){for(var d=a.length;d--;)if(a[d]===b){a.splice(d,1);break}},extend:y,isArray:G,isClass:t,isDOMElement:B,isNumber:v,isObject:z,isString:F,objectEach:n,pick:h,pInt:f,setAnimation:function(a,b){b.renderer.globalAnimation=h(a,b.options.chart.animation,!0)},splat:function(a){return G(a)?a:[a]},syncTimeout:function(a,b,e){if(0<b)return setTimeout(a,b,e);a.call(0,e);return-1}}});M(I,"parts/Color.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.isNumber,G=f.pInt,z=c.merge;c.Color=
function(f){if(!(this instanceof c.Color))return new c.Color(f);this.init(f)};c.Color.prototype={parsers:[{regex:/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,parse:function(c){return[G(c[1]),G(c[2]),G(c[3]),parseFloat(c[4],10)]}},{regex:/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,parse:function(c){return[G(c[1]),G(c[2]),G(c[3]),1]}}],names:{white:"#ffffff",black:"#000000"},init:function(f){var t,v;if((this.input=f=this.names[f&&
f.toLowerCase?f.toLowerCase():""]||f)&&f.stops)this.stops=f.stops.map(function(f){return new c.Color(f[1])});else{if(f&&f.charAt&&"#"===f.charAt()){var C=f.length;f=parseInt(f.substr(1),16);7===C?t=[(f&16711680)>>16,(f&65280)>>8,f&255,1]:4===C&&(t=[(f&3840)>>4|(f&3840)>>8,(f&240)>>4|f&240,(f&15)<<4|f&15,1])}if(!t)for(v=this.parsers.length;v--&&!t;){var B=this.parsers[v];(C=B.regex.exec(f))&&(t=B.parse(C))}}this.rgba=t||[]},get:function(c){var f=this.input,v=this.rgba;if(this.stops){var C=z(f);C.stops=
[].concat(C.stops);this.stops.forEach(function(f,v){C.stops[v]=[C.stops[v][0],f.get(c)]})}else C=v&&F(v[0])?"rgb"===c||!c&&1===v[3]?"rgb("+v[0]+","+v[1]+","+v[2]+")":"a"===c?v[3]:"rgba("+v.join(",")+")":f;return C},brighten:function(c){var f,v=this.rgba;if(this.stops)this.stops.forEach(function(f){f.brighten(c)});else if(F(c)&&0!==c)for(f=0;3>f;f++)v[f]+=G(255*c),0>v[f]&&(v[f]=0),255<v[f]&&(v[f]=255);return this},setOpacity:function(c){this.rgba[3]=c;return this},tweenTo:function(c,f){var v=this.rgba,
t=c.rgba;t.length&&v&&v.length?(c=1!==t[3]||1!==v[3],f=(c?"rgba(":"rgb(")+Math.round(t[0]+(v[0]-t[0])*(1-f))+","+Math.round(t[1]+(v[1]-t[1])*(1-f))+","+Math.round(t[2]+(v[2]-t[2])*(1-f))+(c?","+(t[3]+(v[3]-t[3])*(1-f)):"")+")"):f=c.input||"none";return f}};c.color=function(f){return new c.Color(f)}});M(I,"parts/SvgRenderer.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.attr,G=f.defined,z=f.destroyObjectProperties,B=f.erase,t=f.extend,v=f.isArray,C=f.isNumber,H=f.isObject,
y=f.isString,h=f.objectEach,n=f.pick,q=f.pInt,g=f.splat,b=c.addEvent,a=c.animate,d=c.charts,e=c.color,l=c.css,L=c.createElement,E=c.deg2rad,p=c.doc,u=c.hasTouch,k=c.isFirefox,r=c.isMS,x=c.isWebKit,A=c.merge,w=c.noop,m=c.removeEvent,K=c.stop,J=c.svg,U=c.SVG_NS,S=c.symbolSizes,Q=c.win;var O=c.SVGElement=function(){return this};t(O.prototype,{opacity:1,SVG_NS:U,textProps:"direction fontSize fontWeight fontFamily fontStyle color lineHeight width textAlign textDecoration textOverflow textOutline cursor".split(" "),
init:function(a,b){this.element="span"===b?L(b):p.createElementNS(this.SVG_NS,b);this.renderer=a;c.fireEvent(this,"afterInit")},animate:function(b,d,m){var D=c.animObject(n(d,this.renderer.globalAnimation,!0));n(p.hidden,p.msHidden,p.webkitHidden,!1)&&(D.duration=0);0!==D.duration?(m&&(D.complete=m),a(this,b,D)):(this.attr(b,void 0,m),h(b,function(a,b){D.step&&D.step.call(this,a,{prop:b,pos:1})},this));return this},complexColor:function(a,b,d){var D=this.renderer,m,e,w,N,k,l,g,r,x,p,K,J=[],T;c.fireEvent(this.renderer,
"complexColor",{args:arguments},function(){a.radialGradient?e="radialGradient":a.linearGradient&&(e="linearGradient");e&&(w=a[e],k=D.gradients,g=a.stops,p=d.radialReference,v(w)&&(a[e]=w={x1:w[0],y1:w[1],x2:w[2],y2:w[3],gradientUnits:"userSpaceOnUse"}),"radialGradient"===e&&p&&!G(w.gradientUnits)&&(N=w,w=A(w,D.getRadialAttr(p,N),{gradientUnits:"userSpaceOnUse"})),h(w,function(a,b){"id"!==b&&J.push(b,a)}),h(g,function(a){J.push(a)}),J=J.join(","),k[J]?K=k[J].attr("id"):(w.id=K=c.uniqueKey(),k[J]=l=
D.createElement(e).attr(w).add(D.defs),l.radAttr=N,l.stops=[],g.forEach(function(a){0===a[1].indexOf("rgba")?(m=c.color(a[1]),r=m.get("rgb"),x=m.get("a")):(r=a[1],x=1);a=D.createElement("stop").attr({offset:a[0],"stop-color":r,"stop-opacity":x}).add(l);l.stops.push(a)})),T="url("+D.url+"#"+K+")",d.setAttribute(b,T),d.gradient=J,a.toString=function(){return T})})},applyTextOutline:function(a){var b=this.element,D;-1!==a.indexOf("contrast")&&(a=a.replace(/contrast/g,this.renderer.getContrast(b.style.fill)));
a=a.split(" ");var d=a[a.length-1];if((D=a[0])&&"none"!==D&&c.svg){this.fakeTS=!0;a=[].slice.call(b.getElementsByTagName("tspan"));this.ySetter=this.xSetter;D=D.replace(/(^[\d\.]+)(.*?)$/g,function(a,b,D){return 2*b+D});this.removeTextOutline(a);var m=b.firstChild;a.forEach(function(a,e){0===e&&(a.setAttribute("x",b.getAttribute("x")),e=b.getAttribute("y"),a.setAttribute("y",e||0),null===e&&b.setAttribute("y",0));a=a.cloneNode(1);F(a,{"class":"highcharts-text-outline",fill:d,stroke:d,"stroke-width":D,
"stroke-linejoin":"round"});b.insertBefore(a,m)})}},removeTextOutline:function(a){for(var b=a.length,D;b--;)D=a[b],"highcharts-text-outline"===D.getAttribute("class")&&B(a,this.element.removeChild(D))},symbolCustomAttribs:"x y width height r start end innerR anchorX anchorY rounded".split(" "),attr:function(a,b,d,e){var D=this.element,m,w=this,N,k,l=this.symbolCustomAttribs;if("string"===typeof a&&void 0!==b){var g=a;a={};a[g]=b}"string"===typeof a?w=(this[a+"Getter"]||this._defaultGetter).call(this,
a,D):(h(a,function(b,d){N=!1;e||K(this,d);this.symbolName&&-1!==c.inArray(d,l)&&(m||(this.symbolAttr(a),m=!0),N=!0);!this.rotation||"x"!==d&&"y"!==d||(this.doTransform=!0);N||(k=this[d+"Setter"]||this._defaultSetter,k.call(this,b,d,D),!this.styledMode&&this.shadows&&/^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(d)&&this.updateShadows(d,b,k))},this),this.afterSetters());d&&d.call(this);return w},afterSetters:function(){this.doTransform&&(this.updateTransform(),this.doTransform=!1)},updateShadows:function(a,
b,d){for(var D=this.shadows,e=D.length;e--;)d.call(D[e],"height"===a?Math.max(b-(D[e].cutHeight||0),0):"d"===a?this.d:b,a,D[e])},addClass:function(a,b){var D=b?"":this.attr("class")||"";a=(a||"").split(/ /g).reduce(function(a,b){-1===D.indexOf(b)&&a.push(b);return a},D?[D]:[]).join(" ");a!==D&&this.attr("class",a);return this},hasClass:function(a){return-1!==(this.attr("class")||"").split(" ").indexOf(a)},removeClass:function(a){return this.attr("class",(this.attr("class")||"").replace(y(a)?new RegExp(" ?"+
a+" ?"):a,""))},symbolAttr:function(a){var b=this;"x y r start end width height innerR anchorX anchorY clockwise".split(" ").forEach(function(D){b[D]=n(a[D],b[D])});b.attr({d:b.renderer.symbols[b.symbolName](b.x,b.y,b.width,b.height,b)})},clip:function(a){return this.attr("clip-path",a?"url("+this.renderer.url+"#"+a.id+")":"none")},crisp:function(a,b){b=b||a.strokeWidth||0;var D=Math.round(b)%2/2;a.x=Math.floor(a.x||this.x||0)+D;a.y=Math.floor(a.y||this.y||0)+D;a.width=Math.floor((a.width||this.width||
0)-2*D);a.height=Math.floor((a.height||this.height||0)-2*D);G(a.strokeWidth)&&(a.strokeWidth=b);return a},css:function(a){var b=this.styles,D={},d=this.element,e="",m=!b,w=["textOutline","textOverflow","width"];a&&a.color&&(a.fill=a.color);b&&h(a,function(a,d){a!==b[d]&&(D[d]=a,m=!0)});if(m){b&&(a=t(b,D));if(a)if(null===a.width||"auto"===a.width)delete this.textWidth;else if("text"===d.nodeName.toLowerCase()&&a.width)var k=this.textWidth=q(a.width);this.styles=a;k&&!J&&this.renderer.forExport&&delete a.width;
if(d.namespaceURI===this.SVG_NS){var g=function(a,b){return"-"+b.toLowerCase()};h(a,function(a,b){-1===w.indexOf(b)&&(e+=b.replace(/([A-Z])/g,g)+":"+a+";")});e&&F(d,"style",e)}else l(d,a);this.added&&("text"===this.element.nodeName&&this.renderer.buildText(this),a&&a.textOutline&&this.applyTextOutline(a.textOutline))}return this},getStyle:function(a){return Q.getComputedStyle(this.element||this,"").getPropertyValue(a)},strokeWidth:function(){if(!this.renderer.styledMode)return this["stroke-width"]||
0;var a=this.getStyle("stroke-width");if(a.indexOf("px")===a.length-2)a=q(a);else{var b=p.createElementNS(U,"rect");F(b,{width:a,"stroke-width":0});this.element.parentNode.appendChild(b);a=b.getBBox().width;b.parentNode.removeChild(b)}return a},on:function(a,b){var d=this,D=d.element;u&&"click"===a?(D.ontouchstart=function(a){d.touchEventFired=Date.now();a.preventDefault();b.call(D,a)},D.onclick=function(a){(-1===Q.navigator.userAgent.indexOf("Android")||1100<Date.now()-(d.touchEventFired||0))&&b.call(D,
a)}):D["on"+a]=b;return this},setRadialReference:function(a){var b=this.renderer.gradients[this.element.gradient];this.element.radialReference=a;b&&b.radAttr&&b.animate(this.renderer.getRadialAttr(a,b.radAttr));return this},translate:function(a,b){return this.attr({translateX:a,translateY:b})},invert:function(a){this.inverted=a;this.updateTransform();return this},updateTransform:function(){var a=this.translateX||0,b=this.translateY||0,d=this.scaleX,e=this.scaleY,m=this.inverted,w=this.rotation,k=
this.matrix,l=this.element;m&&(a+=this.width,b+=this.height);a=["translate("+a+","+b+")"];G(k)&&a.push("matrix("+k.join(",")+")");m?a.push("rotate(90) scale(-1,1)"):w&&a.push("rotate("+w+" "+n(this.rotationOriginX,l.getAttribute("x"),0)+" "+n(this.rotationOriginY,l.getAttribute("y")||0)+")");(G(d)||G(e))&&a.push("scale("+n(d,1)+" "+n(e,1)+")");a.length&&l.setAttribute("transform",a.join(" "))},toFront:function(){var a=this.element;a.parentNode.appendChild(a);return this},align:function(a,b,d){var e,
m={};var D=this.renderer;var w=D.alignedObjects;var k,l;if(a){if(this.alignOptions=a,this.alignByTranslate=b,!d||y(d))this.alignTo=e=d||"renderer",B(w,this),w.push(this),d=null}else a=this.alignOptions,b=this.alignByTranslate,e=this.alignTo;d=n(d,D[e],D);e=a.align;D=a.verticalAlign;w=(d.x||0)+(a.x||0);var N=(d.y||0)+(a.y||0);"right"===e?k=1:"center"===e&&(k=2);k&&(w+=(d.width-(a.width||0))/k);m[b?"translateX":"x"]=Math.round(w);"bottom"===D?l=1:"middle"===D&&(l=2);l&&(N+=(d.height-(a.height||0))/
l);m[b?"translateY":"y"]=Math.round(N);this[this.placed?"animate":"attr"](m);this.placed=!0;this.alignAttr=m;return this},getBBox:function(a,b){var d,e=this.renderer,m=this.element,D=this.styles,w=this.textStr,k,l=e.cache,N=e.cacheKeys,g=m.namespaceURI===this.SVG_NS;b=n(b,this.rotation,0);var r=e.styledMode?m&&O.prototype.getStyle.call(m,"font-size"):D&&D.fontSize;if(G(w)){var c=w.toString();-1===c.indexOf("<")&&(c=c.replace(/[0-9]/g,"0"));c+=["",b,r,this.textWidth,D&&D.textOverflow].join()}c&&!a&&
(d=l[c]);if(!d){if(g||e.forExport){try{(k=this.fakeTS&&function(a){[].forEach.call(m.querySelectorAll(".highcharts-text-outline"),function(b){b.style.display=a})})&&k("none"),d=m.getBBox?t({},m.getBBox()):{width:m.offsetWidth,height:m.offsetHeight},k&&k("")}catch(aa){""}if(!d||0>d.width)d={width:0,height:0}}else d=this.htmlGetBBox();e.isSVG&&(a=d.width,e=d.height,g&&(d.height=e={"11px,17":14,"13px,20":16}[D&&D.fontSize+","+Math.round(e)]||e),b&&(D=b*E,d.width=Math.abs(e*Math.sin(D))+Math.abs(a*Math.cos(D)),
d.height=Math.abs(e*Math.cos(D))+Math.abs(a*Math.sin(D))));if(c&&0<d.height){for(;250<N.length;)delete l[N.shift()];l[c]||N.push(c);l[c]=d}}return d},show:function(a){return this.attr({visibility:a?"inherit":"visible"})},hide:function(a){a?this.attr({y:-9999}):this.attr({visibility:"hidden"});return this},fadeOut:function(a){var b=this;b.animate({opacity:0},{duration:a||150,complete:function(){b.attr({y:-9999})}})},add:function(a){var b=this.renderer,d=this.element;a&&(this.parentGroup=a);this.parentInverted=
a&&a.inverted;void 0!==this.textStr&&b.buildText(this);this.added=!0;if(!a||a.handleZ||this.zIndex)var e=this.zIndexSetter();e||(a?a.element:b.box).appendChild(d);if(this.onAdd)this.onAdd();return this},safeRemoveChild:function(a){var b=a.parentNode;b&&b.removeChild(a)},destroy:function(){var a=this,b=a.element||{},d=a.renderer,e=d.isSVG&&"SPAN"===b.nodeName&&a.parentGroup,m=b.ownerSVGElement,w=a.clipPath;b.onclick=b.onmouseout=b.onmouseover=b.onmousemove=b.point=null;K(a);w&&m&&([].forEach.call(m.querySelectorAll("[clip-path],[CLIP-PATH]"),
function(a){-1<a.getAttribute("clip-path").indexOf(w.element.id)&&a.removeAttribute("clip-path")}),a.clipPath=w.destroy());if(a.stops){for(m=0;m<a.stops.length;m++)a.stops[m]=a.stops[m].destroy();a.stops=null}a.safeRemoveChild(b);for(d.styledMode||a.destroyShadows();e&&e.div&&0===e.div.childNodes.length;)b=e.parentGroup,a.safeRemoveChild(e.div),delete e.div,e=b;a.alignTo&&B(d.alignedObjects,a);h(a,function(b,d){a[d]&&a[d].parentGroup===a&&a[d].destroy&&a[d].destroy();delete a[d]})},shadow:function(a,
b,d){var e=[],m,w=this.element;if(!a)this.destroyShadows();else if(!this.shadows){var D=n(a.width,3);var k=(a.opacity||.15)/D;var l=this.parentInverted?"(-1,-1)":"("+n(a.offsetX,1)+", "+n(a.offsetY,1)+")";for(m=1;m<=D;m++){var g=w.cloneNode(0);var r=2*D+1-2*m;F(g,{stroke:a.color||"#000000","stroke-opacity":k*m,"stroke-width":r,transform:"translate"+l,fill:"none"});g.setAttribute("class",(g.getAttribute("class")||"")+" highcharts-shadow");d&&(F(g,"height",Math.max(F(g,"height")-r,0)),g.cutHeight=r);
b?b.element.appendChild(g):w.parentNode&&w.parentNode.insertBefore(g,w);e.push(g)}this.shadows=e}return this},destroyShadows:function(){(this.shadows||[]).forEach(function(a){this.safeRemoveChild(a)},this);this.shadows=void 0},xGetter:function(a){"circle"===this.element.nodeName&&("x"===a?a="cx":"y"===a&&(a="cy"));return this._defaultGetter(a)},_defaultGetter:function(a){a=n(this[a+"Value"],this[a],this.element?this.element.getAttribute(a):null,0);/^[\-0-9\.]+$/.test(a)&&(a=parseFloat(a));return a},
dSetter:function(a,b,d){a&&a.join&&(a=a.join(" "));/(NaN| {2}|^$)/.test(a)&&(a="M 0 0");this[b]!==a&&(d.setAttribute(b,a),this[b]=a)},dashstyleSetter:function(a){var b,d=this["stroke-width"];"inherit"===d&&(d=1);if(a=a&&a.toLowerCase()){a=a.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(b=a.length;b--;)a[b]=q(a[b])*
d;a=a.join(",").replace(/NaN/g,"none");this.element.setAttribute("stroke-dasharray",a)}},alignSetter:function(a){var b={left:"start",center:"middle",right:"end"};b[a]&&(this.alignValue=a,this.element.setAttribute("text-anchor",b[a]))},opacitySetter:function(a,b,d){this[b]=a;d.setAttribute(b,a)},titleSetter:function(a){var b=this.element.getElementsByTagName("title")[0];b||(b=p.createElementNS(this.SVG_NS,"title"),this.element.appendChild(b));b.firstChild&&b.removeChild(b.firstChild);b.appendChild(p.createTextNode(String(n(a,
"")).replace(/<[^>]*>/g,"").replace(/&lt;/g,"<").replace(/&gt;/g,">")))},textSetter:function(a){a!==this.textStr&&(delete this.bBox,delete this.textPxLength,this.textStr=a,this.added&&this.renderer.buildText(this))},setTextPath:function(a,b){var d=this.element,e={textAnchor:"text-anchor"},m=!1,D=this.textPathWrapper,k=!D;b=A(!0,{enabled:!0,attributes:{dy:-5,startOffset:"50%",textAnchor:"middle"}},b);var l=b.attributes;if(a&&b&&b.enabled){this.options&&this.options.padding&&(l.dx=-this.options.padding);
D||(this.textPathWrapper=D=this.renderer.createElement("textPath"),m=!0);var g=D.element;(b=a.element.getAttribute("id"))||a.element.setAttribute("id",b=c.uniqueKey());if(k)for(a=d.getElementsByTagName("tspan");a.length;)a[0].setAttribute("y",0),g.appendChild(a[0]);m&&D.add({element:this.text?this.text.element:d});g.setAttributeNS("http://www.w3.org/1999/xlink","href",this.renderer.url+"#"+b);G(l.dy)&&(g.parentNode.setAttribute("dy",l.dy),delete l.dy);G(l.dx)&&(g.parentNode.setAttribute("dx",l.dx),
delete l.dx);h(l,function(a,b){g.setAttribute(e[b]||b,a)});d.removeAttribute("transform");this.removeTextOutline.call(D,[].slice.call(d.getElementsByTagName("tspan")));this.text&&!this.renderer.styledMode&&this.attr({fill:"none","stroke-width":0});this.applyTextOutline=this.updateTransform=w}else D&&(delete this.updateTransform,delete this.applyTextOutline,this.destroyTextPath(d,a));return this},destroyTextPath:function(a,b){var d;b.element.setAttribute("id","");for(d=this.textPathWrapper.element.childNodes;d.length;)a.firstChild.appendChild(d[0]);
a.firstChild.removeChild(this.textPathWrapper.element);delete b.textPathWrapper},fillSetter:function(a,b,d){"string"===typeof a?d.setAttribute(b,a):a&&this.complexColor(a,b,d)},visibilitySetter:function(a,b,d){"inherit"===a?d.removeAttribute(b):this[b]!==a&&d.setAttribute(b,a);this[b]=a},zIndexSetter:function(a,b){var d=this.renderer,e=this.parentGroup,m=(e||d).element||d.box,w=this.element,k=!1;d=m===d.box;var D=this.added;var l;G(a)?(w.setAttribute("data-z-index",a),a=+a,this[b]===a&&(D=!1)):G(this[b])&&
w.removeAttribute("data-z-index");this[b]=a;if(D){(a=this.zIndex)&&e&&(e.handleZ=!0);b=m.childNodes;for(l=b.length-1;0<=l&&!k;l--){e=b[l];D=e.getAttribute("data-z-index");var g=!G(D);if(e!==w)if(0>a&&g&&!d&&!l)m.insertBefore(w,b[l]),k=!0;else if(q(D)<=a||g&&(!G(a)||0<=a))m.insertBefore(w,b[l+1]||null),k=!0}k||(m.insertBefore(w,b[d?3:0]||null),k=!0)}return k},_defaultSetter:function(a,b,d){d.setAttribute(b,a)}});O.prototype.yGetter=O.prototype.xGetter;O.prototype.translateXSetter=O.prototype.translateYSetter=
O.prototype.rotationSetter=O.prototype.verticalAlignSetter=O.prototype.rotationOriginXSetter=O.prototype.rotationOriginYSetter=O.prototype.scaleXSetter=O.prototype.scaleYSetter=O.prototype.matrixSetter=function(a,b){this[b]=a;this.doTransform=!0};O.prototype["stroke-widthSetter"]=O.prototype.strokeSetter=function(a,b,d){this[b]=a;this.stroke&&this["stroke-width"]?(O.prototype.fillSetter.call(this,this.stroke,"stroke",d),d.setAttribute("stroke-width",this["stroke-width"]),this.hasStroke=!0):"stroke-width"===
b&&0===a&&this.hasStroke?(d.removeAttribute("stroke"),this.hasStroke=!1):this.renderer.styledMode&&this["stroke-width"]&&(d.setAttribute("stroke-width",this["stroke-width"]),this.hasStroke=!0)};f=c.SVGRenderer=function(){this.init.apply(this,arguments)};t(f.prototype,{Element:O,SVG_NS:U,init:function(a,d,e,m,w,g,r){var D=this.createElement("svg").attr({version:"1.1","class":"highcharts-root"});r||D.css(this.getStyle(m));m=D.element;a.appendChild(m);F(a,"dir","ltr");-1===a.innerHTML.indexOf("xmlns")&&
F(m,"xmlns",this.SVG_NS);this.isSVG=!0;this.box=m;this.boxWrapper=D;this.alignedObjects=[];this.url=(k||x)&&p.getElementsByTagName("base").length?Q.location.href.split("#")[0].replace(/<[^>]*>/g,"").replace(/([\('\)])/g,"\\$1").replace(/ /g,"%20"):"";this.createElement("desc").add().element.appendChild(p.createTextNode("Created with Highcharts 7.2.1"));this.defs=this.createElement("defs").add();this.allowHTML=g;this.forExport=w;this.styledMode=r;this.gradients={};this.cache={};this.cacheKeys=[];this.imgCount=
0;this.setSize(d,e,!1);var c;k&&a.getBoundingClientRect&&(d=function(){l(a,{left:0,top:0});c=a.getBoundingClientRect();l(a,{left:Math.ceil(c.left)-c.left+"px",top:Math.ceil(c.top)-c.top+"px"})},d(),this.unSubPixelFix=b(Q,"resize",d))},definition:function(a){function b(a,e){var m;g(a).forEach(function(a){var w=d.createElement(a.tagName),k={};h(a,function(a,b){"tagName"!==b&&"children"!==b&&"textContent"!==b&&(k[b]=a)});w.attr(k);w.add(e||d.defs);a.textContent&&w.element.appendChild(p.createTextNode(a.textContent));
b(a.children||[],w);m=w});return m}var d=this;return b(a)},getStyle:function(a){return this.style=t({fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',fontSize:"12px"},a)},setStyle:function(a){this.boxWrapper.css(this.getStyle(a))},isHidden:function(){return!this.boxWrapper.getBBox().width},destroy:function(){var a=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();z(this.gradients||{});this.gradients=null;a&&(this.defs=a.destroy());this.unSubPixelFix&&
this.unSubPixelFix();return this.alignedObjects=null},createElement:function(a){var b=new this.Element;b.init(this,a);return b},draw:w,getRadialAttr:function(a,b){return{cx:a[0]-a[2]/2+b.cx*a[2],cy:a[1]-a[2]/2+b.cy*a[2],r:b.r*a[2]}},truncate:function(a,b,d,e,m,w,k){var l=this,D=a.rotation,g,r=e?1:0,c=(d||e).length,x=c,J=[],K=function(a){b.firstChild&&b.removeChild(b.firstChild);a&&b.appendChild(p.createTextNode(a))},N=function(w,D){D=D||w;if(void 0===J[D])if(b.getSubStringLength)try{J[D]=m+b.getSubStringLength(0,
e?D+1:D)}catch(ba){""}else l.getSpanWidth&&(K(k(d||e,w)),J[D]=m+l.getSpanWidth(a,b));return J[D]},A;a.rotation=0;var h=N(b.textContent.length);if(A=m+h>w){for(;r<=c;)x=Math.ceil((r+c)/2),e&&(g=k(e,x)),h=N(x,g&&g.length-1),r===c?r=c+1:h>w?c=x-1:r=x;0===c?K(""):d&&c===d.length-1||K(g||k(d||e,x))}e&&e.splice(0,x);a.actualWidth=h;a.rotation=D;return A},escapes:{"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},buildText:function(a){var b=a.element,d=this,e=d.forExport,m=n(a.textStr,"").toString(),
w=-1!==m.indexOf("<"),k=b.childNodes,D,g=F(b,"x"),r=a.styles,c=a.textWidth,x=r&&r.lineHeight,K=r&&r.textOutline,A=r&&"ellipsis"===r.textOverflow,u=r&&"nowrap"===r.whiteSpace,L=r&&r.fontSize,E,f=k.length;r=c&&!a.added&&this.box;var S=function(a){var m;d.styledMode||(m=/(px|em)$/.test(a&&a.style.fontSize)?a.style.fontSize:L||d.style.fontSize||12);return x?q(x):d.fontMetrics(m,a.getAttribute("style")?a:b).h},v=function(a,b){h(d.escapes,function(d,m){b&&-1!==b.indexOf(d)||(a=a.toString().replace(new RegExp(d,
"g"),m))});return a},O=function(a,b){var d=a.indexOf("<");a=a.substring(d,a.indexOf(">")-d);d=a.indexOf(b+"=");if(-1!==d&&(d=d+b.length+1,b=a.charAt(d),'"'===b||"'"===b))return a=a.substring(d+1),a.substring(0,a.indexOf(b))},Q=/<br.*?>/g;var t=[m,A,u,x,K,L,c].join();if(t!==a.textCache){for(a.textCache=t;f--;)b.removeChild(k[f]);w||K||A||c||-1!==m.indexOf(" ")&&(!u||Q.test(m))?(r&&r.appendChild(b),w?(m=d.styledMode?m.replace(/<(b|strong)>/g,'<span class="highcharts-strong">').replace(/<(i|em)>/g,'<span class="highcharts-emphasized">'):
m.replace(/<(b|strong)>/g,'<span style="font-weight:bold">').replace(/<(i|em)>/g,'<span style="font-style:italic">'),m=m.replace(/<a/g,"<span").replace(/<\/(b|strong|i|em|a)>/g,"</span>").split(Q)):m=[m],m=m.filter(function(a){return""!==a}),m.forEach(function(m,w){var k=0,r=0;m=m.replace(/^\s+|\s+$/g,"").replace(/<span/g,"|||<span").replace(/<\/span>/g,"</span>|||");var x=m.split("|||");x.forEach(function(m){if(""!==m||1===x.length){var K={},N=p.createElementNS(d.SVG_NS,"tspan"),h,n;(h=O(m,"class"))&&
F(N,"class",h);if(h=O(m,"style"))h=h.replace(/(;| |^)color([ :])/,"$1fill$2"),F(N,"style",h);(n=O(m,"href"))&&!e&&(F(N,"onclick",'location.href="'+n+'"'),F(N,"class","highcharts-anchor"),d.styledMode||l(N,{cursor:"pointer"}));m=v(m.replace(/<[a-zA-Z\/](.|\n)*?>/g,"")||" ");if(" "!==m){N.appendChild(p.createTextNode(m));k?K.dx=0:w&&null!==g&&(K.x=g);F(N,K);b.appendChild(N);!k&&E&&(!J&&e&&l(N,{display:"block"}),F(N,"dy",S(N)));if(c){var T=m.replace(/([^\^])-/g,"$1- ").split(" ");K=!u&&(1<x.length||
w||1<T.length);n=0;var f=S(N);if(A)D=d.truncate(a,N,m,void 0,0,Math.max(0,c-parseInt(L||12,10)),function(a,b){return a.substring(0,b)+"\u2026"});else if(K)for(;T.length;)T.length&&!u&&0<n&&(N=p.createElementNS(U,"tspan"),F(N,{dy:f,x:g}),h&&F(N,"style",h),N.appendChild(p.createTextNode(T.join(" ").replace(/- /g,"-"))),b.appendChild(N)),d.truncate(a,N,null,T,0===n?r:0,c,function(a,b){return T.slice(0,b).join(" ").replace(/- /g,"-")}),r=a.actualWidth,n++}k++}}});E=E||b.childNodes.length}),A&&D&&a.attr("title",
v(a.textStr,["&lt;","&gt;"])),r&&r.removeChild(b),K&&a.applyTextOutline&&a.applyTextOutline(K)):b.appendChild(p.createTextNode(v(m)))}},getContrast:function(a){a=e(a).rgba;a[0]*=1;a[1]*=1.2;a[2]*=.5;return 459<a[0]+a[1]+a[2]?"#000000":"#FFFFFF"},button:function(a,d,m,e,w,k,l,g,c,x){var D=this.label(a,d,m,c,null,null,x,null,"button"),p=0,K=this.styledMode;D.attr(A({padding:8,r:2},w));if(!K){w=A({fill:"#f7f7f7",stroke:"#cccccc","stroke-width":1,style:{color:"#333333",cursor:"pointer",fontWeight:"normal"}},
w);var J=w.style;delete w.style;k=A(w,{fill:"#e6e6e6"},k);var N=k.style;delete k.style;l=A(w,{fill:"#e6ebf5",style:{color:"#000000",fontWeight:"bold"}},l);var h=l.style;delete l.style;g=A(w,{style:{color:"#cccccc"}},g);var u=g.style;delete g.style}b(D.element,r?"mouseover":"mouseenter",function(){3!==p&&D.setState(1)});b(D.element,r?"mouseout":"mouseleave",function(){3!==p&&D.setState(p)});D.setState=function(a){1!==a&&(D.state=p=a);D.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-"+
["normal","hover","pressed","disabled"][a||0]);K||D.attr([w,k,l,g][a||0]).css([J,N,h,u][a||0])};K||D.attr(w).css(t({cursor:"default"},J));return D.on("click",function(a){3!==p&&e.call(D,a)})},crispLine:function(a,b){a[1]===a[4]&&(a[1]=a[4]=Math.round(a[1])-b%2/2);a[2]===a[5]&&(a[2]=a[5]=Math.round(a[2])+b%2/2);return a},path:function(a){var b=this.styledMode?{}:{fill:"none"};v(a)?b.d=a:H(a)&&t(b,a);return this.createElement("path").attr(b)},circle:function(a,b,d){a=H(a)?a:void 0===a?{}:{x:a,y:b,r:d};
b=this.createElement("circle");b.xSetter=b.ySetter=function(a,b,d){d.setAttribute("c"+b,a)};return b.attr(a)},arc:function(a,b,d,m,e,w){H(a)?(m=a,b=m.y,d=m.r,a=m.x):m={innerR:m,start:e,end:w};a=this.symbol("arc",a,b,d,d,m);a.r=d;return a},rect:function(a,b,d,m,e,w){e=H(a)?a.r:e;var k=this.createElement("rect");a=H(a)?a:void 0===a?{}:{x:a,y:b,width:Math.max(d,0),height:Math.max(m,0)};this.styledMode||(void 0!==w&&(a.strokeWidth=w,a=k.crisp(a)),a.fill="none");e&&(a.r=e);k.rSetter=function(a,b,d){k.r=
a;F(d,{rx:a,ry:a})};k.rGetter=function(){return k.r};return k.attr(a)},setSize:function(a,b,d){var m=this.alignedObjects,e=m.length;this.width=a;this.height=b;for(this.boxWrapper.animate({width:a,height:b},{step:function(){this.attr({viewBox:"0 0 "+this.attr("width")+" "+this.attr("height")})},duration:n(d,!0)?void 0:0});e--;)m[e].align()},g:function(a){var b=this.createElement("g");return a?b.attr({"class":"highcharts-"+a}):b},image:function(a,d,m,e,w,k){var l={preserveAspectRatio:"none"},g=function(a,
b){a.setAttributeNS?a.setAttributeNS("http://www.w3.org/1999/xlink","href",b):a.setAttribute("hc-svg-href",b)},r=function(b){g(c.element,a);k.call(c,b)};1<arguments.length&&t(l,{x:d,y:m,width:e,height:w});var c=this.createElement("image").attr(l);k?(g(c.element,"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="),l=new Q.Image,b(l,"load",r),l.src=a,l.complete&&r({})):g(c.element,a);return c},symbol:function(a,b,m,e,w,k){var g=this,r=/^url\((.*?)\)$/,c=r.test(a),D=!c&&(this.symbols[a]?
a:"circle"),x=D&&this.symbols[D],K=G(b)&&x&&x.call(this.symbols,Math.round(b),Math.round(m),e,w,k);if(x){var J=this.path(K);g.styledMode||J.attr("fill","none");t(J,{symbolName:D,x:b,y:m,width:e,height:w});k&&t(J,k)}else if(c){var A=a.match(r)[1];J=this.image(A);J.imgwidth=n(S[A]&&S[A].width,k&&k.width);J.imgheight=n(S[A]&&S[A].height,k&&k.height);var h=function(){J.attr({width:J.width,height:J.height})};["width","height"].forEach(function(a){J[a+"Setter"]=function(a,b){var d={},m=this["img"+b],e=
"width"===b?"translateX":"translateY";this[b]=a;G(m)&&(k&&"within"===k.backgroundSize&&this.width&&this.height&&(m=Math.round(m*Math.min(this.width/this.imgwidth,this.height/this.imgheight))),this.element&&this.element.setAttribute(b,m),this.alignByTranslate||(d[e]=((this[b]||0)-m)/2,this.attr(d)))}});G(b)&&J.attr({x:b,y:m});J.isImg=!0;G(J.imgwidth)&&G(J.imgheight)?h():(J.attr({width:0,height:0}),L("img",{onload:function(){var a=d[g.chartIndex];0===this.width&&(l(this,{position:"absolute",top:"-999em"}),
p.body.appendChild(this));S[A]={width:this.width,height:this.height};J.imgwidth=this.width;J.imgheight=this.height;J.element&&h();this.parentNode&&this.parentNode.removeChild(this);g.imgCount--;if(!g.imgCount&&a&&a.onload)a.onload()},src:A}),this.imgCount++)}return J},symbols:{circle:function(a,b,d,m){return this.arc(a+d/2,b+m/2,d/2,m/2,{start:.5*Math.PI,end:2.5*Math.PI,open:!1})},square:function(a,b,d,m){return["M",a,b,"L",a+d,b,a+d,b+m,a,b+m,"Z"]},triangle:function(a,b,d,m){return["M",a+d/2,b,"L",
a+d,b+m,a,b+m,"Z"]},"triangle-down":function(a,b,d,m){return["M",a,b,"L",a+d,b,a+d/2,b+m,"Z"]},diamond:function(a,b,d,m){return["M",a+d/2,b,"L",a+d,b+m/2,a+d/2,b+m,a,b+m/2,"Z"]},arc:function(a,b,d,m,e){var w=e.start,k=e.r||d,l=e.r||m||d,g=e.end-.001;d=e.innerR;m=n(e.open,.001>Math.abs(e.end-e.start-2*Math.PI));var r=Math.cos(w),c=Math.sin(w),x=Math.cos(g);g=Math.sin(g);w=.001>e.end-w-Math.PI?0:1;e=["M",a+k*r,b+l*c,"A",k,l,0,w,n(e.clockwise,1),a+k*x,b+l*g];G(d)&&e.push(m?"M":"L",a+d*x,b+d*g,"A",d,
d,0,w,0,a+d*r,b+d*c);e.push(m?"":"Z");return e},callout:function(a,b,d,m,e){var w=Math.min(e&&e.r||0,d,m),k=w+6,l=e&&e.anchorX;e=e&&e.anchorY;var g=["M",a+w,b,"L",a+d-w,b,"C",a+d,b,a+d,b,a+d,b+w,"L",a+d,b+m-w,"C",a+d,b+m,a+d,b+m,a+d-w,b+m,"L",a+w,b+m,"C",a,b+m,a,b+m,a,b+m-w,"L",a,b+w,"C",a,b,a,b,a+w,b];l&&l>d?e>b+k&&e<b+m-k?g.splice(13,3,"L",a+d,e-6,a+d+6,e,a+d,e+6,a+d,b+m-w):g.splice(13,3,"L",a+d,m/2,l,e,a+d,m/2,a+d,b+m-w):l&&0>l?e>b+k&&e<b+m-k?g.splice(33,3,"L",a,e+6,a-6,e,a,e-6,a,b+w):g.splice(33,
3,"L",a,m/2,l,e,a,m/2,a,b+w):e&&e>m&&l>a+k&&l<a+d-k?g.splice(23,3,"L",l+6,b+m,l,b+m+6,l-6,b+m,a+w,b+m):e&&0>e&&l>a+k&&l<a+d-k&&g.splice(3,3,"L",l-6,b,l,b-6,l+6,b,d-w,b);return g}},clipRect:function(a,b,d,m){var e=c.uniqueKey()+"-",w=this.createElement("clipPath").attr({id:e}).add(this.defs);a=this.rect(a,b,d,m,0).add(w);a.id=e;a.clipPath=w;a.count=0;return a},text:function(a,b,d,m){var e={};if(m&&(this.allowHTML||!this.forExport))return this.html(a,b,d);e.x=Math.round(b||0);d&&(e.y=Math.round(d));
G(a)&&(e.text=a);a=this.createElement("text").attr(e);m||(a.xSetter=function(a,b,d){var m=d.getElementsByTagName("tspan"),e=d.getAttribute(b),w;for(w=0;w<m.length;w++){var k=m[w];k.getAttribute(b)===e&&k.setAttribute(b,a)}d.setAttribute(b,a)});return a},fontMetrics:function(a,b){a=!this.styledMode&&/px/.test(a)||!Q.getComputedStyle?a||b&&b.style&&b.style.fontSize||this.style&&this.style.fontSize:b&&O.prototype.getStyle.call(b,"font-size");a=/px/.test(a)?q(a):12;b=24>a?a+3:Math.round(1.2*a);return{h:b,
b:Math.round(.8*b),f:a}},rotCorr:function(a,b,d){var m=a;b&&d&&(m=Math.max(m*Math.cos(b*E),4));return{x:-a/3*Math.sin(b*E),y:m}},label:function(a,b,d,e,w,k,l,g,r){var c=this,x=c.styledMode,J=c.g("button"!==r&&"label"),p=J.text=c.text("",0,0,l).attr({zIndex:1}),K,h,D=0,u=3,L=0,n,N,E,U,f,q={},T,S,v=/^url\((.*?)\)$/.test(e),Q=x||v,y=function(){return x?K.strokeWidth()%2/2:(T?parseInt(T,10):0)%2/2};r&&J.addClass("highcharts-"+r);var R=function(){var a=p.element.style,b={};h=(void 0===n||void 0===N||f)&&
G(p.textStr)&&p.getBBox();J.width=(n||h.width||0)+2*u+L;J.height=(N||h.height||0)+2*u;S=u+Math.min(c.fontMetrics(a&&a.fontSize,p).b,h?h.height:Infinity);Q&&(K||(J.box=K=c.symbols[e]||v?c.symbol(e):c.rect(),K.addClass(("button"===r?"":"highcharts-label-box")+(r?" highcharts-"+r+"-box":"")),K.add(J),a=y(),b.x=a,b.y=(g?-S:0)+a),b.width=Math.round(J.width),b.height=Math.round(J.height),K.attr(t(b,q)),q={})};var B=function(){var a=L+u;var b=g?0:S;G(n)&&h&&("center"===f||"right"===f)&&(a+={center:.5,right:1}[f]*
(n-h.width));if(a!==p.x||b!==p.y)p.attr("x",a),p.hasBoxWidthChanged&&(h=p.getBBox(!0),R()),void 0!==b&&p.attr("y",b);p.x=a;p.y=b};var V=function(a,b){K?K.attr(a,b):q[a]=b};J.onAdd=function(){p.add(J);J.attr({text:a||0===a?a:"",x:b,y:d});K&&G(w)&&J.attr({anchorX:w,anchorY:k})};J.widthSetter=function(a){n=C(a)?a:null};J.heightSetter=function(a){N=a};J["text-alignSetter"]=function(a){f=a};J.paddingSetter=function(a){G(a)&&a!==u&&(u=J.padding=a,B())};J.paddingLeftSetter=function(a){G(a)&&a!==L&&(L=a,
B())};J.alignSetter=function(a){a={left:0,center:.5,right:1}[a];a!==D&&(D=a,h&&J.attr({x:E}))};J.textSetter=function(a){void 0!==a&&p.attr({text:a});R();B()};J["stroke-widthSetter"]=function(a,b){a&&(Q=!0);T=this["stroke-width"]=a;V(b,a)};x?J.rSetter=function(a,b){V(b,a)}:J.strokeSetter=J.fillSetter=J.rSetter=function(a,b){"r"!==b&&("fill"===b&&a&&(Q=!0),J[b]=a);V(b,a)};J.anchorXSetter=function(a,b){w=J.anchorX=a;V(b,Math.round(a)-y()-E)};J.anchorYSetter=function(a,b){k=J.anchorY=a;V(b,a-U)};J.xSetter=
function(a){J.x=a;D&&(a-=D*((n||h.width)+2*u),J["forceAnimate:x"]=!0);E=Math.round(a);J.attr("translateX",E)};J.ySetter=function(a){U=J.y=Math.round(a);J.attr("translateY",U)};var H=J.css;l={css:function(a){if(a){var b={};a=A(a);J.textProps.forEach(function(d){void 0!==a[d]&&(b[d]=a[d],delete a[d])});p.css(b);"width"in b&&R();"fontSize"in b&&(R(),B())}return H.call(J,a)},getBBox:function(){return{width:h.width+2*u,height:h.height+2*u,x:h.x-u,y:h.y-u}},destroy:function(){m(J.element,"mouseenter");
m(J.element,"mouseleave");p&&(p=p.destroy());K&&(K=K.destroy());O.prototype.destroy.call(J);J=c=R=B=V=null}};x||(l.shadow=function(a){a&&(R(),K&&K.shadow(a));return J});return t(J,l)}});c.Renderer=f});M(I,"parts/Html.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.attr,G=f.defined,z=f.extend,B=f.pick,t=f.pInt,v=c.createElement,C=c.css,H=c.isFirefox,y=c.isMS,h=c.isWebKit,n=c.SVGElement;f=c.SVGRenderer;var q=c.win;z(n.prototype,{htmlCss:function(g){var b="SPAN"===this.element.tagName&&
g&&"width"in g,a=B(b&&g.width,void 0);if(b){delete g.width;this.textWidth=a;var d=!0}g&&"ellipsis"===g.textOverflow&&(g.whiteSpace="nowrap",g.overflow="hidden");this.styles=z(this.styles,g);C(this.element,g);d&&this.htmlUpdateTransform();return this},htmlGetBBox:function(){var g=this.element;return{x:g.offsetLeft,y:g.offsetTop,width:g.offsetWidth,height:g.offsetHeight}},htmlUpdateTransform:function(){if(this.added){var g=this.renderer,b=this.element,a=this.translateX||0,d=this.translateY||0,e=this.x||
0,l=this.y||0,c=this.textAlign||"left",h={left:0,center:.5,right:1}[c],p=this.styles,u=p&&p.whiteSpace;C(b,{marginLeft:a,marginTop:d});!g.styledMode&&this.shadows&&this.shadows.forEach(function(b){C(b,{marginLeft:a+1,marginTop:d+1})});this.inverted&&[].forEach.call(b.childNodes,function(a){g.invertChild(a,b)});if("SPAN"===b.tagName){p=this.rotation;var k=this.textWidth&&t(this.textWidth),r=[p,c,b.innerHTML,this.textWidth,this.textAlign].join(),x;(x=k!==this.oldTextWidth)&&!(x=k>this.oldTextWidth)&&
((x=this.textPxLength)||(C(b,{width:"",whiteSpace:u||"nowrap"}),x=b.offsetWidth),x=x>k);x&&(/[ \-]/.test(b.textContent||b.innerText)||"ellipsis"===b.style.textOverflow)?(C(b,{width:k+"px",display:"block",whiteSpace:u||"normal"}),this.oldTextWidth=k,this.hasBoxWidthChanged=!0):this.hasBoxWidthChanged=!1;r!==this.cTT&&(u=g.fontMetrics(b.style.fontSize,b).b,!G(p)||p===(this.oldRotation||0)&&c===this.oldAlign||this.setSpanRotation(p,h,u),this.getSpanCorrection(!G(p)&&this.textPxLength||b.offsetWidth,
u,h,p,c));C(b,{left:e+(this.xCorr||0)+"px",top:l+(this.yCorr||0)+"px"});this.cTT=r;this.oldRotation=p;this.oldAlign=c}}else this.alignOnAdd=!0},setSpanRotation:function(g,b,a){var d={},e=this.renderer.getTransformKey();d[e]=d.transform="rotate("+g+"deg)";d[e+(H?"Origin":"-origin")]=d.transformOrigin=100*b+"% "+a+"px";C(this.element,d)},getSpanCorrection:function(g,b,a){this.xCorr=-g*a;this.yCorr=-b}});z(f.prototype,{getTransformKey:function(){return y&&!/Edge/.test(q.navigator.userAgent)?"-ms-transform":
h?"-webkit-transform":H?"MozTransform":q.opera?"-o-transform":""},html:function(g,b,a){var d=this.createElement("span"),e=d.element,l=d.renderer,c=l.isSVG,h=function(a,b){["opacity","visibility"].forEach(function(d){a[d+"Setter"]=function(e,k,l){var w=a.div?a.div.style:b;n.prototype[d+"Setter"].call(this,e,k,l);w&&(w[k]=e)}});a.addedSetters=!0};d.textSetter=function(a){a!==e.innerHTML&&(delete this.bBox,delete this.oldTextWidth);this.textStr=a;e.innerHTML=B(a,"");d.doTransform=!0};c&&h(d,d.element.style);
d.xSetter=d.ySetter=d.alignSetter=d.rotationSetter=function(a,b){"align"===b&&(b="textAlign");d[b]=a;d.doTransform=!0};d.afterSetters=function(){this.doTransform&&(this.htmlUpdateTransform(),this.doTransform=!1)};d.attr({text:g,x:Math.round(b),y:Math.round(a)}).css({position:"absolute"});l.styledMode||d.css({fontFamily:this.style.fontFamily,fontSize:this.style.fontSize});e.style.whiteSpace="nowrap";d.css=d.htmlCss;c&&(d.add=function(a){var b=l.box.parentNode,k=[];if(this.parentGroup=a){var g=a.div;
if(!g){for(;a;)k.push(a),a=a.parentGroup;k.reverse().forEach(function(a){function e(b,d){a[d]=b;"translateX"===d?m.left=b+"px":m.top=b+"px";a.doTransform=!0}var w=F(a.element,"class");g=a.div=a.div||v("div",w?{className:w}:void 0,{position:"absolute",left:(a.translateX||0)+"px",top:(a.translateY||0)+"px",display:a.display,opacity:a.opacity,pointerEvents:a.styles&&a.styles.pointerEvents},g||b);var m=g.style;z(a,{classSetter:function(a){return function(b){this.element.setAttribute("class",b);a.className=
b}}(g),on:function(){k[0].div&&d.on.apply({element:k[0].div},arguments);return a},translateXSetter:e,translateYSetter:e});a.addedSetters||h(a)})}}else g=b;g.appendChild(e);d.added=!0;d.alignOnAdd&&d.htmlUpdateTransform();return d});return d}})});M(I,"parts/Time.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.defined,G=f.extend,z=f.isObject,B=f.objectEach,t=f.pick,v=f.splat,C=c.merge,H=c.timeUnits,y=c.win;c.Time=function(c){this.update(c,!1)};c.Time.prototype={defaultOptions:{Date:void 0,
getTimezoneOffset:void 0,timezone:void 0,timezoneOffset:0,useUTC:!0},update:function(c){var h=t(c&&c.useUTC,!0),f=this;this.options=c=C(!0,this.options||{},c);this.Date=c.Date||y.Date||Date;this.timezoneOffset=(this.useUTC=h)&&c.timezoneOffset;this.getTimezoneOffset=this.timezoneOffsetFunction();(this.variableTimezone=!(h&&!c.getTimezoneOffset&&!c.timezone))||this.timezoneOffset?(this.get=function(g,b){var a=b.getTime(),d=a-f.getTimezoneOffset(b);b.setTime(d);g=b["getUTC"+g]();b.setTime(a);return g},
this.set=function(g,b,a){if("Milliseconds"===g||"Seconds"===g||"Minutes"===g&&0===b.getTimezoneOffset()%60)b["set"+g](a);else{var d=f.getTimezoneOffset(b);d=b.getTime()-d;b.setTime(d);b["setUTC"+g](a);g=f.getTimezoneOffset(b);d=b.getTime()+g;b.setTime(d)}}):h?(this.get=function(g,b){return b["getUTC"+g]()},this.set=function(g,b,a){return b["setUTC"+g](a)}):(this.get=function(g,b){return b["get"+g]()},this.set=function(g,b,a){return b["set"+g](a)})},makeTime:function(h,n,f,g,b,a){if(this.useUTC){var d=
this.Date.UTC.apply(0,arguments);var e=this.getTimezoneOffset(d);d+=e;var l=this.getTimezoneOffset(d);e!==l?d+=l-e:e-36E5!==this.getTimezoneOffset(d-36E5)||c.isSafari||(d-=36E5)}else d=(new this.Date(h,n,t(f,1),t(g,0),t(b,0),t(a,0))).getTime();return d},timezoneOffsetFunction:function(){var h=this,n=this.options,f=y.moment;if(!this.useUTC)return function(g){return 6E4*(new Date(g)).getTimezoneOffset()};if(n.timezone){if(f)return function(g){return 6E4*-f.tz(g,n.timezone).utcOffset()};c.error(25)}return this.useUTC&&
n.getTimezoneOffset?function(g){return 6E4*n.getTimezoneOffset(g)}:function(){return 6E4*(h.timezoneOffset||0)}},dateFormat:function(h,n,f){if(!F(n)||isNaN(n))return c.defaultOptions.lang.invalidDate||"";h=t(h,"%Y-%m-%d %H:%M:%S");var g=this,b=new this.Date(n),a=this.get("Hours",b),d=this.get("Day",b),e=this.get("Date",b),l=this.get("Month",b),L=this.get("FullYear",b),E=c.defaultOptions.lang,p=E.weekdays,u=E.shortWeekdays,k=c.pad;b=G({a:u?u[d]:p[d].substr(0,3),A:p[d],d:k(e),e:k(e,2," "),w:d,b:E.shortMonths[l],
B:E.months[l],m:k(l+1),o:l+1,y:L.toString().substr(2,2),Y:L,H:k(a),k:a,I:k(a%12||12),l:a%12||12,M:k(g.get("Minutes",b)),p:12>a?"AM":"PM",P:12>a?"am":"pm",S:k(b.getSeconds()),L:k(Math.floor(n%1E3),3)},c.dateFormats);B(b,function(a,b){for(;-1!==h.indexOf("%"+b);)h=h.replace("%"+b,"function"===typeof a?a.call(g,n):a)});return f?h.substr(0,1).toUpperCase()+h.substr(1):h},resolveDTLFormat:function(c){return z(c,!0)?c:(c=v(c),{main:c[0],from:c[1],to:c[2]})},getTimeTicks:function(c,n,f,g){var b=this,a=[],
d={};var e=new b.Date(n);var l=c.unitRange,h=c.count||1,E;g=t(g,1);if(F(n)){b.set("Milliseconds",e,l>=H.second?0:h*Math.floor(b.get("Milliseconds",e)/h));l>=H.second&&b.set("Seconds",e,l>=H.minute?0:h*Math.floor(b.get("Seconds",e)/h));l>=H.minute&&b.set("Minutes",e,l>=H.hour?0:h*Math.floor(b.get("Minutes",e)/h));l>=H.hour&&b.set("Hours",e,l>=H.day?0:h*Math.floor(b.get("Hours",e)/h));l>=H.day&&b.set("Date",e,l>=H.month?1:Math.max(1,h*Math.floor(b.get("Date",e)/h)));if(l>=H.month){b.set("Month",e,l>=
H.year?0:h*Math.floor(b.get("Month",e)/h));var p=b.get("FullYear",e)}l>=H.year&&b.set("FullYear",e,p-p%h);l===H.week&&(p=b.get("Day",e),b.set("Date",e,b.get("Date",e)-p+g+(p<g?-7:0)));p=b.get("FullYear",e);g=b.get("Month",e);var u=b.get("Date",e),k=b.get("Hours",e);n=e.getTime();b.variableTimezone&&(E=f-n>4*H.month||b.getTimezoneOffset(n)!==b.getTimezoneOffset(f));n=e.getTime();for(e=1;n<f;)a.push(n),n=l===H.year?b.makeTime(p+e*h,0):l===H.month?b.makeTime(p,g+e*h):!E||l!==H.day&&l!==H.week?E&&l===
H.hour&&1<h?b.makeTime(p,g,u,k+e*h):n+l*h:b.makeTime(p,g,u+e*h*(l===H.day?1:7)),e++;a.push(n);l<=H.hour&&1E4>a.length&&a.forEach(function(a){0===a%18E5&&"000000000"===b.dateFormat("%H%M%S%L",a)&&(d[a]="day")})}a.info=G(c,{higherRanks:d,totalRange:l*h});return a}}});M(I,"parts/Options.js",[I["parts/Globals.js"]],function(c){var f=c.color,F=c.merge;c.defaultOptions={colors:"#7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1".split(" "),symbols:["circle","diamond","square",
"triangle","triangle-down"],lang:{loading:"Loading...",months:"January February March April May June July August September October November December".split(" "),shortMonths:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),weekdays:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),decimalPoint:".",numericSymbols:"kMGTPE".split(""),resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:" "},global:{},time:c.Time.prototype.defaultOptions,chart:{styledMode:!1,
borderRadius:0,colorCount:10,defaultSeriesType:"line",ignoreHiddenSeries:!0,spacing:[10,10,15,10],resetZoomButton:{theme:{zIndex:6},position:{align:"right",x:-10,y:10}},width:null,height:null,borderColor:"#335cad",backgroundColor:"#ffffff",plotBorderColor:"#cccccc"},title:{text:"Chart title",align:"center",margin:15,widthAdjust:-44},subtitle:{text:"",align:"center",widthAdjust:-44},caption:{margin:15,text:"",align:"left",verticalAlign:"bottom"},plotOptions:{},labels:{style:{position:"absolute",color:"#333333"}},
legend:{enabled:!0,align:"center",alignColumns:!0,layout:"horizontal",labelFormatter:function(){return this.name},borderColor:"#999999",borderRadius:0,navigation:{activeColor:"#003399",inactiveColor:"#cccccc"},itemStyle:{color:"#333333",cursor:"pointer",fontSize:"12px",fontWeight:"bold",textOverflow:"ellipsis"},itemHoverStyle:{color:"#000000"},itemHiddenStyle:{color:"#cccccc"},shadow:!1,itemCheckboxStyle:{position:"absolute",width:"13px",height:"13px"},squareSymbol:!0,symbolPadding:5,verticalAlign:"bottom",
x:0,y:0,title:{style:{fontWeight:"bold"}}},loading:{labelStyle:{fontWeight:"bold",position:"relative",top:"45%"},style:{position:"absolute",backgroundColor:"#ffffff",opacity:.5,textAlign:"center"}},tooltip:{enabled:!0,animation:c.svg,borderRadius:3,dateTimeLabelFormats:{millisecond:"%A, %b %e, %H:%M:%S.%L",second:"%A, %b %e, %H:%M:%S",minute:"%A, %b %e, %H:%M",hour:"%A, %b %e, %H:%M",day:"%A, %b %e, %Y",week:"Week from %A, %b %e, %Y",month:"%B %Y",year:"%Y"},footerFormat:"",padding:8,snap:c.isTouchDevice?
25:10,headerFormat:'<span style="font-size: 10px">{point.key}</span><br/>',pointFormat:'<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.y}</b><br/>',backgroundColor:f("#f7f7f7").setOpacity(.85).get(),borderWidth:1,shadow:!0,style:{color:"#333333",cursor:"default",fontSize:"12px",pointerEvents:"none",whiteSpace:"nowrap"}},credits:{enabled:!0,href:"https://www.highcharts.com?credits",position:{align:"right",x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",color:"#999999",
fontSize:"9px"},text:"Highcharts.com"}};c.setOptions=function(f){c.defaultOptions=F(!0,c.defaultOptions,f);(f.time||f.global)&&c.time.update(F(c.defaultOptions.global,c.defaultOptions.time,f.global,f.time));return c.defaultOptions};c.getOptions=function(){return c.defaultOptions};c.defaultPlotOptions=c.defaultOptions.plotOptions;c.time=new c.Time(F(c.defaultOptions.global,c.defaultOptions.time));c.dateFormat=function(f,z,B){return c.time.dateFormat(f,z,B)};""});M(I,"parts/Tick.js",[I["parts/Globals.js"],
I["parts/Utilities.js"]],function(c,f){var F=f.defined,G=f.destroyObjectProperties,z=f.extend,B=f.isNumber,t=f.pick,v=c.correctFloat,C=c.fireEvent,H=c.merge,y=c.deg2rad;c.Tick=function(c,n,f,g,b){this.axis=c;this.pos=n;this.type=f||"";this.isNewLabel=this.isNew=!0;this.parameters=b||{};this.tickmarkOffset=this.parameters.tickmarkOffset;this.options=this.parameters.options;f||g||this.addLabel()};c.Tick.prototype={addLabel:function(){var c=this,n=c.axis,f=n.options,g=n.chart,b=n.categories,a=n.names,
d=c.pos,e=t(c.options&&c.options.labels,f.labels),l=n.tickPositions,L=d===l[0],E=d===l[l.length-1];b=this.parameters.category||(b?t(b[d],a[d],d):d);var p=c.label;l=l.info;var u,k;if(n.isDatetimeAxis&&l){var r=g.time.resolveDTLFormat(f.dateTimeLabelFormats[!f.grid&&l.higherRanks[d]||l.unitName]);var x=r.main}c.isFirst=L;c.isLast=E;c.formatCtx={axis:n,chart:g,isFirst:L,isLast:E,dateTimeLabelFormat:x,tickPositionInfo:l,value:n.isLog?v(n.lin2log(b)):b,pos:d};f=n.labelFormatter.call(c.formatCtx,this.formatCtx);
if(k=r&&r.list)c.shortenLabel=function(){for(u=0;u<k.length;u++)if(p.attr({text:n.labelFormatter.call(z(c.formatCtx,{dateTimeLabelFormat:k[u]}))}),p.getBBox().width<n.getSlotWidth(c)-2*t(e.padding,5))return;p.attr({text:""})};if(F(p))p&&p.textStr!==f&&(!p.textWidth||e.style&&e.style.width||p.styles.width||p.css({width:null}),p.attr({text:f}),p.textPxLength=p.getBBox().width);else{if(c.label=p=F(f)&&e.enabled?g.renderer.text(f,0,0,e.useHTML).add(n.labelGroup):null)g.styledMode||p.css(H(e.style)),p.textPxLength=
p.getBBox().width;c.rotation=0}},getLabelSize:function(){return this.label?this.label.getBBox()[this.axis.horiz?"height":"width"]:0},handleOverflow:function(c){var h=this.axis,f=h.options.labels,g=c.x,b=h.chart.chartWidth,a=h.chart.spacing,d=t(h.labelLeft,Math.min(h.pos,a[3]));a=t(h.labelRight,Math.max(h.isRadial?0:h.pos+h.len,b-a[1]));var e=this.label,l=this.rotation,L={left:0,center:.5,right:1}[h.labelAlign||e.attr("align")],E=e.getBBox().width,p=h.getSlotWidth(this),u=p,k=1,r,x={};if(l||"justify"!==
t(f.overflow,"justify"))0>l&&g-L*E<d?r=Math.round(g/Math.cos(l*y)-d):0<l&&g+L*E>a&&(r=Math.round((b-g)/Math.cos(l*y)));else if(b=g+(1-L)*E,g-L*E<d?u=c.x+u*(1-L)-d:b>a&&(u=a-c.x+u*L,k=-1),u=Math.min(p,u),u<p&&"center"===h.labelAlign&&(c.x+=k*(p-u-L*(p-Math.min(E,u)))),E>u||h.autoRotation&&(e.styles||{}).width)r=u;r&&(this.shortenLabel?this.shortenLabel():(x.width=Math.floor(r),(f.style||{}).textOverflow||(x.textOverflow="ellipsis"),e.css(x)))},getPosition:function(h,n,f,g){var b=this.axis,a=b.chart,
d=g&&a.oldChartHeight||a.chartHeight;h={x:h?c.correctFloat(b.translate(n+f,null,null,g)+b.transB):b.left+b.offset+(b.opposite?(g&&a.oldChartWidth||a.chartWidth)-b.right-b.left:0),y:h?d-b.bottom+b.offset-(b.opposite?b.height:0):c.correctFloat(d-b.translate(n+f,null,null,g)-b.transB)};h.y=Math.max(Math.min(h.y,1E5),-1E5);C(this,"afterGetPosition",{pos:h});return h},getLabelPosition:function(c,n,f,g,b,a,d,e){var l=this.axis,h=l.transA,E=l.isLinked&&l.linkedParent?l.linkedParent.reversed:l.reversed,p=
l.staggerLines,u=l.tickRotCorr||{x:0,y:0},k=b.y,r=g||l.reserveSpaceDefault?0:-l.labelOffset*("center"===l.labelAlign?.5:1),x={};F(k)||(k=0===l.side?f.rotation?-8:-f.getBBox().height:2===l.side?u.y+8:Math.cos(f.rotation*y)*(u.y-f.getBBox(!1,0).height/2));c=c+b.x+r+u.x-(a&&g?a*h*(E?-1:1):0);n=n+k-(a&&!g?a*h*(E?1:-1):0);p&&(f=d/(e||1)%p,l.opposite&&(f=p-f-1),n+=l.labelOffset/p*f);x.x=c;x.y=Math.round(n);C(this,"afterGetLabelPosition",{pos:x,tickmarkOffset:a,index:d});return x},getMarkPath:function(c,
n,f,g,b,a){return a.crispLine(["M",c,n,"L",c+(b?0:-f),n+(b?f:0)],g)},renderGridLine:function(c,n,f){var g=this.axis,b=g.options,a=this.gridLine,d={},e=this.pos,l=this.type,h=t(this.tickmarkOffset,g.tickmarkOffset),E=g.chart.renderer,p=l?l+"Grid":"grid",u=b[p+"LineWidth"],k=b[p+"LineColor"];b=b[p+"LineDashStyle"];a||(g.chart.styledMode||(d.stroke=k,d["stroke-width"]=u,b&&(d.dashstyle=b)),l||(d.zIndex=1),c&&(n=0),this.gridLine=a=E.path().attr(d).addClass("highcharts-"+(l?l+"-":"")+"grid-line").add(g.gridGroup));
if(a&&(f=g.getPlotLinePath({value:e+h,lineWidth:a.strokeWidth()*f,force:"pass",old:c})))a[c||this.isNew?"attr":"animate"]({d:f,opacity:n})},renderMark:function(c,n,f){var g=this.axis,b=g.options,a=g.chart.renderer,d=this.type,e=d?d+"Tick":"tick",l=g.tickSize(e),h=this.mark,E=!h,p=c.x;c=c.y;var u=t(b[e+"Width"],!d&&g.isXAxis?1:0);b=b[e+"Color"];l&&(g.opposite&&(l[0]=-l[0]),E&&(this.mark=h=a.path().addClass("highcharts-"+(d?d+"-":"")+"tick").add(g.axisGroup),g.chart.styledMode||h.attr({stroke:b,"stroke-width":u})),
h[E?"attr":"animate"]({d:this.getMarkPath(p,c,l[0],h.strokeWidth()*f,g.horiz,a),opacity:n}))},renderLabel:function(c,n,f,g){var b=this.axis,a=b.horiz,d=b.options,e=this.label,l=d.labels,h=l.step;b=t(this.tickmarkOffset,b.tickmarkOffset);var E=!0,p=c.x;c=c.y;e&&B(p)&&(e.xy=c=this.getLabelPosition(p,c,e,a,l,b,g,h),this.isFirst&&!this.isLast&&!t(d.showFirstLabel,1)||this.isLast&&!this.isFirst&&!t(d.showLastLabel,1)?E=!1:!a||l.step||l.rotation||n||0===f||this.handleOverflow(c),h&&g%h&&(E=!1),E&&B(c.y)?
(c.opacity=f,e[this.isNewLabel?"attr":"animate"](c),this.isNewLabel=!1):(e.attr("y",-9999),this.isNewLabel=!0))},render:function(h,n,f){var g=this.axis,b=g.horiz,a=this.pos,d=t(this.tickmarkOffset,g.tickmarkOffset);a=this.getPosition(b,a,d,n);d=a.x;var e=a.y;g=b&&d===g.pos+g.len||!b&&e===g.pos?-1:1;f=t(f,1);this.isActive=!0;this.renderGridLine(n,f,g);this.renderMark(a,f,g);this.renderLabel(a,n,f,h);this.isNew=!1;c.fireEvent(this,"afterRender")},destroy:function(){G(this,this.axis)}}});M(I,"parts/Axis.js",
[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.arrayMax,G=f.arrayMin,z=f.defined,B=f.destroyObjectProperties,t=f.extend,v=f.isArray,C=f.isNumber,H=f.isString,y=f.objectEach,h=f.pick,n=f.splat,q=f.syncTimeout,g=c.addEvent,b=c.animObject,a=c.color,d=c.correctFloat,e=c.defaultOptions,l=c.deg2rad,L=c.fireEvent,E=c.format,p=c.getMagnitude,u=c.merge,k=c.normalizeTickInterval,r=c.removeEvent,x=c.seriesTypes,A=c.Tick;f=function(){this.init.apply(this,arguments)};t(f.prototype,{defaultOptions:{dateTimeLabelFormats:{millisecond:{main:"%H:%M:%S.%L",
range:!1},second:{main:"%H:%M:%S",range:!1},minute:{main:"%H:%M",range:!1},hour:{main:"%H:%M",range:!1},day:{main:"%e. %b"},week:{main:"%e. %b"},month:{main:"%b '%y"},year:{main:"%Y"}},endOnTick:!1,labels:{enabled:!0,indentation:10,x:0,style:{color:"#666666",cursor:"default",fontSize:"11px"}},maxPadding:.01,minorTickLength:2,minorTickPosition:"outside",minPadding:.01,showEmpty:!0,startOfWeek:1,startOnTick:!1,tickLength:10,tickPixelInterval:100,tickmarkPlacement:"between",tickPosition:"outside",title:{align:"middle",
style:{color:"#666666"}},type:"linear",minorGridLineColor:"#f2f2f2",minorGridLineWidth:1,minorTickColor:"#999999",lineColor:"#ccd6eb",lineWidth:1,gridLineColor:"#e6e6e6",tickColor:"#ccd6eb"},defaultYAxisOptions:{endOnTick:!0,maxPadding:.05,minPadding:.05,tickPixelInterval:72,showLastLabel:!0,labels:{x:-8},startOnTick:!0,title:{rotation:270,text:"Values"},stackLabels:{allowOverlap:!1,enabled:!1,crop:!0,overflow:"justify",formatter:function(){return c.numberFormat(this.total,-1)},style:{color:"#000000",
fontSize:"11px",fontWeight:"bold",textOutline:"1px contrast"}},gridLineWidth:1,lineWidth:0},defaultLeftAxisOptions:{labels:{x:-15},title:{rotation:270}},defaultRightAxisOptions:{labels:{x:15},title:{rotation:90}},defaultBottomAxisOptions:{labels:{autoRotation:[-45],x:0},margin:15,title:{rotation:0}},defaultTopAxisOptions:{labels:{autoRotation:[-45],x:0},margin:15,title:{rotation:0}},init:function(a,b){var d=b.isX,m=this;m.chart=a;m.horiz=a.inverted&&!m.isZAxis?!d:d;m.isXAxis=d;m.coll=m.coll||(d?"xAxis":
"yAxis");L(this,"init",{userOptions:b});m.opposite=b.opposite;m.side=b.side||(m.horiz?m.opposite?0:2:m.opposite?1:3);m.setOptions(b);var e=this.options,w=e.type;m.labelFormatter=e.labels.formatter||m.defaultLabelFormatter;m.userOptions=b;m.minPixelPadding=0;m.reversed=e.reversed;m.visible=!1!==e.visible;m.zoomEnabled=!1!==e.zoomEnabled;m.hasNames="category"===w||!0===e.categories;m.categories=e.categories||m.hasNames;m.names||(m.names=[],m.names.keys={});m.plotLinesAndBandsGroups={};m.isLog="logarithmic"===
w;m.isDatetimeAxis="datetime"===w;m.positiveValuesOnly=m.isLog&&!m.allowNegativeLog;m.isLinked=z(e.linkedTo);m.ticks={};m.labelEdge=[];m.minorTicks={};m.plotLinesAndBands=[];m.alternateBands={};m.len=0;m.minRange=m.userMinRange=e.minRange||e.maxZoom;m.range=e.range;m.offset=e.offset||0;m.stacks={};m.oldStacks={};m.stacksTouched=0;m.max=null;m.min=null;m.crosshair=h(e.crosshair,n(a.options.tooltip.crosshairs)[d?0:1],!1);b=m.options.events;-1===a.axes.indexOf(m)&&(d?a.axes.splice(a.xAxis.length,0,m):
a.axes.push(m),a[m.coll].push(m));m.series=m.series||[];a.inverted&&!m.isZAxis&&d&&void 0===m.reversed&&(m.reversed=!0);y(b,function(a,b){c.isFunction(a)&&g(m,b,a)});m.lin2log=e.linearToLogConverter||m.lin2log;m.isLog&&(m.val2lin=m.log2lin,m.lin2val=m.lin2log);L(this,"afterInit")},setOptions:function(a){this.options=u(this.defaultOptions,"yAxis"===this.coll&&this.defaultYAxisOptions,[this.defaultTopAxisOptions,this.defaultRightAxisOptions,this.defaultBottomAxisOptions,this.defaultLeftAxisOptions][this.side],
u(e[this.coll],a));L(this,"afterSetOptions",{userOptions:a})},defaultLabelFormatter:function(){var a=this.axis,b=this.value,d=a.chart.time,k=a.categories,l=this.dateTimeLabelFormat,g=e.lang,r=g.numericSymbols;g=g.numericSymbolMagnitude||1E3;var x=r&&r.length,p=a.options.labels.format;a=a.isLog?Math.abs(b):a.tickInterval;if(p)var h=E(p,this,d);else if(k)h=b;else if(l)h=d.dateFormat(l,b);else if(x&&1E3<=a)for(;x--&&void 0===h;)d=Math.pow(g,x+1),a>=d&&0===10*b%d&&null!==r[x]&&0!==b&&(h=c.numberFormat(b/
d,-1)+r[x]);void 0===h&&(h=1E4<=Math.abs(b)?c.numberFormat(b,-1):c.numberFormat(b,-1,void 0,""));return h},getSeriesExtremes:function(){var a=this,b=a.chart,d;L(this,"getSeriesExtremes",null,function(){a.hasVisibleSeries=!1;a.dataMin=a.dataMax=a.threshold=null;a.softThreshold=!a.isXAxis;a.buildStacks&&a.buildStacks();a.series.forEach(function(m){if(m.visible||!b.options.chart.ignoreHiddenSeries){var e=m.options,w=e.threshold;a.hasVisibleSeries=!0;a.positiveValuesOnly&&0>=w&&(w=null);if(a.isXAxis){if(e=
m.xData,e.length){d=m.getXExtremes(e);var k=d.min;var c=d.max;C(k)||k instanceof Date||(e=e.filter(C),d=m.getXExtremes(e),k=d.min,c=d.max);e.length&&(a.dataMin=Math.min(h(a.dataMin,k),k),a.dataMax=Math.max(h(a.dataMax,c),c))}}else if(m.getExtremes(),c=m.dataMax,k=m.dataMin,z(k)&&z(c)&&(a.dataMin=Math.min(h(a.dataMin,k),k),a.dataMax=Math.max(h(a.dataMax,c),c)),z(w)&&(a.threshold=w),!e.softThreshold||a.positiveValuesOnly)a.softThreshold=!1}})});L(this,"afterGetSeriesExtremes")},translate:function(a,
b,d,e,k,c){var m=this.linkedParent||this,w=1,l=0,g=e?m.oldTransA:m.transA;e=e?m.oldMin:m.min;var r=m.minPixelPadding;k=(m.isOrdinal||m.isBroken||m.isLog&&k)&&m.lin2val;g||(g=m.transA);d&&(w*=-1,l=m.len);m.reversed&&(w*=-1,l-=w*(m.sector||m.len));b?(a=(a*w+l-r)/g+e,k&&(a=m.lin2val(a))):(k&&(a=m.val2lin(a)),a=C(e)?w*(a-e)*g+l+w*r+(C(c)?g*c:0):void 0);return a},toPixels:function(a,b){return this.translate(a,!1,!this.horiz,null,!0)+(b?0:this.pos)},toValue:function(a,b){return this.translate(a-(b?0:this.pos),
!0,!this.horiz,null,!0)},getPlotLinePath:function(a){var b=this,d=b.chart,e=b.left,w=b.top,k=a.old,c=a.value,l=a.translatedValue,g=a.lineWidth,r=a.force,x,p,A,u,n=k&&d.oldChartHeight||d.chartHeight,f=k&&d.oldChartWidth||d.chartWidth,E,q=b.transB,v=function(a,b,d){if("pass"!==r&&a<b||a>d)r?a=Math.min(Math.max(b,a),d):E=!0;return a};a={value:c,lineWidth:g,old:k,force:r,acrossPanes:a.acrossPanes,translatedValue:l};L(this,"getPlotLinePath",a,function(a){l=h(l,b.translate(c,null,null,k));l=Math.min(Math.max(-1E5,
l),1E5);x=A=Math.round(l+q);p=u=Math.round(n-l-q);C(l)?b.horiz?(p=w,u=n-b.bottom,x=A=v(x,e,e+b.width)):(x=e,A=f-b.right,p=u=v(p,w,w+b.height)):(E=!0,r=!1);a.path=E&&!r?null:d.renderer.crispLine(["M",x,p,"L",A,u],g||1)});return a.path},getLinearTickPositions:function(a,b,e){var m=d(Math.floor(b/a)*a);e=d(Math.ceil(e/a)*a);var w=[],k;d(m+a)===m&&(k=20);if(this.single)return[b];for(b=m;b<=e;){w.push(b);b=d(b+a,k);if(b===c)break;var c=b}return w},getMinorTickInterval:function(){var a=this.options;return!0===
a.minorTicks?h(a.minorTickInterval,"auto"):!1===a.minorTicks?null:a.minorTickInterval},getMinorTickPositions:function(){var a=this,b=a.options,d=a.tickPositions,e=a.minorTickInterval,k=[],c=a.pointRangePadding||0,l=a.min-c;c=a.max+c;var g=c-l;if(g&&g/e<a.len/3)if(a.isLog)this.paddedTicks.forEach(function(b,d,m){d&&k.push.apply(k,a.getLogTickPositions(e,m[d-1],m[d],!0))});else if(a.isDatetimeAxis&&"auto"===this.getMinorTickInterval())k=k.concat(a.getTimeTicks(a.normalizeTimeTickInterval(e),l,c,b.startOfWeek));
else for(b=l+(d[0]-l)%e;b<=c&&b!==k[0];b+=e)k.push(b);0!==k.length&&a.trimTicks(k);return k},adjustForMinRange:function(){var a=this.options,b=this.min,d=this.max,e,k,c,l,g;this.isXAxis&&void 0===this.minRange&&!this.isLog&&(z(a.min)||z(a.max)?this.minRange=null:(this.series.forEach(function(a){l=a.xData;for(k=g=a.xIncrement?1:l.length-1;0<k;k--)if(c=l[k]-l[k-1],void 0===e||c<e)e=c}),this.minRange=Math.min(5*e,this.dataMax-this.dataMin)));if(d-b<this.minRange){var r=this.dataMax-this.dataMin>=this.minRange;
var x=this.minRange;var p=(x-d+b)/2;p=[b-p,h(a.min,b-p)];r&&(p[2]=this.isLog?this.log2lin(this.dataMin):this.dataMin);b=F(p);d=[b+x,h(a.max,b+x)];r&&(d[2]=this.isLog?this.log2lin(this.dataMax):this.dataMax);d=G(d);d-b<x&&(p[0]=d-x,p[1]=h(a.min,d-x),b=F(p))}this.min=b;this.max=d},getClosest:function(){var a;this.categories?a=1:this.series.forEach(function(b){var d=b.closestPointRange,m=b.visible||!b.chart.options.chart.ignoreHiddenSeries;!b.noSharedTooltip&&z(d)&&m&&(a=z(a)?Math.min(a,d):d)});return a},
nameToX:function(a){var b=v(this.categories),d=b?this.categories:this.names,e=a.options.x;a.series.requireSorting=!1;z(e)||(e=!1===this.options.uniqueNames?a.series.autoIncrement():b?d.indexOf(a.name):h(d.keys[a.name],-1));if(-1===e){if(!b)var k=d.length}else k=e;void 0!==k&&(this.names[k]=a.name,this.names.keys[a.name]=k);return k},updateNames:function(){var a=this,b=this.names;0<b.length&&(Object.keys(b.keys).forEach(function(a){delete b.keys[a]}),b.length=0,this.minRange=this.userMinRange,(this.series||
[]).forEach(function(b){b.xIncrement=null;if(!b.points||b.isDirtyData)a.max=Math.max(a.max,b.xData.length-1),b.processData(),b.generatePoints();b.data.forEach(function(d,e){if(d&&d.options&&void 0!==d.name){var m=a.nameToX(d);void 0!==m&&m!==d.x&&(d.x=m,b.xData[e]=m)}})}))},setAxisTranslation:function(a){var b=this,d=b.max-b.min,e=b.axisPointRange||0,k=0,w=0,c=b.linkedParent,l=!!b.categories,g=b.transA,r=b.isXAxis;if(r||l||e){var p=b.getClosest();c?(k=c.minPointOffset,w=c.pointRangePadding):b.series.forEach(function(a){var d=
l?1:r?h(a.options.pointRange,p,0):b.axisPointRange||0,m=a.options.pointPlacement;e=Math.max(e,d);if(!b.single||l)a=x.xrange&&a instanceof x.xrange?!r:r,k=Math.max(k,a&&H(m)?0:d/2),w=Math.max(w,a&&"on"===m?0:d)});c=b.ordinalSlope&&p?b.ordinalSlope/p:1;b.minPointOffset=k*=c;b.pointRangePadding=w*=c;b.pointRange=Math.min(e,b.single&&l?1:d);r&&(b.closestPointRange=p)}a&&(b.oldTransA=g);b.translationSlope=b.transA=g=b.staticScale||b.len/(d+w||1);b.transB=b.horiz?b.left:b.bottom;b.minPixelPadding=g*k;L(this,
"afterSetAxisTranslation")},minFromRange:function(){return this.max-this.range},setTickInterval:function(a){var b=this,e=b.chart,w=b.options,l=b.isLog,g=b.isDatetimeAxis,r=b.isXAxis,x=b.isLinked,A=w.maxPadding,u=w.minPadding,n=w.tickInterval,f=w.tickPixelInterval,E=b.categories,q=C(b.threshold)?b.threshold:null,v=b.softThreshold;g||E||x||this.getTickAmount();var t=h(b.userMin,w.min);var y=h(b.userMax,w.max);if(x){b.linkedParent=e[b.coll][w.linkedTo];var B=b.linkedParent.getExtremes();b.min=h(B.min,
B.dataMin);b.max=h(B.max,B.dataMax);w.type!==b.linkedParent.options.type&&c.error(11,1,e)}else{if(!v&&z(q))if(b.dataMin>=q)B=q,u=0;else if(b.dataMax<=q){var H=q;A=0}b.min=h(t,B,b.dataMin);b.max=h(y,H,b.dataMax)}l&&(b.positiveValuesOnly&&!a&&0>=Math.min(b.min,h(b.dataMin,b.min))&&c.error(10,1,e),b.min=d(b.log2lin(b.min),16),b.max=d(b.log2lin(b.max),16));b.range&&z(b.max)&&(b.userMin=b.min=t=Math.max(b.dataMin,b.minFromRange()),b.userMax=y=b.max,b.range=null);L(b,"foundExtremes");b.beforePadding&&b.beforePadding();
b.adjustForMinRange();!(E||b.axisPointRange||b.usePercentage||x)&&z(b.min)&&z(b.max)&&(e=b.max-b.min)&&(!z(t)&&u&&(b.min-=e*u),!z(y)&&A&&(b.max+=e*A));C(w.softMin)&&!C(b.userMin)&&w.softMin<b.min&&(b.min=t=w.softMin);C(w.softMax)&&!C(b.userMax)&&w.softMax>b.max&&(b.max=y=w.softMax);C(w.floor)&&(b.min=Math.min(Math.max(b.min,w.floor),Number.MAX_VALUE));C(w.ceiling)&&(b.max=Math.max(Math.min(b.max,w.ceiling),h(b.userMax,-Number.MAX_VALUE)));v&&z(b.dataMin)&&(q=q||0,!z(t)&&b.min<q&&b.dataMin>=q?b.min=
b.options.minRange?Math.min(q,b.max-b.minRange):q:!z(y)&&b.max>q&&b.dataMax<=q&&(b.max=b.options.minRange?Math.max(q,b.min+b.minRange):q));b.tickInterval=b.min===b.max||void 0===b.min||void 0===b.max?1:x&&!n&&f===b.linkedParent.options.tickPixelInterval?n=b.linkedParent.tickInterval:h(n,this.tickAmount?(b.max-b.min)/Math.max(this.tickAmount-1,1):void 0,E?1:(b.max-b.min)*f/Math.max(b.len,f));r&&!a&&b.series.forEach(function(a){a.processData(b.min!==b.oldMin||b.max!==b.oldMax)});b.setAxisTranslation(!0);
b.beforeSetTickPositions&&b.beforeSetTickPositions();b.postProcessTickInterval&&(b.tickInterval=b.postProcessTickInterval(b.tickInterval));b.pointRange&&!n&&(b.tickInterval=Math.max(b.pointRange,b.tickInterval));a=h(w.minTickInterval,b.isDatetimeAxis&&b.closestPointRange);!n&&b.tickInterval<a&&(b.tickInterval=a);g||l||n||(b.tickInterval=k(b.tickInterval,null,p(b.tickInterval),h(w.allowDecimals,!(.5<b.tickInterval&&5>b.tickInterval&&1E3<b.max&&9999>b.max)),!!this.tickAmount));this.tickAmount||(b.tickInterval=
b.unsquish());this.setTickPositions()},setTickPositions:function(){var a=this.options,b=a.tickPositions;var d=this.getMinorTickInterval();var e=a.tickPositioner,k=a.startOnTick,l=a.endOnTick;this.tickmarkOffset=this.categories&&"between"===a.tickmarkPlacement&&1===this.tickInterval?.5:0;this.minorTickInterval="auto"===d&&this.tickInterval?this.tickInterval/5:d;this.single=this.min===this.max&&z(this.min)&&!this.tickAmount&&(parseInt(this.min,10)===this.min||!1!==a.allowDecimals);this.tickPositions=
d=b&&b.slice();!d&&(!this.ordinalPositions&&(this.max-this.min)/this.tickInterval>Math.max(2*this.len,200)?(d=[this.min,this.max],c.error(19,!1,this.chart)):d=this.isDatetimeAxis?this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval,a.units),this.min,this.max,a.startOfWeek,this.ordinalPositions,this.closestPointRange,!0):this.isLog?this.getLogTickPositions(this.tickInterval,this.min,this.max):this.getLinearTickPositions(this.tickInterval,this.min,this.max),d.length>this.len&&(d=[d[0],
d.pop()],d[0]===d[1]&&(d.length=1)),this.tickPositions=d,e&&(e=e.apply(this,[this.min,this.max])))&&(this.tickPositions=d=e);this.paddedTicks=d.slice(0);this.trimTicks(d,k,l);this.isLinked||(this.single&&2>d.length&&!this.categories&&(this.min-=.5,this.max+=.5),b||e||this.adjustTickAmount());L(this,"afterSetTickPositions")},trimTicks:function(a,b,d){var e=a[0],m=a[a.length-1],k=this.minPointOffset||0;L(this,"trimTicks");if(!this.isLinked){if(b&&-Infinity!==e)this.min=e;else for(;this.min-k>a[0];)a.shift();
if(d)this.max=m;else for(;this.max+k<a[a.length-1];)a.pop();0===a.length&&z(e)&&!this.options.tickPositions&&a.push((m+e)/2)}},alignToOthers:function(){var a={},b,d=this.options;!1===this.chart.options.chart.alignTicks||!1===d.alignTicks||!1===d.startOnTick||!1===d.endOnTick||this.isLog||this.chart[this.coll].forEach(function(d){var e=d.options;e=[d.horiz?e.left:e.top,e.width,e.height,e.pane].join();d.series.length&&(a[e]?b=!0:a[e]=1)});return b},getTickAmount:function(){var a=this.options,b=a.tickAmount,
d=a.tickPixelInterval;!z(a.tickInterval)&&this.len<d&&!this.isRadial&&!this.isLog&&a.startOnTick&&a.endOnTick&&(b=2);!b&&this.alignToOthers()&&(b=Math.ceil(this.len/d)+1);4>b&&(this.finalTickAmt=b,b=5);this.tickAmount=b},adjustTickAmount:function(){var a=this.options,b=this.tickInterval,e=this.tickPositions,k=this.tickAmount,c=this.finalTickAmt,l=e&&e.length,g=h(this.threshold,this.softThreshold?0:null),r;if(this.hasData()){if(l<k){for(r=this.min;e.length<k;)e.length%2||r===g?e.push(d(e[e.length-
1]+b)):e.unshift(d(e[0]-b));this.transA*=(l-1)/(k-1);this.min=a.startOnTick?e[0]:Math.min(this.min,e[0]);this.max=a.endOnTick?e[e.length-1]:Math.max(this.max,e[e.length-1])}else l>k&&(this.tickInterval*=2,this.setTickPositions());if(z(c)){for(b=a=e.length;b--;)(3===c&&1===b%2||2>=c&&0<b&&b<a-1)&&e.splice(b,1);this.finalTickAmt=void 0}}},setScale:function(){var a=this.series.some(function(a){return a.isDirtyData||a.isDirty||a.xAxis&&a.xAxis.isDirty}),b;this.oldMin=this.min;this.oldMax=this.max;this.oldAxisLength=
this.len;this.setAxisSize();(b=this.len!==this.oldAxisLength)||a||this.isLinked||this.forceRedraw||this.userMin!==this.oldUserMin||this.userMax!==this.oldUserMax||this.alignToOthers()?(this.resetStacks&&this.resetStacks(),this.forceRedraw=!1,this.getSeriesExtremes(),this.setTickInterval(),this.oldUserMin=this.userMin,this.oldUserMax=this.userMax,this.isDirty||(this.isDirty=b||this.min!==this.oldMin||this.max!==this.oldMax)):this.cleanStacks&&this.cleanStacks();L(this,"afterSetScale")},setExtremes:function(a,
b,d,e,k){var m=this,w=m.chart;d=h(d,!0);m.series.forEach(function(a){delete a.kdTree});k=t(k,{min:a,max:b});L(m,"setExtremes",k,function(){m.userMin=a;m.userMax=b;m.eventArgs=k;d&&w.redraw(e)})},zoom:function(a,b){var d=this.dataMin,e=this.dataMax,m=this.options,k=Math.min(d,h(m.min,d)),w=Math.max(e,h(m.max,e));a={newMin:a,newMax:b};L(this,"zoom",a,function(a){var b=a.newMin,m=a.newMax;if(b!==this.min||m!==this.max)this.allowZoomOutside||(z(d)&&(b<k&&(b=k),b>w&&(b=w)),z(e)&&(m<k&&(m=k),m>w&&(m=w))),
this.displayBtn=void 0!==b||void 0!==m,this.setExtremes(b,m,!1,void 0,{trigger:"zoom"});a.zoomed=!0});return a.zoomed},setAxisSize:function(){var a=this.chart,b=this.options,d=b.offsets||[0,0,0,0],e=this.horiz,k=this.width=Math.round(c.relativeLength(h(b.width,a.plotWidth-d[3]+d[1]),a.plotWidth)),l=this.height=Math.round(c.relativeLength(h(b.height,a.plotHeight-d[0]+d[2]),a.plotHeight)),g=this.top=Math.round(c.relativeLength(h(b.top,a.plotTop+d[0]),a.plotHeight,a.plotTop));b=this.left=Math.round(c.relativeLength(h(b.left,
a.plotLeft+d[3]),a.plotWidth,a.plotLeft));this.bottom=a.chartHeight-l-g;this.right=a.chartWidth-k-b;this.len=Math.max(e?k:l,0);this.pos=e?b:g},getExtremes:function(){var a=this.isLog;return{min:a?d(this.lin2log(this.min)):this.min,max:a?d(this.lin2log(this.max)):this.max,dataMin:this.dataMin,dataMax:this.dataMax,userMin:this.userMin,userMax:this.userMax}},getThreshold:function(a){var b=this.isLog,d=b?this.lin2log(this.min):this.min;b=b?this.lin2log(this.max):this.max;null===a||-Infinity===a?a=d:Infinity===
a?a=b:d>a?a=d:b<a&&(a=b);return this.translate(a,0,1,0,1)},autoLabelAlign:function(a){var b=(h(a,0)-90*this.side+720)%360;a={align:"center"};L(this,"autoLabelAlign",a,function(a){15<b&&165>b?a.align="right":195<b&&345>b&&(a.align="left")});return a.align},tickSize:function(a){var b=this.options,d=b[a+"Length"],e=h(b[a+"Width"],"tick"===a&&this.isXAxis&&!this.categories?1:0);if(e&&d){"inside"===b[a+"Position"]&&(d=-d);var k=[d,e]}a={tickSize:k};L(this,"afterTickSize",a);return a.tickSize},labelMetrics:function(){var a=
this.tickPositions&&this.tickPositions[0]||0;return this.chart.renderer.fontMetrics(this.options.labels.style&&this.options.labels.style.fontSize,this.ticks[a]&&this.ticks[a].label)},unsquish:function(){var a=this.options.labels,b=this.horiz,e=this.tickInterval,k=e,c=this.len/(((this.categories?1:0)+this.max-this.min)/e),g,r=a.rotation,x=this.labelMetrics(),p,A=Number.MAX_VALUE,u,n=this.max-this.min,f=function(a){var b=a/(c||1);b=1<b?Math.ceil(b):1;b*e>n&&Infinity!==a&&Infinity!==c&&n&&(b=Math.ceil(n/
e));return d(b*e)};b?(u=!a.staggerLines&&!a.step&&(z(r)?[r]:c<h(a.autoRotationLimit,80)&&a.autoRotation))&&u.forEach(function(a){if(a===r||a&&-90<=a&&90>=a){p=f(Math.abs(x.h/Math.sin(l*a)));var b=p+Math.abs(a/360);b<A&&(A=b,g=a,k=p)}}):a.step||(k=f(x.h));this.autoRotation=u;this.labelRotation=h(g,r);return k},getSlotWidth:function(a){var b=this.chart,d=this.horiz,e=this.options.labels,k=Math.max(this.tickPositions.length-(this.categories?0:1),1),c=b.margin[3];return a&&a.slotWidth||d&&2>(e.step||
0)&&!e.rotation&&(this.staggerLines||1)*this.len/k||!d&&(e.style&&parseInt(e.style.width,10)||c&&c-b.spacing[3]||.33*b.chartWidth)},renderUnsquish:function(){var a=this.chart,b=a.renderer,d=this.tickPositions,e=this.ticks,k=this.options.labels,c=k&&k.style||{},l=this.horiz,g=this.getSlotWidth(),r=Math.max(1,Math.round(g-2*(k.padding||5))),x={},p=this.labelMetrics(),h=k.style&&k.style.textOverflow,A=0;H(k.rotation)||(x.rotation=k.rotation||0);d.forEach(function(a){(a=e[a])&&a.label&&a.label.textPxLength>
A&&(A=a.label.textPxLength)});this.maxLabelLength=A;if(this.autoRotation)A>r&&A>p.h?x.rotation=this.labelRotation:this.labelRotation=0;else if(g){var u=r;if(!h){var n="clip";for(r=d.length;!l&&r--;){var f=d[r];if(f=e[f].label)f.styles&&"ellipsis"===f.styles.textOverflow?f.css({textOverflow:"clip"}):f.textPxLength>g&&f.css({width:g+"px"}),f.getBBox().height>this.len/d.length-(p.h-p.f)&&(f.specificTextOverflow="ellipsis")}}}x.rotation&&(u=A>.5*a.chartHeight?.33*a.chartHeight:A,h||(n="ellipsis"));if(this.labelAlign=
k.align||this.autoLabelAlign(this.labelRotation))x.align=this.labelAlign;d.forEach(function(a){var b=(a=e[a])&&a.label,d=c.width,k={};b&&(b.attr(x),a.shortenLabel?a.shortenLabel():u&&!d&&"nowrap"!==c.whiteSpace&&(u<b.textPxLength||"SPAN"===b.element.tagName)?(k.width=u,h||(k.textOverflow=b.specificTextOverflow||n),b.css(k)):b.styles&&b.styles.width&&!k.width&&!d&&b.css({width:null}),delete b.specificTextOverflow,a.rotation=x.rotation)},this);this.tickRotCorr=b.rotCorr(p.b,this.labelRotation||0,0!==
this.side)},hasData:function(){return this.series.some(function(a){return a.hasData()})||this.options.showEmpty&&z(this.min)&&z(this.max)},addTitle:function(a){var b=this.chart.renderer,d=this.horiz,e=this.opposite,k=this.options.title,c,l=this.chart.styledMode;this.axisTitle||((c=k.textAlign)||(c=(d?{low:"left",middle:"center",high:"right"}:{low:e?"right":"left",middle:"center",high:e?"left":"right"})[k.align]),this.axisTitle=b.text(k.text,0,0,k.useHTML).attr({zIndex:7,rotation:k.rotation||0,align:c}).addClass("highcharts-axis-title"),
l||this.axisTitle.css(u(k.style)),this.axisTitle.add(this.axisGroup),this.axisTitle.isNew=!0);l||k.style.width||this.isRadial||this.axisTitle.css({width:this.len});this.axisTitle[a?"show":"hide"](a)},generateTick:function(a){var b=this.ticks;b[a]?b[a].addLabel():b[a]=new A(this,a)},getOffset:function(){var a=this,b=a.chart,d=b.renderer,e=a.options,k=a.tickPositions,c=a.ticks,l=a.horiz,g=a.side,r=b.inverted&&!a.isZAxis?[1,0,3,2][g]:g,x,p=0,A=0,u=e.title,n=e.labels,f=0,E=b.axisOffset;b=b.clipOffset;
var q=[-1,1,1,-1][g],v=e.className,t=a.axisParent;var C=a.hasData();a.showAxis=x=C||h(e.showEmpty,!0);a.staggerLines=a.horiz&&n.staggerLines;a.axisGroup||(a.gridGroup=d.g("grid").attr({zIndex:e.gridZIndex||1}).addClass("highcharts-"+this.coll.toLowerCase()+"-grid "+(v||"")).add(t),a.axisGroup=d.g("axis").attr({zIndex:e.zIndex||2}).addClass("highcharts-"+this.coll.toLowerCase()+" "+(v||"")).add(t),a.labelGroup=d.g("axis-labels").attr({zIndex:n.zIndex||7}).addClass("highcharts-"+a.coll.toLowerCase()+
"-labels "+(v||"")).add(t));C||a.isLinked?(k.forEach(function(b,d){a.generateTick(b,d)}),a.renderUnsquish(),a.reserveSpaceDefault=0===g||2===g||{1:"left",3:"right"}[g]===a.labelAlign,h(n.reserveSpace,"center"===a.labelAlign?!0:null,a.reserveSpaceDefault)&&k.forEach(function(a){f=Math.max(c[a].getLabelSize(),f)}),a.staggerLines&&(f*=a.staggerLines),a.labelOffset=f*(a.opposite?-1:1)):y(c,function(a,b){a.destroy();delete c[b]});if(u&&u.text&&!1!==u.enabled&&(a.addTitle(x),x&&!1!==u.reserveSpace)){a.titleOffset=
p=a.axisTitle.getBBox()[l?"height":"width"];var B=u.offset;A=z(B)?0:h(u.margin,l?5:10)}a.renderLine();a.offset=q*h(e.offset,E[g]?E[g]+(e.margin||0):0);a.tickRotCorr=a.tickRotCorr||{x:0,y:0};d=0===g?-a.labelMetrics().h:2===g?a.tickRotCorr.y:0;A=Math.abs(f)+A;f&&(A=A-d+q*(l?h(n.y,a.tickRotCorr.y+8*q):n.x));a.axisTitleMargin=h(B,A);a.getMaxLabelDimensions&&(a.maxLabelDimensions=a.getMaxLabelDimensions(c,k));l=this.tickSize("tick");E[g]=Math.max(E[g],a.axisTitleMargin+p+q*a.offset,A,k&&k.length&&l?l[0]+
q*a.offset:0);e=e.offset?0:2*Math.floor(a.axisLine.strokeWidth()/2);b[r]=Math.max(b[r],e);L(this,"afterGetOffset")},getLinePath:function(a){var b=this.chart,d=this.opposite,e=this.offset,k=this.horiz,c=this.left+(d?this.width:0)+e;e=b.chartHeight-this.bottom-(d?this.height:0)+e;d&&(a*=-1);return b.renderer.crispLine(["M",k?this.left:c,k?e:this.top,"L",k?b.chartWidth-this.right:c,k?e:b.chartHeight-this.bottom],a)},renderLine:function(){this.axisLine||(this.axisLine=this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup),
this.chart.styledMode||this.axisLine.attr({stroke:this.options.lineColor,"stroke-width":this.options.lineWidth,zIndex:7}))},getTitlePosition:function(){var a=this.horiz,b=this.left,d=this.top,e=this.len,k=this.options.title,c=a?b:d,l=this.opposite,g=this.offset,r=k.x||0,x=k.y||0,p=this.axisTitle,A=this.chart.renderer.fontMetrics(k.style&&k.style.fontSize,p);p=Math.max(p.getBBox(null,0).height-A.h-1,0);e={low:c+(a?0:e),middle:c+e/2,high:c+(a?e:0)}[k.align];b=(a?d+this.height:b)+(a?1:-1)*(l?-1:1)*this.axisTitleMargin+
[-p,p,A.f,-p][this.side];a={x:a?e+r:b+(l?this.width:0)+g+r,y:a?b+x-(l?this.height:0)+g:e+x};L(this,"afterGetTitlePosition",{titlePosition:a});return a},renderMinorTick:function(a){var b=this.chart.hasRendered&&C(this.oldMin),d=this.minorTicks;d[a]||(d[a]=new A(this,a,"minor"));b&&d[a].isNew&&d[a].render(null,!0);d[a].render(null,!1,1)},renderTick:function(a,b){var d=this.isLinked,e=this.ticks,k=this.chart.hasRendered&&C(this.oldMin);if(!d||a>=this.min&&a<=this.max)e[a]||(e[a]=new A(this,a)),k&&e[a].isNew&&
e[a].render(b,!0,-1),e[a].render(b)},render:function(){var a=this,d=a.chart,e=a.options,k=a.isLog,l=a.isLinked,g=a.tickPositions,r=a.axisTitle,x=a.ticks,p=a.minorTicks,h=a.alternateBands,u=e.stackLabels,n=e.alternateGridColor,f=a.tickmarkOffset,E=a.axisLine,v=a.showAxis,t=b(d.renderer.globalAnimation),B,H;a.labelEdge.length=0;a.overlap=!1;[x,p,h].forEach(function(a){y(a,function(a){a.isActive=!1})});if(a.hasData()||l)a.minorTickInterval&&!a.categories&&a.getMinorTickPositions().forEach(function(b){a.renderMinorTick(b)}),
g.length&&(g.forEach(function(b,d){a.renderTick(b,d)}),f&&(0===a.min||a.single)&&(x[-1]||(x[-1]=new A(a,-1,null,!0)),x[-1].render(-1))),n&&g.forEach(function(b,e){H=void 0!==g[e+1]?g[e+1]+f:a.max-f;0===e%2&&b<a.max&&H<=a.max+(d.polar?-f:f)&&(h[b]||(h[b]=new c.PlotLineOrBand(a)),B=b+f,h[b].options={from:k?a.lin2log(B):B,to:k?a.lin2log(H):H,color:n},h[b].render(),h[b].isActive=!0)}),a._addedPlotLB||((e.plotLines||[]).concat(e.plotBands||[]).forEach(function(b){a.addPlotBandOrLine(b)}),a._addedPlotLB=
!0);[x,p,h].forEach(function(a){var b,e=[],k=t.duration;y(a,function(a,b){a.isActive||(a.render(b,!1,0),a.isActive=!1,e.push(b))});q(function(){for(b=e.length;b--;)a[e[b]]&&!a[e[b]].isActive&&(a[e[b]].destroy(),delete a[e[b]])},a!==h&&d.hasRendered&&k?k:0)});E&&(E[E.isPlaced?"animate":"attr"]({d:this.getLinePath(E.strokeWidth())}),E.isPlaced=!0,E[v?"show":"hide"](v));r&&v&&(e=a.getTitlePosition(),C(e.y)?(r[r.isNew?"attr":"animate"](e),r.isNew=!1):(r.attr("y",-9999),r.isNew=!0));u&&u.enabled&&a.renderStackTotals();
a.isDirty=!1;L(this,"afterRender")},redraw:function(){this.visible&&(this.render(),this.plotLinesAndBands.forEach(function(a){a.render()}));this.series.forEach(function(a){a.isDirty=!0})},keepProps:"extKey hcEvents names series userMax userMin".split(" "),destroy:function(a){var b=this,d=b.stacks,e=b.plotLinesAndBands,k;L(this,"destroy",{keepEvents:a});a||r(b);y(d,function(a,b){B(a);d[b]=null});[b.ticks,b.minorTicks,b.alternateBands].forEach(function(a){B(a)});if(e)for(a=e.length;a--;)e[a].destroy();
"stackTotalGroup axisLine axisTitle axisGroup gridGroup labelGroup cross scrollbar".split(" ").forEach(function(a){b[a]&&(b[a]=b[a].destroy())});for(k in b.plotLinesAndBandsGroups)b.plotLinesAndBandsGroups[k]=b.plotLinesAndBandsGroups[k].destroy();y(b,function(a,d){-1===b.keepProps.indexOf(d)&&delete b[d]})},drawCrosshair:function(b,d){var e,k=this.crosshair,c=h(k.snap,!0),l,g=this.cross;L(this,"drawCrosshair",{e:b,point:d});b||(b=this.cross&&this.cross.e);if(this.crosshair&&!1!==(z(d)||!c)){c?z(d)&&
(l=h("colorAxis"!==this.coll?d.crosshairPos:null,this.isXAxis?d.plotX:this.len-d.plotY)):l=b&&(this.horiz?b.chartX-this.pos:this.len-b.chartY+this.pos);z(l)&&(e=this.getPlotLinePath({value:d&&(this.isXAxis?d.x:h(d.stackY,d.y)),translatedValue:l})||null);if(!z(e)){this.hideCrosshair();return}c=this.categories&&!this.isRadial;g||(this.cross=g=this.chart.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-"+(c?"category ":"thin ")+k.className).attr({zIndex:h(k.zIndex,2)}).add(),this.chart.styledMode||
(g.attr({stroke:k.color||(c?a("#ccd6eb").setOpacity(.25).get():"#cccccc"),"stroke-width":h(k.width,1)}).css({"pointer-events":"none"}),k.dashStyle&&g.attr({dashstyle:k.dashStyle})));g.show().attr({d:e});c&&!k.width&&g.attr({"stroke-width":this.transA});this.cross.e=b}else this.hideCrosshair();L(this,"afterDrawCrosshair",{e:b,point:d})},hideCrosshair:function(){this.cross&&this.cross.hide();L(this,"afterHideCrosshair")}});return c.Axis=f});M(I,"parts/DateTimeAxis.js",[I["parts/Globals.js"]],function(c){var f=
c.Axis,F=c.getMagnitude,G=c.normalizeTickInterval,z=c.timeUnits;f.prototype.getTimeTicks=function(){return this.chart.time.getTimeTicks.apply(this.chart.time,arguments)};f.prototype.normalizeTimeTickInterval=function(c,f){var v=f||[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",[1,2,5,10,15,30]],["minute",[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1,2]],["week",[1,2]],["month",[1,2,3,4,6]],["year",null]];f=v[v.length-1];var t=z[f[0]],B=f[1],y;for(y=0;y<v.length&&!(f=v[y],t=z[f[0]],
B=f[1],v[y+1]&&c<=(t*B[B.length-1]+z[v[y+1][0]])/2);y++);t===z.year&&c<5*t&&(B=[1,2,5]);c=G(c/t,B,"year"===f[0]?Math.max(F(c/t),1):1);return{unitRange:t,count:c,unitName:f[0]}}});M(I,"parts/LogarithmicAxis.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.pick;f=c.Axis;var G=c.getMagnitude,z=c.normalizeTickInterval;f.prototype.getLogTickPositions=function(c,f,v,C){var t=this.options,y=this.len,h=[];C||(this._minorAutoInterval=null);if(.5<=c)c=Math.round(c),h=this.getLinearTickPositions(c,
f,v);else if(.08<=c){y=Math.floor(f);var n,q;for(t=.3<c?[1,2,4]:.15<c?[1,2,4,6,8]:[1,2,3,4,5,6,7,8,9];y<v+1&&!q;y++){var g=t.length;for(n=0;n<g&&!q;n++){var b=this.log2lin(this.lin2log(y)*t[n]);b>f&&(!C||a<=v)&&void 0!==a&&h.push(a);a>v&&(q=!0);var a=b}}}else f=this.lin2log(f),v=this.lin2log(v),c=C?this.getMinorTickInterval():t.tickInterval,c=F("auto"===c?null:c,this._minorAutoInterval,t.tickPixelInterval/(C?5:1)*(v-f)/((C?y/this.tickPositions.length:y)||1)),c=z(c,null,G(c)),h=this.getLinearTickPositions(c,
f,v).map(this.log2lin),C||(this._minorAutoInterval=c/5);C||(this.tickInterval=c);return h};f.prototype.log2lin=function(c){return Math.log(c)/Math.LN10};f.prototype.lin2log=function(c){return Math.pow(10,c)}});M(I,"parts/PlotLineOrBand.js",[I["parts/Globals.js"],I["parts/Axis.js"],I["parts/Utilities.js"]],function(c,f,F){var G=F.arrayMax,z=F.arrayMin,B=F.defined,t=F.destroyObjectProperties,v=F.erase,C=F.extend,H=F.objectEach,y=F.pick,h=c.merge;c.PlotLineOrBand=function(c,h){this.axis=c;h&&(this.options=
h,this.id=h.id)};c.PlotLineOrBand.prototype={render:function(){c.fireEvent(this,"render");var f=this,q=f.axis,g=q.horiz,b=f.options,a=b.label,d=f.label,e=b.to,l=b.from,L=b.value,E=B(l)&&B(e),p=B(L),u=f.svgElem,k=!u,r=[],x=b.color,A=y(b.zIndex,0),w=b.events;r={"class":"highcharts-plot-"+(E?"band ":"line ")+(b.className||"")};var m={},K=q.chart.renderer,J=E?"bands":"lines";q.isLog&&(l=q.log2lin(l),e=q.log2lin(e),L=q.log2lin(L));q.chart.styledMode||(p?(r.stroke=x||"#999999",r["stroke-width"]=y(b.width,
1),b.dashStyle&&(r.dashstyle=b.dashStyle)):E&&(r.fill=x||"#e6ebf5",b.borderWidth&&(r.stroke=b.borderColor,r["stroke-width"]=b.borderWidth)));m.zIndex=A;J+="-"+A;(x=q.plotLinesAndBandsGroups[J])||(q.plotLinesAndBandsGroups[J]=x=K.g("plot-"+J).attr(m).add());k&&(f.svgElem=u=K.path().attr(r).add(x));if(p)r=q.getPlotLinePath({value:L,lineWidth:u.strokeWidth(),acrossPanes:b.acrossPanes});else if(E)r=q.getPlotBandPath(l,e,b);else return;(k||!u.d)&&r&&r.length?(u.attr({d:r}),w&&H(w,function(a,b){u.on(b,
function(a){w[b].apply(f,[a])})})):u&&(r?(u.show(!0),u.animate({d:r})):u.d&&(u.hide(),d&&(f.label=d=d.destroy())));a&&(B(a.text)||B(a.formatter))&&r&&r.length&&0<q.width&&0<q.height&&!r.isFlat?(a=h({align:g&&E&&"center",x:g?!E&&4:10,verticalAlign:!g&&E&&"middle",y:g?E?16:10:E?6:-4,rotation:g&&!E&&90},a),this.renderLabel(a,r,E,A)):d&&d.hide();return f},renderLabel:function(c,h,g,b){var a=this.label,d=this.axis.chart.renderer;a||(a={align:c.textAlign||c.align,rotation:c.rotation,"class":"highcharts-plot-"+
(g?"band":"line")+"-label "+(c.className||"")},a.zIndex=b,b=this.getLabelText(c),this.label=a=d.text(b,0,0,c.useHTML).attr(a).add(),this.axis.chart.styledMode||a.css(c.style));d=h.xBounds||[h[1],h[4],g?h[6]:h[1]];h=h.yBounds||[h[2],h[5],g?h[7]:h[2]];g=z(d);b=z(h);a.align(c,!1,{x:g,y:b,width:G(d)-g,height:G(h)-b});a.show(!0)},getLabelText:function(c){return B(c.formatter)?c.formatter.call(this):c.text},destroy:function(){v(this.axis.plotLinesAndBands,this);delete this.axis;t(this)}};C(f.prototype,
{getPlotBandPath:function(c,h){var g=this.getPlotLinePath({value:h,force:!0,acrossPanes:this.options.acrossPanes}),b=this.getPlotLinePath({value:c,force:!0,acrossPanes:this.options.acrossPanes}),a=[],d=this.horiz,e=1;c=c<this.min&&h<this.min||c>this.max&&h>this.max;if(b&&g){if(c){var l=b.toString()===g.toString();e=0}for(c=0;c<b.length;c+=6)d&&g[c+1]===b[c+1]?(g[c+1]+=e,g[c+4]+=e):d||g[c+2]!==b[c+2]||(g[c+2]+=e,g[c+5]+=e),a.push("M",b[c+1],b[c+2],"L",b[c+4],b[c+5],g[c+4],g[c+5],g[c+1],g[c+2],"z"),
a.isFlat=l}return a},addPlotBand:function(c){return this.addPlotBandOrLine(c,"plotBands")},addPlotLine:function(c){return this.addPlotBandOrLine(c,"plotLines")},addPlotBandOrLine:function(h,f){var g=(new c.PlotLineOrBand(this,h)).render(),b=this.userOptions;if(g){if(f){var a=b[f]||[];a.push(h);b[f]=a}this.plotLinesAndBands.push(g)}return g},removePlotBandOrLine:function(c){for(var h=this.plotLinesAndBands,g=this.options,b=this.userOptions,a=h.length;a--;)h[a].id===c&&h[a].destroy();[g.plotLines||
[],b.plotLines||[],g.plotBands||[],b.plotBands||[]].forEach(function(b){for(a=b.length;a--;)b[a].id===c&&v(b,b[a])})},removePlotBand:function(c){this.removePlotBandOrLine(c)},removePlotLine:function(c){this.removePlotBandOrLine(c)}})});M(I,"parts/Tooltip.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.defined,G=f.discardElement,z=f.extend,B=f.isNumber,t=f.isString,v=f.pick,C=f.splat,H=f.syncTimeout;"";var y=c.doc,h=c.format,n=c.merge,q=c.timeUnits;c.Tooltip=function(){this.init.apply(this,
arguments)};c.Tooltip.prototype={init:function(c,b){this.chart=c;this.options=b;this.crosshairs=[];this.now={x:0,y:0};this.isHidden=!0;this.split=b.split&&!c.inverted;this.shared=b.shared||this.split;this.outside=v(b.outside,!(!c.scrollablePixelsX&&!c.scrollablePixelsY))},cleanSplit:function(c){this.chart.series.forEach(function(b){var a=b&&b.tt;a&&(!a.isActive||c?b.tt=a.destroy():a.isActive=!1)})},applyFilter:function(){var c=this.chart;c.renderer.definition({tagName:"filter",id:"drop-shadow-"+c.index,
opacity:.5,children:[{tagName:"feGaussianBlur","in":"SourceAlpha",stdDeviation:1},{tagName:"feOffset",dx:1,dy:1},{tagName:"feComponentTransfer",children:[{tagName:"feFuncA",type:"linear",slope:.3}]},{tagName:"feMerge",children:[{tagName:"feMergeNode"},{tagName:"feMergeNode","in":"SourceGraphic"}]}]});c.renderer.definition({tagName:"style",textContent:".highcharts-tooltip-"+c.index+"{filter:url(#drop-shadow-"+c.index+")}"})},getLabel:function(){var g=this,b=this.chart.renderer,a=this.chart.styledMode,
d=this.options,e="tooltip"+(F(d.className)?" "+d.className:""),l;if(!this.label){this.outside&&(this.container=l=c.doc.createElement("div"),l.className="highcharts-tooltip-container",c.css(l,{position:"absolute",top:"1px",pointerEvents:d.style&&d.style.pointerEvents,zIndex:3}),c.doc.body.appendChild(l),this.renderer=b=new c.Renderer(l,0,0,{},void 0,void 0,b.styledMode));this.split?this.label=b.g(e):(this.label=b.label("",0,0,d.shape||"callout",null,null,d.useHTML,null,e).attr({padding:d.padding,r:d.borderRadius}),
a||this.label.attr({fill:d.backgroundColor,"stroke-width":d.borderWidth}).css(d.style).shadow(d.shadow));a&&(this.applyFilter(),this.label.addClass("highcharts-tooltip-"+this.chart.index));if(g.outside&&!g.split){var h={x:this.label.xSetter,y:this.label.ySetter};this.label.xSetter=function(a,b){h[b].call(this.label,g.distance);l.style.left=a+"px"};this.label.ySetter=function(a,b){h[b].call(this.label,g.distance);l.style.top=a+"px"}}this.label.attr({zIndex:8}).add()}return this.label},update:function(c){this.destroy();
n(!0,this.chart.options.tooltip.userOptions,c);this.init(this.chart,n(!0,this.options,c))},destroy:function(){this.label&&(this.label=this.label.destroy());this.split&&this.tt&&(this.cleanSplit(this.chart,!0),this.tt=this.tt.destroy());this.renderer&&(this.renderer=this.renderer.destroy(),G(this.container));c.clearTimeout(this.hideTimer);c.clearTimeout(this.tooltipTimeout)},move:function(g,b,a,d){var e=this,l=e.now,h=!1!==e.options.animation&&!e.isHidden&&(1<Math.abs(g-l.x)||1<Math.abs(b-l.y)),f=
e.followPointer||1<e.len;z(l,{x:h?(2*l.x+g)/3:g,y:h?(l.y+b)/2:b,anchorX:f?void 0:h?(2*l.anchorX+a)/3:a,anchorY:f?void 0:h?(l.anchorY+d)/2:d});e.getLabel().attr(l);h&&(c.clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(function(){e&&e.move(g,b,a,d)},32))},hide:function(g){var b=this;c.clearTimeout(this.hideTimer);g=v(g,this.options.hideDelay,500);this.isHidden||(this.hideTimer=H(function(){b.getLabel()[g?"fadeOut":"hide"]();b.isHidden=!0},g))},getAnchor:function(c,b){var a=this.chart,
d=a.pointer,e=a.inverted,l=a.plotTop,g=a.plotLeft,h=0,p=0,f,k;c=C(c);this.followPointer&&b?(void 0===b.chartX&&(b=d.normalize(b)),c=[b.chartX-a.plotLeft,b.chartY-l]):c[0].tooltipPos?c=c[0].tooltipPos:(c.forEach(function(a){f=a.series.yAxis;k=a.series.xAxis;h+=a.plotX+(!e&&k?k.left-g:0);p+=(a.plotLow?(a.plotLow+a.plotHigh)/2:a.plotY)+(!e&&f?f.top-l:0)}),h/=c.length,p/=c.length,c=[e?a.plotWidth-p:h,this.shared&&!e&&1<c.length&&b?b.chartY-l:e?a.plotHeight-h:p]);return c.map(Math.round)},getPosition:function(c,
b,a){var d=this.chart,e=this.distance,l={},g=d.inverted&&a.h||0,h,p=this.outside,f=p?y.documentElement.clientWidth-2*e:d.chartWidth,k=p?Math.max(y.body.scrollHeight,y.documentElement.scrollHeight,y.body.offsetHeight,y.documentElement.offsetHeight,y.documentElement.clientHeight):d.chartHeight,r=d.pointer.getChartPosition(),x=d.containerScaling,A=function(a){return x?a*x.scaleX:a},w=function(a){return x?a*x.scaleY:a},m=function(l){var m="x"===l;return[l,m?f:k,m?c:b].concat(p?[m?A(c):w(b),m?r.left-e+
A(a.plotX+d.plotLeft):r.top-e+w(a.plotY+d.plotTop),0,m?f:k]:[m?c:b,m?a.plotX+d.plotLeft:a.plotY+d.plotTop,m?d.plotLeft:d.plotTop,m?d.plotLeft+d.plotWidth:d.plotTop+d.plotHeight])},n=m("y"),J=m("x"),q=!this.followPointer&&v(a.ttBelow,!d.inverted===!!a.negative),t=function(a,b,d,c,k,m,r){var x="y"===a?w(e):A(e),p=(d-c)/2,h=c<k-e,f=k+e+c<b,u=k-x-d+p;k=k+x-p;if(q&&f)l[a]=k;else if(!q&&h)l[a]=u;else if(h)l[a]=Math.min(r-c,0>u-g?u:u-g);else if(f)l[a]=Math.max(m,k+g+d>b?k:k+g);else return!1},C=function(a,
b,d,k,c){var m;c<e||c>b-e?m=!1:l[a]=c<d/2?1:c>b-k/2?b-k-2:c-d/2;return m},O=function(a){var b=n;n=J;J=b;h=a},D=function(){!1!==t.apply(0,n)?!1!==C.apply(0,J)||h||(O(!0),D()):h?l.x=l.y=0:(O(!0),D())};(d.inverted||1<this.len)&&O();D();return l},defaultFormatter:function(c){var b=this.points||C(this);var a=[c.tooltipFooterHeaderFormatter(b[0])];a=a.concat(c.bodyFormatter(b));a.push(c.tooltipFooterHeaderFormatter(b[0],!0));return a},refresh:function(g,b){var a=this.chart,d=this.options,e=g,l={},h=[],
f=d.formatter||this.defaultFormatter;l=this.shared;var p=a.styledMode;if(d.enabled){c.clearTimeout(this.hideTimer);this.followPointer=C(e)[0].series.tooltipOptions.followPointer;var u=this.getAnchor(e,b);b=u[0];var k=u[1];!l||e.series&&e.series.noSharedTooltip?l=e.getLabelConfig():(a.pointer.applyInactiveState(e),e.forEach(function(a){a.setState("hover");h.push(a.getLabelConfig())}),l={x:e[0].category,y:e[0].y},l.points=h,e=e[0]);this.len=h.length;a=f.call(l,this);f=e.series;this.distance=v(f.tooltipOptions.distance,
16);!1===a?this.hide():(this.split?this.renderSplit(a,C(g)):(g=this.getLabel(),d.style.width&&!p||g.css({width:this.chart.spacingBox.width}),g.attr({text:a&&a.join?a.join(""):a}),g.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-"+v(e.colorIndex,f.colorIndex)),p||g.attr({stroke:d.borderColor||e.color||f.color||"#666666"}),this.updatePosition({plotX:b,plotY:k,negative:e.negative,ttBelow:e.ttBelow,h:u[2]||0})),this.isHidden&&this.label&&this.label.attr({opacity:1}).show(),this.isHidden=
!1);c.fireEvent(this,"refresh")}},renderSplit:function(g,b){var a=this,d=[],e=this.chart,l=e.renderer,h=!0,f=this.options,p=0,u,k=this.getLabel(),r=e.plotTop;t(g)&&(g=[!1,g]);g.slice(0,b.length+1).forEach(function(c,m){if(!1!==c&&""!==c){m=b[m-1]||{isHeader:!0,plotX:b[0].plotX,plotY:e.plotHeight};var g=m.series||a,x=g.tt,w=m.series||{},A="highcharts-color-"+v(m.colorIndex,w.colorIndex,"none");x||(x={padding:f.padding,r:f.borderRadius},e.styledMode||(x.fill=f.backgroundColor,x["stroke-width"]=f.borderWidth),
g.tt=x=l.label(null,null,null,(m.isHeader?f.headerShape:f.shape)||"callout",null,null,f.useHTML).addClass(m.isHeader?"highcharts-tooltip-header ":"highcharts-tooltip-box "+A).attr(x).add(k));x.isActive=!0;x.attr({text:c});e.styledMode||x.css(f.style).shadow(f.shadow).attr({stroke:f.borderColor||m.color||w.color||"#333333"});c=x.getBBox();A=c.width+x.strokeWidth();m.isHeader?(p=c.height,e.xAxis[0].opposite&&(u=!0,r-=p),c=Math.max(0,Math.min(m.plotX+e.plotLeft-A/2,e.chartWidth+(e.scrollablePixelsX?
e.scrollablePixelsX-e.marginRight:0)-A))):c=m.plotX+e.plotLeft-v(f.distance,16)-A;0>c&&(h=!1);m.isHeader?w=u?-p:e.plotHeight+p:(w=w.yAxis,w=w.pos-r+Math.max(0,Math.min(m.plotY||0,w.len)));d.push({target:w,rank:m.isHeader?1:0,size:g.tt.getBBox().height+1,point:m,x:c,tt:x})}});this.cleanSplit();f.positioner&&d.forEach(function(b){var d=f.positioner.call(a,b.tt.getBBox().width,b.size,b.point);b.x=d.x;b.align=0;b.target=d.y;b.rank=v(d.rank,b.rank)});c.distribute(d,e.plotHeight+p);d.forEach(function(b){var d=
b.point,c=d.series,k=c&&c.yAxis;b.tt.attr({visibility:void 0===b.pos?"hidden":"inherit",x:h||d.isHeader||f.positioner?b.x:d.plotX+e.plotLeft+a.distance,y:b.pos+r,anchorX:d.isHeader?d.plotX+e.plotLeft:d.plotX+c.xAxis.pos,anchorY:d.isHeader?e.plotTop+e.plotHeight/2:k.pos+Math.max(0,Math.min(d.plotY,k.len))})});var x=a.container;g=a.renderer;if(a.outside&&x&&g){var A=e.pointer.getChartPosition();x.style.left=A.left+"px";x.style.top=A.top+"px";x=k.getBBox();g.setSize(x.width+x.x,x.height+x.y,!1)}},updatePosition:function(g){var b=
this.chart,a=b.pointer,d=this.getLabel(),e=g.plotX+b.plotLeft,l=g.plotY+b.plotTop;a=a.getChartPosition();g=(this.options.positioner||this.getPosition).call(this,d.width,d.height,g);if(this.outside){var h=(this.options.borderWidth||0)+2*this.distance;this.renderer.setSize(d.width+h,d.height+h,!1);if(b=b.containerScaling)c.css(this.container,{transform:"scale("+b.scaleX+", "+b.scaleY+")"}),e*=b.scaleX,l*=b.scaleY;e+=a.left-g.x;l+=a.top-g.y}this.move(Math.round(g.x),Math.round(g.y||0),e,l)},getDateFormat:function(c,
b,a,d){var e=this.chart.time,l=e.dateFormat("%m-%d %H:%M:%S.%L",b),g={millisecond:15,second:12,minute:9,hour:6,day:3},h="millisecond";for(p in q){if(c===q.week&&+e.dateFormat("%w",b)===a&&"00:00:00.000"===l.substr(6)){var p="week";break}if(q[p]>c){p=h;break}if(g[p]&&l.substr(g[p])!=="01-01 00:00:00.000".substr(g[p]))break;"week"!==p&&(h=p)}if(p)var f=e.resolveDTLFormat(d[p]).main;return f},getXDateFormat:function(c,b,a){b=b.dateTimeLabelFormats;var d=a&&a.closestPointRange;return(d?this.getDateFormat(d,
c.x,a.options.startOfWeek,b):b.day)||b.year},tooltipFooterHeaderFormatter:function(g,b){var a=b?"footer":"header",d=g.series,e=d.tooltipOptions,l=e.xDateFormat,f=d.xAxis,n=f&&"datetime"===f.options.type&&B(g.key),p=e[a+"Format"];b={isFooter:b,labelConfig:g};c.fireEvent(this,"headerFormatter",b,function(a){n&&!l&&(l=this.getXDateFormat(g,e,f));n&&l&&(g.point&&g.point.tooltipDateKeys||["key"]).forEach(function(a){p=p.replace("{point."+a+"}","{point."+a+":"+l+"}")});d.chart.styledMode&&(p=this.styledModeFormat(p));
a.text=h(p,{point:g,series:d},this.chart.time)});return b.text},bodyFormatter:function(c){return c.map(function(b){var a=b.series.tooltipOptions;return(a[(b.point.formatPrefix||"point")+"Formatter"]||b.point.tooltipFormatter).call(b.point,a[(b.point.formatPrefix||"point")+"Format"]||"")})},styledModeFormat:function(c){return c.replace('style="font-size: 10px"','class="highcharts-header"').replace(/style="color:{(point|series)\.color}"/g,'class="highcharts-color-{$1.colorIndex}"')}}});M(I,"parts/Pointer.js",
[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.attr,G=f.defined,z=f.extend,B=f.isNumber,t=f.isObject,v=f.objectEach,C=f.pick,H=f.splat,y=c.addEvent,h=c.charts,n=c.color,q=c.css,g=c.find,b=c.fireEvent,a=c.offset,d=c.Tooltip;c.Pointer=function(a,b){this.init(a,b)};c.Pointer.prototype={init:function(a,b){this.options=b;this.chart=a;this.runChartClick=b.chart.events&&!!b.chart.events.click;this.pinchDown=[];this.lastValidTouch={};d&&(a.tooltip=new d(a,b.tooltip),this.followTouchMove=
C(b.tooltip.followTouchMove,!0));this.setDOMEvents()},zoomOption:function(a){var b=this.chart,d=b.options.chart,e=d.zoomType||"";b=b.inverted;/touch/.test(a.type)&&(e=C(d.pinchType,e));this.zoomX=a=/x/.test(e);this.zoomY=e=/y/.test(e);this.zoomHor=a&&!b||e&&b;this.zoomVert=e&&!b||a&&b;this.hasZoom=a||e},getChartPosition:function(){return this.chartPosition||(this.chartPosition=a(this.chart.container))},normalize:function(a,b){var d=a.touches?a.touches.length?a.touches.item(0):a.changedTouches[0]:
a;b||(b=this.getChartPosition());var e=d.pageX-b.left;b=d.pageY-b.top;if(d=this.chart.containerScaling)e/=d.scaleX,b/=d.scaleY;return z(a,{chartX:Math.round(e),chartY:Math.round(b)})},getCoordinates:function(a){var b={xAxis:[],yAxis:[]};this.chart.axes.forEach(function(d){b[d.isXAxis?"xAxis":"yAxis"].push({axis:d,value:d.toValue(a[d.horiz?"chartX":"chartY"])})});return b},findNearestKDPoint:function(a,b,d){var e;a.forEach(function(a){var c=!(a.noSharedTooltip&&b)&&0>a.options.findNearestPointBy.indexOf("y");
a=a.searchPoint(d,c);if((c=t(a,!0))&&!(c=!t(e,!0))){c=e.distX-a.distX;var k=e.dist-a.dist,l=(a.series.group&&a.series.group.zIndex)-(e.series.group&&e.series.group.zIndex);c=0<(0!==c&&b?c:0!==k?k:0!==l?l:e.series.index>a.series.index?-1:1)}c&&(e=a)});return e},getPointFromEvent:function(a){a=a.target;for(var b;a&&!b;)b=a.point,a=a.parentNode;return b},getChartCoordinatesFromPoint:function(a,b){var d=a.series,e=d.xAxis;d=d.yAxis;var c=C(a.clientX,a.plotX),l=a.shapeArgs;if(e&&d)return b?{chartX:e.len+
e.pos-c,chartY:d.len+d.pos-a.plotY}:{chartX:c+e.pos,chartY:a.plotY+d.pos};if(l&&l.x&&l.y)return{chartX:l.x,chartY:l.y}},getHoverData:function(a,b,d,c,h,f){var e,l=[];c=!(!c||!a);var x=b&&!b.stickyTracking?[b]:d.filter(function(a){return a.visible&&!(!h&&a.directTouch)&&C(a.options.enableMouseTracking,!0)&&a.stickyTracking});b=(e=c||!f?a:this.findNearestKDPoint(x,h,f))&&e.series;e&&(h&&!b.noSharedTooltip?(x=d.filter(function(a){return a.visible&&!(!h&&a.directTouch)&&C(a.options.enableMouseTracking,
!0)&&!a.noSharedTooltip}),x.forEach(function(a){var b=g(a.points,function(a){return a.x===e.x&&!a.isNull});t(b)&&(a.chart.isBoosting&&(b=a.getPoint(b)),l.push(b))})):l.push(e));return{hoverPoint:e,hoverSeries:b,hoverPoints:l}},runPointActions:function(a,b){var d=this.chart,e=d.tooltip&&d.tooltip.options.enabled?d.tooltip:void 0,l=e?e.shared:!1,g=b||d.hoverPoint,k=g&&g.series||d.hoverSeries;k=this.getHoverData(g,k,d.series,(!a||"touchmove"!==a.type)&&(!!b||k&&k.directTouch&&this.isDirectTouch),l,a);
g=k.hoverPoint;var r=k.hoverPoints;b=(k=k.hoverSeries)&&k.tooltipOptions.followPointer;l=l&&k&&!k.noSharedTooltip;if(g&&(g!==d.hoverPoint||e&&e.isHidden)){(d.hoverPoints||[]).forEach(function(a){-1===r.indexOf(a)&&a.setState()});if(d.hoverSeries!==k)k.onMouseOver();this.applyInactiveState(r);(r||[]).forEach(function(a){a.setState("hover")});d.hoverPoint&&d.hoverPoint.firePointEvent("mouseOut");if(!g.series)return;g.firePointEvent("mouseOver");d.hoverPoints=r;d.hoverPoint=g;e&&e.refresh(l?r:g,a)}else b&&
e&&!e.isHidden&&(g=e.getAnchor([{}],a),e.updatePosition({plotX:g[0],plotY:g[1]}));this.unDocMouseMove||(this.unDocMouseMove=y(d.container.ownerDocument,"mousemove",function(a){var b=h[c.hoverChartIndex];if(b)b.pointer.onDocumentMouseMove(a)}));d.axes.forEach(function(b){var d=C(b.crosshair.snap,!0),e=d?c.find(r,function(a){return a.series[b.coll]===b}):void 0;e||!d?b.drawCrosshair(a,e):b.hideCrosshair()})},applyInactiveState:function(a){var b=[],d;(a||[]).forEach(function(a){d=a.series;b.push(d);
d.linkedParent&&b.push(d.linkedParent);d.linkedSeries&&(b=b.concat(d.linkedSeries));d.navigatorSeries&&b.push(d.navigatorSeries)});this.chart.series.forEach(function(a){-1===b.indexOf(a)?a.setState("inactive",!0):a.options.inactiveOtherPoints&&a.setAllPointsToState("inactive")})},reset:function(a,b){var d=this.chart,e=d.hoverSeries,c=d.hoverPoint,g=d.hoverPoints,k=d.tooltip,l=k&&k.shared?g:c;a&&l&&H(l).forEach(function(b){b.series.isCartesian&&void 0===b.plotX&&(a=!1)});if(a)k&&l&&H(l).length&&(k.refresh(l),
k.shared&&g?g.forEach(function(a){a.setState(a.state,!0);a.series.isCartesian&&(a.series.xAxis.crosshair&&a.series.xAxis.drawCrosshair(null,a),a.series.yAxis.crosshair&&a.series.yAxis.drawCrosshair(null,a))}):c&&(c.setState(c.state,!0),d.axes.forEach(function(a){a.crosshair&&a.drawCrosshair(null,c)})));else{if(c)c.onMouseOut();g&&g.forEach(function(a){a.setState()});if(e)e.onMouseOut();k&&k.hide(b);this.unDocMouseMove&&(this.unDocMouseMove=this.unDocMouseMove());d.axes.forEach(function(a){a.hideCrosshair()});
this.hoverX=d.hoverPoints=d.hoverPoint=null}},scaleGroups:function(a,b){var d=this.chart,e;d.series.forEach(function(c){e=a||c.getPlotBox();c.xAxis&&c.xAxis.zoomEnabled&&c.group&&(c.group.attr(e),c.markerGroup&&(c.markerGroup.attr(e),c.markerGroup.clip(b?d.clipRect:null)),c.dataLabelsGroup&&c.dataLabelsGroup.attr(e))});d.clipRect.attr(b||d.clipBox)},dragStart:function(a){var b=this.chart;b.mouseIsDown=a.type;b.cancelClick=!1;b.mouseDownX=this.mouseDownX=a.chartX;b.mouseDownY=this.mouseDownY=a.chartY},
drag:function(a){var b=this.chart,d=b.options.chart,e=a.chartX,c=a.chartY,g=this.zoomHor,k=this.zoomVert,r=b.plotLeft,h=b.plotTop,A=b.plotWidth,w=b.plotHeight,m=this.selectionMarker,f=this.mouseDownX,J=this.mouseDownY,v=d.panKey&&a[d.panKey+"Key"];if(!m||!m.touch)if(e<r?e=r:e>r+A&&(e=r+A),c<h?c=h:c>h+w&&(c=h+w),this.hasDragged=Math.sqrt(Math.pow(f-e,2)+Math.pow(J-c,2)),10<this.hasDragged){var q=b.isInsidePlot(f-r,J-h);b.hasCartesianSeries&&(this.zoomX||this.zoomY)&&q&&!v&&!m&&(this.selectionMarker=
m=b.renderer.rect(r,h,g?1:A,k?1:w,0).attr({"class":"highcharts-selection-marker",zIndex:7}).add(),b.styledMode||m.attr({fill:d.selectionMarkerFill||n("#335cad").setOpacity(.25).get()}));m&&g&&(e-=f,m.attr({width:Math.abs(e),x:(0<e?0:e)+f}));m&&k&&(e=c-J,m.attr({height:Math.abs(e),y:(0<e?0:e)+J}));q&&!m&&d.panning&&b.pan(a,d.panning)}},drop:function(a){var d=this,e=this.chart,c=this.hasPinched;if(this.selectionMarker){var g={originalEvent:a,xAxis:[],yAxis:[]},h=this.selectionMarker,k=h.attr?h.attr("x"):
h.x,r=h.attr?h.attr("y"):h.y,x=h.attr?h.attr("width"):h.width,A=h.attr?h.attr("height"):h.height,w;if(this.hasDragged||c)e.axes.forEach(function(b){if(b.zoomEnabled&&G(b.min)&&(c||d[{xAxis:"zoomX",yAxis:"zoomY"}[b.coll]])){var e=b.horiz,m="touchend"===a.type?b.minPixelPadding:0,l=b.toValue((e?k:r)+m);e=b.toValue((e?k+x:r+A)-m);g[b.coll].push({axis:b,min:Math.min(l,e),max:Math.max(l,e)});w=!0}}),w&&b(e,"selection",g,function(a){e.zoom(z(a,c?{animation:!1}:null))});B(e.index)&&(this.selectionMarker=
this.selectionMarker.destroy());c&&this.scaleGroups()}e&&B(e.index)&&(q(e.container,{cursor:e._cursor}),e.cancelClick=10<this.hasDragged,e.mouseIsDown=this.hasDragged=this.hasPinched=!1,this.pinchDown=[])},onContainerMouseDown:function(a){a=this.normalize(a);2!==a.button&&(this.zoomOption(a),a.preventDefault&&a.preventDefault(),this.dragStart(a))},onDocumentMouseUp:function(a){h[c.hoverChartIndex]&&h[c.hoverChartIndex].pointer.drop(a)},onDocumentMouseMove:function(a){var b=this.chart,d=this.chartPosition;
a=this.normalize(a,d);!d||this.inClass(a.target,"highcharts-tracker")||b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)||this.reset()},onContainerMouseLeave:function(a){var b=h[c.hoverChartIndex];b&&(a.relatedTarget||a.toElement)&&(b.pointer.reset(),b.pointer.chartPosition=void 0)},onContainerMouseMove:function(a){var b=this.chart;G(c.hoverChartIndex)&&h[c.hoverChartIndex]&&h[c.hoverChartIndex].mouseIsDown||(c.hoverChartIndex=b.index);a=this.normalize(a);a.preventDefault||(a.returnValue=!1);
"mousedown"===b.mouseIsDown&&this.drag(a);!this.inClass(a.target,"highcharts-tracker")&&!b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)||b.openMenu||this.runPointActions(a)},inClass:function(a,b){for(var d;a;){if(d=F(a,"class")){if(-1!==d.indexOf(b))return!0;if(-1!==d.indexOf("highcharts-container"))return!1}a=a.parentNode}},onTrackerMouseOut:function(a){var b=this.chart.hoverSeries;a=a.relatedTarget||a.toElement;this.isDirectTouch=!1;if(!(!b||!a||b.stickyTracking||this.inClass(a,"highcharts-tooltip")||
this.inClass(a,"highcharts-series-"+b.index)&&this.inClass(a,"highcharts-tracker")))b.onMouseOut()},onContainerClick:function(a){var d=this.chart,e=d.hoverPoint,c=d.plotLeft,g=d.plotTop;a=this.normalize(a);d.cancelClick||(e&&this.inClass(a.target,"highcharts-tracker")?(b(e.series,"click",z(a,{point:e})),d.hoverPoint&&e.firePointEvent("click",a)):(z(a,this.getCoordinates(a)),d.isInsidePlot(a.chartX-c,a.chartY-g)&&b(d,"click",a)))},setDOMEvents:function(){var a=this,b=a.chart.container,d=b.ownerDocument;
b.onmousedown=function(b){a.onContainerMouseDown(b)};b.onmousemove=function(b){a.onContainerMouseMove(b)};b.onclick=function(b){a.onContainerClick(b)};this.unbindContainerMouseLeave=y(b,"mouseleave",a.onContainerMouseLeave);c.unbindDocumentMouseUp||(c.unbindDocumentMouseUp=y(d,"mouseup",a.onDocumentMouseUp));c.hasTouch&&(y(b,"touchstart",function(b){a.onContainerTouchStart(b)}),y(b,"touchmove",function(b){a.onContainerTouchMove(b)}),c.unbindDocumentTouchEnd||(c.unbindDocumentTouchEnd=y(d,"touchend",
a.onDocumentTouchEnd)))},destroy:function(){var a=this;a.unDocMouseMove&&a.unDocMouseMove();this.unbindContainerMouseLeave();c.chartCount||(c.unbindDocumentMouseUp&&(c.unbindDocumentMouseUp=c.unbindDocumentMouseUp()),c.unbindDocumentTouchEnd&&(c.unbindDocumentTouchEnd=c.unbindDocumentTouchEnd()));clearInterval(a.tooltipTimeout);v(a,function(b,d){a[d]=null})}}});M(I,"parts/TouchPointer.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.extend,G=f.pick,z=c.charts,B=c.noop;F(c.Pointer.prototype,
{pinchTranslate:function(c,f,C,B,y,h){this.zoomHor&&this.pinchTranslateDirection(!0,c,f,C,B,y,h);this.zoomVert&&this.pinchTranslateDirection(!1,c,f,C,B,y,h)},pinchTranslateDirection:function(c,f,C,B,y,h,n,q){var g=this.chart,b=c?"x":"y",a=c?"X":"Y",d="chart"+a,e=c?"width":"height",l=g["plot"+(c?"Left":"Top")],v,t,p=q||1,u=g.inverted,k=g.bounds[c?"h":"v"],r=1===f.length,x=f[0][d],A=C[0][d],w=!r&&f[1][d],m=!r&&C[1][d];C=function(){!r&&20<Math.abs(x-w)&&(p=q||Math.abs(A-m)/Math.abs(x-w));t=(l-A)/p+x;
v=g["plot"+(c?"Width":"Height")]/p};C();f=t;if(f<k.min){f=k.min;var K=!0}else f+v>k.max&&(f=k.max-v,K=!0);K?(A-=.8*(A-n[b][0]),r||(m-=.8*(m-n[b][1])),C()):n[b]=[A,m];u||(h[b]=t-l,h[e]=v);h=u?1/p:p;y[e]=v;y[b]=f;B[u?c?"scaleY":"scaleX":"scale"+a]=p;B["translate"+a]=h*l+(A-h*x)},pinch:function(c){var f=this,t=f.chart,z=f.pinchDown,y=c.touches,h=y.length,n=f.lastValidTouch,q=f.hasZoom,g=f.selectionMarker,b={},a=1===h&&(f.inClass(c.target,"highcharts-tracker")&&t.runTrackerClick||f.runChartClick),d={};
1<h&&(f.initiated=!0);q&&f.initiated&&!a&&c.preventDefault();[].map.call(y,function(a){return f.normalize(a)});"touchstart"===c.type?([].forEach.call(y,function(a,b){z[b]={chartX:a.chartX,chartY:a.chartY}}),n.x=[z[0].chartX,z[1]&&z[1].chartX],n.y=[z[0].chartY,z[1]&&z[1].chartY],t.axes.forEach(function(a){if(a.zoomEnabled){var b=t.bounds[a.horiz?"h":"v"],d=a.minPixelPadding,e=a.toPixels(Math.min(G(a.options.min,a.dataMin),a.dataMin)),c=a.toPixels(Math.max(G(a.options.max,a.dataMax),a.dataMax)),g=Math.max(e,
c);b.min=Math.min(a.pos,Math.min(e,c)-d);b.max=Math.max(a.pos+a.len,g+d)}}),f.res=!0):f.followTouchMove&&1===h?this.runPointActions(f.normalize(c)):z.length&&(g||(f.selectionMarker=g=F({destroy:B,touch:!0},t.plotBox)),f.pinchTranslate(z,y,b,g,d,n),f.hasPinched=q,f.scaleGroups(b,d),f.res&&(f.res=!1,this.reset(!1,0)))},touch:function(f,v){var t=this.chart,z;if(t.index!==c.hoverChartIndex)this.onContainerMouseLeave({relatedTarget:!0});c.hoverChartIndex=t.index;if(1===f.touches.length)if(f=this.normalize(f),
(z=t.isInsidePlot(f.chartX-t.plotLeft,f.chartY-t.plotTop))&&!t.openMenu){v&&this.runPointActions(f);if("touchmove"===f.type){v=this.pinchDown;var y=v[0]?4<=Math.sqrt(Math.pow(v[0].chartX-f.chartX,2)+Math.pow(v[0].chartY-f.chartY,2)):!1}G(y,!0)&&this.pinch(f)}else v&&this.reset();else 2===f.touches.length&&this.pinch(f)},onContainerTouchStart:function(c){this.zoomOption(c);this.touch(c,!0)},onContainerTouchMove:function(c){this.touch(c)},onDocumentTouchEnd:function(f){z[c.hoverChartIndex]&&z[c.hoverChartIndex].pointer.drop(f)}})});
M(I,"parts/MSPointer.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.extend,G=f.objectEach,z=c.addEvent,B=c.charts,t=c.css,v=c.doc,C=c.noop;f=c.Pointer;var H=c.removeEvent,y=c.win,h=c.wrap;if(!c.hasTouch&&(y.PointerEvent||y.MSPointerEvent)){var n={},q=!!y.PointerEvent,g=function(){var a=[];a.item=function(a){return this[a]};G(n,function(b){a.push({pageX:b.pageX,pageY:b.pageY,target:b.target})});return a},b=function(a,b,e,l){"touch"!==a.pointerType&&a.pointerType!==a.MSPOINTER_TYPE_TOUCH||
!B[c.hoverChartIndex]||(l(a),l=B[c.hoverChartIndex].pointer,l[b]({type:e,target:a.currentTarget,preventDefault:C,touches:g()}))};F(f.prototype,{onContainerPointerDown:function(a){b(a,"onContainerTouchStart","touchstart",function(a){n[a.pointerId]={pageX:a.pageX,pageY:a.pageY,target:a.currentTarget}})},onContainerPointerMove:function(a){b(a,"onContainerTouchMove","touchmove",function(a){n[a.pointerId]={pageX:a.pageX,pageY:a.pageY};n[a.pointerId].target||(n[a.pointerId].target=a.currentTarget)})},onDocumentPointerUp:function(a){b(a,
"onDocumentTouchEnd","touchend",function(a){delete n[a.pointerId]})},batchMSEvents:function(a){a(this.chart.container,q?"pointerdown":"MSPointerDown",this.onContainerPointerDown);a(this.chart.container,q?"pointermove":"MSPointerMove",this.onContainerPointerMove);a(v,q?"pointerup":"MSPointerUp",this.onDocumentPointerUp)}});h(f.prototype,"init",function(a,b,e){a.call(this,b,e);this.hasZoom&&t(b.container,{"-ms-touch-action":"none","touch-action":"none"})});h(f.prototype,"setDOMEvents",function(a){a.apply(this);
(this.hasZoom||this.followTouchMove)&&this.batchMSEvents(z)});h(f.prototype,"destroy",function(a){this.batchMSEvents(H);a.call(this)})}});M(I,"parts/Legend.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.defined,G=f.discardElement,z=f.isNumber,B=f.pick,t=f.setAnimation,v=c.addEvent,C=c.css,H=c.fireEvent;f=c.isFirefox;var y=c.marginNames,h=c.merge,n=c.stableSort,q=c.win,g=c.wrap;c.Legend=function(b,a){this.init(b,a)};c.Legend.prototype={init:function(b,a){this.chart=b;this.setOptions(a);
a.enabled&&(this.render(),v(this.chart,"endResize",function(){this.legend.positionCheckboxes()}),this.proximate?this.unchartrender=v(this.chart,"render",function(){this.legend.proximatePositions();this.legend.positionItems()}):this.unchartrender&&this.unchartrender())},setOptions:function(b){var a=B(b.padding,8);this.options=b;this.chart.styledMode||(this.itemStyle=b.itemStyle,this.itemHiddenStyle=h(this.itemStyle,b.itemHiddenStyle));this.itemMarginTop=b.itemMarginTop||0;this.itemMarginBottom=b.itemMarginBottom||
0;this.padding=a;this.initialItemY=a-5;this.symbolWidth=B(b.symbolWidth,16);this.pages=[];this.proximate="proximate"===b.layout&&!this.chart.inverted},update:function(b,a){var d=this.chart;this.setOptions(h(!0,this.options,b));this.destroy();d.isDirtyLegend=d.isDirtyBox=!0;B(a,!0)&&d.redraw();H(this,"afterUpdate")},colorizeItem:function(b,a){b.legendGroup[a?"removeClass":"addClass"]("highcharts-legend-item-hidden");if(!this.chart.styledMode){var d=this.options,e=b.legendItem,c=b.legendLine,g=b.legendSymbol,
h=this.itemHiddenStyle.color;d=a?d.itemStyle.color:h;var f=a?b.color||h:h,u=b.options&&b.options.marker,k={fill:f};e&&e.css({fill:d,color:d});c&&c.attr({stroke:f});g&&(u&&g.isMarker&&(k=b.pointAttribs(),a||(k.stroke=k.fill=h)),g.attr(k))}H(this,"afterColorizeItem",{item:b,visible:a})},positionItems:function(){this.allItems.forEach(this.positionItem,this);this.chart.isResizing||this.positionCheckboxes()},positionItem:function(b){var a=this.options,d=a.symbolPadding;a=!a.rtl;var e=b._legendItemPos,
c=e[0];e=e[1];var g=b.checkbox;if((b=b.legendGroup)&&b.element)b[F(b.translateY)?"animate":"attr"]({translateX:a?c:this.legendWidth-c-2*d-4,translateY:e});g&&(g.x=c,g.y=e)},destroyItem:function(b){var a=b.checkbox;["legendItem","legendLine","legendSymbol","legendGroup"].forEach(function(a){b[a]&&(b[a]=b[a].destroy())});a&&G(b.checkbox)},destroy:function(){function b(a){this[a]&&(this[a]=this[a].destroy())}this.getAllItems().forEach(function(a){["legendItem","legendGroup"].forEach(b,a)});"clipRect up down pager nav box title group".split(" ").forEach(b,
this);this.display=null},positionCheckboxes:function(){var b=this.group&&this.group.alignAttr,a=this.clipHeight||this.legendHeight,d=this.titleHeight;if(b){var e=b.translateY;this.allItems.forEach(function(c){var g=c.checkbox;if(g){var l=e+d+g.y+(this.scrollOffset||0)+3;C(g,{left:b.translateX+c.checkboxOffset+g.x-20+"px",top:l+"px",display:this.proximate||l>e-6&&l<e+a-6?"":"none"})}},this)}},renderTitle:function(){var b=this.options,a=this.padding,d=b.title,e=0;d.text&&(this.title||(this.title=this.chart.renderer.label(d.text,
a-3,a-4,null,null,null,b.useHTML,null,"legend-title").attr({zIndex:1}),this.chart.styledMode||this.title.css(d.style),this.title.add(this.group)),d.width||this.title.css({width:this.maxLegendWidth+"px"}),b=this.title.getBBox(),e=b.height,this.offsetWidth=b.width,this.contentGroup.attr({translateY:e}));this.titleHeight=e},setText:function(b){var a=this.options;b.legendItem.attr({text:a.labelFormat?c.format(a.labelFormat,b,this.chart.time):a.labelFormatter.call(b)})},renderItem:function(b){var a=this.chart,
d=a.renderer,e=this.options,c=this.symbolWidth,g=e.symbolPadding,f=this.itemStyle,p=this.itemHiddenStyle,u="horizontal"===e.layout?B(e.itemDistance,20):0,k=!e.rtl,r=b.legendItem,x=!b.series,A=!x&&b.series.drawLegendSymbol?b.series:b,w=A.options;w=this.createCheckboxForItem&&w&&w.showCheckbox;u=c+g+u+(w?20:0);var m=e.useHTML,n=b.options.className;r||(b.legendGroup=d.g("legend-item").addClass("highcharts-"+A.type+"-series highcharts-color-"+b.colorIndex+(n?" "+n:"")+(x?" highcharts-series-"+b.index:
"")).attr({zIndex:1}).add(this.scrollGroup),b.legendItem=r=d.text("",k?c+g:-g,this.baseline||0,m),a.styledMode||r.css(h(b.visible?f:p)),r.attr({align:k?"left":"right",zIndex:2}).add(b.legendGroup),this.baseline||(this.fontMetrics=d.fontMetrics(a.styledMode?12:f.fontSize,r),this.baseline=this.fontMetrics.f+3+this.itemMarginTop,r.attr("y",this.baseline)),this.symbolHeight=e.symbolHeight||this.fontMetrics.f,A.drawLegendSymbol(this,b),this.setItemEvents&&this.setItemEvents(b,r,m));w&&!b.checkbox&&this.createCheckboxForItem(b);
this.colorizeItem(b,b.visible);!a.styledMode&&f.width||r.css({width:(e.itemWidth||this.widthOption||a.spacingBox.width)-u});this.setText(b);a=r.getBBox();b.itemWidth=b.checkboxOffset=e.itemWidth||b.legendItemWidth||a.width+u;this.maxItemWidth=Math.max(this.maxItemWidth,b.itemWidth);this.totalItemWidth+=b.itemWidth;this.itemHeight=b.itemHeight=Math.round(b.legendItemHeight||a.height||this.symbolHeight)},layoutItem:function(b){var a=this.options,d=this.padding,e="horizontal"===a.layout,c=b.itemHeight,
g=this.itemMarginBottom,h=this.itemMarginTop,f=e?B(a.itemDistance,20):0,u=this.maxLegendWidth;a=a.alignColumns&&this.totalItemWidth>u?this.maxItemWidth:b.itemWidth;e&&this.itemX-d+a>u&&(this.itemX=d,this.lastLineHeight&&(this.itemY+=h+this.lastLineHeight+g),this.lastLineHeight=0);this.lastItemY=h+this.itemY+g;this.lastLineHeight=Math.max(c,this.lastLineHeight);b._legendItemPos=[this.itemX,this.itemY];e?this.itemX+=a:(this.itemY+=h+c+g,this.lastLineHeight=c);this.offsetWidth=this.widthOption||Math.max((e?
this.itemX-d-(b.checkbox?0:f):a)+d,this.offsetWidth)},getAllItems:function(){var b=[];this.chart.series.forEach(function(a){var d=a&&a.options;a&&B(d.showInLegend,F(d.linkedTo)?!1:void 0,!0)&&(b=b.concat(a.legendItems||("point"===d.legendType?a.data:a)))});H(this,"afterGetAllItems",{allItems:b});return b},getAlignment:function(){var b=this.options;return this.proximate?b.align.charAt(0)+"tv":b.floating?"":b.align.charAt(0)+b.verticalAlign.charAt(0)+b.layout.charAt(0)},adjustMargins:function(b,a){var d=
this.chart,e=this.options,c=this.getAlignment();c&&[/(lth|ct|rth)/,/(rtv|rm|rbv)/,/(rbh|cb|lbh)/,/(lbv|lm|ltv)/].forEach(function(g,l){g.test(c)&&!F(b[l])&&(d[y[l]]=Math.max(d[y[l]],d.legend[(l+1)%2?"legendHeight":"legendWidth"]+[1,-1,-1,1][l]*e[l%2?"x":"y"]+B(e.margin,12)+a[l]+(d.titleOffset[l]||0)))})},proximatePositions:function(){var b=this.chart,a=[],d="left"===this.options.align;this.allItems.forEach(function(e){var g=d;if(e.yAxis&&e.points){e.xAxis.options.reversed&&(g=!g);var h=c.find(g?e.points:
e.points.slice(0).reverse(),function(a){return z(a.plotY)});g=this.itemMarginTop+e.legendItem.getBBox().height+this.itemMarginBottom;var f=e.yAxis.top-b.plotTop;e.visible?(h=h?h.plotY:e.yAxis.height,h+=f-.3*g):h=f+e.yAxis.height;a.push({target:h,size:g,item:e})}},this);c.distribute(a,b.plotHeight);a.forEach(function(a){a.item._legendItemPos[1]=b.plotTop-b.spacing[0]+a.pos})},render:function(){var b=this.chart,a=b.renderer,d=this.group,e,g=this.box,f=this.options,q=this.padding;this.itemX=q;this.itemY=
this.initialItemY;this.lastItemY=this.offsetWidth=0;this.widthOption=c.relativeLength(f.width,b.spacingBox.width-q);var p=b.spacingBox.width-2*q-f.x;-1<["rm","lm"].indexOf(this.getAlignment().substring(0,2))&&(p/=2);this.maxLegendWidth=this.widthOption||p;d||(this.group=d=a.g("legend").attr({zIndex:7}).add(),this.contentGroup=a.g().attr({zIndex:1}).add(d),this.scrollGroup=a.g().add(this.contentGroup));this.renderTitle();p=this.getAllItems();n(p,function(a,b){return(a.options&&a.options.legendIndex||
0)-(b.options&&b.options.legendIndex||0)});f.reversed&&p.reverse();this.allItems=p;this.display=e=!!p.length;this.itemHeight=this.totalItemWidth=this.maxItemWidth=this.lastLineHeight=0;p.forEach(this.renderItem,this);p.forEach(this.layoutItem,this);p=(this.widthOption||this.offsetWidth)+q;var u=this.lastItemY+this.lastLineHeight+this.titleHeight;u=this.handleOverflow(u);u+=q;g||(this.box=g=a.rect().addClass("highcharts-legend-box").attr({r:f.borderRadius}).add(d),g.isNew=!0);b.styledMode||g.attr({stroke:f.borderColor,
"stroke-width":f.borderWidth||0,fill:f.backgroundColor||"none"}).shadow(f.shadow);0<p&&0<u&&(g[g.isNew?"attr":"animate"](g.crisp.call({},{x:0,y:0,width:p,height:u},g.strokeWidth())),g.isNew=!1);g[e?"show":"hide"]();b.styledMode&&"none"===d.getStyle("display")&&(p=u=0);this.legendWidth=p;this.legendHeight=u;e&&(a=b.spacingBox,g=a.y,/(lth|ct|rth)/.test(this.getAlignment())&&0<b.titleOffset[0]?g+=b.titleOffset[0]:/(lbh|cb|rbh)/.test(this.getAlignment())&&0<b.titleOffset[2]&&(g-=b.titleOffset[2]),g!==
a.y&&(a=h(a,{y:g})),d.align(h(f,{width:p,height:u,verticalAlign:this.proximate?"top":f.verticalAlign}),!0,a));this.proximate||this.positionItems();H(this,"afterRender")},handleOverflow:function(b){var a=this,d=this.chart,e=d.renderer,c=this.options,g=c.y,h=this.padding;g=d.spacingBox.height+("top"===c.verticalAlign?-g:g)-h;var f=c.maxHeight,u,k=this.clipRect,r=c.navigation,x=B(r.animation,!0),A=r.arrowSize||12,w=this.nav,m=this.pages,n,J=this.allItems,q=function(b){"number"===typeof b?k.attr({height:b}):
k&&(a.clipRect=k.destroy(),a.contentGroup.clip());a.contentGroup.div&&(a.contentGroup.div.style.clip=b?"rect("+h+"px,9999px,"+(h+b)+"px,0)":"auto")},v=function(b){a[b]=e.circle(0,0,1.3*A).translate(A/2,A/2).add(w);d.styledMode||a[b].attr("fill","rgba(0,0,0,0.0001)");return a[b]};"horizontal"!==c.layout||"middle"===c.verticalAlign||c.floating||(g/=2);f&&(g=Math.min(g,f));m.length=0;b>g&&!1!==r.enabled?(this.clipHeight=u=Math.max(g-20-this.titleHeight-h,0),this.currentPage=B(this.currentPage,1),this.fullHeight=
b,J.forEach(function(a,b){var d=a._legendItemPos[1],e=Math.round(a.legendItem.getBBox().height),c=m.length;if(!c||d-m[c-1]>u&&(n||d)!==m[c-1])m.push(n||d),c++;a.pageIx=c-1;n&&(J[b-1].pageIx=c-1);b===J.length-1&&d+e-m[c-1]>u&&d!==n&&(m.push(d),a.pageIx=c);d!==n&&(n=d)}),k||(k=a.clipRect=e.clipRect(0,h,9999,0),a.contentGroup.clip(k)),q(u),w||(this.nav=w=e.g().attr({zIndex:1}).add(this.group),this.up=e.symbol("triangle",0,0,A,A).add(w),v("upTracker").on("click",function(){a.scroll(-1,x)}),this.pager=
e.text("",15,10).addClass("highcharts-legend-navigation"),d.styledMode||this.pager.css(r.style),this.pager.add(w),this.down=e.symbol("triangle-down",0,0,A,A).add(w),v("downTracker").on("click",function(){a.scroll(1,x)})),a.scroll(0),b=g):w&&(q(),this.nav=w.destroy(),this.scrollGroup.attr({translateY:1}),this.clipHeight=0);return b},scroll:function(b,a){var d=this.pages,e=d.length,c=this.currentPage+b;b=this.clipHeight;var g=this.options.navigation,h=this.pager,f=this.padding;c>e&&(c=e);0<c&&(void 0!==
a&&t(a,this.chart),this.nav.attr({translateX:f,translateY:b+this.padding+7+this.titleHeight,visibility:"visible"}),[this.up,this.upTracker].forEach(function(a){a.attr({"class":1===c?"highcharts-legend-nav-inactive":"highcharts-legend-nav-active"})}),h.attr({text:c+"/"+e}),[this.down,this.downTracker].forEach(function(a){a.attr({x:18+this.pager.getBBox().width,"class":c===e?"highcharts-legend-nav-inactive":"highcharts-legend-nav-active"})},this),this.chart.styledMode||(this.up.attr({fill:1===c?g.inactiveColor:
g.activeColor}),this.upTracker.css({cursor:1===c?"default":"pointer"}),this.down.attr({fill:c===e?g.inactiveColor:g.activeColor}),this.downTracker.css({cursor:c===e?"default":"pointer"})),this.scrollOffset=-d[c-1]+this.initialItemY,this.scrollGroup.animate({translateY:this.scrollOffset}),this.currentPage=c,this.positionCheckboxes())}};c.LegendSymbolMixin={drawRectangle:function(b,a){var d=b.symbolHeight,e=b.options.squareSymbol;a.legendSymbol=this.chart.renderer.rect(e?(b.symbolWidth-d)/2:0,b.baseline-
d+1,e?d:b.symbolWidth,d,B(b.options.symbolRadius,d/2)).addClass("highcharts-point").attr({zIndex:3}).add(a.legendGroup)},drawLineMarker:function(b){var a=this.options,d=a.marker,e=b.symbolWidth,c=b.symbolHeight,g=c/2,f=this.chart.renderer,p=this.legendGroup;b=b.baseline-Math.round(.3*b.fontMetrics.b);var u={};this.chart.styledMode||(u={"stroke-width":a.lineWidth||0},a.dashStyle&&(u.dashstyle=a.dashStyle));this.legendLine=f.path(["M",0,b,"L",e,b]).addClass("highcharts-graph").attr(u).add(p);d&&!1!==
d.enabled&&e&&(a=Math.min(B(d.radius,g),g),0===this.symbol.indexOf("url")&&(d=h(d,{width:c,height:c}),a=0),this.legendSymbol=d=f.symbol(this.symbol,e/2-a,b-a,2*a,2*a,d).addClass("highcharts-point").add(p),d.isMarker=!0)}};(/Trident\/7\.0/.test(q.navigator&&q.navigator.userAgent)||f)&&g(c.Legend.prototype,"positionItem",function(b,a){var d=this,e=function(){a._legendItemPos&&b.call(d,a)};e();d.bubbleLegend||setTimeout(e)})});M(I,"parts/Chart.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,
f){var F=f.attr,G=f.defined,z=f.discardElement,B=f.erase,t=f.extend,v=f.isArray,C=f.isNumber,H=f.isObject,y=f.isString,h=f.objectEach,n=f.pick,q=f.pInt,g=f.setAnimation,b=f.splat,a=f.syncTimeout,d=c.addEvent,e=c.animate,l=c.animObject,L=c.doc,E=c.Axis,p=c.createElement,u=c.defaultOptions,k=c.charts,r=c.css,x=c.find,A=c.fireEvent,w=c.Legend,m=c.marginNames,K=c.merge,J=c.Pointer,U=c.removeEvent,S=c.seriesTypes,Q=c.win,O=c.Chart=function(){this.getArgs.apply(this,arguments)};c.chart=function(a,b,d){return new O(a,
b,d)};t(O.prototype,{callbacks:[],getArgs:function(){var a=[].slice.call(arguments);if(y(a[0])||a[0].nodeName)this.renderTo=a.shift();this.init(a[0],a[1])},init:function(a,b){var e,g=a.series,m=a.plotOptions||{};A(this,"init",{args:arguments},function(){a.series=null;e=K(u,a);h(e.plotOptions,function(a,b){H(a)&&(a.tooltip=m[b]&&K(m[b].tooltip)||void 0)});e.tooltip.userOptions=a.chart&&a.chart.forExport&&a.tooltip.userOptions||a.tooltip;e.series=a.series=g;this.userOptions=a;var r=e.chart,l=r.events;
this.margin=[];this.spacing=[];this.bounds={h:{},v:{}};this.labelCollectors=[];this.callback=b;this.isResizing=0;this.options=e;this.axes=[];this.series=[];this.time=a.time&&Object.keys(a.time).length?new c.Time(a.time):c.time;this.styledMode=r.styledMode;this.hasCartesianSeries=r.showAxes;var f=this;f.index=k.length;k.push(f);c.chartCount++;l&&h(l,function(a,b){c.isFunction(a)&&d(f,b,a)});f.xAxis=[];f.yAxis=[];f.pointCount=f.colorCounter=f.symbolCounter=0;A(f,"afterInit");f.firstRender()})},initSeries:function(a){var b=
this.options.chart;b=a.type||b.type||b.defaultSeriesType;var d=S[b];d||c.error(17,!0,this,{missingModuleFor:b});b=new d;b.init(this,a);return b},orderSeries:function(a){var b=this.series;for(a=a||0;a<b.length;a++)b[a]&&(b[a].index=a,b[a].name=b[a].getName())},isInsidePlot:function(a,b,d){var e=d?b:a;a=d?a:b;return 0<=e&&e<=this.plotWidth&&0<=a&&a<=this.plotHeight},redraw:function(a){A(this,"beforeRedraw");var b=this.axes,d=this.series,e=this.pointer,c=this.legend,k=this.userOptions.legend,m=this.isDirtyLegend,
r=this.hasCartesianSeries,h=this.isDirtyBox,l=this.renderer,f=l.isHidden(),x=[];this.setResponsive&&this.setResponsive(!1);g(a,this);f&&this.temporaryDisplay();this.layOutTitles();for(a=d.length;a--;){var w=d[a];if(w.options.stacking){var p=!0;if(w.isDirty){var u=!0;break}}}if(u)for(a=d.length;a--;)w=d[a],w.options.stacking&&(w.isDirty=!0);d.forEach(function(a){a.isDirty&&("point"===a.options.legendType?(a.updateTotals&&a.updateTotals(),m=!0):k&&(k.labelFormatter||k.labelFormat)&&(m=!0));a.isDirtyData&&
A(a,"updatedData")});m&&c&&c.options.enabled&&(c.render(),this.isDirtyLegend=!1);p&&this.getStacks();r&&b.forEach(function(a){a.updateNames();a.setScale()});this.getMargins();r&&(b.forEach(function(a){a.isDirty&&(h=!0)}),b.forEach(function(a){var b=a.min+","+a.max;a.extKey!==b&&(a.extKey=b,x.push(function(){A(a,"afterSetExtremes",t(a.eventArgs,a.getExtremes()));delete a.eventArgs}));(h||p)&&a.redraw()}));h&&this.drawChartBox();A(this,"predraw");d.forEach(function(a){(h||a.isDirty)&&a.visible&&a.redraw();
a.isDirtyData=!1});e&&e.reset(!0);l.draw();A(this,"redraw");A(this,"render");f&&this.temporaryDisplay(!0);x.forEach(function(a){a.call()})},get:function(a){function b(b){return b.id===a||b.options&&b.options.id===a}var d=this.series,e;var c=x(this.axes,b)||x(this.series,b);for(e=0;!c&&e<d.length;e++)c=x(d[e].points||[],b);return c},getAxes:function(){var a=this,d=this.options,e=d.xAxis=b(d.xAxis||{});d=d.yAxis=b(d.yAxis||{});A(this,"getAxes");e.forEach(function(a,b){a.index=b;a.isX=!0});d.forEach(function(a,
b){a.index=b});e.concat(d).forEach(function(b){new E(a,b)});A(this,"afterGetAxes")},getSelectedPoints:function(){var a=[];this.series.forEach(function(b){a=a.concat((b[b.hasGroupedData?"points":"data"]||[]).filter(function(a){return n(a.selectedStaging,a.selected)}))});return a},getSelectedSeries:function(){return this.series.filter(function(a){return a.selected})},setTitle:function(a,b,d){this.applyDescription("title",a);this.applyDescription("subtitle",b);this.applyDescription("caption",void 0);
this.layOutTitles(d)},applyDescription:function(a,b){var d=this,e="title"===a?{color:"#333333",fontSize:this.options.isStock?"16px":"18px"}:{color:"#666666"};e=this.options[a]=K(!this.styledMode&&{style:e},this.options[a],b);var c=this[a];c&&b&&(this[a]=c=c.destroy());e&&!c&&(c=this.renderer.text(e.text,0,0,e.useHTML).attr({align:e.align,"class":"highcharts-"+a,zIndex:e.zIndex||4}).add(),c.update=function(b){d[{title:"setTitle",subtitle:"setSubtitle",caption:"setCaption"}[a]](b)},this.styledMode||
c.css(e.style),this[a]=c)},layOutTitles:function(a){var b=[0,0,0],d=this.renderer,e=this.spacingBox;["title","subtitle","caption"].forEach(function(a){var c=this[a],k=this.options[a],g=k.verticalAlign||"top";a="title"===a?-3:"top"===g?b[0]+2:0;if(c){if(!this.styledMode)var m=k.style.fontSize;m=d.fontMetrics(m,c).b;c.css({width:(k.width||e.width+(k.widthAdjust||0))+"px"});var r=Math.round(c.getBBox(k.useHTML).height);c.align(t({y:"bottom"===g?m:a+m,height:r},k),!1,"spacingBox");k.floating||("top"===
g?b[0]=Math.ceil(b[0]+r):"bottom"===g&&(b[2]=Math.ceil(b[2]+r)))}},this);b[0]&&"top"===(this.options.title.verticalAlign||"top")&&(b[0]+=this.options.title.margin);b[2]&&"bottom"===this.options.caption.verticalAlign&&(b[2]+=this.options.caption.margin);var c=!this.titleOffset||this.titleOffset.join(",")!==b.join(",");this.titleOffset=b;A(this,"afterLayOutTitles");!this.isDirtyBox&&c&&(this.isDirtyBox=this.isDirtyLegend=c,this.hasRendered&&n(a,!0)&&this.isDirtyBox&&this.redraw())},getChartSize:function(){var a=
this.options.chart,b=a.width;a=a.height;var d=this.renderTo;G(b)||(this.containerWidth=c.getStyle(d,"width"));G(a)||(this.containerHeight=c.getStyle(d,"height"));this.chartWidth=Math.max(0,b||this.containerWidth||600);this.chartHeight=Math.max(0,c.relativeLength(a,this.chartWidth)||(1<this.containerHeight?this.containerHeight:400))},temporaryDisplay:function(a){var b=this.renderTo;if(a)for(;b&&b.style;)b.hcOrigStyle&&(c.css(b,b.hcOrigStyle),delete b.hcOrigStyle),b.hcOrigDetached&&(L.body.removeChild(b),
b.hcOrigDetached=!1),b=b.parentNode;else for(;b&&b.style;){L.body.contains(b)||b.parentNode||(b.hcOrigDetached=!0,L.body.appendChild(b));if("none"===c.getStyle(b,"display",!1)||b.hcOricDetached)b.hcOrigStyle={display:b.style.display,height:b.style.height,overflow:b.style.overflow},a={display:"block",overflow:"hidden"},b!==this.renderTo&&(a.height=0),c.css(b,a),b.offsetWidth||b.style.setProperty("display","block","important");b=b.parentNode;if(b===L.body)break}},setClassName:function(a){this.container.className=
"highcharts-container "+(a||"")},getContainer:function(){var a=this.options,b=a.chart;var d=this.renderTo;var e=c.uniqueKey(),g,m;d||(this.renderTo=d=b.renderTo);y(d)&&(this.renderTo=d=L.getElementById(d));d||c.error(13,!0,this);var h=q(F(d,"data-highcharts-chart"));C(h)&&k[h]&&k[h].hasRendered&&k[h].destroy();F(d,"data-highcharts-chart",this.index);d.innerHTML="";b.skipClone||d.offsetWidth||this.temporaryDisplay();this.getChartSize();h=this.chartWidth;var l=this.chartHeight;r(d,{overflow:"hidden"});
this.styledMode||(g=t({position:"relative",overflow:"hidden",width:h+"px",height:l+"px",textAlign:"left",lineHeight:"normal",zIndex:0,"-webkit-tap-highlight-color":"rgba(0,0,0,0)"},b.style));this.container=d=p("div",{id:e},g,d);this._cursor=d.style.cursor;this.renderer=new (c[b.renderer]||c.Renderer)(d,h,l,null,b.forExport,a.exporting&&a.exporting.allowHTML,this.styledMode);this.setClassName(b.className);if(this.styledMode)for(m in a.defs)this.renderer.definition(a.defs[m]);else this.renderer.setStyle(b.style);
this.renderer.chartIndex=this.index;A(this,"afterGetContainer")},getMargins:function(a){var b=this.spacing,d=this.margin,e=this.titleOffset;this.resetMargins();e[0]&&!G(d[0])&&(this.plotTop=Math.max(this.plotTop,e[0]+b[0]));e[2]&&!G(d[2])&&(this.marginBottom=Math.max(this.marginBottom,e[2]+b[2]));this.legend&&this.legend.display&&this.legend.adjustMargins(d,b);A(this,"getMargins");a||this.getAxisMargins()},getAxisMargins:function(){var a=this,b=a.axisOffset=[0,0,0,0],d=a.colorAxis,e=a.margin,c=function(a){a.forEach(function(a){a.visible&&
a.getOffset()})};a.hasCartesianSeries?c(a.axes):d&&d.length&&c(d);m.forEach(function(d,c){G(e[c])||(a[d]+=b[c])});a.setChartSize()},reflow:function(b){var d=this,e=d.options.chart,k=d.renderTo,g=G(e.width)&&G(e.height),m=e.width||c.getStyle(k,"width");e=e.height||c.getStyle(k,"height");k=b?b.target:Q;if(!g&&!d.isPrinting&&m&&e&&(k===Q||k===L)){if(m!==d.containerWidth||e!==d.containerHeight)c.clearTimeout(d.reflowTimeout),d.reflowTimeout=a(function(){d.container&&d.setSize(void 0,void 0,!1)},b?100:
0);d.containerWidth=m;d.containerHeight=e}},setReflow:function(a){var b=this;!1===a||this.unbindReflow?!1===a&&this.unbindReflow&&(this.unbindReflow=this.unbindReflow()):(this.unbindReflow=d(Q,"resize",function(a){b.options&&b.reflow(a)}),d(this,"destroy",this.unbindReflow))},setSize:function(b,d,c){var k=this,m=k.renderer;k.isResizing+=1;g(c,k);k.oldChartHeight=k.chartHeight;k.oldChartWidth=k.chartWidth;void 0!==b&&(k.options.chart.width=b);void 0!==d&&(k.options.chart.height=d);k.getChartSize();
if(!k.styledMode){var h=m.globalAnimation;(h?e:r)(k.container,{width:k.chartWidth+"px",height:k.chartHeight+"px"},h)}k.setChartSize(!0);m.setSize(k.chartWidth,k.chartHeight,c);k.axes.forEach(function(a){a.isDirty=!0;a.setScale()});k.isDirtyLegend=!0;k.isDirtyBox=!0;k.layOutTitles();k.getMargins();k.redraw(c);k.oldChartHeight=null;A(k,"resize");a(function(){k&&A(k,"endResize",null,function(){--k.isResizing})},l(h).duration||0)},setChartSize:function(a){var b=this.inverted,d=this.renderer,e=this.chartWidth,
c=this.chartHeight,k=this.options.chart,g=this.spacing,m=this.clipOffset,r,h,l,f;this.plotLeft=r=Math.round(this.plotLeft);this.plotTop=h=Math.round(this.plotTop);this.plotWidth=l=Math.max(0,Math.round(e-r-this.marginRight));this.plotHeight=f=Math.max(0,Math.round(c-h-this.marginBottom));this.plotSizeX=b?f:l;this.plotSizeY=b?l:f;this.plotBorderWidth=k.plotBorderWidth||0;this.spacingBox=d.spacingBox={x:g[3],y:g[0],width:e-g[3]-g[1],height:c-g[0]-g[2]};this.plotBox=d.plotBox={x:r,y:h,width:l,height:f};
e=2*Math.floor(this.plotBorderWidth/2);b=Math.ceil(Math.max(e,m[3])/2);d=Math.ceil(Math.max(e,m[0])/2);this.clipBox={x:b,y:d,width:Math.floor(this.plotSizeX-Math.max(e,m[1])/2-b),height:Math.max(0,Math.floor(this.plotSizeY-Math.max(e,m[2])/2-d))};a||this.axes.forEach(function(a){a.setAxisSize();a.setAxisTranslation()});A(this,"afterSetChartSize",{skipAxes:a})},resetMargins:function(){A(this,"resetMargins");var a=this,b=a.options.chart;["margin","spacing"].forEach(function(d){var e=b[d],c=H(e)?e:[e,
e,e,e];["Top","Right","Bottom","Left"].forEach(function(e,k){a[d][k]=n(b[d+e],c[k])})});m.forEach(function(b,d){a[b]=n(a.margin[d],a.spacing[d])});a.axisOffset=[0,0,0,0];a.clipOffset=[0,0,0,0]},drawChartBox:function(){var a=this.options.chart,b=this.renderer,d=this.chartWidth,e=this.chartHeight,c=this.chartBackground,k=this.plotBackground,g=this.plotBorder,m=this.styledMode,r=this.plotBGImage,h=a.backgroundColor,l=a.plotBackgroundColor,f=a.plotBackgroundImage,x,w=this.plotLeft,p=this.plotTop,u=this.plotWidth,
n=this.plotHeight,J=this.plotBox,K=this.clipRect,q=this.clipBox,v="animate";c||(this.chartBackground=c=b.rect().addClass("highcharts-background").add(),v="attr");if(m)var y=x=c.strokeWidth();else{y=a.borderWidth||0;x=y+(a.shadow?8:0);h={fill:h||"none"};if(y||c["stroke-width"])h.stroke=a.borderColor,h["stroke-width"]=y;c.attr(h).shadow(a.shadow)}c[v]({x:x/2,y:x/2,width:d-x-y%2,height:e-x-y%2,r:a.borderRadius});v="animate";k||(v="attr",this.plotBackground=k=b.rect().addClass("highcharts-plot-background").add());
k[v](J);m||(k.attr({fill:l||"none"}).shadow(a.plotShadow),f&&(r?r.animate(J):this.plotBGImage=b.image(f,w,p,u,n).add()));K?K.animate({width:q.width,height:q.height}):this.clipRect=b.clipRect(q);v="animate";g||(v="attr",this.plotBorder=g=b.rect().addClass("highcharts-plot-border").attr({zIndex:1}).add());m||g.attr({stroke:a.plotBorderColor,"stroke-width":a.plotBorderWidth||0,fill:"none"});g[v](g.crisp({x:w,y:p,width:u,height:n},-g.strokeWidth()));this.isDirtyBox=!1;A(this,"afterDrawChartBox")},propFromSeries:function(){var a=
this,b=a.options.chart,d,e=a.options.series,c,k;["inverted","angular","polar"].forEach(function(g){d=S[b.type||b.defaultSeriesType];k=b[g]||d&&d.prototype[g];for(c=e&&e.length;!k&&c--;)(d=S[e[c].type])&&d.prototype[g]&&(k=!0);a[g]=k})},linkSeries:function(){var a=this,b=a.series;b.forEach(function(a){a.linkedSeries.length=0});b.forEach(function(b){var d=b.options.linkedTo;y(d)&&(d=":previous"===d?a.series[b.index-1]:a.get(d))&&d.linkedParent!==b&&(d.linkedSeries.push(b),b.linkedParent=d,b.visible=
n(b.options.visible,d.options.visible,b.visible))});A(this,"afterLinkSeries")},renderSeries:function(){this.series.forEach(function(a){a.translate();a.render()})},renderLabels:function(){var a=this,b=a.options.labels;b.items&&b.items.forEach(function(d){var e=t(b.style,d.style),c=q(e.left)+a.plotLeft,k=q(e.top)+a.plotTop+12;delete e.left;delete e.top;a.renderer.text(d.html,c,k).attr({zIndex:2}).css(e).add()})},render:function(){var a=this.axes,b=this.colorAxis,d=this.renderer,e=this.options,c=0,k=
function(a){a.forEach(function(a){a.visible&&a.render()})};this.setTitle();this.legend=new w(this,e.legend);this.getStacks&&this.getStacks();this.getMargins(!0);this.setChartSize();e=this.plotWidth;a.some(function(a){if(a.horiz&&a.visible&&a.options.labels.enabled&&a.series.length)return c=21,!0});var g=this.plotHeight=Math.max(this.plotHeight-c,0);a.forEach(function(a){a.setScale()});this.getAxisMargins();var m=1.1<e/this.plotWidth;var r=1.05<g/this.plotHeight;if(m||r)a.forEach(function(a){(a.horiz&&
m||!a.horiz&&r)&&a.setTickInterval(!0)}),this.getMargins();this.drawChartBox();this.hasCartesianSeries?k(a):b&&b.length&&k(b);this.seriesGroup||(this.seriesGroup=d.g("series-group").attr({zIndex:3}).add());this.renderSeries();this.renderLabels();this.addCredits();this.setResponsive&&this.setResponsive();this.updateContainerScaling();this.hasRendered=!0},addCredits:function(a){var b=this;a=K(!0,this.options.credits,a);a.enabled&&!this.credits&&(this.credits=this.renderer.text(a.text+(this.mapCredits||
""),0,0).addClass("highcharts-credits").on("click",function(){a.href&&(Q.location.href=a.href)}).attr({align:a.position.align,zIndex:8}),b.styledMode||this.credits.css(a.style),this.credits.add().align(a.position),this.credits.update=function(a){b.credits=b.credits.destroy();b.addCredits(a)})},updateContainerScaling:function(){var a=this.container;if(a.offsetWidth&&a.offsetHeight&&a.getBoundingClientRect){var b=a.getBoundingClientRect(),d=b.width/a.offsetWidth;a=b.height/a.offsetHeight;1!==d||1!==
a?this.containerScaling={scaleX:d,scaleY:a}:delete this.containerScaling}},destroy:function(){var a=this,b=a.axes,d=a.series,e=a.container,g,m=e&&e.parentNode;A(a,"destroy");a.renderer.forExport?B(k,a):k[a.index]=void 0;c.chartCount--;a.renderTo.removeAttribute("data-highcharts-chart");U(a);for(g=b.length;g--;)b[g]=b[g].destroy();this.scroller&&this.scroller.destroy&&this.scroller.destroy();for(g=d.length;g--;)d[g]=d[g].destroy();"title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer".split(" ").forEach(function(b){var d=
a[b];d&&d.destroy&&(a[b]=d.destroy())});e&&(e.innerHTML="",U(e),m&&z(e));h(a,function(b,d){delete a[d]})},firstRender:function(){var a=this,b=a.options;if(!a.isReadyToRender||a.isReadyToRender()){a.getContainer();a.resetMargins();a.setChartSize();a.propFromSeries();a.getAxes();(v(b.series)?b.series:[]).forEach(function(b){a.initSeries(b)});a.linkSeries();A(a,"beforeRender");J&&(a.pointer=new J(a,b));a.render();if(!a.renderer.imgCount&&a.onload)a.onload();a.temporaryDisplay(!0)}},onload:function(){this.callbacks.concat([this.callback]).forEach(function(a){a&&
void 0!==this.index&&a.apply(this,[this])},this);A(this,"load");A(this,"render");G(this.index)&&this.setReflow(this.options.chart.reflow);this.onload=null}})});M(I,"parts/ScrollablePlotArea.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.pick,G=c.addEvent;f=c.Chart;"";G(f,"afterSetChartSize",function(f){var z=this.options.chart.scrollablePlotArea,t=z&&z.minWidth;z=z&&z.minHeight;if(!this.renderer.forExport){if(t){if(this.scrollablePixelsX=t=Math.max(0,t-this.chartWidth)){this.plotWidth+=
t;this.inverted?(this.clipBox.height+=t,this.plotBox.height+=t):(this.clipBox.width+=t,this.plotBox.width+=t);var v={1:{name:"right",value:t}}}}else z&&(this.scrollablePixelsY=t=Math.max(0,z-this.chartHeight))&&(this.plotHeight+=t,this.inverted?(this.clipBox.width+=t,this.plotBox.width+=t):(this.clipBox.height+=t,this.plotBox.height+=t),v={2:{name:"bottom",value:t}});v&&!f.skipAxes&&this.axes.forEach(function(f){v[f.side]?f.getPlotLinePath=function(){var t=v[f.side].name,y=this[t];this[t]=y-v[f.side].value;
var h=c.Axis.prototype.getPlotLinePath.apply(this,arguments);this[t]=y;return h}:(f.setAxisSize(),f.setAxisTranslation())})}});G(f,"render",function(){this.scrollablePixelsX||this.scrollablePixelsY?(this.setUpScrolling&&this.setUpScrolling(),this.applyFixed()):this.fixedDiv&&this.applyFixed()});f.prototype.setUpScrolling=function(){var f={WebkitOverflowScrolling:"touch",overflowX:"hidden",overflowY:"hidden"};this.scrollablePixelsX&&(f.overflowX="auto");this.scrollablePixelsY&&(f.overflowY="auto");
this.scrollingContainer=c.createElement("div",{className:"highcharts-scrolling"},f,this.renderTo);this.innerContainer=c.createElement("div",{className:"highcharts-inner-container"},null,this.scrollingContainer);this.innerContainer.appendChild(this.container);this.setUpScrolling=null};f.prototype.moveFixedElements=function(){var c=this.container,f=this.fixedRenderer,t=".highcharts-contextbutton .highcharts-credits .highcharts-legend .highcharts-legend-checkbox .highcharts-navigator-series .highcharts-navigator-xaxis .highcharts-navigator-yaxis .highcharts-navigator .highcharts-reset-zoom .highcharts-scrollbar .highcharts-subtitle .highcharts-title".split(" "),
v;this.scrollablePixelsX&&!this.inverted?v=".highcharts-yaxis":this.scrollablePixelsX&&this.inverted?v=".highcharts-xaxis":this.scrollablePixelsY&&!this.inverted?v=".highcharts-xaxis":this.scrollablePixelsY&&this.inverted&&(v=".highcharts-yaxis");t.push(v,v+"-labels");t.forEach(function(v){[].forEach.call(c.querySelectorAll(v),function(c){(c.namespaceURI===f.SVG_NS?f.box:f.box.parentNode).appendChild(c);c.style.pointerEvents="auto"})})};f.prototype.applyFixed=function(){var f,B=!this.fixedDiv,t=this.options.chart.scrollablePlotArea;
B?(this.fixedDiv=c.createElement("div",{className:"highcharts-fixed"},{position:"absolute",overflow:"hidden",pointerEvents:"none",zIndex:2},null,!0),this.renderTo.insertBefore(this.fixedDiv,this.renderTo.firstChild),this.renderTo.style.overflow="visible",this.fixedRenderer=f=new c.Renderer(this.fixedDiv,this.chartWidth,this.chartHeight),this.scrollableMask=f.path().attr({fill:c.color(this.options.chart.backgroundColor||"#fff").setOpacity(F(t.opacity,.85)).get(),zIndex:-1}).addClass("highcharts-scrollable-mask").add(),
this.moveFixedElements(),G(this,"afterShowResetZoom",this.moveFixedElements),G(this,"afterLayOutTitles",this.moveFixedElements)):this.fixedRenderer.setSize(this.chartWidth,this.chartHeight);f=this.chartWidth+(this.scrollablePixelsX||0);var v=this.chartHeight+(this.scrollablePixelsY||0);c.stop(this.container);this.container.style.width=f+"px";this.container.style.height=v+"px";this.renderer.boxWrapper.attr({width:f,height:v,viewBox:[0,0,f,v].join(" ")});this.chartBackground.attr({width:f,height:v});
this.scrollablePixelsY&&(this.scrollingContainer.style.height=this.chartHeight+"px");B&&(t.scrollPositionX&&(this.scrollingContainer.scrollLeft=this.scrollablePixelsX*t.scrollPositionX),t.scrollPositionY&&(this.scrollingContainer.scrollTop=this.scrollablePixelsY*t.scrollPositionY));v=this.axisOffset;B=this.plotTop-v[0]-1;t=this.plotLeft-v[3]-1;f=this.plotTop+this.plotHeight+v[2]+1;v=this.plotLeft+this.plotWidth+v[1]+1;var C=this.plotLeft+this.plotWidth-(this.scrollablePixelsX||0),H=this.plotTop+this.plotHeight-
(this.scrollablePixelsY||0);B=this.scrollablePixelsX?["M",0,B,"L",this.plotLeft-1,B,"L",this.plotLeft-1,f,"L",0,f,"Z","M",C,B,"L",this.chartWidth,B,"L",this.chartWidth,f,"L",C,f,"Z"]:this.scrollablePixelsY?["M",t,0,"L",t,this.plotTop-1,"L",v,this.plotTop-1,"L",v,0,"Z","M",t,H,"L",t,this.chartHeight,"L",v,this.chartHeight,"L",v,H,"Z"]:["M",0,0];"adjustHeight"!==this.redrawTrigger&&this.scrollableMask.attr({d:B})}});M(I,"parts/Point.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=
f.defined,G=f.erase,z=f.extend,B=f.isArray,t=f.isNumber,v=f.isObject,C=f.pick,H,y=c.fireEvent,h=c.format,n=c.uniqueKey,q=c.removeEvent;c.Point=H=function(){};c.Point.prototype={init:function(c,b,a){this.series=c;this.applyOptions(b,a);this.id=F(this.id)?this.id:n();this.resolveColor();c.chart.pointCount++;y(this,"afterInit");return this},resolveColor:function(){var c=this.series;var b=c.chart.options.chart.colorCount;var a=c.chart.styledMode;a||this.options.color||(this.color=c.color);c.options.colorByPoint?
(a||(b=c.options.colors||c.chart.options.colors,this.color=this.color||b[c.colorCounter],b=b.length),a=c.colorCounter,c.colorCounter++,c.colorCounter===b&&(c.colorCounter=0)):a=c.colorIndex;this.colorIndex=C(this.colorIndex,a)},applyOptions:function(c,b){var a=this.series,d=a.options.pointValKey||a.pointValKey;c=H.prototype.optionsToObject.call(this,c);z(this,c);this.options=this.options?z(this.options,c):c;c.group&&delete this.group;c.dataLabels&&delete this.dataLabels;d&&(this.y=this[d]);this.formatPrefix=
(this.isNull=C(this.isValid&&!this.isValid(),null===this.x||!t(this.y)))?"null":"point";this.selected&&(this.state="select");"name"in this&&void 0===b&&a.xAxis&&a.xAxis.hasNames&&(this.x=a.xAxis.nameToX(this));void 0===this.x&&a&&(this.x=void 0===b?a.autoIncrement(this):b);return this},setNestedProperty:function(c,b,a){a.split(".").reduce(function(a,e,c,g){a[e]=g.length-1===c?b:v(a[e],!0)?a[e]:{};return a[e]},c);return c},optionsToObject:function(g){var b={},a=this.series,d=a.options.keys,e=d||a.pointArrayMap||
["y"],h=e.length,f=0,n=0;if(t(g)||null===g)b[e[0]]=g;else if(B(g))for(!d&&g.length>h&&(a=typeof g[0],"string"===a?b.name=g[0]:"number"===a&&(b.x=g[0]),f++);n<h;)d&&void 0===g[f]||(0<e[n].indexOf(".")?c.Point.prototype.setNestedProperty(b,g[f],e[n]):b[e[n]]=g[f]),f++,n++;else"object"===typeof g&&(b=g,g.dataLabels&&(a._hasPointLabels=!0),g.marker&&(a._hasPointMarkers=!0));return b},getClassName:function(){return"highcharts-point"+(this.selected?" highcharts-point-select":"")+(this.negative?" highcharts-negative":
"")+(this.isNull?" highcharts-null-point":"")+(void 0!==this.colorIndex?" highcharts-color-"+this.colorIndex:"")+(this.options.className?" "+this.options.className:"")+(this.zone&&this.zone.className?" "+this.zone.className.replace("highcharts-negative",""):"")},getZone:function(){var c=this.series,b=c.zones;c=c.zoneAxis||"y";var a=0,d;for(d=b[a];this[c]>=d.value;)d=b[++a];this.nonZonedColor||(this.nonZonedColor=this.color);this.color=d&&d.color&&!this.options.color?d.color:this.nonZonedColor;return d},
hasNewShapeType:function(){return this.graphic&&this.graphic.element.nodeName!==this.shapeType},destroy:function(){var c=this.series.chart,b=c.hoverPoints,a;c.pointCount--;b&&(this.setState(),G(b,this),b.length||(c.hoverPoints=null));if(this===c.hoverPoint)this.onMouseOut();if(this.graphic||this.dataLabel||this.dataLabels)q(this),this.destroyElements();this.legendItem&&c.legend.destroyItem(this);for(a in this)this[a]=null},destroyElements:function(c){var b=this,a=[],d;c=c||{graphic:1,dataLabel:1};
c.graphic&&a.push("graphic","shadowGroup");c.dataLabel&&a.push("dataLabel","dataLabelUpper","connector");for(d=a.length;d--;){var e=a[d];b[e]&&(b[e]=b[e].destroy())}["dataLabel","connector"].forEach(function(a){var d=a+"s";c[a]&&b[d]&&(b[d].forEach(function(a){a.element&&a.destroy()}),delete b[d])})},getLabelConfig:function(){return{x:this.category,y:this.y,color:this.color,colorIndex:this.colorIndex,key:this.name||this.category,series:this.series,point:this,percentage:this.percentage,total:this.total||
this.stackTotal}},tooltipFormatter:function(c){var b=this.series,a=b.tooltipOptions,d=C(a.valueDecimals,""),e=a.valuePrefix||"",g=a.valueSuffix||"";b.chart.styledMode&&(c=b.chart.tooltip.styledModeFormat(c));(b.pointArrayMap||["y"]).forEach(function(a){a="{point."+a;if(e||g)c=c.replace(RegExp(a+"}","g"),e+a+"}"+g);c=c.replace(RegExp(a+"}","g"),a+":,."+d+"f}")});return h(c,{point:this,series:this.series},b.chart.time)},firePointEvent:function(c,b,a){var d=this,e=this.series.options;(e.point.events[c]||
d.options&&d.options.events&&d.options.events[c])&&this.importEvents();"click"===c&&e.allowPointSelect&&(a=function(a){d.select&&d.select(null,a.ctrlKey||a.metaKey||a.shiftKey)});y(this,c,b,a)},visible:!0}});M(I,"parts/Series.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.arrayMax,G=f.arrayMin,z=f.defined,B=f.erase,t=f.extend,v=f.isArray,C=f.isNumber,H=f.isString,y=f.objectEach,h=f.pick,n=f.splat,q=f.syncTimeout,g=c.addEvent,b=c.animObject,a=c.correctFloat,d=c.defaultOptions,
e=c.defaultPlotOptions,l=c.fireEvent,L=c.merge,E=c.removeEvent,p=c.SVGElement,u=c.win;c.Series=c.seriesType("line",null,{lineWidth:2,allowPointSelect:!1,showCheckbox:!1,animation:{duration:1E3},events:{},marker:{lineWidth:0,lineColor:"#ffffff",enabledThreshold:2,radius:4,states:{normal:{animation:!0},hover:{animation:{duration:50},enabled:!0,radiusPlus:2,lineWidthPlus:1},select:{fillColor:"#cccccc",lineColor:"#000000",lineWidth:2}}},point:{events:{}},dataLabels:{align:"center",formatter:function(){return null===
this.y?"":c.numberFormat(this.y,-1)},padding:5,style:{fontSize:"11px",fontWeight:"bold",color:"contrast",textOutline:"1px contrast"},verticalAlign:"bottom",x:0,y:0},cropThreshold:300,opacity:1,pointRange:0,softThreshold:!0,states:{normal:{animation:!0},hover:{animation:{duration:50},lineWidthPlus:1,marker:{},halo:{size:10,opacity:.25}},select:{animation:{duration:0}},inactive:{animation:{duration:50},opacity:.2}},stickyTracking:!0,turboThreshold:1E3,findNearestPointBy:"x"},{axisTypes:["xAxis","yAxis"],
coll:"series",colorCounter:0,cropShoulder:1,directTouch:!1,isCartesian:!0,parallelArrays:["x","y"],pointClass:c.Point,requireSorting:!0,sorted:!0,init:function(a,b){l(this,"init",{options:b});var d=this,e=a.series,k;this.eventOptions=this.eventOptions||{};d.chart=a;d.options=b=d.setOptions(b);d.linkedSeries=[];d.bindAxes();t(d,{name:b.name,state:"",visible:!1!==b.visible,selected:!0===b.selected});var m=b.events;y(m,function(a,b){c.isFunction(a)&&d.eventOptions[b]!==a&&(c.isFunction(d.eventOptions[b])&&
E(d,b,d.eventOptions[b]),d.eventOptions[b]=a,g(d,b,a))});if(m&&m.click||b.point&&b.point.events&&b.point.events.click||b.allowPointSelect)a.runTrackerClick=!0;d.getColor();d.getSymbol();d.parallelArrays.forEach(function(a){d[a+"Data"]||(d[a+"Data"]=[])});d.points||d.data||d.setData(b.data,!1);d.isCartesian&&(a.hasCartesianSeries=!0);e.length&&(k=e[e.length-1]);d._i=h(k&&k._i,-1)+1;a.orderSeries(this.insert(e));l(this,"afterInit")},insert:function(a){var b=this.options.index,d;if(C(b)){for(d=a.length;d--;)if(b>=
h(a[d].options.index,a[d]._i)){a.splice(d+1,0,this);break}-1===d&&a.unshift(this);d+=1}else a.push(this);return h(d,a.length-1)},bindAxes:function(){var a=this,b=a.options,d=a.chart,e;l(this,"bindAxes",null,function(){(a.axisTypes||[]).forEach(function(k){d[k].forEach(function(d){e=d.options;if(b[k]===e.index||void 0!==b[k]&&b[k]===e.id||void 0===b[k]&&0===e.index)a.insert(d.series),a[k]=d,d.isDirty=!0});a[k]||a.optionalAxis===k||c.error(18,!0,d)})})},updateParallelArrays:function(a,b){var d=a.series,
c=arguments,e=C(b)?function(c){var e="y"===c&&d.toYData?d.toYData(a):a[c];d[c+"Data"][b]=e}:function(a){Array.prototype[b].apply(d[a+"Data"],Array.prototype.slice.call(c,2))};d.parallelArrays.forEach(e)},hasData:function(){return this.visible&&void 0!==this.dataMax&&void 0!==this.dataMin||this.visible&&this.yData&&0<this.yData.length},autoIncrement:function(){var a=this.options,b=this.xIncrement,d,c=a.pointIntervalUnit,e=this.chart.time;b=h(b,a.pointStart,0);this.pointInterval=d=h(this.pointInterval,
a.pointInterval,1);c&&(a=new e.Date(b),"day"===c?e.set("Date",a,e.get("Date",a)+d):"month"===c?e.set("Month",a,e.get("Month",a)+d):"year"===c&&e.set("FullYear",a,e.get("FullYear",a)+d),d=a.getTime()-b);this.xIncrement=b+d;return b},setOptions:function(a){var b=this.chart,c=b.options,e=c.plotOptions,k=b.userOptions||{};a=L(a);b=b.styledMode;var g={plotOptions:e,userOptions:a};l(this,"setOptions",g);var f=g.plotOptions[this.type],p=k.plotOptions||{};this.userOptions=g.userOptions;k=L(f,e.series,k.plotOptions&&
k.plotOptions[this.type],a);this.tooltipOptions=L(d.tooltip,d.plotOptions.series&&d.plotOptions.series.tooltip,d.plotOptions[this.type].tooltip,c.tooltip.userOptions,e.series&&e.series.tooltip,e[this.type].tooltip,a.tooltip);this.stickyTracking=h(a.stickyTracking,p[this.type]&&p[this.type].stickyTracking,p.series&&p.series.stickyTracking,this.tooltipOptions.shared&&!this.noSharedTooltip?!0:k.stickyTracking);null===f.marker&&delete k.marker;this.zoneAxis=k.zoneAxis;c=this.zones=(k.zones||[]).slice();
!k.negativeColor&&!k.negativeFillColor||k.zones||(e={value:k[this.zoneAxis+"Threshold"]||k.threshold||0,className:"highcharts-negative"},b||(e.color=k.negativeColor,e.fillColor=k.negativeFillColor),c.push(e));c.length&&z(c[c.length-1].value)&&c.push(b?{}:{color:this.color,fillColor:this.fillColor});l(this,"afterSetOptions",{options:k});return k},getName:function(){return h(this.options.name,"Series "+(this.index+1))},getCyclic:function(a,b,d){var c=this.chart,e=this.userOptions,k=a+"Index",g=a+"Counter",
f=d?d.length:h(c.options.chart[a+"Count"],c[a+"Count"]);if(!b){var r=h(e[k],e["_"+k]);z(r)||(c.series.length||(c[g]=0),e["_"+k]=r=c[g]%f,c[g]+=1);d&&(b=d[r])}void 0!==r&&(this[k]=r);this[a]=b},getColor:function(){this.chart.styledMode?this.getCyclic("color"):this.options.colorByPoint?this.options.color=null:this.getCyclic("color",this.options.color||e[this.type].color,this.chart.options.colors)},getSymbol:function(){this.getCyclic("symbol",this.options.marker.symbol,this.chart.options.symbols)},findPointIndex:function(a,
b){var d=a.id;a=a.x;var c=this.points,e;if(d){var k=(d=this.chart.get(d))&&d.index;void 0!==k&&(e=!0)}void 0===k&&C(a)&&(k=this.xData.indexOf(a,b));-1!==k&&void 0!==k&&this.cropped&&(k=k>=this.cropStart?k-this.cropStart:k);!e&&c[k]&&c[k].touched&&(k=void 0);return k},drawLegendSymbol:c.LegendSymbolMixin.drawLineMarker,updateData:function(a){var b=this.options,d=this.points,c=[],e,k,g,h=this.requireSorting,f=a.length===d.length,l=!0;this.xIncrement=null;a.forEach(function(a,k){var m=z(a)&&this.pointClass.prototype.optionsToObject.call({series:this},
a)||{};var r=m.x;if(m.id||C(r))if(r=this.findPointIndex(m,g),-1===r||void 0===r?c.push(a):d[r]&&a!==b.data[r]?(d[r].update(a,!1,null,!1),d[r].touched=!0,h&&(g=r+1)):d[r]&&(d[r].touched=!0),!f||k!==r||this.hasDerivedData)e=!0},this);if(e)for(a=d.length;a--;)(k=d[a])&&!k.touched&&k.remove(!1);else f?a.forEach(function(a,b){d[b].update&&a!==d[b].y&&d[b].update(a,!1,null,!1)}):l=!1;d.forEach(function(a){a&&(a.touched=!1)});if(!l)return!1;c.forEach(function(a){this.addPoint(a,!1,null,null,!1)},this);return!0},
setData:function(a,b,d,e){var k=this,g=k.points,f=g&&g.length||0,r,l=k.options,p=k.chart,x=null,A=k.xAxis;x=l.turboThreshold;var u=this.xData,n=this.yData,q=(r=k.pointArrayMap)&&r.length,y=l.keys,t=0,E=1,L;a=a||[];r=a.length;b=h(b,!0);!1!==e&&r&&f&&!k.cropped&&!k.hasGroupedData&&k.visible&&!k.isSeriesBoosting&&(L=this.updateData(a));if(!L){k.xIncrement=null;k.colorCounter=0;this.parallelArrays.forEach(function(a){k[a+"Data"].length=0});if(x&&r>x)if(x=k.getFirstValidPoint(a),C(x))for(d=0;d<r;d++)u[d]=
this.autoIncrement(),n[d]=a[d];else if(v(x))if(q)for(d=0;d<r;d++)e=a[d],u[d]=e[0],n[d]=e.slice(1,q+1);else for(y&&(t=y.indexOf("x"),E=y.indexOf("y"),t=0<=t?t:0,E=0<=E?E:1),d=0;d<r;d++)e=a[d],u[d]=e[t],n[d]=e[E];else c.error(12,!1,p);else for(d=0;d<r;d++)void 0!==a[d]&&(e={series:k},k.pointClass.prototype.applyOptions.apply(e,[a[d]]),k.updateParallelArrays(e,d));n&&H(n[0])&&c.error(14,!0,p);k.data=[];k.options.data=k.userOptions.data=a;for(d=f;d--;)g[d]&&g[d].destroy&&g[d].destroy();A&&(A.minRange=
A.userMinRange);k.isDirty=p.isDirtyBox=!0;k.isDirtyData=!!g;d=!1}"point"===l.legendType&&(this.processData(),this.generatePoints());b&&p.redraw(d)},processData:function(a){var b=this.xData,d=this.yData,e=b.length;var k=0;var g=this.xAxis,h=this.options;var f=h.cropThreshold;var l=this.getExtremesFromAll||h.getExtremesFromAll,p=this.isCartesian;h=g&&g.val2lin;var u=g&&g.isLog,n=this.requireSorting;if(p&&!this.isDirty&&!g.isDirty&&!this.yAxis.isDirty&&!a)return!1;if(g){a=g.getExtremes();var q=a.min;
var v=a.max}if(p&&this.sorted&&!l&&(!f||e>f||this.forceCrop))if(b[e-1]<q||b[0]>v)b=[],d=[];else if(this.yData&&(b[0]<q||b[e-1]>v)){k=this.cropData(this.xData,this.yData,q,v);b=k.xData;d=k.yData;k=k.start;var y=!0}for(f=b.length||1;--f;)if(e=u?h(b[f])-h(b[f-1]):b[f]-b[f-1],0<e&&(void 0===t||e<t))var t=e;else 0>e&&n&&(c.error(15,!1,this.chart),n=!1);this.cropped=y;this.cropStart=k;this.processedXData=b;this.processedYData=d;this.closestPointRange=this.basePointRange=t},cropData:function(a,b,d,e,c){var k=
a.length,g=0,f=k,r;c=h(c,this.cropShoulder);for(r=0;r<k;r++)if(a[r]>=d){g=Math.max(0,r-c);break}for(d=r;d<k;d++)if(a[d]>e){f=d+c;break}return{xData:a.slice(g,f),yData:b.slice(g,f),start:g,end:f}},generatePoints:function(){var a=this.options,b=a.data,d=this.data,e,c=this.processedXData,g=this.processedYData,f=this.pointClass,h=c.length,p=this.cropStart||0,u=this.hasGroupedData;a=a.keys;var q=[],v;d||u||(d=[],d.length=b.length,d=this.data=d);a&&u&&(this.options.keys=!1);for(v=0;v<h;v++){var y=p+v;if(u){var E=
(new f).init(this,[c[v]].concat(n(g[v])));E.dataGroup=this.groupMap[v];E.dataGroup.options&&(E.options=E.dataGroup.options,t(E,E.dataGroup.options),delete E.dataLabels)}else(E=d[y])||void 0===b[y]||(d[y]=E=(new f).init(this,b[y],c[v]));E&&(E.index=y,q[v]=E)}this.options.keys=a;if(d&&(h!==(e=d.length)||u))for(v=0;v<e;v++)v!==p||u||(v+=h),d[v]&&(d[v].destroyElements(),d[v].plotX=void 0);this.data=d;this.points=q;l(this,"afterGeneratePoints")},getXExtremes:function(a){return{min:G(a),max:F(a)}},getExtremes:function(a){var b=
this.xAxis,d=this.yAxis,e=this.processedXData||this.xData,c=[],k=0,g=0;var f=0;var h=this.requireSorting?this.cropShoulder:0,p=d?d.positiveValuesOnly:!1,u;a=a||this.stackedYData||this.processedYData||[];d=a.length;b&&(f=b.getExtremes(),g=f.min,f=f.max);for(u=0;u<d;u++){var n=e[u];var q=a[u];var y=(C(q)||v(q))&&(q.length||0<q||!p);n=this.getExtremesFromAll||this.options.getExtremesFromAll||this.cropped||!b||(e[u+h]||n)>=g&&(e[u-h]||n)<=f;if(y&&n)if(y=q.length)for(;y--;)C(q[y])&&(c[k++]=q[y]);else c[k++]=
q}this.dataMin=G(c);this.dataMax=F(c);l(this,"afterGetExtremes")},getFirstValidPoint:function(a){for(var b=null,d=a.length,e=0;null===b&&e<d;)b=a[e],e++;return b},translate:function(){this.processedXData||this.processData();this.generatePoints();var b=this.options,d=b.stacking,e=this.xAxis,c=e.categories,g=this.yAxis,m=this.points,f=m.length,p=!!this.modifyValue,u,n=this.pointPlacementToXValue(),q=C(n),y=b.threshold,t=b.startFromThreshold?y:0,E,L=this.zoneAxis||"y",B=Number.MAX_VALUE;for(u=0;u<f;u++){var H=
m[u],G=H.x;var F=H.y;var I=H.low,M=d&&g.stacks[(this.negStacks&&F<(t?0:y)?"-":"")+this.stackKey];g.positiveValuesOnly&&null!==F&&0>=F&&(H.isNull=!0);H.plotX=E=a(Math.min(Math.max(-1E5,e.translate(G,0,0,0,1,n,"flags"===this.type)),1E5));if(d&&this.visible&&M&&M[G]){var X=this.getStackIndicator(X,G,this.index);if(!H.isNull){var P=M[G];var Y=P.points[X.key]}}v(Y)&&(I=Y[0],F=Y[1],I===t&&X.key===M[G].base&&(I=h(C(y)&&y,g.min)),g.positiveValuesOnly&&0>=I&&(I=null),H.total=H.stackTotal=P.total,H.percentage=
P.total&&H.y/P.total*100,H.stackY=F,this.irregularWidths||P.setOffset(this.pointXOffset||0,this.barW||0));H.yBottom=z(I)?Math.min(Math.max(-1E5,g.translate(I,0,1,0,1)),1E5):null;p&&(F=this.modifyValue(F,H));H.plotY=F="number"===typeof F&&Infinity!==F?Math.min(Math.max(-1E5,g.translate(F,0,1,0,1)),1E5):void 0;H.isInside=void 0!==F&&0<=F&&F<=g.len&&0<=E&&E<=e.len;H.clientX=q?a(e.translate(G,0,0,0,1,n)):E;H.negative=H[L]<(b[L+"Threshold"]||y||0);H.category=c&&void 0!==c[H.x]?c[H.x]:H.x;if(!H.isNull){void 0!==
Z&&(B=Math.min(B,Math.abs(E-Z)));var Z=E}H.zone=this.zones.length&&H.getZone()}this.closestPointRangePx=B;l(this,"afterTranslate")},getValidPoints:function(a,b,d){var e=this.chart;return(a||this.points||[]).filter(function(a){return b&&!e.isInsidePlot(a.plotX,a.plotY,e.inverted)?!1:d||!a.isNull})},getClipBox:function(a,b){var d=this.options,e=this.chart,c=e.inverted,k=this.xAxis,g=k&&this.yAxis;a&&!1===d.clip&&g?a=c?{y:-e.chartWidth+g.len+g.pos,height:e.chartWidth,width:e.chartHeight,x:-e.chartHeight+
k.len+k.pos}:{y:-g.pos,height:e.chartHeight,width:e.chartWidth,x:-k.pos}:(a=this.clipBox||e.clipBox,b&&(a.width=e.plotSizeX,a.x=0));return b?{width:a.width,x:a.x}:a},setClip:function(a){var b=this.chart,d=this.options,e=b.renderer,c=b.inverted,k=this.clipBox,g=this.getClipBox(a),f=this.sharedClipKey||["_sharedClip",a&&a.duration,a&&a.easing,g.height,d.xAxis,d.yAxis].join(),h=b[f],l=b[f+"m"];h||(a&&(g.width=0,c&&(g.x=b.plotSizeX+(!1!==d.clip?0:b.plotTop)),b[f+"m"]=l=e.clipRect(c?b.plotSizeX+99:-99,
c?-b.plotLeft:-b.plotTop,99,c?b.chartWidth:b.chartHeight)),b[f]=h=e.clipRect(g),h.count={length:0});a&&!h.count[this.index]&&(h.count[this.index]=!0,h.count.length+=1);if(!1!==d.clip||a)this.group.clip(a||k?h:b.clipRect),this.markerGroup.clip(l),this.sharedClipKey=f;a||(h.count[this.index]&&(delete h.count[this.index],--h.count.length),0===h.count.length&&f&&b[f]&&(k||(b[f]=b[f].destroy()),b[f+"m"]&&(b[f+"m"]=b[f+"m"].destroy())))},animate:function(a){var d=this.chart,e=b(this.options.animation);
if(a)this.setClip(e);else{var c=this.sharedClipKey;a=d[c];var k=this.getClipBox(e,!0);a&&a.animate(k,e);d[c+"m"]&&d[c+"m"].animate({width:k.width+99,x:k.x-(d.inverted?0:99)},e);this.animate=null}},afterAnimate:function(){this.setClip();l(this,"afterAnimate");this.finishedAnimating=!0},drawPoints:function(){var a=this.points,b=this.chart,d,e=this.options.marker,c=this[this.specialGroup]||this.markerGroup;var g=this.xAxis;var f=h(e.enabled,!g||g.isRadial?!0:null,this.closestPointRangePx>=e.enabledThreshold*
e.radius);if(!1!==e.enabled||this._hasPointMarkers)for(g=0;g<a.length;g++){var l=a[g];var p=(d=l.graphic)?"animate":"attr";var u=l.marker||{};var n=!!l.marker;var q=f&&void 0===u.enabled||u.enabled;var v=!1!==l.isInside;if(q&&!l.isNull){var y=h(u.symbol,this.symbol);q=this.markerAttribs(l,l.selected&&"select");d?d[v?"show":"hide"](v).animate(q):v&&(0<q.width||l.hasImage)&&(l.graphic=d=b.renderer.symbol(y,q.x,q.y,q.width,q.height,n?u:e).add(c));if(d&&!b.styledMode)d[p](this.pointAttribs(l,l.selected&&
"select"));d&&d.addClass(l.getClassName(),!0)}else d&&(l.graphic=d.destroy())}},markerAttribs:function(a,b){var d=this.options.marker,e=a.marker||{},c=e.symbol||d.symbol,k=h(e.radius,d.radius);b&&(d=d.states[b],b=e.states&&e.states[b],k=h(b&&b.radius,d&&d.radius,k+(d&&d.radiusPlus||0)));a.hasImage=c&&0===c.indexOf("url");a.hasImage&&(k=0);a={x:Math.floor(a.plotX)-k,y:a.plotY-k};k&&(a.width=a.height=2*k);return a},pointAttribs:function(a,b){var d=this.options.marker,e=a&&a.options,c=e&&e.marker||{},
k=this.color,g=e&&e.color,f=a&&a.color;e=h(c.lineWidth,d.lineWidth);var l=a&&a.zone&&a.zone.color;a=1;k=g||l||f||k;g=c.fillColor||d.fillColor||k;k=c.lineColor||d.lineColor||k;b=b||"normal";d=d.states[b];b=c.states&&c.states[b]||{};e=h(b.lineWidth,d.lineWidth,e+h(b.lineWidthPlus,d.lineWidthPlus,0));g=b.fillColor||d.fillColor||g;k=b.lineColor||d.lineColor||k;a=h(b.opacity,d.opacity,a);return{stroke:k,"stroke-width":e,fill:g,opacity:a}},destroy:function(a){var b=this,d=b.chart,e=/AppleWebKit\/533/.test(u.navigator.userAgent),
k,g,f=b.data||[],h,n;l(b,"destroy");a||E(b);(b.axisTypes||[]).forEach(function(a){(n=b[a])&&n.series&&(B(n.series,b),n.isDirty=n.forceRedraw=!0)});b.legendItem&&b.chart.legend.destroyItem(b);for(g=f.length;g--;)(h=f[g])&&h.destroy&&h.destroy();b.points=null;c.clearTimeout(b.animationTimeout);y(b,function(a,b){a instanceof p&&!a.survive&&(k=e&&"group"===b?"hide":"destroy",a[k]())});d.hoverSeries===b&&(d.hoverSeries=null);B(d.series,b);d.orderSeries();y(b,function(d,e){a&&"hcEvents"===e||delete b[e]})},
getGraphPath:function(a,b,d){var e=this,c=e.options,k=c.step,g,f=[],h=[],l;a=a||e.points;(g=a.reversed)&&a.reverse();(k={right:1,center:2}[k]||k&&3)&&g&&(k=4-k);!c.connectNulls||b||d||(a=this.getValidPoints(a));a.forEach(function(g,m){var r=g.plotX,p=g.plotY,u=a[m-1];(g.leftCliff||u&&u.rightCliff)&&!d&&(l=!0);g.isNull&&!z(b)&&0<m?l=!c.connectNulls:g.isNull&&!b?l=!0:(0===m||l?m=["M",g.plotX,g.plotY]:e.getPointSpline?m=e.getPointSpline(a,g,m):k?(m=1===k?["L",u.plotX,p]:2===k?["L",(u.plotX+r)/2,u.plotY,
"L",(u.plotX+r)/2,p]:["L",r,u.plotY],m.push("L",r,p)):m=["L",r,p],h.push(g.x),k&&(h.push(g.x),2===k&&h.push(g.x)),f.push.apply(f,m),l=!1)});f.xMap=h;return e.graphPath=f},drawGraph:function(){var a=this,b=this.options,d=(this.gappedPath||this.getGraphPath).call(this),e=this.chart.styledMode,c=[["graph","highcharts-graph"]];e||c[0].push(b.lineColor||this.color||"#cccccc",b.dashStyle);c=a.getZonesGraphs(c);c.forEach(function(c,k){var g=c[0],f=a[g],h=f?"animate":"attr";f?(f.endX=a.preventGraphAnimation?
null:d.xMap,f.animate({d:d})):d.length&&(a[g]=f=a.chart.renderer.path(d).addClass(c[1]).attr({zIndex:1}).add(a.group));f&&!e&&(g={stroke:c[2],"stroke-width":b.lineWidth,fill:a.fillGraph&&a.color||"none"},c[3]?g.dashstyle=c[3]:"square"!==b.linecap&&(g["stroke-linecap"]=g["stroke-linejoin"]="round"),f[h](g).shadow(2>k&&b.shadow));f&&(f.startX=d.xMap,f.isArea=d.isArea)})},getZonesGraphs:function(a){this.zones.forEach(function(b,d){d=["zone-graph-"+d,"highcharts-graph highcharts-zone-graph-"+d+" "+(b.className||
"")];this.chart.styledMode||d.push(b.color||this.color,b.dashStyle||this.options.dashStyle);a.push(d)},this);return a},applyZones:function(){var a=this,b=this.chart,d=b.renderer,e=this.zones,c,g,f=this.clips||[],l,p=this.graph,u=this.area,n=Math.max(b.chartWidth,b.chartHeight),q=this[(this.zoneAxis||"y")+"Axis"],v=b.inverted,y,t,E,C=!1;if(e.length&&(p||u)&&q&&void 0!==q.min){var L=q.reversed;var z=q.horiz;p&&!this.showLine&&p.hide();u&&u.hide();var B=q.getExtremes();e.forEach(function(e,k){c=L?z?
b.plotWidth:0:z?0:q.toPixels(B.min)||0;c=Math.min(Math.max(h(g,c),0),n);g=Math.min(Math.max(Math.round(q.toPixels(h(e.value,B.max),!0)||0),0),n);C&&(c=g=q.toPixels(B.max));y=Math.abs(c-g);t=Math.min(c,g);E=Math.max(c,g);q.isXAxis?(l={x:v?E:t,y:0,width:y,height:n},z||(l.x=b.plotHeight-l.x)):(l={x:0,y:v?E:t,width:n,height:y},z&&(l.y=b.plotWidth-l.y));v&&d.isVML&&(l=q.isXAxis?{x:0,y:L?t:E,height:l.width,width:b.chartWidth}:{x:l.y-b.plotLeft-b.spacingBox.x,y:0,width:l.height,height:b.chartHeight});f[k]?
f[k].animate(l):f[k]=d.clipRect(l);p&&a["zone-graph-"+k].clip(f[k]);u&&a["zone-area-"+k].clip(f[k]);C=e.value>B.max;a.resetZones&&0===g&&(g=void 0)});this.clips=f}else a.visible&&(p&&p.show(!0),u&&u.show(!0))},invertGroups:function(a){function b(){["group","markerGroup"].forEach(function(b){d[b]&&(e.renderer.isVML&&d[b].attr({width:d.yAxis.len,height:d.xAxis.len}),d[b].width=d.yAxis.len,d[b].height=d.xAxis.len,d[b].invert(a))})}var d=this,e=d.chart;if(d.xAxis){var c=g(e,"resize",b);g(d,"destroy",
c);b(a);d.invertGroups=b}},plotGroup:function(a,b,d,e,c){var k=this[a],g=!k;g&&(this[a]=k=this.chart.renderer.g().attr({zIndex:e||.1}).add(c));k.addClass("highcharts-"+b+" highcharts-series-"+this.index+" highcharts-"+this.type+"-series "+(z(this.colorIndex)?"highcharts-color-"+this.colorIndex+" ":"")+(this.options.className||"")+(k.hasClass("highcharts-tracker")?" highcharts-tracker":""),!0);k.attr({visibility:d})[g?"attr":"animate"](this.getPlotBox());return k},getPlotBox:function(){var a=this.chart,
b=this.xAxis,d=this.yAxis;a.inverted&&(b=d,d=this.xAxis);return{translateX:b?b.left:a.plotLeft,translateY:d?d.top:a.plotTop,scaleX:1,scaleY:1}},render:function(){var a=this,d=a.chart,e=a.options,c=!!a.animate&&d.renderer.isSVG&&b(e.animation).duration,g=a.visible?"inherit":"hidden",f=e.zIndex,h=a.hasRendered,p=d.seriesGroup,u=d.inverted;l(this,"render");var n=a.plotGroup("group","series",g,f,p);a.markerGroup=a.plotGroup("markerGroup","markers",g,f,p);c&&a.animate(!0);n.inverted=a.isCartesian||a.invertable?
u:!1;a.drawGraph&&(a.drawGraph(),a.applyZones());a.visible&&a.drawPoints();a.drawDataLabels&&a.drawDataLabels();a.redrawPoints&&a.redrawPoints();a.drawTracker&&!1!==a.options.enableMouseTracking&&a.drawTracker();a.invertGroups(u);!1===e.clip||a.sharedClipKey||h||n.clip(d.clipRect);c&&a.animate();h||(a.animationTimeout=q(function(){a.afterAnimate()},c||0));a.isDirty=!1;a.hasRendered=!0;l(a,"afterRender")},redraw:function(){var a=this.chart,b=this.isDirty||this.isDirtyData,d=this.group,e=this.xAxis,
c=this.yAxis;d&&(a.inverted&&d.attr({width:a.plotWidth,height:a.plotHeight}),d.animate({translateX:h(e&&e.left,a.plotLeft),translateY:h(c&&c.top,a.plotTop)}));this.translate();this.render();b&&delete this.kdTree},kdAxisArray:["clientX","plotY"],searchPoint:function(a,b){var d=this.xAxis,e=this.yAxis,c=this.chart.inverted;return this.searchKDTree({clientX:c?d.len-a.chartY+d.pos:a.chartX-d.pos,plotY:c?e.len-a.chartX+e.pos:a.chartY-e.pos},b,a)},buildKDTree:function(a){function b(a,e,c){var g;if(g=a&&
a.length){var k=d.kdAxisArray[e%c];a.sort(function(a,b){return a[k]-b[k]});g=Math.floor(g/2);return{point:a[g],left:b(a.slice(0,g),e+1,c),right:b(a.slice(g+1),e+1,c)}}}this.buildingKdTree=!0;var d=this,e=-1<d.options.findNearestPointBy.indexOf("y")?2:1;delete d.kdTree;q(function(){d.kdTree=b(d.getValidPoints(null,!d.directTouch),e,e);d.buildingKdTree=!1},d.options.kdNow||a&&"touchstart"===a.type?0:1)},searchKDTree:function(a,b,d){function e(a,b,d,h){var l=b.point,m=c.kdAxisArray[d%h],p=l;var r=z(a[g])&&
z(l[g])?Math.pow(a[g]-l[g],2):null;var u=z(a[k])&&z(l[k])?Math.pow(a[k]-l[k],2):null;u=(r||0)+(u||0);l.dist=z(u)?Math.sqrt(u):Number.MAX_VALUE;l.distX=z(r)?Math.sqrt(r):Number.MAX_VALUE;m=a[m]-l[m];u=0>m?"left":"right";r=0>m?"right":"left";b[u]&&(u=e(a,b[u],d+1,h),p=u[f]<p[f]?u:l);b[r]&&Math.sqrt(m*m)<p[f]&&(a=e(a,b[r],d+1,h),p=a[f]<p[f]?a:p);return p}var c=this,g=this.kdAxisArray[0],k=this.kdAxisArray[1],f=b?"distX":"dist";b=-1<c.options.findNearestPointBy.indexOf("y")?2:1;this.kdTree||this.buildingKdTree||
this.buildKDTree(d);if(this.kdTree)return e(a,this.kdTree,b,b)},pointPlacementToXValue:function(){var a=this.xAxis,b=this.options.pointPlacement;"between"===b&&(b=a.reversed?-.5:.5);C(b)&&(b*=h(this.options.pointRange||a.pointRange));return b}});""});M(I,"parts/Stacking.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.defined,G=f.destroyObjectProperties,z=f.objectEach,B=f.pick;f=c.Axis;var t=c.Chart,v=c.correctFloat,C=c.format,H=c.Series;c.StackItem=function(c,f,n,q,g){var b=
c.chart.inverted;this.axis=c;this.isNegative=n;this.options=f=f||{};this.x=q;this.total=null;this.points={};this.stack=g;this.rightCliff=this.leftCliff=0;this.alignOptions={align:f.align||(b?n?"left":"right":"center"),verticalAlign:f.verticalAlign||(b?"middle":n?"bottom":"top"),y:f.y,x:f.x};this.textAlign=f.textAlign||(b?n?"right":"left":"center")};c.StackItem.prototype={destroy:function(){G(this,this.axis)},render:function(c){var f=this.axis.chart,n=this.options,q=n.format;q=q?C(q,this,f.time):n.formatter.call(this);
this.label?this.label.attr({text:q,visibility:"hidden"}):(this.label=f.renderer.label(q,null,null,n.shape,null,null,n.useHTML,!1,"stack-labels"),q={text:q,align:this.textAlign,rotation:n.rotation,padding:B(n.padding,0),visibility:"hidden"},this.label.attr(q),f.styledMode||this.label.css(n.style),this.label.added||this.label.add(c));this.label.labelrank=f.plotHeight},setOffset:function(c,f,n,q,g){var b=this.axis,a=b.chart;q=b.translate(b.usePercentage?100:q?q:this.total,0,0,0,1);n=b.translate(n?n:
0);n=F(q)&&Math.abs(q-n);c=B(g,a.xAxis[0].translate(this.x))+c;b=F(q)&&this.getStackBox(a,this,c,q,f,n,b);f=this.label;c=this.isNegative;g="justify"===B(this.options.overflow,"justify");if(f&&b){n=f.getBBox();var d=a.inverted?c?n.width:0:n.width/2,e=a.inverted?n.height/2:c?-4:n.height+4;this.alignOptions.x=B(this.options.x,0);f.align(this.alignOptions,null,b);q=f.alignAttr;f.show();q.y-=e;g&&(q.x-=d,H.prototype.justifyDataLabel.call(this.axis,f,this.alignOptions,q,n,b),q.x+=d);q.x=f.alignAttr.x;f.attr({x:q.x,
y:q.y});B(!g&&this.options.crop,!0)&&((a=a.isInsidePlot(f.x+(a.inverted?0:-n.width/2),f.y)&&a.isInsidePlot(f.x+(a.inverted?c?-n.width:n.width:n.width/2),f.y+n.height))||f.hide())}},getStackBox:function(c,f,n,q,g,b,a){var d=f.axis.reversed,e=c.inverted;c=a.height+a.pos-(e?c.plotLeft:c.plotTop);f=f.isNegative&&!d||!f.isNegative&&d;return{x:e?f?q:q-b:n,y:e?c-n-g:f?c-q-b:c-q,width:e?b:g,height:e?g:b}}};t.prototype.getStacks=function(){var c=this,f=c.inverted;c.yAxis.forEach(function(c){c.stacks&&c.hasVisibleSeries&&
(c.oldStacks=c.stacks)});c.series.forEach(function(h){var n=h.xAxis&&h.xAxis.options||{};!h.options.stacking||!0!==h.visible&&!1!==c.options.chart.ignoreHiddenSeries||(h.stackKey=[h.type,B(h.options.stack,""),f?n.top:n.left,f?n.height:n.width].join())})};f.prototype.buildStacks=function(){var c=this.series,f=B(this.options.reversedStacks,!0),n=c.length,q;if(!this.isXAxis){this.usePercentage=!1;for(q=n;q--;)c[f?q:n-q-1].setStackedPoints();for(q=0;q<n;q++)c[q].modifyStacks()}};f.prototype.renderStackTotals=
function(){var c=this.chart,f=c.renderer,n=this.stacks,q=this.stackTotalGroup;q||(this.stackTotalGroup=q=f.g("stack-labels").attr({visibility:"visible",zIndex:6}).add());q.translate(c.plotLeft,c.plotTop);z(n,function(c){z(c,function(b){b.render(q)})})};f.prototype.resetStacks=function(){var c=this,f=c.stacks;c.isXAxis||z(f,function(f){z(f,function(h,g){h.touched<c.stacksTouched?(h.destroy(),delete f[g]):(h.total=null,h.cumulative=null)})})};f.prototype.cleanStacks=function(){if(!this.isXAxis){if(this.oldStacks)var c=
this.stacks=this.oldStacks;z(c,function(c){z(c,function(c){c.cumulative=c.total})})}};H.prototype.setStackedPoints=function(){if(this.options.stacking&&(!0===this.visible||!1===this.chart.options.chart.ignoreHiddenSeries)){var f=this.processedXData,h=this.processedYData,n=[],q=h.length,g=this.options,b=g.threshold,a=B(g.startFromThreshold&&b,0),d=g.stack;g=g.stacking;var e=this.stackKey,l="-"+e,t=this.negStacks,E=this.yAxis,p=E.stacks,u=E.oldStacks,k,r;E.stacksTouched+=1;for(r=0;r<q;r++){var x=f[r];
var A=h[r];var w=this.getStackIndicator(w,x,this.index);var m=w.key;var K=(k=t&&A<(a?0:b))?l:e;p[K]||(p[K]={});p[K][x]||(u[K]&&u[K][x]?(p[K][x]=u[K][x],p[K][x].total=null):p[K][x]=new c.StackItem(E,E.options.stackLabels,k,x,d));K=p[K][x];null!==A?(K.points[m]=K.points[this.index]=[B(K.cumulative,a)],F(K.cumulative)||(K.base=m),K.touched=E.stacksTouched,0<w.index&&!1===this.singleStacks&&(K.points[m][0]=K.points[this.index+","+x+",0"][0])):K.points[m]=K.points[this.index]=null;"percent"===g?(k=k?e:
l,t&&p[k]&&p[k][x]?(k=p[k][x],K.total=k.total=Math.max(k.total,K.total)+Math.abs(A)||0):K.total=v(K.total+(Math.abs(A)||0))):K.total=v(K.total+(A||0));K.cumulative=B(K.cumulative,a)+(A||0);null!==A&&(K.points[m].push(K.cumulative),n[r]=K.cumulative)}"percent"===g&&(E.usePercentage=!0);this.stackedYData=n;E.oldStacks={}}};H.prototype.modifyStacks=function(){var c=this,f=c.stackKey,n=c.yAxis.stacks,q=c.processedXData,g,b=c.options.stacking;c[b+"Stacker"]&&[f,"-"+f].forEach(function(a){for(var d=q.length,
e,f;d--;)if(e=q[d],g=c.getStackIndicator(g,e,c.index,a),f=(e=n[a]&&n[a][e])&&e.points[g.key])c[b+"Stacker"](f,e,d)})};H.prototype.percentStacker=function(c,f,n){f=f.total?100/f.total:0;c[0]=v(c[0]*f);c[1]=v(c[1]*f);this.stackedYData[n]=c[1]};H.prototype.getStackIndicator=function(c,f,n,q){!F(c)||c.x!==f||q&&c.key!==q?c={x:f,index:0,key:q}:c.index++;c.key=[n,f,c.index].join();return c}});M(I,"parts/Dynamics.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.defined,G=f.erase,
z=f.extend,B=f.isArray,t=f.isNumber,v=f.isObject,C=f.isString,H=f.objectEach,y=f.pick,h=f.setAnimation,n=f.splat,q=c.addEvent,g=c.animate,b=c.Axis;f=c.Chart;var a=c.createElement,d=c.css,e=c.fireEvent,l=c.merge,L=c.Point,E=c.Series,p=c.seriesTypes;c.cleanRecursively=function(a,b){var d={};H(a,function(e,g){if(v(a[g],!0)&&!a.nodeType&&b[g])e=c.cleanRecursively(a[g],b[g]),Object.keys(e).length&&(d[g]=e);else if(v(a[g])||a[g]!==b[g])d[g]=a[g]});return d};z(f.prototype,{addSeries:function(a,b,d){var c,
g=this;a&&(b=y(b,!0),e(g,"addSeries",{options:a},function(){c=g.initSeries(a);g.isDirtyLegend=!0;g.linkSeries();e(g,"afterAddSeries",{series:c});b&&g.redraw(d)}));return c},addAxis:function(a,b,d,c){return this.createAxis(b?"xAxis":"yAxis",{axis:a,redraw:d,animation:c})},addColorAxis:function(a,b,d){return this.createAxis("colorAxis",{axis:a,redraw:b,animation:d})},createAxis:function(a,d){var e=this.options,g="colorAxis"===a,k=d.redraw,f=d.animation;d=l(d.axis,{index:this[a].length,isX:"xAxis"===
a});var h=g?new c.ColorAxis(this,d):new b(this,d);e[a]=n(e[a]||{});e[a].push(d);g&&(this.isDirtyLegend=!0,this.axes.forEach(function(a){a.series=[]}),this.series.forEach(function(a){a.bindAxes();a.isDirtyData=!0}));y(k,!0)&&this.redraw(f);return h},showLoading:function(b){var c=this,e=c.options,f=c.loadingDiv,h=e.loading,l=function(){f&&d(f,{left:c.plotLeft+"px",top:c.plotTop+"px",width:c.plotWidth+"px",height:c.plotHeight+"px"})};f||(c.loadingDiv=f=a("div",{className:"highcharts-loading highcharts-loading-hidden"},
null,c.container),c.loadingSpan=a("span",{className:"highcharts-loading-inner"},null,f),q(c,"redraw",l));f.className="highcharts-loading";c.loadingSpan.innerHTML=y(b,e.lang.loading,"");c.styledMode||(d(f,z(h.style,{zIndex:10})),d(c.loadingSpan,h.labelStyle),c.loadingShown||(d(f,{opacity:0,display:""}),g(f,{opacity:h.style.opacity||.5},{duration:h.showDuration||0})));c.loadingShown=!0;l()},hideLoading:function(){var a=this.options,b=this.loadingDiv;b&&(b.className="highcharts-loading highcharts-loading-hidden",
this.styledMode||g(b,{opacity:0},{duration:a.loading.hideDuration||100,complete:function(){d(b,{display:"none"})}}));this.loadingShown=!1},propsRequireDirtyBox:"backgroundColor borderColor borderWidth borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow".split(" "),propsRequireReflow:"margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft".split(" "),propsRequireUpdateSeries:"chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions time tooltip".split(" "),
collectionsWithUpdate:"xAxis yAxis zAxis colorAxis series pane".split(" "),update:function(a,b,d,g){var k=this,f={credits:"addCredits",title:"setTitle",subtitle:"setSubtitle",caption:"setCaption"},h,p,r,u=a.isResponsiveOptions,q=[];e(k,"update",{options:a});u||k.setResponsive(!1,!0);a=c.cleanRecursively(a,k.options);l(!0,k.userOptions,a);if(h=a.chart){l(!0,k.options.chart,h);"className"in h&&k.setClassName(h.className);"reflow"in h&&k.setReflow(h.reflow);if("inverted"in h||"polar"in h||"type"in h){k.propFromSeries();
var x=!0}"alignTicks"in h&&(x=!0);H(h,function(a,b){-1!==k.propsRequireUpdateSeries.indexOf("chart."+b)&&(p=!0);-1!==k.propsRequireDirtyBox.indexOf(b)&&(k.isDirtyBox=!0);u||-1===k.propsRequireReflow.indexOf(b)||(r=!0)});!k.styledMode&&"style"in h&&k.renderer.setStyle(h.style)}!k.styledMode&&a.colors&&(this.options.colors=a.colors);a.plotOptions&&l(!0,this.options.plotOptions,a.plotOptions);a.time&&this.time===c.time&&(this.time=new c.Time(a.time));H(a,function(a,b){if(k[b]&&"function"===typeof k[b].update)k[b].update(a,
!1);else if("function"===typeof k[f[b]])k[f[b]](a);"chart"!==b&&-1!==k.propsRequireUpdateSeries.indexOf(b)&&(p=!0)});this.collectionsWithUpdate.forEach(function(b){if(a[b]){if("series"===b){var c=[];k[b].forEach(function(a,b){a.options.isInternal||c.push(y(a.options.index,b))})}n(a[b]).forEach(function(a,e){(e=F(a.id)&&k.get(a.id)||k[b][c?c[e]:e])&&e.coll===b&&(e.update(a,!1),d&&(e.touched=!0));!e&&d&&k.collectionsWithInit[b]&&(k.collectionsWithInit[b][0].apply(k,[a].concat(k.collectionsWithInit[b][1]||
[]).concat([!1])).touched=!0)});d&&k[b].forEach(function(a){a.touched||a.options.isInternal?delete a.touched:q.push(a)})}});q.forEach(function(a){a.remove&&a.remove(!1)});x&&k.axes.forEach(function(a){a.update({},!1)});p&&k.series.forEach(function(a){a.update({},!1)});a.loading&&l(!0,k.options.loading,a.loading);x=h&&h.width;h=h&&h.height;C(h)&&(h=c.relativeLength(h,x||k.chartWidth));r||t(x)&&x!==k.chartWidth||t(h)&&h!==k.chartHeight?k.setSize(x,h,g):y(b,!0)&&k.redraw(g);e(k,"afterUpdate",{options:a,
redraw:b,animation:g})},setSubtitle:function(a,b){this.applyDescription("subtitle",a);this.layOutTitles(b)},setCaption:function(a,b){this.applyDescription("caption",a);this.layOutTitles(b)}});f.prototype.collectionsWithInit={xAxis:[f.prototype.addAxis,[!0]],yAxis:[f.prototype.addAxis,[!1]],colorAxis:[f.prototype.addColorAxis,[!1]],series:[f.prototype.addSeries]};z(L.prototype,{update:function(a,b,d,c){function e(){g.applyOptions(a);null===g.y&&f&&(g.graphic=f.destroy());v(a,!0)&&(f&&f.element&&a&&
a.marker&&void 0!==a.marker.symbol&&(g.graphic=f.destroy()),a&&a.dataLabels&&g.dataLabel&&(g.dataLabel=g.dataLabel.destroy()),g.connector&&(g.connector=g.connector.destroy()));h=g.index;k.updateParallelArrays(g,h);p.data[h]=v(p.data[h],!0)||v(a,!0)?g.options:y(a,p.data[h]);k.isDirty=k.isDirtyData=!0;!k.fixedBox&&k.hasCartesianSeries&&(l.isDirtyBox=!0);"point"===p.legendType&&(l.isDirtyLegend=!0);b&&l.redraw(d)}var g=this,k=g.series,f=g.graphic,h,l=k.chart,p=k.options;b=y(b,!0);!1===c?e():g.firePointEvent("update",
{options:a},e)},remove:function(a,b){this.series.removePoint(this.series.data.indexOf(this),a,b)}});z(E.prototype,{addPoint:function(a,b,d,c,g){var k=this.options,f=this.data,h=this.chart,l=this.xAxis;l=l&&l.hasNames&&l.names;var p=k.data,r=this.xData,n;b=y(b,!0);var u={series:this};this.pointClass.prototype.applyOptions.apply(u,[a]);var q=u.x;var x=r.length;if(this.requireSorting&&q<r[x-1])for(n=!0;x&&r[x-1]>q;)x--;this.updateParallelArrays(u,"splice",x,0,0);this.updateParallelArrays(u,x);l&&u.name&&
(l[q]=u.name);p.splice(x,0,a);n&&(this.data.splice(x,0,null),this.processData());"point"===k.legendType&&this.generatePoints();d&&(f[0]&&f[0].remove?f[0].remove(!1):(f.shift(),this.updateParallelArrays(u,"shift"),p.shift()));!1!==g&&e(this,"addPoint",{point:u});this.isDirtyData=this.isDirty=!0;b&&h.redraw(c)},removePoint:function(a,b,d){var c=this,e=c.data,g=e[a],k=c.points,f=c.chart,l=function(){k&&k.length===e.length&&k.splice(a,1);e.splice(a,1);c.options.data.splice(a,1);c.updateParallelArrays(g||
{series:c},"splice",a,1);g&&g.destroy();c.isDirty=!0;c.isDirtyData=!0;b&&f.redraw()};h(d,f);b=y(b,!0);g?g.firePointEvent("remove",null,l):l()},remove:function(a,b,d,c){function g(){k.destroy(c);k.remove=null;f.isDirtyLegend=f.isDirtyBox=!0;f.linkSeries();y(a,!0)&&f.redraw(b)}var k=this,f=k.chart;!1!==d?e(k,"remove",null,g):g()},update:function(a,b){a=c.cleanRecursively(a,this.userOptions);e(this,"update",{options:a});var d=this,g=d.chart,k=d.userOptions,f=d.initialType||d.type,h=a.type||k.type||g.options.chart.type,
n=!(this.hasDerivedData||a.dataGrouping||h&&h!==this.type||void 0!==a.pointStart||a.pointInterval||a.pointIntervalUnit||a.keys),u=p[f].prototype,q,v=["group","markerGroup","dataLabelsGroup","transformGroup"],t=["eventOptions","navigatorSeries","baseSeries"],E=d.finishedAnimating&&{animation:!1},C={};n&&(t.push("data","isDirtyData","points","processedXData","processedYData","xIncrement","_hasPointMarkers","_hasPointLabels","mapMap","mapData","minY","maxY","minX","maxX"),!1!==a.visible&&t.push("area",
"graph"),d.parallelArrays.forEach(function(a){t.push(a+"Data")}),a.data&&this.setData(a.data,!1));a=l(k,E,{index:void 0===k.index?d.index:k.index,pointStart:y(k.pointStart,d.xData[0])},!n&&{data:d.options.data},a);n&&a.data&&(a.data=d.options.data);t=v.concat(t);t.forEach(function(a){t[a]=d[a];delete d[a]});d.remove(!1,null,!1,!0);for(q in u)d[q]=void 0;p[h||f]?z(d,p[h||f].prototype):c.error(17,!0,g,{missingModuleFor:h||f});t.forEach(function(a){d[a]=t[a]});d.init(g,a);if(n&&this.points){var L=d.options;
!1===L.visible?(C.graphic=1,C.dataLabel=1):d._hasPointLabels||(h=L.marker,u=L.dataLabels,h&&(!1===h.enabled||"symbol"in h)&&(C.graphic=1),u&&!1===u.enabled&&(C.dataLabel=1));this.points.forEach(function(a){a&&a.series&&(a.resolveColor(),Object.keys(C).length&&a.destroyElements(C),!1===L.showInLegend&&a.legendItem&&g.legend.destroyItem(a))},this)}a.zIndex!==k.zIndex&&v.forEach(function(b){d[b]&&d[b].attr({zIndex:a.zIndex})});d.initialType=f;g.linkSeries();e(this,"afterUpdate");y(b,!0)&&g.redraw(n?
void 0:!1)},setName:function(a){this.name=this.options.name=this.userOptions.name=a;this.chart.isDirtyLegend=!0}});z(b.prototype,{update:function(a,b){var d=this.chart,c=a&&a.events||{};a=l(this.userOptions,a);d.options[this.coll].indexOf&&(d.options[this.coll][d.options[this.coll].indexOf(this.userOptions)]=a);H(d.options[this.coll].events,function(a,b){"undefined"===typeof c[b]&&(c[b]=void 0)});this.destroy(!0);this.init(d,z(a,{events:c}));d.isDirtyBox=!0;y(b,!0)&&d.redraw()},remove:function(a){for(var b=
this.chart,d=this.coll,c=this.series,e=c.length;e--;)c[e]&&c[e].remove(!1);G(b.axes,this);G(b[d],this);B(b.options[d])?b.options[d].splice(this.options.index,1):delete b.options[d];b[d].forEach(function(a,b){a.options.index=a.userOptions.index=b});this.destroy();b.isDirtyBox=!0;y(a,!0)&&b.redraw()},setTitle:function(a,b){this.update({title:a},b)},setCategories:function(a,b){this.update({categories:a},b)}})});M(I,"parts/AreaSeries.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=
f.objectEach,G=f.pick,z=c.color,B=c.Series;f=c.seriesType;f("area","line",{softThreshold:!1,threshold:0},{singleStacks:!1,getStackPoints:function(c){var f=[],t=[],z=this.xAxis,y=this.yAxis,h=y.stacks[this.stackKey],n={},q=this.index,g=y.series,b=g.length,a=G(y.options.reversedStacks,!0)?1:-1,d;c=c||this.points;if(this.options.stacking){for(d=0;d<c.length;d++)c[d].leftNull=c[d].rightNull=void 0,n[c[d].x]=c[d];F(h,function(a,b){null!==a.total&&t.push(b)});t.sort(function(a,b){return a-b});var e=g.map(function(a){return a.visible});
t.forEach(function(c,g){var l=0,p,u;if(n[c]&&!n[c].isNull)f.push(n[c]),[-1,1].forEach(function(k){var f=1===k?"rightNull":"leftNull",l=0,v=h[t[g+k]];if(v)for(d=q;0<=d&&d<b;)p=v.points[d],p||(d===q?n[c][f]=!0:e[d]&&(u=h[c].points[d])&&(l-=u[1]-u[0])),d+=a;n[c][1===k?"rightCliff":"leftCliff"]=l});else{for(d=q;0<=d&&d<b;){if(p=h[c].points[d]){l=p[1];break}d+=a}l=y.translate(l,0,1,0,1);f.push({isNull:!0,plotX:z.translate(c,0,0,0,1),x:c,plotY:l,yBottom:l})}})}return f},getGraphPath:function(c){var f=B.prototype.getGraphPath,
t=this.options,z=t.stacking,y=this.yAxis,h,n=[],q=[],g=this.index,b=y.stacks[this.stackKey],a=t.threshold,d=Math.round(y.getThreshold(t.threshold));t=G(t.connectNulls,"percent"===z);var e=function(e,f,k){var h=c[e];e=z&&b[h.x].points[g];var l=h[k+"Null"]||0;k=h[k+"Cliff"]||0;h=!0;if(k||l){var p=(l?e[0]:e[1])+k;var u=e[0]+k;h=!!l}else!z&&c[f]&&c[f].isNull&&(p=u=a);void 0!==p&&(q.push({plotX:L,plotY:null===p?d:y.getThreshold(p),isNull:h,isCliff:!0}),n.push({plotX:L,plotY:null===u?d:y.getThreshold(u),
doCurve:!1}))};c=c||this.points;z&&(c=this.getStackPoints(c));for(h=0;h<c.length;h++){z||(c[h].leftCliff=c[h].rightCliff=c[h].leftNull=c[h].rightNull=void 0);var l=c[h].isNull;var L=G(c[h].rectPlotX,c[h].plotX);var E=G(c[h].yBottom,d);if(!l||t)t||e(h,h-1,"left"),l&&!z&&t||(q.push(c[h]),n.push({x:h,plotX:L,plotY:E})),t||e(h,h+1,"right")}h=f.call(this,q,!0,!0);n.reversed=!0;l=f.call(this,n,!0,!0);l.length&&(l[0]="L");l=h.concat(l);f=f.call(this,q,!1,t);l.xMap=h.xMap;this.areaPath=l;return f},drawGraph:function(){this.areaPath=
[];B.prototype.drawGraph.apply(this);var c=this,f=this.areaPath,C=this.options,H=[["area","highcharts-area",this.color,C.fillColor]];this.zones.forEach(function(f,h){H.push(["zone-area-"+h,"highcharts-area highcharts-zone-area-"+h+" "+f.className,f.color||c.color,f.fillColor||C.fillColor])});H.forEach(function(v){var h=v[0],n=c[h],q=n?"animate":"attr",g={};n?(n.endX=c.preventGraphAnimation?null:f.xMap,n.animate({d:f})):(g.zIndex=0,n=c[h]=c.chart.renderer.path(f).addClass(v[1]).add(c.group),n.isArea=
!0);c.chart.styledMode||(g.fill=G(v[3],z(v[2]).setOpacity(G(C.fillOpacity,.75)).get()));n[q](g);n.startX=f.xMap;n.shiftUnit=C.step?2:1})},drawLegendSymbol:c.LegendSymbolMixin.drawRectangle});""});M(I,"parts/SplineSeries.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.pick;c=c.seriesType;c("spline","line",{},{getPointSpline:function(c,f,B){var t=f.plotX,v=f.plotY,C=c[B-1];B=c[B+1];if(C&&!C.isNull&&!1!==C.doCurve&&!f.isCliff&&B&&!B.isNull&&!1!==B.doCurve&&!f.isCliff){c=C.plotY;
var z=B.plotX;B=B.plotY;var y=0;var h=(1.5*t+C.plotX)/2.5;var n=(1.5*v+c)/2.5;z=(1.5*t+z)/2.5;var q=(1.5*v+B)/2.5;z!==h&&(y=(q-n)*(z-t)/(z-h)+v-q);n+=y;q+=y;n>c&&n>v?(n=Math.max(c,v),q=2*v-n):n<c&&n<v&&(n=Math.min(c,v),q=2*v-n);q>B&&q>v?(q=Math.max(B,v),n=2*v-q):q<B&&q<v&&(q=Math.min(B,v),n=2*v-q);f.rightContX=z;f.rightContY=q}f=["C",F(C.rightContX,C.plotX),F(C.rightContY,C.plotY),F(h,t),F(n,v),t,v];C.rightContX=C.rightContY=null;return f}});""});M(I,"parts/AreaSplineSeries.js",[I["parts/Globals.js"]],
function(c){var f=c.seriesTypes.area.prototype,F=c.seriesType;F("areaspline","spline",c.defaultPlotOptions.area,{getStackPoints:f.getStackPoints,getGraphPath:f.getGraphPath,drawGraph:f.drawGraph,drawLegendSymbol:c.LegendSymbolMixin.drawRectangle});""});M(I,"parts/ColumnSeries.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.defined,G=f.extend,z=f.isNumber,B=f.pick,t=c.animObject,v=c.color,C=c.merge,H=c.Series;f=c.seriesType;var y=c.svg;f("column","line",{borderRadius:0,crisp:!0,
groupPadding:.2,marker:null,pointPadding:.1,minPointLength:0,cropThreshold:50,pointRange:null,states:{hover:{halo:!1,brightness:.1},select:{color:"#cccccc",borderColor:"#000000"}},dataLabels:{align:null,verticalAlign:null,y:null},softThreshold:!1,startFromThreshold:!0,stickyTracking:!1,tooltip:{distance:6},threshold:0,borderColor:"#ffffff"},{cropShoulder:0,directTouch:!0,trackerGroups:["group","dataLabelsGroup"],negStacks:!0,init:function(){H.prototype.init.apply(this,arguments);var c=this,f=c.chart;
f.hasRendered&&f.series.forEach(function(f){f.type===c.type&&(f.isDirty=!0)})},getColumnMetrics:function(){var c=this,f=c.options,q=c.xAxis,g=c.yAxis,b=q.options.reversedStacks;b=q.reversed&&!b||!q.reversed&&b;var a,d={},e=0;!1===f.grouping?e=1:c.chart.series.forEach(function(b){var f=b.yAxis,k=b.options;if(b.type===c.type&&(b.visible||!c.chart.options.chart.ignoreHiddenSeries)&&g.len===f.len&&g.pos===f.pos){if(k.stacking){a=b.stackKey;void 0===d[a]&&(d[a]=e++);var h=d[a]}else!1!==k.grouping&&(h=
e++);b.columnIndex=h}});var l=Math.min(Math.abs(q.transA)*(q.ordinalSlope||f.pointRange||q.closestPointRange||q.tickInterval||1),q.len),v=l*f.groupPadding,t=(l-2*v)/(e||1);f=Math.min(f.maxPointWidth||q.len,B(f.pointWidth,t*(1-2*f.pointPadding)));c.columnMetrics={width:f,offset:(t-f)/2+(v+((c.columnIndex||0)+(b?1:0))*t-l/2)*(b?-1:1)};return c.columnMetrics},crispCol:function(c,f,q,g){var b=this.chart,a=this.borderWidth,d=-(a%2?.5:0);a=a%2?.5:1;b.inverted&&b.renderer.isVML&&(a+=1);this.options.crisp&&
(q=Math.round(c+q)+d,c=Math.round(c)+d,q-=c);g=Math.round(f+g)+a;d=.5>=Math.abs(f)&&.5<g;f=Math.round(f)+a;g-=f;d&&g&&(--f,g+=1);return{x:c,y:f,width:q,height:g}},translate:function(){var c=this,f=c.chart,q=c.options,g=c.dense=2>c.closestPointRange*c.xAxis.transA;g=c.borderWidth=B(q.borderWidth,g?0:1);var b=c.yAxis,a=q.threshold,d=c.translatedThreshold=b.getThreshold(a),e=B(q.minPointLength,5),l=c.getColumnMetrics(),v=l.width,t=c.barW=Math.max(v,1+2*g),p=c.pointXOffset=l.offset,u=c.dataMin,k=c.dataMax;
f.inverted&&(d-=.5);q.pointPadding&&(t=Math.ceil(t));H.prototype.translate.apply(c);c.points.forEach(function(g){var h=B(g.yBottom,d),l=999+Math.abs(h),r=v;l=Math.min(Math.max(-l,g.plotY),b.len+l);var m=g.plotX+p,n=t,q=Math.min(l,h),y=Math.max(l,h)-q;if(e&&Math.abs(y)<e){y=e;var E=!b.reversed&&!g.negative||b.reversed&&g.negative;g.y===a&&c.dataMax<=a&&b.min<a&&u!==k&&(E=!E);q=Math.abs(q-d)>e?h-e:d-(E?e:0)}F(g.options.pointWidth)&&(r=n=Math.ceil(g.options.pointWidth),m-=Math.round((r-v)/2));g.barX=
m;g.pointWidth=r;g.tooltipPos=f.inverted?[b.len+b.pos-f.plotLeft-l,c.xAxis.len-m-n/2,y]:[m+n/2,l+b.pos-f.plotTop,y];g.shapeType=c.pointClass.prototype.shapeType||"rect";g.shapeArgs=c.crispCol.apply(c,g.isNull?[m,d,n,0]:[m,q,n,y])})},getSymbol:c.noop,drawLegendSymbol:c.LegendSymbolMixin.drawRectangle,drawGraph:function(){this.group[this.dense?"addClass":"removeClass"]("highcharts-dense-data")},pointAttribs:function(c,f){var h=this.options,g=this.pointAttrToOptions||{};var b=g.stroke||"borderColor";
var a=g["stroke-width"]||"borderWidth",d=c&&c.color||this.color,e=c&&c[b]||h[b]||this.color||d,l=c&&c[a]||h[a]||this[a]||0;g=c&&c.options.dashStyle||h.dashStyle;var n=B(h.opacity,1);if(c&&this.zones.length){var t=c.getZone();d=c.options.color||t&&(t.color||c.nonZonedColor)||this.color;t&&(e=t.borderColor||e,g=t.dashStyle||g,l=t.borderWidth||l)}f&&(c=C(h.states[f],c.options.states&&c.options.states[f]||{}),f=c.brightness,d=c.color||void 0!==f&&v(d).brighten(c.brightness).get()||d,e=c[b]||e,l=c[a]||
l,g=c.dashStyle||g,n=B(c.opacity,n));b={fill:d,stroke:e,"stroke-width":l,opacity:n};g&&(b.dashstyle=g);return b},drawPoints:function(){var c=this,f=this.chart,q=c.options,g=f.renderer,b=q.animationLimit||250,a;c.points.forEach(function(d){var e=d.graphic,l=e&&f.pointCount<b?"animate":"attr";if(z(d.plotY)&&null!==d.y){a=d.shapeArgs;e&&d.hasNewShapeType()&&(e=e.destroy());if(e)e[l](C(a));else d.graphic=e=g[d.shapeType](a).add(d.group||c.group);if(q.borderRadius)e[l]({r:q.borderRadius});f.styledMode||
e[l](c.pointAttribs(d,d.selected&&"select")).shadow(!1!==d.allowShadow&&q.shadow,null,q.stacking&&!q.borderRadius);e.addClass(d.getClassName(),!0)}else e&&(d.graphic=e.destroy())})},animate:function(c){var f=this,h=this.yAxis,g=f.options,b=this.chart.inverted,a={},d=b?"translateX":"translateY";if(y)if(c)a.scaleY=.001,c=Math.min(h.pos+h.len,Math.max(h.pos,h.toPixels(g.threshold))),b?a.translateX=c-h.len:a.translateY=c,f.clipBox&&f.setClip(),f.group.attr(a);else{var e=f.group.attr(d);f.group.animate({scaleY:1},
G(t(f.options.animation),{step:function(b,c){a[d]=e+c.pos*(h.pos-e);f.group.attr(a)}}));f.animate=null}},remove:function(){var c=this,f=c.chart;f.hasRendered&&f.series.forEach(function(f){f.type===c.type&&(f.isDirty=!0)});H.prototype.remove.apply(c,arguments)}});""});M(I,"parts/BarSeries.js",[I["parts/Globals.js"]],function(c){c=c.seriesType;c("bar","column",null,{inverted:!0});""});M(I,"parts/ScatterSeries.js",[I["parts/Globals.js"]],function(c){var f=c.Series,F=c.seriesType;F("scatter","line",{lineWidth:0,
findNearestPointBy:"xy",jitter:{x:0,y:0},marker:{enabled:!0},tooltip:{headerFormat:'<span style="color:{point.color}">\u25cf</span> <span style="font-size: 10px"> {series.name}</span><br/>',pointFormat:"x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"}},{sorted:!1,requireSorting:!1,noSharedTooltip:!0,trackerGroups:["group","markerGroup","dataLabelsGroup"],takeOrdinalPosition:!1,drawGraph:function(){this.options.lineWidth&&f.prototype.drawGraph.call(this)},applyJitter:function(){var c=this,f=this.options.jitter,
B=this.points.length;f&&this.points.forEach(function(t,v){["x","y"].forEach(function(C,z){var y="plot"+C.toUpperCase();if(f[C]&&!t.isNull){var h=c[C+"Axis"];var n=f[C]*h.transA;if(h&&!h.isLog){var q=Math.max(0,t[y]-n);h=Math.min(h.len,t[y]+n);z=1E4*Math.sin(v+z*B);t[y]=q+(h-q)*(z-Math.floor(z));"x"===C&&(t.clientX=t.plotX)}}})})}});c.addEvent(f,"afterTranslate",function(){this.applyJitter&&this.applyJitter()});""});M(I,"mixins/centered-series.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,
f){var F=f.isNumber,G=f.pick,z=c.deg2rad,B=c.relativeLength;c.CenteredSeriesMixin={getCenter:function(){var c=this.options,f=this.chart,C=2*(c.slicedOffset||0),z=f.plotWidth-2*C;f=f.plotHeight-2*C;var y=c.center;y=[G(y[0],"50%"),G(y[1],"50%"),c.size||"100%",c.innerSize||0];var h=Math.min(z,f),n;for(n=0;4>n;++n){var q=y[n];c=2>n||2===n&&/%$/.test(q);y[n]=B(q,[z,f,h,y[2]][n])+(c?C:0)}y[3]>y[2]&&(y[3]=y[2]);return y},getStartAndEndRadians:function(c,f){c=F(c)?c:0;f=F(f)&&f>c&&360>f-c?f:c+360;return{start:z*
(c+-90),end:z*(f+-90)}}}});M(I,"parts/PieSeries.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.defined,G=f.isNumber,z=f.pick,B=f.setAnimation,t=c.addEvent;f=c.CenteredSeriesMixin;var v=f.getStartAndEndRadians,C=c.merge,H=c.noop,y=c.Point,h=c.Series,n=c.seriesType,q=c.fireEvent;n("pie","line",{center:[null,null],clip:!1,colorByPoint:!0,dataLabels:{allowOverlap:!0,connectorPadding:5,distance:30,enabled:!0,formatter:function(){return this.point.isNull?void 0:this.point.name},
softConnector:!0,x:0,connectorShape:"fixedOffset",crookDistance:"70%"},fillColor:void 0,ignoreHiddenPoint:!0,inactiveOtherPoints:!0,legendType:"point",marker:null,size:null,showInLegend:!1,slicedOffset:10,stickyTracking:!1,tooltip:{followPointer:!0},borderColor:"#ffffff",borderWidth:1,lineWidth:void 0,states:{hover:{brightness:.1}}},{isCartesian:!1,requireSorting:!1,directTouch:!0,noSharedTooltip:!0,trackerGroups:["group","dataLabelsGroup"],axisTypes:[],pointAttribs:c.seriesTypes.column.prototype.pointAttribs,
animate:function(c){var b=this,a=b.points,d=b.startAngleRad;c||(a.forEach(function(a){var c=a.graphic,e=a.shapeArgs;c&&(c.attr({r:a.startR||b.center[3]/2,start:d,end:d}),c.animate({r:e.r,start:e.start,end:e.end},b.options.animation))}),b.animate=null)},hasData:function(){return!!this.processedXData.length},updateTotals:function(){var c,b=0,a=this.points,d=a.length,e=this.options.ignoreHiddenPoint;for(c=0;c<d;c++){var f=a[c];b+=e&&!f.visible?0:f.isNull?0:f.y}this.total=b;for(c=0;c<d;c++)f=a[c],f.percentage=
0<b&&(f.visible||!e)?f.y/b*100:0,f.total=b},generatePoints:function(){h.prototype.generatePoints.call(this);this.updateTotals()},getX:function(c,b,a){var d=this.center,e=this.radii?this.radii[a.index]:d[2]/2;return d[0]+(b?-1:1)*Math.cos(Math.asin(Math.max(Math.min((c-d[1])/(e+a.labelDistance),1),-1)))*(e+a.labelDistance)+(0<a.labelDistance?(b?-1:1)*this.options.dataLabels.padding:0)},translate:function(g){this.generatePoints();var b=0,a=this.options,d=a.slicedOffset,e=d+(a.borderWidth||0),f=v(a.startAngle,
a.endAngle),h=this.startAngleRad=f.start;f=(this.endAngleRad=f.end)-h;var n=this.points,p=a.dataLabels.distance;a=a.ignoreHiddenPoint;var u,k=n.length;g||(this.center=g=this.getCenter());for(u=0;u<k;u++){var r=n[u];var x=h+b*f;if(!a||r.visible)b+=r.percentage/100;var A=h+b*f;r.shapeType="arc";r.shapeArgs={x:g[0],y:g[1],r:g[2]/2,innerR:g[3]/2,start:Math.round(1E3*x)/1E3,end:Math.round(1E3*A)/1E3};r.labelDistance=z(r.options.dataLabels&&r.options.dataLabels.distance,p);r.labelDistance=c.relativeLength(r.labelDistance,
r.shapeArgs.r);this.maxLabelDistance=Math.max(this.maxLabelDistance||0,r.labelDistance);A=(A+x)/2;A>1.5*Math.PI?A-=2*Math.PI:A<-Math.PI/2&&(A+=2*Math.PI);r.slicedTranslation={translateX:Math.round(Math.cos(A)*d),translateY:Math.round(Math.sin(A)*d)};var w=Math.cos(A)*g[2]/2;var m=Math.sin(A)*g[2]/2;r.tooltipPos=[g[0]+.7*w,g[1]+.7*m];r.half=A<-Math.PI/2||A>Math.PI/2?1:0;r.angle=A;x=Math.min(e,r.labelDistance/5);r.labelPosition={natural:{x:g[0]+w+Math.cos(A)*r.labelDistance,y:g[1]+m+Math.sin(A)*r.labelDistance},
"final":{},alignment:0>r.labelDistance?"center":r.half?"right":"left",connectorPosition:{breakAt:{x:g[0]+w+Math.cos(A)*x,y:g[1]+m+Math.sin(A)*x},touchingSliceAt:{x:g[0]+w,y:g[1]+m}}}}q(this,"afterTranslate")},drawEmpty:function(){var c=this.options;if(0===this.total){var b=this.center[0];var a=this.center[1];this.graph||(this.graph=this.chart.renderer.circle(b,a,0).addClass("highcharts-graph").add(this.group));this.graph.animate({"stroke-width":c.borderWidth,cx:b,cy:a,r:this.center[2]/2,fill:c.fillColor||
"none",stroke:c.color||"#cccccc"})}else this.graph&&(this.graph=this.graph.destroy())},redrawPoints:function(){var c=this,b=c.chart,a=b.renderer,d,e,f,h,n=c.options.shadow;this.drawEmpty();!n||c.shadowGroup||b.styledMode||(c.shadowGroup=a.g("shadow").attr({zIndex:-1}).add(c.group));c.points.forEach(function(g){var l={};e=g.graphic;if(!g.isNull&&e){h=g.shapeArgs;d=g.getTranslate();if(!b.styledMode){var k=g.shadowGroup;n&&!k&&(k=g.shadowGroup=a.g("shadow").add(c.shadowGroup));k&&k.attr(d);f=c.pointAttribs(g,
g.selected&&"select")}g.delayedRendering?(e.setRadialReference(c.center).attr(h).attr(d),b.styledMode||e.attr(f).attr({"stroke-linejoin":"round"}).shadow(n,k),g.delayedRendering=!1):(e.setRadialReference(c.center),b.styledMode||C(!0,l,f),C(!0,l,h,d),e.animate(l));e.attr({visibility:g.visible?"inherit":"hidden"});e.addClass(g.getClassName())}else e&&(g.graphic=e.destroy())})},drawPoints:function(){var c=this.chart.renderer;this.points.forEach(function(b){b.graphic||(b.graphic=c[b.shapeType](b.shapeArgs).add(b.series.group),
b.delayedRendering=!0)})},searchPoint:H,sortByAngle:function(c,b){c.sort(function(a,d){return void 0!==a.angle&&(d.angle-a.angle)*b})},drawLegendSymbol:c.LegendSymbolMixin.drawRectangle,getCenter:f.getCenter,getSymbol:H,drawGraph:null},{init:function(){y.prototype.init.apply(this,arguments);var c=this;c.name=z(c.name,"Slice");var b=function(a){c.slice("select"===a.type)};t(c,"select",b);t(c,"unselect",b);return c},isValid:function(){return G(this.y)&&0<=this.y},setVisible:function(c,b){var a=this,
d=a.series,e=d.chart,f=d.options.ignoreHiddenPoint;b=z(b,f);c!==a.visible&&(a.visible=a.options.visible=c=void 0===c?!a.visible:c,d.options.data[d.data.indexOf(a)]=a.options,["graphic","dataLabel","connector","shadowGroup"].forEach(function(b){if(a[b])a[b][c?"show":"hide"](!0)}),a.legendItem&&e.legend.colorizeItem(a,c),c||"hover"!==a.state||a.setState(""),f&&(d.isDirty=!0),b&&e.redraw())},slice:function(c,b,a){var d=this.series;B(a,d.chart);z(b,!0);this.sliced=this.options.sliced=F(c)?c:!this.sliced;
d.options.data[d.data.indexOf(this)]=this.options;this.graphic.animate(this.getTranslate());this.shadowGroup&&this.shadowGroup.animate(this.getTranslate())},getTranslate:function(){return this.sliced?this.slicedTranslation:{translateX:0,translateY:0}},haloPath:function(c){var b=this.shapeArgs;return this.sliced||!this.visible?[]:this.series.chart.renderer.symbols.arc(b.x,b.y,b.r+c,b.r+c,{innerR:b.r-1,start:b.start,end:b.end})},connectorShapes:{fixedOffset:function(c,b,a){var d=b.breakAt;b=b.touchingSliceAt;
return["M",c.x,c.y].concat(a.softConnector?["C",c.x+("left"===c.alignment?-5:5),c.y,2*d.x-b.x,2*d.y-b.y,d.x,d.y]:["L",d.x,d.y]).concat(["L",b.x,b.y])},straight:function(c,b){b=b.touchingSliceAt;return["M",c.x,c.y,"L",b.x,b.y]},crookedLine:function(f,b,a){b=b.touchingSliceAt;var d=this.series,e=d.center[0],g=d.chart.plotWidth,h=d.chart.plotLeft;d=f.alignment;var n=this.shapeArgs.r;a=c.relativeLength(a.crookDistance,1);a="left"===d?e+n+(g+h-e-n)*(1-a):h+(e-n)*a;e=["L",a,f.y];if("left"===d?a>f.x||a<
b.x:a<f.x||a>b.x)e=[];return["M",f.x,f.y].concat(e).concat(["L",b.x,b.y])}},getConnectorPath:function(){var c=this.labelPosition,b=this.series.options.dataLabels,a=b.connectorShape,d=this.connectorShapes;d[a]&&(a=d[a]);return a.call(this,{x:c.final.x,y:c.final.y,alignment:c.alignment},c.connectorPosition,b)}});""});M(I,"parts/DataLabels.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.arrayMax,G=f.defined,z=f.extend,B=f.isArray,t=f.objectEach,v=f.pick,C=f.splat,H=c.format,
y=c.merge;f=c.noop;var h=c.relativeLength,n=c.Series,q=c.seriesTypes,g=c.stableSort;c.distribute=function(b,a,d){function e(a,b){return a.target-b.target}var f,h=!0,n=b,p=[];var u=0;var k=n.reducedLen||a;for(f=b.length;f--;)u+=b[f].size;if(u>k){g(b,function(a,b){return(b.rank||0)-(a.rank||0)});for(u=f=0;u<=k;)u+=b[f].size,f++;p=b.splice(f-1,b.length)}g(b,e);for(b=b.map(function(a){return{size:a.size,targets:[a.target],align:v(a.align,.5)}});h;){for(f=b.length;f--;)h=b[f],u=(Math.min.apply(0,h.targets)+
Math.max.apply(0,h.targets))/2,h.pos=Math.min(Math.max(0,u-h.size*h.align),a-h.size);f=b.length;for(h=!1;f--;)0<f&&b[f-1].pos+b[f-1].size>b[f].pos&&(b[f-1].size+=b[f].size,b[f-1].targets=b[f-1].targets.concat(b[f].targets),b[f-1].align=.5,b[f-1].pos+b[f-1].size>a&&(b[f-1].pos=a-b[f-1].size),b.splice(f,1),h=!0)}n.push.apply(n,p);f=0;b.some(function(b){var e=0;if(b.targets.some(function(){n[f].pos=b.pos+e;if(Math.abs(n[f].pos-n[f].target)>d)return n.slice(0,f+1).forEach(function(a){delete a.pos}),n.reducedLen=
(n.reducedLen||a)-.1*a,n.reducedLen>.1*a&&c.distribute(n,a,d),!0;e+=n[f].size;f++}))return!0});g(n,e)};n.prototype.drawDataLabels=function(){function b(a,b){var d=b.filter;return d?(b=d.operator,a=a[d.property],d=d.value,">"===b&&a>d||"<"===b&&a<d||">="===b&&a>=d||"<="===b&&a<=d||"=="===b&&a==d||"==="===b&&a===d?!0:!1):!0}function a(a,b){var d=[],c;if(B(a)&&!B(b))d=a.map(function(a){return y(a,b)});else if(B(b)&&!B(a))d=b.map(function(b){return y(a,b)});else if(B(a)||B(b))for(c=Math.max(a.length,
b.length);c--;)d[c]=y(a[c],b[c]);else d=y(a,b);return d}var d=this,e=d.chart,f=d.options,g=f.dataLabels,h=d.points,p,n=d.hasRendered||0,k=c.animObject(f.animation).duration,r=Math.min(k,200),q=!e.renderer.forExport&&v(g.defer,0<r),A=e.renderer;g=a(a(e.options.plotOptions&&e.options.plotOptions.series&&e.options.plotOptions.series.dataLabels,e.options.plotOptions&&e.options.plotOptions[d.type]&&e.options.plotOptions[d.type].dataLabels),g);c.fireEvent(this,"drawDataLabels");if(B(g)||g.enabled||d._hasPointLabels){var w=
d.plotGroup("dataLabelsGroup","data-labels",q&&!n?"hidden":"inherit",g.zIndex||6);q&&(w.attr({opacity:+n}),n||setTimeout(function(){var a=d.dataLabelsGroup;a&&(d.visible&&w.show(!0),a[f.animation?"animate":"attr"]({opacity:1},{duration:r}))},k-r));h.forEach(function(c){p=C(a(g,c.dlOptions||c.options&&c.options.dataLabels));p.forEach(function(a,g){var k=a.enabled&&(!c.isNull||c.dataLabelOnNull)&&b(c,a),h=c.dataLabels?c.dataLabels[g]:c.dataLabel,l=c.connectors?c.connectors[g]:c.connector,p=v(a.distance,
c.labelDistance),m=!h;if(k){var r=c.getLabelConfig();var n=v(a[c.formatPrefix+"Format"],a.format);r=G(n)?H(n,r,e.time):(a[c.formatPrefix+"Formatter"]||a.formatter).call(r,a);n=a.style;var u=a.rotation;e.styledMode||(n.color=v(a.color,n.color,d.color,"#000000"),"contrast"===n.color&&(c.contrastColor=A.getContrast(c.color||d.color),n.color=!G(p)&&a.inside||0>p||f.stacking?c.contrastColor:"#000000"),f.cursor&&(n.cursor=f.cursor));var q={r:a.borderRadius||0,rotation:u,padding:a.padding,zIndex:1};e.styledMode||
(q.fill=a.backgroundColor,q.stroke=a.borderColor,q["stroke-width"]=a.borderWidth);t(q,function(a,b){void 0===a&&delete q[b]})}!h||k&&G(r)?k&&G(r)&&(h?q.text=r:(c.dataLabels=c.dataLabels||[],h=c.dataLabels[g]=u?A.text(r,0,-9999).addClass("highcharts-data-label"):A.label(r,0,-9999,a.shape,null,null,a.useHTML,null,"data-label"),g||(c.dataLabel=h),h.addClass(" highcharts-data-label-color-"+c.colorIndex+" "+(a.className||"")+(a.useHTML?" highcharts-tracker":""))),h.options=a,h.attr(q),e.styledMode||h.css(n).shadow(a.shadow),
h.added||h.add(w),a.textPath&&!a.useHTML&&h.setTextPath(c.getDataLabelPath&&c.getDataLabelPath(h)||c.graphic,a.textPath),d.alignDataLabel(c,h,a,null,m)):(c.dataLabel=c.dataLabel&&c.dataLabel.destroy(),c.dataLabels&&(1===c.dataLabels.length?delete c.dataLabels:delete c.dataLabels[g]),g||delete c.dataLabel,l&&(c.connector=c.connector.destroy(),c.connectors&&(1===c.connectors.length?delete c.connectors:delete c.connectors[g])))})})}c.fireEvent(this,"afterDrawDataLabels")};n.prototype.alignDataLabel=
function(b,a,d,c,f){var e=this.chart,g=this.isCartesian&&e.inverted,h=v(b.dlBox&&b.dlBox.centerX,b.plotX,-9999),l=v(b.plotY,-9999),k=a.getBBox(),n=d.rotation,q=d.align,A=this.visible&&(b.series.forceDL||e.isInsidePlot(h,Math.round(l),g)||c&&e.isInsidePlot(h,g?c.x+1:c.y+c.height-1,g)),w="justify"===v(d.overflow,"justify");if(A){var m=e.renderer.fontMetrics(e.styledMode?void 0:d.style.fontSize,a).b;c=z({x:g?this.yAxis.len-l:h,y:Math.round(g?this.xAxis.len-h:l),width:0,height:0},c);z(d,{width:k.width,
height:k.height});n?(w=!1,h=e.renderer.rotCorr(m,n),h={x:c.x+d.x+c.width/2+h.x,y:c.y+d.y+{top:0,middle:.5,bottom:1}[d.verticalAlign]*c.height},a[f?"attr":"animate"](h).attr({align:q}),l=(n+720)%360,l=180<l&&360>l,"left"===q?h.y-=l?k.height:0:"center"===q?(h.x-=k.width/2,h.y-=k.height/2):"right"===q&&(h.x-=k.width,h.y-=l?0:k.height),a.placed=!0,a.alignAttr=h):(a.align(d,null,c),h=a.alignAttr);w&&0<=c.height?this.justifyDataLabel(a,d,h,k,c,f):v(d.crop,!0)&&(A=e.isInsidePlot(h.x,h.y)&&e.isInsidePlot(h.x+
k.width,h.y+k.height));if(d.shape&&!n)a[f?"attr":"animate"]({anchorX:g?e.plotWidth-b.plotY:b.plotX,anchorY:g?e.plotHeight-b.plotX:b.plotY})}A||(a.hide(!0),a.placed=!1)};n.prototype.justifyDataLabel=function(b,a,d,c,f,g){var e=this.chart,h=a.align,l=a.verticalAlign,k=b.box?0:b.padding||0;var n=d.x+k;if(0>n){"right"===h?(a.align="left",a.inside=!0):a.x=-n;var q=!0}n=d.x+c.width-k;n>e.plotWidth&&("left"===h?(a.align="right",a.inside=!0):a.x=e.plotWidth-n,q=!0);n=d.y+k;0>n&&("bottom"===l?(a.verticalAlign=
"top",a.inside=!0):a.y=-n,q=!0);n=d.y+c.height-k;n>e.plotHeight&&("top"===l?(a.verticalAlign="bottom",a.inside=!0):a.y=e.plotHeight-n,q=!0);q&&(b.placed=!g,b.align(a,null,f));return q};q.pie&&(q.pie.prototype.dataLabelPositioners={radialDistributionY:function(b){return b.top+b.distributeBox.pos},radialDistributionX:function(b,a,d,c){return b.getX(d<a.top+2||d>a.bottom-2?c:d,a.half,a)},justify:function(b,a,d){return d[0]+(b.half?-1:1)*(a+b.labelDistance)},alignToPlotEdges:function(b,a,d,c){b=b.getBBox().width;
return a?b+c:d-b-c},alignToConnectors:function(b,a,d,c){var e=0,f;b.forEach(function(a){f=a.dataLabel.getBBox().width;f>e&&(e=f)});return a?e+c:d-e-c}},q.pie.prototype.drawDataLabels=function(){var b=this,a=b.data,d,e=b.chart,f=b.options.dataLabels,g=f.connectorPadding,h,p=e.plotWidth,u=e.plotHeight,k=e.plotLeft,r=Math.round(e.chartWidth/3),q,A=b.center,w=A[2]/2,m=A[1],t,z,C,B,H=[[],[]],I,D,N,M,R=[0,0,0,0],P=b.dataLabelPositioners,W;b.visible&&(f.enabled||b._hasPointLabels)&&(a.forEach(function(a){a.dataLabel&&
a.visible&&a.dataLabel.shortened&&(a.dataLabel.attr({width:"auto"}).css({width:"auto",textOverflow:"clip"}),a.dataLabel.shortened=!1)}),n.prototype.drawDataLabels.apply(b),a.forEach(function(a){a.dataLabel&&(a.visible?(H[a.half].push(a),a.dataLabel._pos=null,!G(f.style.width)&&!G(a.options.dataLabels&&a.options.dataLabels.style&&a.options.dataLabels.style.width)&&a.dataLabel.getBBox().width>r&&(a.dataLabel.css({width:.7*r}),a.dataLabel.shortened=!0)):(a.dataLabel=a.dataLabel.destroy(),a.dataLabels&&
1===a.dataLabels.length&&delete a.dataLabels))}),H.forEach(function(a,h){var l=a.length,n=[],r;if(l){b.sortByAngle(a,h-.5);if(0<b.maxLabelDistance){var q=Math.max(0,m-w-b.maxLabelDistance);var x=Math.min(m+w+b.maxLabelDistance,e.plotHeight);a.forEach(function(a){0<a.labelDistance&&a.dataLabel&&(a.top=Math.max(0,m-w-a.labelDistance),a.bottom=Math.min(m+w+a.labelDistance,e.plotHeight),r=a.dataLabel.getBBox().height||21,a.distributeBox={target:a.labelPosition.natural.y-a.top+r/2,size:r,rank:a.y},n.push(a.distributeBox))});
q=x+r-q;c.distribute(n,q,q/5)}for(M=0;M<l;M++){d=a[M];C=d.labelPosition;t=d.dataLabel;N=!1===d.visible?"hidden":"inherit";D=q=C.natural.y;n&&G(d.distributeBox)&&(void 0===d.distributeBox.pos?N="hidden":(B=d.distributeBox.size,D=P.radialDistributionY(d)));delete d.positionIndex;if(f.justify)I=P.justify(d,w,A);else switch(f.alignTo){case "connectors":I=P.alignToConnectors(a,h,p,k);break;case "plotEdges":I=P.alignToPlotEdges(t,h,p,k);break;default:I=P.radialDistributionX(b,d,D,q)}t._attr={visibility:N,
align:C.alignment};t._pos={x:I+f.x+({left:g,right:-g}[C.alignment]||0),y:D+f.y-10};C.final.x=I;C.final.y=D;v(f.crop,!0)&&(z=t.getBBox().width,q=null,I-z<g&&1===h?(q=Math.round(z-I+g),R[3]=Math.max(q,R[3])):I+z>p-g&&0===h&&(q=Math.round(I+z-p+g),R[1]=Math.max(q,R[1])),0>D-B/2?R[0]=Math.max(Math.round(-D+B/2),R[0]):D+B/2>u&&(R[2]=Math.max(Math.round(D+B/2-u),R[2])),t.sideOverflow=q)}}}),0===F(R)||this.verifyDataLabelOverflow(R))&&(this.placeDataLabels(),this.points.forEach(function(a){W=y(f,a.options.dataLabels);
if(h=v(W.connectorWidth,1)){var d;q=a.connector;if((t=a.dataLabel)&&t._pos&&a.visible&&0<a.labelDistance){N=t._attr.visibility;if(d=!q)a.connector=q=e.renderer.path().addClass("highcharts-data-label-connector  highcharts-color-"+a.colorIndex+(a.className?" "+a.className:"")).add(b.dataLabelsGroup),e.styledMode||q.attr({"stroke-width":h,stroke:W.connectorColor||a.color||"#666666"});q[d?"attr":"animate"]({d:a.getConnectorPath()});q.attr("visibility",N)}else q&&(a.connector=q.destroy())}}))},q.pie.prototype.placeDataLabels=
function(){this.points.forEach(function(b){var a=b.dataLabel,d;a&&b.visible&&((d=a._pos)?(a.sideOverflow&&(a._attr.width=Math.max(a.getBBox().width-a.sideOverflow,0),a.css({width:a._attr.width+"px",textOverflow:(this.options.dataLabels.style||{}).textOverflow||"ellipsis"}),a.shortened=!0),a.attr(a._attr),a[a.moved?"animate":"attr"](d),a.moved=!0):a&&a.attr({y:-9999}));delete b.distributeBox},this)},q.pie.prototype.alignDataLabel=f,q.pie.prototype.verifyDataLabelOverflow=function(b){var a=this.center,
d=this.options,c=d.center,f=d.minSize||80,g=null!==d.size;if(!g){if(null!==c[0])var n=Math.max(a[2]-Math.max(b[1],b[3]),f);else n=Math.max(a[2]-b[1]-b[3],f),a[0]+=(b[3]-b[1])/2;null!==c[1]?n=Math.max(Math.min(n,a[2]-Math.max(b[0],b[2])),f):(n=Math.max(Math.min(n,a[2]-b[0]-b[2]),f),a[1]+=(b[0]-b[2])/2);n<a[2]?(a[2]=n,a[3]=Math.min(h(d.innerSize||0,n),n),this.translate(a),this.drawDataLabels&&this.drawDataLabels()):g=!0}return g});q.column&&(q.column.prototype.alignDataLabel=function(b,a,d,c,f){var e=
this.chart.inverted,g=b.series,h=b.dlBox||b.shapeArgs,l=v(b.below,b.plotY>v(this.translatedThreshold,g.yAxis.len)),k=v(d.inside,!!this.options.stacking);h&&(c=y(h),0>c.y&&(c.height+=c.y,c.y=0),h=c.y+c.height-g.yAxis.len,0<h&&(c.height-=h),e&&(c={x:g.yAxis.len-c.y-c.height,y:g.xAxis.len-c.x-c.width,width:c.height,height:c.width}),k||(e?(c.x+=l?0:c.width,c.width=0):(c.y+=l?c.height:0,c.height=0)));d.align=v(d.align,!e||k?"center":l?"right":"left");d.verticalAlign=v(d.verticalAlign,e||k?"middle":l?"top":
"bottom");n.prototype.alignDataLabel.call(this,b,a,d,c,f);d.inside&&b.contrastColor&&a.css({color:b.contrastColor})})});M(I,"modules/overlapping-datalabels.src.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.isArray,G=f.objectEach,z=f.pick;f=c.Chart;var B=c.addEvent,t=c.fireEvent;B(f,"render",function(){var c=[];(this.labelCollectors||[]).forEach(function(f){c=c.concat(f())});(this.yAxis||[]).forEach(function(f){f.options.stackLabels&&!f.options.stackLabels.allowOverlap&&
G(f.stacks,function(f){G(f,function(f){c.push(f.label)})})});(this.series||[]).forEach(function(f){var v=f.options.dataLabels;f.visible&&(!1!==v.enabled||f._hasPointLabels)&&f.points.forEach(function(f){f.visible&&(F(f.dataLabels)?f.dataLabels:f.dataLabel?[f.dataLabel]:[]).forEach(function(h){var n=h.options;h.labelrank=z(n.labelrank,f.labelrank,f.shapeArgs&&f.shapeArgs.height);n.allowOverlap||c.push(h)})})});this.hideOverlappingLabels(c)});f.prototype.hideOverlappingLabels=function(c){var f=this,
v=c.length,y=f.renderer,h,n,q;var g=function(a){var b=a.box?0:a.padding||0;var d=0;if(a&&(!a.alignAttr||a.placed)){var c=a.attr("x");var f=a.attr("y");c="number"===typeof c&&"number"===typeof f?{x:c,y:f}:a.alignAttr;f=a.parentGroup;a.width||(d=a.getBBox(),a.width=d.width,a.height=d.height,d=y.fontMetrics(null,a.element).h);return{x:c.x+(f.translateX||0)+b,y:c.y+(f.translateY||0)+b-d,width:a.width-2*b,height:a.height-2*b}}};for(n=0;n<v;n++)if(h=c[n])h.oldOpacity=h.opacity,h.newOpacity=1,h.absoluteBox=
g(h);c.sort(function(a,b){return(b.labelrank||0)-(a.labelrank||0)});for(n=0;n<v;n++){var b=(g=c[n])&&g.absoluteBox;for(h=n+1;h<v;++h){var a=(q=c[h])&&q.absoluteBox;!b||!a||g===q||0===g.newOpacity||0===q.newOpacity||a.x>b.x+b.width||a.x+a.width<b.x||a.y>b.y+b.height||a.y+a.height<b.y||((g.labelrank<q.labelrank?g:q).newOpacity=0)}}c.forEach(function(a){var b;if(a){var d=a.newOpacity;a.oldOpacity!==d&&(a.alignAttr&&a.placed?(d?a.show(!0):b=function(){a.hide(!0);a.placed=!1},a.alignAttr.opacity=d,a[a.isOld?
"animate":"attr"](a.alignAttr,null,b),t(f,"afterHideOverlappingLabels")):a.attr({opacity:d}));a.isOld=!0}})}});M(I,"parts/Interaction.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.defined,G=f.extend,z=f.isArray,B=f.isObject,t=f.objectEach,v=f.pick,C=c.addEvent;f=c.Chart;var H=c.createElement,y=c.css,h=c.defaultOptions,n=c.defaultPlotOptions,q=c.fireEvent,g=c.hasTouch,b=c.Legend,a=c.merge,d=c.Point,e=c.Series,l=c.seriesTypes,I=c.svg;var E=c.TrackerMixin={drawTrackerPoint:function(){var a=
this,b=a.chart,d=b.pointer,c=function(a){var b=d.getPointFromEvent(a);void 0!==b&&(d.isDirectTouch=!0,b.onMouseOver(a))},e;a.points.forEach(function(a){e=z(a.dataLabels)?a.dataLabels:a.dataLabel?[a.dataLabel]:[];a.graphic&&(a.graphic.element.point=a);e.forEach(function(b){b.div?b.div.point=a:b.element.point=a})});a._hasTracking||(a.trackerGroups.forEach(function(e){if(a[e]){a[e].addClass("highcharts-tracker").on("mouseover",c).on("mouseout",function(a){d.onTrackerMouseOut(a)});if(g)a[e].on("touchstart",
c);!b.styledMode&&a.options.cursor&&a[e].css(y).css({cursor:a.options.cursor})}}),a._hasTracking=!0);q(this,"afterDrawTracker")},drawTrackerGraph:function(){var a=this,b=a.options,d=b.trackByArea,c=[].concat(d?a.areaPath:a.graphPath),e=c.length,f=a.chart,h=f.pointer,l=f.renderer,n=f.options.tooltip.snap,v=a.tracker,t,y=function(){if(f.hoverSeries!==a)a.onMouseOver()},z="rgba(192,192,192,"+(I?.0001:.002)+")";if(e&&!d)for(t=e+1;t--;)"M"===c[t]&&c.splice(t+1,0,c[t+1]-n,c[t+2],"L"),(t&&"M"===c[t]||t===
e)&&c.splice(t,0,"L",c[t-2]+n,c[t-1]);v?v.attr({d:c}):a.graph&&(a.tracker=l.path(c).attr({visibility:a.visible?"visible":"hidden",zIndex:2}).addClass(d?"highcharts-tracker-area":"highcharts-tracker-line").add(a.group),f.styledMode||a.tracker.attr({"stroke-linejoin":"round",stroke:z,fill:d?z:"none","stroke-width":a.graph.strokeWidth()+(d?0:2*n)}),[a.tracker,a.markerGroup].forEach(function(a){a.addClass("highcharts-tracker").on("mouseover",y).on("mouseout",function(a){h.onTrackerMouseOut(a)});b.cursor&&
!f.styledMode&&a.css({cursor:b.cursor});if(g)a.on("touchstart",y)}));q(this,"afterDrawTracker")}};l.column&&(l.column.prototype.drawTracker=E.drawTrackerPoint);l.pie&&(l.pie.prototype.drawTracker=E.drawTrackerPoint);l.scatter&&(l.scatter.prototype.drawTracker=E.drawTrackerPoint);G(b.prototype,{setItemEvents:function(b,c,e){var f=this,g=f.chart.renderer.boxWrapper,k=b instanceof d,h="highcharts-legend-"+(k?"point":"series")+"-active",l=f.chart.styledMode;(e?c:b.legendGroup).on("mouseover",function(){b.visible&&
f.allItems.forEach(function(a){b!==a&&a.setState("inactive",!k)});b.setState("hover");b.visible&&g.addClass(h);l||c.css(f.options.itemHoverStyle)}).on("mouseout",function(){f.chart.styledMode||c.css(a(b.visible?f.itemStyle:f.itemHiddenStyle));f.allItems.forEach(function(a){b!==a&&a.setState("",!k)});g.removeClass(h);b.setState()}).on("click",function(a){var c=function(){b.setVisible&&b.setVisible();f.allItems.forEach(function(a){b!==a&&a.setState(b.visible?"inactive":"",!k)})};g.removeClass(h);a=
{browserEvent:a};b.firePointEvent?b.firePointEvent("legendItemClick",a,c):q(b,"legendItemClick",a,c)})},createCheckboxForItem:function(a){a.checkbox=H("input",{type:"checkbox",className:"highcharts-legend-checkbox",checked:a.selected,defaultChecked:a.selected},this.options.itemCheckboxStyle,this.chart.container);C(a.checkbox,"click",function(b){q(a.series||a,"checkboxClick",{checked:b.target.checked,item:a},function(){a.select()})})}});G(f.prototype,{showResetZoom:function(){function a(){b.zoomOut()}
var b=this,c=h.lang,d=b.options.chart.resetZoomButton,e=d.theme,f=e.states,g="chart"===d.relativeTo||"spaceBox"===d.relativeTo?null:"plotBox";q(this,"beforeShowResetZoom",null,function(){b.resetZoomButton=b.renderer.button(c.resetZoom,null,null,a,e,f&&f.hover).attr({align:d.position.align,title:c.resetZoomTitle}).addClass("highcharts-reset-zoom").add().align(d.position,!1,g)});q(this,"afterShowResetZoom")},zoomOut:function(){q(this,"selection",{resetSelection:!0},this.zoom)},zoom:function(a){var b=
this,c,d=b.pointer,e=!1,f=b.inverted?d.mouseDownX:d.mouseDownY;!a||a.resetSelection?(b.axes.forEach(function(a){c=a.zoom()}),d.initiated=!1):a.xAxis.concat(a.yAxis).forEach(function(a){var g=a.axis,k=b.inverted?g.left:g.top,h=b.inverted?k+g.width:k+g.height,l=g.isXAxis,m=!1;if(!l&&f>=k&&f<=h||l||!F(f))m=!0;d[l?"zoomX":"zoomY"]&&m&&(c=g.zoom(a.min,a.max),g.displayBtn&&(e=!0))});var g=b.resetZoomButton;e&&!g?b.showResetZoom():!e&&B(g)&&(b.resetZoomButton=g.destroy());c&&b.redraw(v(b.options.chart.animation,
a&&a.animation,100>b.pointCount))},pan:function(a,b){var c=this,d=c.hoverPoints,e;q(this,"pan",{originalEvent:a},function(){d&&d.forEach(function(a){a.setState()});("xy"===b?[1,0]:[1]).forEach(function(b){b=c[b?"xAxis":"yAxis"][0];var d=b.horiz,f=a[d?"chartX":"chartY"];d=d?"mouseDownX":"mouseDownY";var g=c[d],k=(b.pointRange||0)/2,h=b.reversed&&!c.inverted||!b.reversed&&c.inverted?-1:1,l=b.getExtremes(),p=b.toValue(g-f,!0)+k*h;h=b.toValue(g+b.len-f,!0)-k*h;var n=h<p;g=n?h:p;p=n?p:h;h=Math.min(l.dataMin,
k?l.min:b.toValue(b.toPixels(l.min)-b.minPixelPadding));k=Math.max(l.dataMax,k?l.max:b.toValue(b.toPixels(l.max)+b.minPixelPadding));n=h-g;0<n&&(p+=n,g=h);n=p-k;0<n&&(p=k,g-=n);b.series.length&&g!==l.min&&p!==l.max&&(b.setExtremes(g,p,!1,!1,{trigger:"pan"}),e=!0);c[d]=f});e&&c.redraw(!1);y(c.container,{cursor:"move"})})}});G(d.prototype,{select:function(a,b){var c=this,d=c.series,e=d.chart;this.selectedStaging=a=v(a,!c.selected);c.firePointEvent(a?"select":"unselect",{accumulate:b},function(){c.selected=
c.options.selected=a;d.options.data[d.data.indexOf(c)]=c.options;c.setState(a&&"select");b||e.getSelectedPoints().forEach(function(a){var b=a.series;a.selected&&a!==c&&(a.selected=a.options.selected=!1,b.options.data[b.data.indexOf(a)]=a.options,a.setState(e.hoverPoints&&b.options.inactiveOtherPoints?"inactive":""),a.firePointEvent("unselect"))})});delete this.selectedStaging},onMouseOver:function(a){var b=this.series.chart,c=b.pointer;a=a?c.normalize(a):c.getChartCoordinatesFromPoint(this,b.inverted);
c.runPointActions(a,this)},onMouseOut:function(){var a=this.series.chart;this.firePointEvent("mouseOut");this.series.options.inactiveOtherPoints||(a.hoverPoints||[]).forEach(function(a){a.setState()});a.hoverPoints=a.hoverPoint=null},importEvents:function(){if(!this.hasImportedEvents){var b=this,d=a(b.series.options.point,b.options).events;b.events=d;t(d,function(a,d){c.isFunction(a)&&C(b,d,a)});this.hasImportedEvents=!0}},setState:function(a,b){var c=this.series,d=this.state,e=c.options.states[a||
"normal"]||{},f=n[c.type].marker&&c.options.marker,g=f&&!1===f.enabled,h=f&&f.states&&f.states[a||"normal"]||{},l=!1===h.enabled,p=c.stateMarkerGraphic,u=this.marker||{},t=c.chart,y=c.halo,z,B=f&&c.markerAttribs;a=a||"";if(!(a===this.state&&!b||this.selected&&"select"!==a||!1===e.enabled||a&&(l||g&&!1===h.enabled)||a&&u.states&&u.states[a]&&!1===u.states[a].enabled)){this.state=a;B&&(z=c.markerAttribs(this,a));if(this.graphic){d&&this.graphic.removeClass("highcharts-point-"+d);a&&this.graphic.addClass("highcharts-point-"+
a);if(!t.styledMode){var C=c.pointAttribs(this,a);var H=v(t.options.chart.animation,e.animation);c.options.inactiveOtherPoints&&((this.dataLabels||[]).forEach(function(a){a&&a.animate({opacity:C.opacity},H)}),this.connector&&this.connector.animate({opacity:C.opacity},H));this.graphic.animate(C,H)}z&&this.graphic.animate(z,v(t.options.chart.animation,h.animation,f.animation));p&&p.hide()}else{if(a&&h){d=u.symbol||c.symbol;p&&p.currentSymbol!==d&&(p=p.destroy());if(z)if(p)p[b?"animate":"attr"]({x:z.x,
y:z.y});else d&&(c.stateMarkerGraphic=p=t.renderer.symbol(d,z.x,z.y,z.width,z.height).add(c.markerGroup),p.currentSymbol=d);!t.styledMode&&p&&p.attr(c.pointAttribs(this,a))}p&&(p[a&&this.isInside?"show":"hide"](),p.element.point=this)}a=e.halo;e=(p=this.graphic||p)&&p.visibility||"inherit";a&&a.size&&p&&"hidden"!==e?(y||(c.halo=y=t.renderer.path().add(p.parentGroup)),y.show()[b?"animate":"attr"]({d:this.haloPath(a.size)}),y.attr({"class":"highcharts-halo highcharts-color-"+v(this.colorIndex,c.colorIndex)+
(this.className?" "+this.className:""),visibility:e,zIndex:-1}),y.point=this,t.styledMode||y.attr(G({fill:this.color||c.color,"fill-opacity":a.opacity},a.attributes))):y&&y.point&&y.point.haloPath&&y.animate({d:y.point.haloPath(0)},null,y.hide);q(this,"afterSetState")}},haloPath:function(a){return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX)-a,this.plotY-a,2*a,2*a)}});G(e.prototype,{onMouseOver:function(){var a=this.chart,b=a.hoverSeries;if(b&&b!==this)b.onMouseOut();this.options.events.mouseOver&&
q(this,"mouseOver");this.setState("hover");a.hoverSeries=this},onMouseOut:function(){var a=this.options,b=this.chart,c=b.tooltip,d=b.hoverPoint;b.hoverSeries=null;if(d)d.onMouseOut();this&&a.events.mouseOut&&q(this,"mouseOut");!c||this.stickyTracking||c.shared&&!this.noSharedTooltip||c.hide();b.series.forEach(function(a){a.setState("",!0)})},setState:function(a,b){var c=this,d=c.options,e=c.graph,f=d.inactiveOtherPoints,g=d.states,h=d.lineWidth,l=d.opacity,n=v(g[a||"normal"]&&g[a||"normal"].animation,
c.chart.options.chart.animation);d=0;a=a||"";if(c.state!==a&&([c.group,c.markerGroup,c.dataLabelsGroup].forEach(function(b){b&&(c.state&&b.removeClass("highcharts-series-"+c.state),a&&b.addClass("highcharts-series-"+a))}),c.state=a,!c.chart.styledMode)){if(g[a]&&!1===g[a].enabled)return;a&&(h=g[a].lineWidth||h+(g[a].lineWidthPlus||0),l=v(g[a].opacity,l));if(e&&!e.dashstyle)for(g={"stroke-width":h},e.animate(g,n);c["zone-graph-"+d];)c["zone-graph-"+d].attr(g),d+=1;f||[c.group,c.markerGroup,c.dataLabelsGroup,
c.labelBySeries].forEach(function(a){a&&a.animate({opacity:l},n)})}b&&f&&c.points&&c.setAllPointsToState(a)},setAllPointsToState:function(a){this.points.forEach(function(b){b.setState&&b.setState(a)})},setVisible:function(a,b){var c=this,d=c.chart,e=c.legendItem,f=d.options.chart.ignoreHiddenSeries,g=c.visible;var h=(c.visible=a=c.options.visible=c.userOptions.visible=void 0===a?!g:a)?"show":"hide";["group","dataLabelsGroup","markerGroup","tracker","tt"].forEach(function(a){if(c[a])c[a][h]()});if(d.hoverSeries===
c||(d.hoverPoint&&d.hoverPoint.series)===c)c.onMouseOut();e&&d.legend.colorizeItem(c,a);c.isDirty=!0;c.options.stacking&&d.series.forEach(function(a){a.options.stacking&&a.visible&&(a.isDirty=!0)});c.linkedSeries.forEach(function(b){b.setVisible(a,!1)});f&&(d.isDirtyBox=!0);q(c,h);!1!==b&&d.redraw()},show:function(){this.setVisible(!0)},hide:function(){this.setVisible(!1)},select:function(a){this.selected=a=this.options.selected=void 0===a?!this.selected:a;this.checkbox&&(this.checkbox.checked=a);
q(this,a?"select":"unselect")},drawTracker:E.drawTrackerGraph})});M(I,"parts/Responsive.js",[I["parts/Globals.js"],I["parts/Utilities.js"]],function(c,f){var F=f.isArray,G=f.isObject,z=f.objectEach,B=f.pick,t=f.splat;f=c.Chart;f.prototype.setResponsive=function(f,t){var v=this.options.responsive,y=[],h=this.currentResponsive;!t&&v&&v.rules&&v.rules.forEach(function(f){void 0===f._id&&(f._id=c.uniqueKey());this.matchResponsiveRule(f,y)},this);t=c.merge.apply(0,y.map(function(f){return c.find(v.rules,
function(c){return c._id===f}).chartOptions}));t.isResponsiveOptions=!0;y=y.toString()||void 0;y!==(h&&h.ruleIds)&&(h&&this.update(h.undoOptions,f,!0),y?(h=this.currentOptions(t),h.isResponsiveOptions=!0,this.currentResponsive={ruleIds:y,mergedOptions:t,undoOptions:h},this.update(t,f,!0)):this.currentResponsive=void 0)};f.prototype.matchResponsiveRule=function(c,f){var t=c.condition;(t.callback||function(){return this.chartWidth<=B(t.maxWidth,Number.MAX_VALUE)&&this.chartHeight<=B(t.maxHeight,Number.MAX_VALUE)&&
this.chartWidth>=B(t.minWidth,0)&&this.chartHeight>=B(t.minHeight,0)}).call(this)&&f.push(c._id)};f.prototype.currentOptions=function(c){function f(c,n,q,g){var b;z(c,function(a,c){if(!g&&-1<v.collectionsWithUpdate.indexOf(c))for(a=t(a),q[c]=[],b=0;b<a.length;b++)n[c][b]&&(q[c][b]={},f(a[b],n[c][b],q[c][b],g+1));else G(a)?(q[c]=F(a)?[]:{},f(a,n[c]||{},q[c],g+1)):q[c]=void 0===n[c]?null:n[c]})}var v=this,y={};f(c,this.options,y,0);return y}});M(I,"masters/highcharts.src.js",[I["parts/Globals.js"],
I["parts/Utilities.js"]],function(c,f){var F=f.extend;F(c,{arrayMax:f.arrayMax,arrayMin:f.arrayMin,attr:f.attr,defined:f.defined,erase:f.erase,extend:f.extend,isArray:f.isArray,isClass:f.isClass,isDOMElement:f.isDOMElement,isNumber:f.isNumber,isObject:f.isObject,isString:f.isString,objectEach:f.objectEach,pick:f.pick,pInt:f.pInt,setAnimation:f.setAnimation,splat:f.splat,syncTimeout:f.syncTimeout});return c});I["masters/highcharts.src.js"]._modules=I;return I["masters/highcharts.src.js"]});

},{}],8:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v3.4.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2019-05-01T21:04Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};




	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.4.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a global context
	globalEval: function( code, options ) {
		DOMEval( code, { nonce: options && options.nonce } );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.4
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2019-04-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) &&

				// Support: IE 8 only
				// Exclude object elements
				(nodeType !== 1 || context.nodeName.toLowerCase() !== "object") ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 && rdescend.test( selector ) ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem.namespaceURI,
		docElem = (elem.ownerDocument || elem).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( typeof elem.contentDocument !== "undefined" ) {
			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();
						return result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								} );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Fall back to offsetWidth/offsetHeight when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	// Support: Android <=4.1 - 4.3 only
	// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
	// Support: IE 9-11 only
	// Also use offsetWidth/offsetHeight for when box sizing is unreliable
	// We use getClientRects() to check for hidden/disconnected.
	// In those cases, the computed value can be trusted to be border-box
	if ( ( !support.boxSizingReliable() && isBorderBox ||
		val === "auto" ||
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
					jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = Date.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url, options ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{}],9:[function(require,module,exports){
/* @license
Papa Parse
v5.1.0
https://github.com/mholt/PapaParse
License: MIT
*/
!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof module&&"undefined"!=typeof exports?module.exports=t():e.Papa=t()}(this,function s(){"use strict";var f="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==f?f:{};var n=!f.document&&!!f.postMessage,o=n&&/blob:/i.test((f.location||{}).protocol),a={},h=0,b={parse:function(e,t){var r=(t=t||{}).dynamicTyping||!1;q(r)&&(t.dynamicTypingFunction=r,r={});if(t.dynamicTyping=r,t.transform=!!q(t.transform)&&t.transform,t.worker&&b.WORKERS_SUPPORTED){var i=function(){if(!b.WORKERS_SUPPORTED)return!1;var e=(r=f.URL||f.webkitURL||null,i=s.toString(),b.BLOB_URL||(b.BLOB_URL=r.createObjectURL(new Blob(["(",i,")();"],{type:"text/javascript"})))),t=new f.Worker(e);var r,i;return t.onmessage=_,t.id=h++,a[t.id]=t}();return i.userStep=t.step,i.userChunk=t.chunk,i.userComplete=t.complete,i.userError=t.error,t.step=q(t.step),t.chunk=q(t.chunk),t.complete=q(t.complete),t.error=q(t.error),delete t.worker,void i.postMessage({input:e,config:t,workerId:i.id})}var n=null;b.NODE_STREAM_INPUT,"string"==typeof e?n=t.download?new l(t):new p(t):!0===e.readable&&q(e.read)&&q(e.on)?n=new m(t):(f.File&&e instanceof File||e instanceof Object)&&(n=new c(t));return n.stream(e)},unparse:function(e,t){var n=!1,_=!0,g=",",v="\r\n",s='"',a=s+s,r=!1,i=null;!function(){if("object"!=typeof t)return;"string"!=typeof t.delimiter||b.BAD_DELIMITERS.filter(function(e){return-1!==t.delimiter.indexOf(e)}).length||(g=t.delimiter);("boolean"==typeof t.quotes||"function"==typeof t.quotes||Array.isArray(t.quotes))&&(n=t.quotes);"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(r=t.skipEmptyLines);"string"==typeof t.newline&&(v=t.newline);"string"==typeof t.quoteChar&&(s=t.quoteChar);"boolean"==typeof t.header&&(_=t.header);if(Array.isArray(t.columns)){if(0===t.columns.length)throw new Error("Option columns is empty");i=t.columns}void 0!==t.escapeChar&&(a=t.escapeChar+s)}();var o=new RegExp(U(s),"g");"string"==typeof e&&(e=JSON.parse(e));if(Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return u(null,e,r);if("object"==typeof e[0])return u(i||h(e[0]),e,r)}else if("object"==typeof e)return"string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:h(e.data[0])),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),u(e.fields||[],e.data||[],r);throw new Error("Unable to serialize unrecognized input");function h(e){if("object"!=typeof e)return[];var t=[];for(var r in e)t.push(r);return t}function u(e,t,r){var i="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var n=Array.isArray(e)&&0<e.length,s=!Array.isArray(t[0]);if(n&&_){for(var a=0;a<e.length;a++)0<a&&(i+=g),i+=y(e[a],a);0<t.length&&(i+=v)}for(var o=0;o<t.length;o++){var h=n?e.length:t[o].length,u=!1,f=n?0===Object.keys(t[o]).length:0===t[o].length;if(r&&!n&&(u="greedy"===r?""===t[o].join("").trim():1===t[o].length&&0===t[o][0].length),"greedy"===r&&n){for(var d=[],l=0;l<h;l++){var c=s?e[l]:l;d.push(t[o][c])}u=""===d.join("").trim()}if(!u){for(var p=0;p<h;p++){0<p&&!f&&(i+=g);var m=n&&s?e[p]:p;i+=y(t[o][m],p)}o<t.length-1&&(!r||0<h&&!f)&&(i+=v)}}return i}function y(e,t){if(null==e)return"";if(e.constructor===Date)return JSON.stringify(e).slice(1,25);var r=e.toString().replace(o,a),i="boolean"==typeof n&&n||"function"==typeof n&&n(e,t)||Array.isArray(n)&&n[t]||function(e,t){for(var r=0;r<t.length;r++)if(-1<e.indexOf(t[r]))return!0;return!1}(r,b.BAD_DELIMITERS)||-1<r.indexOf(g)||" "===r.charAt(0)||" "===r.charAt(r.length-1);return i?s+r+s:r}}};if(b.RECORD_SEP=String.fromCharCode(30),b.UNIT_SEP=String.fromCharCode(31),b.BYTE_ORDER_MARK="\ufeff",b.BAD_DELIMITERS=["\r","\n",'"',b.BYTE_ORDER_MARK],b.WORKERS_SUPPORTED=!n&&!!f.Worker,b.NODE_STREAM_INPUT=1,b.LocalChunkSize=10485760,b.RemoteChunkSize=5242880,b.DefaultDelimiter=",",b.Parser=E,b.ParserHandle=r,b.NetworkStreamer=l,b.FileStreamer=c,b.StringStreamer=p,b.ReadableStreamStreamer=m,f.jQuery){var d=f.jQuery;d.fn.parse=function(o){var r=o.config||{},h=[];return this.each(function(e){if(!("INPUT"===d(this).prop("tagName").toUpperCase()&&"file"===d(this).attr("type").toLowerCase()&&f.FileReader)||!this.files||0===this.files.length)return!0;for(var t=0;t<this.files.length;t++)h.push({file:this.files[t],inputElem:this,instanceConfig:d.extend({},r)})}),e(),this;function e(){if(0!==h.length){var e,t,r,i,n=h[0];if(q(o.before)){var s=o.before(n.file,n.inputElem);if("object"==typeof s){if("abort"===s.action)return e="AbortError",t=n.file,r=n.inputElem,i=s.reason,void(q(o.error)&&o.error({name:e},t,r,i));if("skip"===s.action)return void u();"object"==typeof s.config&&(n.instanceConfig=d.extend(n.instanceConfig,s.config))}else if("skip"===s)return void u()}var a=n.instanceConfig.complete;n.instanceConfig.complete=function(e){q(a)&&a(e,n.file,n.inputElem),u()},b.parse(n.file,n.instanceConfig)}else q(o.complete)&&o.complete()}function u(){h.splice(0,1),e()}}}function u(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=w(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null);this._handle=new r(t),(this._handle.streamer=this)._config=t}.call(this,e),this.parseChunk=function(e,t){if(this.isFirstChunk&&q(this._config.beforeFirstChunk)){var r=this._config.beforeFirstChunk(e);void 0!==r&&(e=r)}this.isFirstChunk=!1,this._halted=!1;var i=this._partialLine+e;this._partialLine="";var n=this._handle.parse(i,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var s=n.meta.cursor;this._finished||(this._partialLine=i.substring(s-this._baseIndex),this._baseIndex=s),n&&n.data&&(this._rowCount+=n.data.length);var a=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(o)f.postMessage({results:n,workerId:b.WORKER_ID,finished:a});else if(q(this._config.chunk)&&!t){if(this._config.chunk(n,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);n=void 0,this._completeResults=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(n.data),this._completeResults.errors=this._completeResults.errors.concat(n.errors),this._completeResults.meta=n.meta),this._completed||!a||!q(this._config.complete)||n&&n.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),a||n&&n.meta.paused||this._nextChunk(),n}this._halted=!0},this._sendError=function(e){q(this._config.error)?this._config.error(e):o&&this._config.error&&f.postMessage({workerId:b.WORKER_ID,error:e,finished:!1})}}function l(e){var i;(e=e||{}).chunkSize||(e.chunkSize=b.RemoteChunkSize),u.call(this,e),this._nextChunk=n?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(e){this._input=e,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(i=new XMLHttpRequest,this._config.withCredentials&&(i.withCredentials=this._config.withCredentials),n||(i.onload=y(this._chunkLoaded,this),i.onerror=y(this._chunkError,this)),i.open("GET",this._input,!n),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var t in e)i.setRequestHeader(t,e[t])}if(this._config.chunkSize){var r=this._start+this._config.chunkSize-1;i.setRequestHeader("Range","bytes="+this._start+"-"+r)}try{i.send()}catch(e){this._chunkError(e.message)}n&&0===i.status&&this._chunkError()}},this._chunkLoaded=function(){4===i.readyState&&(i.status<200||400<=i.status?this._chunkError():(this._start+=i.responseText.length,this._finished=!this._config.chunkSize||this._start>=function(e){var t=e.getResponseHeader("Content-Range");if(null===t)return-1;return parseInt(t.substr(t.lastIndexOf("/")+1))}(i),this.parseChunk(i.responseText)))},this._chunkError=function(e){var t=i.statusText||e;this._sendError(new Error(t))}}function c(e){var i,n;(e=e||{}).chunkSize||(e.chunkSize=b.LocalChunkSize),u.call(this,e);var s="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,n=e.slice||e.webkitSlice||e.mozSlice,s?((i=new FileReader).onload=y(this._chunkLoaded,this),i.onerror=y(this._chunkError,this)):i=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var t=Math.min(this._start+this._config.chunkSize,this._input.size);e=n.call(e,this._start,t)}var r=i.readAsText(e,this._config.encoding);s||this._chunkLoaded({target:{result:r}})},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result)},this._chunkError=function(){this._sendError(i.error)}}function p(e){var r;u.call(this,e=e||{}),this.stream=function(e){return r=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e=this._config.chunkSize,t=e?r.substr(0,e):r;return r=e?r.substr(e):"",this._finished=!r,this.parseChunk(t)}}}function m(e){u.call(this,e=e||{});var t=[],r=!0,i=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){i&&1===t.length&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):r=!0},this._streamData=y(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),r&&(r=!1,this._checkIsFinished(),this.parseChunk(t.shift()))}catch(e){this._streamError(e)}},this),this._streamError=y(function(e){this._streamCleanUp(),this._sendError(e)},this),this._streamEnd=y(function(){this._streamCleanUp(),i=!0,this._streamData("")},this),this._streamCleanUp=y(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function r(g){var a,o,h,i=Math.pow(2,53),n=-i,s=/^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i,u=/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,t=this,r=0,f=0,d=!1,e=!1,l=[],c={data:[],errors:[],meta:{}};if(q(g.step)){var p=g.step;g.step=function(e){if(c=e,_())m();else{if(m(),0===c.data.length)return;r+=e.data.length,g.preview&&r>g.preview?o.abort():p(c,t)}}}function v(e){return"greedy"===g.skipEmptyLines?""===e.join("").trim():1===e.length&&0===e[0].length}function m(){if(c&&h&&(k("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+b.DefaultDelimiter+"'"),h=!1),g.skipEmptyLines)for(var e=0;e<c.data.length;e++)v(c.data[e])&&c.data.splice(e--,1);return _()&&function(){if(!c)return;function e(e){q(g.transformHeader)&&(e=g.transformHeader(e)),l.push(e)}if(Array.isArray(c.data[0])){for(var t=0;_()&&t<c.data.length;t++)c.data[t].forEach(e);c.data.splice(0,1)}else c.data.forEach(e)}(),function(){if(!c||!g.header&&!g.dynamicTyping&&!g.transform)return c;function e(e,t){var r,i=g.header?{}:[];for(r=0;r<e.length;r++){var n=r,s=e[r];g.header&&(n=r>=l.length?"__parsed_extra":l[r]),g.transform&&(s=g.transform(s,n)),s=y(n,s),"__parsed_extra"===n?(i[n]=i[n]||[],i[n].push(s)):i[n]=s}return g.header&&(r>l.length?k("FieldMismatch","TooManyFields","Too many fields: expected "+l.length+" fields but parsed "+r,f+t):r<l.length&&k("FieldMismatch","TooFewFields","Too few fields: expected "+l.length+" fields but parsed "+r,f+t)),i}var t=1;!c.data.length||Array.isArray(c.data[0])?(c.data=c.data.map(e),t=c.data.length):c.data=e(c.data,0);g.header&&c.meta&&(c.meta.fields=l);return f+=t,c}()}function _(){return g.header&&0===l.length}function y(e,t){return r=e,g.dynamicTypingFunction&&void 0===g.dynamicTyping[r]&&(g.dynamicTyping[r]=g.dynamicTypingFunction(r)),!0===(g.dynamicTyping[r]||g.dynamicTyping)?"true"===t||"TRUE"===t||"false"!==t&&"FALSE"!==t&&(function(e){if(s.test(e)){var t=parseFloat(e);if(n<t&&t<i)return!0}return!1}(t)?parseFloat(t):u.test(t)?new Date(t):""===t?null:t):t;var r}function k(e,t,r,i){c.errors.push({type:e,code:t,message:r,row:i})}this.parse=function(e,t,r){var i=g.quoteChar||'"';if(g.newline||(g.newline=function(e,t){e=e.substr(0,1048576);var r=new RegExp(U(t)+"([^]*?)"+U(t),"gm"),i=(e=e.replace(r,"")).split("\r"),n=e.split("\n"),s=1<n.length&&n[0].length<i[0].length;if(1===i.length||s)return"\n";for(var a=0,o=0;o<i.length;o++)"\n"===i[o][0]&&a++;return a>=i.length/2?"\r\n":"\r"}(e,i)),h=!1,g.delimiter)q(g.delimiter)&&(g.delimiter=g.delimiter(e),c.meta.delimiter=g.delimiter);else{var n=function(e,t,r,i,n){var s,a,o,h;n=n||[",","\t","|",";",b.RECORD_SEP,b.UNIT_SEP];for(var u=0;u<n.length;u++){var f=n[u],d=0,l=0,c=0;o=void 0;for(var p=new E({comments:i,delimiter:f,newline:t,preview:10}).parse(e),m=0;m<p.data.length;m++)if(r&&v(p.data[m]))c++;else{var _=p.data[m].length;l+=_,void 0!==o?0<_&&(d+=Math.abs(_-o),o=_):o=_}0<p.data.length&&(l/=p.data.length-c),(void 0===a||d<=a)&&(void 0===h||h<l)&&1.99<l&&(a=d,s=f,h=l)}return{successful:!!(g.delimiter=s),bestDelimiter:s}}(e,g.newline,g.skipEmptyLines,g.comments,g.delimitersToGuess);n.successful?g.delimiter=n.bestDelimiter:(h=!0,g.delimiter=b.DefaultDelimiter),c.meta.delimiter=g.delimiter}var s=w(g);return g.preview&&g.header&&s.preview++,a=e,o=new E(s),c=o.parse(a,t,r),m(),d?{meta:{paused:!0}}:c||{meta:{paused:!1}}},this.paused=function(){return d},this.pause=function(){d=!0,o.abort(),a=a.substr(o.getCharIndex())},this.resume=function(){t.streamer._halted?(d=!1,t.streamer.parseChunk(a,!0)):setTimeout(this.resume,3)},this.aborted=function(){return e},this.abort=function(){e=!0,o.abort(),c.meta.aborted=!0,q(g.complete)&&g.complete(c),a=""}}function U(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function E(e){var O,D=(e=e||{}).delimiter,I=e.newline,T=e.comments,A=e.step,L=e.preview,F=e.fastMode,M=O=void 0===e.quoteChar?'"':e.quoteChar;if(void 0!==e.escapeChar&&(M=e.escapeChar),("string"!=typeof D||-1<b.BAD_DELIMITERS.indexOf(D))&&(D=","),T===D)throw new Error("Comment character same as delimiter");!0===T?T="#":("string"!=typeof T||-1<b.BAD_DELIMITERS.indexOf(T))&&(T=!1),"\n"!==I&&"\r"!==I&&"\r\n"!==I&&(I="\n");var z=0,j=!1;this.parse=function(a,r,t){if("string"!=typeof a)throw new Error("Input must be a string");var i=a.length,e=D.length,n=I.length,s=T.length,o=q(A),h=[],u=[],f=[],d=z=0;if(!a)return R();if(F||!1!==F&&-1===a.indexOf(O)){for(var l=a.split(I),c=0;c<l.length;c++){if(f=l[c],z+=f.length,c!==l.length-1)z+=I.length;else if(t)return R();if(!T||f.substr(0,s)!==T){if(o){if(h=[],b(f.split(D)),S(),j)return R()}else b(f.split(D));if(L&&L<=c)return h=h.slice(0,L),R(!0)}}return R()}for(var p=a.indexOf(D,z),m=a.indexOf(I,z),_=new RegExp(U(M)+U(O),"g"),g=a.indexOf(O,z);;)if(a[z]!==O)if(T&&0===f.length&&a.substr(z,s)===T){if(-1===m)return R();z=m+n,m=a.indexOf(I,z),p=a.indexOf(D,z)}else{if(-1!==p&&(p<m||-1===m)){if(!(p<g)){f.push(a.substring(z,p)),z=p+e,p=a.indexOf(D,z);continue}var v=x(p,g,m);if(v&&void 0!==v.nextDelim){p=v.nextDelim,g=v.quoteSearch,f.push(a.substring(z,p)),z=p+e,p=a.indexOf(D,z);continue}}if(-1===m)break;if(f.push(a.substring(z,m)),C(m+n),o&&(S(),j))return R();if(L&&h.length>=L)return R(!0)}else for(g=z,z++;;){if(-1===(g=a.indexOf(O,g+1)))return t||u.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:h.length,index:z}),w();if(g===i-1)return w(a.substring(z,g).replace(_,O));if(O!==M||a[g+1]!==M){if(O===M||0===g||a[g-1]!==M){var y=E(-1===m?p:Math.min(p,m));if(a[g+1+y]===D){f.push(a.substring(z,g).replace(_,O)),a[z=g+1+y+e]!==O&&(g=a.indexOf(O,z)),p=a.indexOf(D,z),m=a.indexOf(I,z);break}var k=E(m);if(a.substr(g+1+k,n)===I){if(f.push(a.substring(z,g).replace(_,O)),C(g+1+k+n),p=a.indexOf(D,z),g=a.indexOf(O,z),o&&(S(),j))return R();if(L&&h.length>=L)return R(!0);break}u.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:h.length,index:z}),g++}}else g++}return w();function b(e){h.push(e),d=z}function E(e){var t=0;if(-1!==e){var r=a.substring(g+1,e);r&&""===r.trim()&&(t=r.length)}return t}function w(e){return t||(void 0===e&&(e=a.substr(z)),f.push(e),z=i,b(f),o&&S()),R()}function C(e){z=e,b(f),f=[],m=a.indexOf(I,z)}function R(e,t){return{data:t||!1?h[0]:h,errors:u,meta:{delimiter:D,linebreak:I,aborted:j,truncated:!!e,cursor:d+(r||0)}}}function S(){A(R(void 0,!0)),h=[],u=[]}function x(e,t,r){var i={nextDelim:void 0,quoteSearch:void 0},n=a.indexOf(O,t+1);if(t<e&&e<n&&(n<r||-1===r)){var s=a.indexOf(D,n);if(-1===s)return i;n<s&&(n=a.indexOf(O,n+1)),i=x(s,n,r)}else i={nextDelim:e,quoteSearch:t};return i}},this.abort=function(){j=!0},this.getCharIndex=function(){return z}}function _(e){var t=e.data,r=a[t.workerId],i=!1;if(t.error)r.userError(t.error,t.file);else if(t.results&&t.results.data){var n={abort:function(){i=!0,g(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:v,resume:v};if(q(r.userStep)){for(var s=0;s<t.results.data.length&&(r.userStep({data:t.results.data[s],errors:t.results.errors,meta:t.results.meta},n),!i);s++);delete t.results}else q(r.userChunk)&&(r.userChunk(t.results,n,t.file),delete t.results)}t.finished&&!i&&g(t.workerId,t.results)}function g(e,t){var r=a[e];q(r.userComplete)&&r.userComplete(t),r.terminate(),delete a[e]}function v(){throw new Error("Not implemented.")}function w(e){if("object"!=typeof e||null===e)return e;var t=Array.isArray(e)?[]:{};for(var r in e)t[r]=w(e[r]);return t}function y(e,t){return function(){e.apply(t,arguments)}}function q(e){return"function"==typeof e}return o&&(f.onmessage=function(e){var t=e.data;void 0===b.WORKER_ID&&t&&(b.WORKER_ID=t.workerId);if("string"==typeof t.input)f.postMessage({workerId:b.WORKER_ID,results:b.parse(t.input,t.config),finished:!0});else if(f.File&&t.input instanceof File||t.input instanceof Object){var r=b.parse(t.input,t.config);r&&f.postMessage({workerId:b.WORKER_ID,results:r,finished:!0})}}),(l.prototype=Object.create(u.prototype)).constructor=l,(c.prototype=Object.create(u.prototype)).constructor=c,(p.prototype=Object.create(p.prototype)).constructor=p,(m.prototype=Object.create(u.prototype)).constructor=m,b});
},{}],10:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.regression = mod.exports;
  }
})(this, function (module) {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var DEFAULT_OPTIONS = { order: 2, precision: 2, period: null };

  /**
  * Determine the coefficient of determination (r^2) of a fit from the observations
  * and predictions.
  *
  * @param {Array<Array<number>>} data - Pairs of observed x-y values
  * @param {Array<Array<number>>} results - Pairs of observed predicted x-y values
  *
  * @return {number} - The r^2 value, or NaN if one cannot be calculated.
  */
  function determinationCoefficient(data, results) {
    var predictions = [];
    var observations = [];

    data.forEach(function (d, i) {
      if (d[1] !== null) {
        observations.push(d);
        predictions.push(results[i]);
      }
    });

    var sum = observations.reduce(function (a, observation) {
      return a + observation[1];
    }, 0);
    var mean = sum / observations.length;

    var ssyy = observations.reduce(function (a, observation) {
      var difference = observation[1] - mean;
      return a + difference * difference;
    }, 0);

    var sse = observations.reduce(function (accum, observation, index) {
      var prediction = predictions[index];
      var residual = observation[1] - prediction[1];
      return accum + residual * residual;
    }, 0);

    return 1 - sse / ssyy;
  }

  /**
  * Determine the solution of a system of linear equations A * x = b using
  * Gaussian elimination.
  *
  * @param {Array<Array<number>>} input - A 2-d matrix of data in row-major form [ A | b ]
  * @param {number} order - How many degrees to solve for
  *
  * @return {Array<number>} - Vector of normalized solution coefficients matrix (x)
  */
  function gaussianElimination(input, order) {
    var matrix = input;
    var n = input.length - 1;
    var coefficients = [order];

    for (var i = 0; i < n; i++) {
      var maxrow = i;
      for (var j = i + 1; j < n; j++) {
        if (Math.abs(matrix[i][j]) > Math.abs(matrix[i][maxrow])) {
          maxrow = j;
        }
      }

      for (var k = i; k < n + 1; k++) {
        var tmp = matrix[k][i];
        matrix[k][i] = matrix[k][maxrow];
        matrix[k][maxrow] = tmp;
      }

      for (var _j = i + 1; _j < n; _j++) {
        for (var _k = n; _k >= i; _k--) {
          matrix[_k][_j] -= matrix[_k][i] * matrix[i][_j] / matrix[i][i];
        }
      }
    }

    for (var _j2 = n - 1; _j2 >= 0; _j2--) {
      var total = 0;
      for (var _k2 = _j2 + 1; _k2 < n; _k2++) {
        total += matrix[_k2][_j2] * coefficients[_k2];
      }

      coefficients[_j2] = (matrix[n][_j2] - total) / matrix[_j2][_j2];
    }

    return coefficients;
  }

  /**
  * Round a number to a precision, specificed in number of decimal places
  *
  * @param {number} number - The number to round
  * @param {number} precision - The number of decimal places to round to:
  *                             > 0 means decimals, < 0 means powers of 10
  *
  *
  * @return {numbr} - The number, rounded
  */
  function round(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  /**
  * The set of all fitting methods
  *
  * @namespace
  */
  var methods = {
    linear: function linear(data, options) {
      var sum = [0, 0, 0, 0, 0];
      var len = 0;

      for (var n = 0; n < data.length; n++) {
        if (data[n][1] !== null) {
          len++;
          sum[0] += data[n][0];
          sum[1] += data[n][1];
          sum[2] += data[n][0] * data[n][0];
          sum[3] += data[n][0] * data[n][1];
          sum[4] += data[n][1] * data[n][1];
        }
      }

      var run = len * sum[2] - sum[0] * sum[0];
      var rise = len * sum[3] - sum[0] * sum[1];
      var gradient = run === 0 ? 0 : round(rise / run, options.precision);
      var intercept = round(sum[1] / len - gradient * sum[0] / len, options.precision);

      var predict = function predict(x) {
        return [round(x, options.precision), round(gradient * x + intercept, options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [gradient, intercept],
        r2: round(determinationCoefficient(data, points), options.precision),
        string: intercept === 0 ? 'y = ' + gradient + 'x' : 'y = ' + gradient + 'x + ' + intercept
      };
    },
    exponential: function exponential(data, options) {
      var sum = [0, 0, 0, 0, 0, 0];

      for (var n = 0; n < data.length; n++) {
        if (data[n][1] !== null) {
          sum[0] += data[n][0];
          sum[1] += data[n][1];
          sum[2] += data[n][0] * data[n][0] * data[n][1];
          sum[3] += data[n][1] * Math.log(data[n][1]);
          sum[4] += data[n][0] * data[n][1] * Math.log(data[n][1]);
          sum[5] += data[n][0] * data[n][1];
        }
      }

      var denominator = sum[1] * sum[2] - sum[5] * sum[5];
      var a = Math.exp((sum[2] * sum[3] - sum[5] * sum[4]) / denominator);
      var b = (sum[1] * sum[4] - sum[5] * sum[3]) / denominator;
      var coeffA = round(a, options.precision);
      var coeffB = round(b, options.precision);
      var predict = function predict(x) {
        return [round(x, options.precision), round(coeffA * Math.exp(coeffB * x), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + 'e^(' + coeffB + 'x)',
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    },
    logarithmic: function logarithmic(data, options) {
      var sum = [0, 0, 0, 0];
      var len = data.length;

      for (var n = 0; n < len; n++) {
        if (data[n][1] !== null) {
          sum[0] += Math.log(data[n][0]);
          sum[1] += data[n][1] * Math.log(data[n][0]);
          sum[2] += data[n][1];
          sum[3] += Math.pow(Math.log(data[n][0]), 2);
        }
      }

      var a = (len * sum[1] - sum[2] * sum[0]) / (len * sum[3] - sum[0] * sum[0]);
      var coeffB = round(a, options.precision);
      var coeffA = round((sum[2] - coeffB * sum[0]) / len, options.precision);

      var predict = function predict(x) {
        return [round(x, options.precision), round(round(coeffA + coeffB * Math.log(x), options.precision), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + ' + ' + coeffB + ' ln(x)',
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    },
    power: function power(data, options) {
      var sum = [0, 0, 0, 0, 0];
      var len = data.length;

      for (var n = 0; n < len; n++) {
        if (data[n][1] !== null) {
          sum[0] += Math.log(data[n][0]);
          sum[1] += Math.log(data[n][1]) * Math.log(data[n][0]);
          sum[2] += Math.log(data[n][1]);
          sum[3] += Math.pow(Math.log(data[n][0]), 2);
        }
      }

      var b = (len * sum[1] - sum[0] * sum[2]) / (len * sum[3] - Math.pow(sum[0], 2));
      var a = (sum[2] - b * sum[0]) / len;
      var coeffA = round(Math.exp(a), options.precision);
      var coeffB = round(b, options.precision);

      var predict = function predict(x) {
        return [round(x, options.precision), round(round(coeffA * Math.pow(x, coeffB), options.precision), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + 'x^' + coeffB,
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    },
    polynomial: function polynomial(data, options) {
      var lhs = [];
      var rhs = [];
      var a = 0;
      var b = 0;
      var len = data.length;
      var k = options.order + 1;

      for (var i = 0; i < k; i++) {
        for (var l = 0; l < len; l++) {
          if (data[l][1] !== null) {
            a += Math.pow(data[l][0], i) * data[l][1];
          }
        }

        lhs.push(a);
        a = 0;

        var c = [];
        for (var j = 0; j < k; j++) {
          for (var _l = 0; _l < len; _l++) {
            if (data[_l][1] !== null) {
              b += Math.pow(data[_l][0], i + j);
            }
          }
          c.push(b);
          b = 0;
        }
        rhs.push(c);
      }
      rhs.push(lhs);

      var coefficients = gaussianElimination(rhs, k).map(function (v) {
        return round(v, options.precision);
      });

      var predict = function predict(x) {
        return [round(x, options.precision), round(coefficients.reduce(function (sum, coeff, power) {
          return sum + coeff * Math.pow(x, power);
        }, 0), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      var string = 'y = ';
      for (var _i = coefficients.length - 1; _i >= 0; _i--) {
        if (_i > 1) {
          string += coefficients[_i] + 'x^' + _i + ' + ';
        } else if (_i === 1) {
          string += coefficients[_i] + 'x + ';
        } else {
          string += coefficients[_i];
        }
      }

      return {
        string: string,
        points: points,
        predict: predict,
        equation: [].concat(_toConsumableArray(coefficients)).reverse(),
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    }
  };

  function createWrapper() {
    var reduce = function reduce(accumulator, name) {
      return _extends({
        _round: round
      }, accumulator, _defineProperty({}, name, function (data, supplied) {
        return methods[name](data, _extends({}, DEFAULT_OPTIONS, supplied));
      }));
    };

    return Object.keys(methods).reduce(reduce, {});
  }

  module.exports = createWrapper();
});

},{}]},{},[4]);
