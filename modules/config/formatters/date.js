const help = require('../../helpers.js');
const time = {
	sv: require('../../../config/charts/lang/sv/time.json'),
	en: require('../../../config/charts/lang/en/time.json'),
}

var dateFormat = (date) => {
	return date.getFullYear() + ' ' + time[nav_lang].months[help.months()[date.getMonth()]] + ' ' + date.getDate();
}

var formats = {
	YYYYMMDD: (date) => {
		try{

			return date.getFullYear() + ' ' + time[nav_lang].months[help.months()[date.getMonth()]] + ' ' + date.getDate();
		}catch(error){
			return ''
		}
	},
	MMDD: (date) => {
		try{
			var month = time[nav_lang].months[help.months()[date.getMonth()]];
			var day = date.getDate();
			if(month == undefined){
				console.log(date)
				console.log(time[nav_lang].months)
				console.log(date.getMonth())
				console.log(help.months()[date.getMonth()])
			}
			return month + ' ' + day;
		}catch(error){
			return ''
		}
	},
}
exports.spectrum = function(value){
	return {
		regular: new Date(1999, 0, 1).addDays(value - 1),
		leap: new Date(2000, 0, 1).addDays(value -1)
	}
}
exports.formats = formats;
