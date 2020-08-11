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

			return date.getFullYear() + ' ' + formats['MM'](date) + ' ' + formats['DD'](date) 
		}catch(error){
			return ''
		}
	},
	MMDD: (date, shrt=false) => {
		try{
			return formats['MM'](date, shrt) + ' ' + formats['DD'](date, shrt);
		}catch(error){
			return ''
		}
	},
	DD: (date) => {
		return date.getDate();	
	},
	MM: (date, shrt=false) => {
		return (shrt ? time[nav_lang].monthShort : time[nav_lang].months)[help.months()[date.getMonth()]]
	},
}
exports.formats = formats;
exports.spectrum = function(value){
	return {
		regular: new Date(1999, 0, 1).addDays(value - 1),
		leap: new Date(2000, 0, 1).addDays(value -1)
	}
}
