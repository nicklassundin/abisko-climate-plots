// TODO create a builder instead of this mess

const help = require('../helpers.js');
const time = {
	sv: require('../../config/charts/lang/sv/time.json'),
	en: require('../../config/charts/lang/en/time.json'),
}

var dateFormat = (date) => {
	return date.getFullYear() + ' ' + time[nav_lang].months[help.months()[date.getMonth()]] + ' ' + date.getDate();
}

var dateFormats = {
	YYYYMMDD: (date) => {
		return date.getFullYear() + ' ' + time[nav_lang].months[help.months()[date.getMonth()]] + ' ' + date.getDate();
	},
	MMDD: (date) => {
		var month = time[nav_lang].months[help.months()[date.getMonth()]];
		var day = date.getDate();
		if(month == undefined){
			console.log(date)
			console.log(time[nav_lang].months)
			console.log(date.getMonth())
			console.log(help.months()[date.getMonth()])
		}
		return month + ' ' + day;
	},
}
exports.dateFormats = dateFormats;

var yAxis = {
	MMDD: function(){
		var month = '';
		var regYear = dateFormats['MMDD'](new Date(1999, 0, 1).addDays(this.value - 1)).split(' ');	
		var leapYear = dateFormats['MMDD'](new Date(2000, 0, 1).addDays(this.value - 1)).split(' ');
		if(regYear[0] == leapYear[0]){
			month = regYear[0]
			if(regYear[1] == leapYear[1]){
				return month + ' ' + regYear[1];
			}else{
				return month + ' ' + regYear[1] + '-' + leapYear[1];
			}
		}else{
			return regYear[0] + ' ' + regYear[1] + ' - ' + leapYear[0] + ' ' + leapYear[1];
		}

	}
}
exports.yAxis = yAxis;


exports.formatters = {
	winterDOY: function(){
		var tooltip = '<span style="font-size: 10px">' + (this.x-1) + '/' + this.x + '</span><br/>';
		this.points.forEach(point => {
			var dec = point.series.chart.options.tooltip.valueDecimals;
			tooltip += '<span style="color:' + point.color +'">\u25CF</span> ' + point.series.name + ': <b>' +(point.point.options.name || point.y.toFixed(dec)) + '</b><br/>'
		})
		return tooltip;
	},
	winterValue: function(){
		var tooltip = '<span style="font-size: 10px">' + (this.x-1) + '/' + this.x + '</span><br/>';
		this.points.forEach(point => {
			var dec = point.series.chart.options.tooltip.valueDecimals;
			tooltip += '<span style="color:' + point.color +'">\u25CF</span> ' + point.series.name + ': <b>' + point.y.toFixed(dec) + '</b><br/>'
		})
		return tooltip;
	},
	winterValueDate: function(){
		var tooltip = '<span style="font-size: 10px">Winter ' + (this.x + '-' + (this.x+1)) + '</span><br/>';
		this.points.forEach(point =>{
			var dec = point.series.chart.options.tooltip.valueDecimals;

			tooltip += '<span style="font-size: 10px">'+point.point.date+'</span><br/>'
			tooltip += '<span style="color:'+
				point.color +
				'">\u25CF</span> ' +
				point.series.name +
				': <b>'+
				(point.y.toFixed(dec)) + 
				'</b><br/>'
		});
		return tooltip;

	},
	winterValueDateExtreme: function(){
		var tooltip = '<span style="font-size: 10px">Winter ' + (this.x + '-' + (this.x+1)) + '</span><br/>';
		this.points.forEach(point =>{
			tooltip += '<span style="color:'+
				point.color +
				'">\u25CF</span> ' +
				point.series.name +
				': <b>'+
				dateFormats.YYYYMMDD(point.point.fullDate)+
				'</b><br/>'
		});
		return tooltip;

	},
	valueDate: function(){
		var tooltip = '<span style="font-size: 10px">'+this.x+'</span><br/>';
		this.points.forEach(point =>{
			var dec = point.series.chart.options.tooltip.valueDecimals;
			tooltip += '<span style="color:'+
				point.color +
				'">\u25CF</span> ' +
				point.series.name +
				': <b>'+
				(point.y.toFixed(dec)) + 
				'</b><br/>'
			point.point.subX.forEach(date => {
				tooltip += dateFormats.MMDD(date) + '</b><br/>'
			})
			tooltip += '<br/>'
		});
		return tooltip;

	},
	default: undefined,
}

