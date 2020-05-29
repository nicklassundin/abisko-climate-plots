
exports.formatters = {
	winterDOY: function(){
		var tooltip = '<span style="font-size: 10px">' + (this.x-1) + '/' + this.x + '</span><br/>';
		this.points.forEach(point => {
			tooltip += '<span style="color:' + point.color +'">\u25CF</span> ' + point.series.name + ': <b>' +(point.point.options.name || point.y) + '</b><br/>'
		})
		return tooltip;
	},
	winterValue: function(){
		var tooltip = '<span style="font-size: 10px">' + (this.x-1) + '/' + this.x + '</span><br/>';
		this.points.forEach(point => {
			tooltip += '<span style="color:' + point.color +'">\u25CF</span> ' + point.series.name + ': <b>' + point.y + '</b><br/>'
		})
		return tooltip;
	},
	default: undefined,
}

