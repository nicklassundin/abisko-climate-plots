
const Papa = require('papaparse');
var data = {
	abisko: {
		'ANS_Prec.csv': JSON.stringify(require('./abisko/ANS_Prec.csv')),
		'AWS_Daily_1984-2019.csv': JSON.stringify(require('./abisko/AWS_Daily_1984-2019.csv')),
		'ANS_SnowDepth.csv': JSON.stringify(require('./abisko/ANS_SnowDepth.csv')),
		'ANS_Temp_Prec.csv': JSON.stringify(require('./abisko/ANS_Temp_Prec.csv')),
		'Tornetrask-data.csv': JSON.stringify(require('./abisko/Tornetrask-data.csv')),
		'Tornetrask_islaggning_islossning.csv': JSON.stringify(require('./abisko/Tornetrask_islaggning_islossning.csv')),
	}
}

exports.generateDemo = function(){

}

