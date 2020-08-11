var date = require('./date');

var yAxis = {
	DOY: function(value, form, shrt = false){
		var month = '';
		var year = date.spectrum(value); 
		var reg = form(year.regular, shrt);
		var leap = form(year.leap, shrt);
		if(year.regular.getMonth() == year.leap.getMonth()){
			if(year.regular.getDate() == year.leap.getDate()){
				return reg
			}else{
				return reg + '-' + leap.split(' ')[1];
			}
		}else{
			return reg + ' - ' + leap;
		}
	},
	MMDD: function(shrt = true){
		return yAxis['DOY'](this.value, date.formats['MMDD'], shrt)
	},
	MM: function(shrt = false){
		return yAxis['DOY'](this.value, date.formats['MM'], shrt)				
	}
}
exports.yAxis = yAxis;
exports.xAxis = {

}
