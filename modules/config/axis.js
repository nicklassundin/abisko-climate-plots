var dateFormats = require('./dateformatter').dateFormats

exports.yAxis = {
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
exports.xAxis = {

}
