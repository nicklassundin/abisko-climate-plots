// TODO create a builder instead of this mess

const help = require('../helpers.js');
const time = {
	sv: require('../../config/charts/lang/sv/time.json'),
	en: require('../../config/charts/lang/en/time.json'),
}

var dateFormat = (date) => {
	return date.getFullYear() + ' ' + time[nav_lang].months[help.months()[date.getMonth()]] + ' ' + date.getDate();
}
	
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
				dateFormat(point.point.fullDate)+
				'</b><br/>'
		});
		return tooltip;

	},
	default: undefined,
}

