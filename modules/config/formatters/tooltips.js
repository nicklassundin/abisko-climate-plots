// TODO create a builder instead of this mess

var dateFormats = require('./date').dateFormats

exports.formatters = function(meta){
	return {
		winterDOY: function(){
			try{
				var tooltip = '<span style="font-size: 10px">' + (this.x-1) + '/' + this.x + '</span><br/>';
				this.points.forEach(point => {
					var dec = point.series.chart.options.tooltip.valueDecimals;
					tooltip += '<span style="color:' + point.color +'">\u25CF</span> ' + point.series.name + 
						(meta.unitType ? ' ['+meta.units[meta.unitType].plural+']' : '') +
						': <b>' +(point.point.options.name || point.y.toFixed(dec)) + '</b><br/>'
				})
				return tooltip;
			}catch(error){
				console.log(error);
				return undefined;
			}
		},
		winterValue: function(){
			try{
				var tooltip = '<span style="font-size: 10px">' + (this.x-1) + '/' + this.x + '</span><br/>';
				this.points.forEach(point => {
					var dec = point.series.chart.options.tooltip.valueDecimals;
					tooltip += '<span style="color:' + point.color +'">\u25CF</span> ' + point.series.name + 
						(meta.unitType ? ' ['+meta.units[meta.unitType].plural+']' : '') +
						': <b>' + point.y.toFixed(dec) + '</b><br/>'
				})
				return tooltip;
			}catch(error){
				console.log(error);
				return undefined;
			}
		},
		winterValueDate: function(){
			try{
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

			}catch(error){
				console.log(error);
				return undefined;
			}
		},
		winterValueDateExtreme: function(){
			try{
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

			}catch(error){
				console.log(error);
				return undefined;
			}
		},
		valueDate: function(){
			try{
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

			}catch(error){
				console.log(error);
				return undefined;
			}
		},
		value: function(){
			try{
				var tooltip = '<span style="font-size: 10px">'+this.x+'</span><br/>';
				this.points.forEach(point => {
					var dec = point.series.chart.options.tooltip.valueDecimals;
					tooltip += '<span style="color:'+
						point.color +
						'">\u25CF</span> ' +
						point.series.name +
						(meta.unitType ? ' ['+meta.units[meta.unitType].plural+']' : '') +
						': <b>'+
						(point.y.toFixed(dec)) + 
						'</b><br/>'
					tooltip += '<br/>'

				})
				return tooltip
			}catch(error){
				console.log(error)
				return undefined
			}
		},
		default: undefined,
	}
}
