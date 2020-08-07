var date = require('./date');

var yAxis = {
	DOY: function(value, form){
		var month = '';
		var year = date.spectrum(value); 
		var reg = form(year.regular);
		var leap = form(year.leap);
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
	MMDD: function(){
		return yAxis['DOY'](this.value, date.formats['MMDD'])
	},
	MM: function(){
				
	}
}
exports.yAxis = yAxis;
exports.xAxis = {

}
