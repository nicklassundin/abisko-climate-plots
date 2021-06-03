
// const preset = require('./parse.config.json');
var before = {
	smhi:  function(result){ 
		result = result.split('\n') 
		var line = result.findIndex(x => x.indexOf('Tidsutsnitt:') > -1) 
		var rest = result.splice(0,line);
		result = result.join('\r\n'); 
		rest = rest[1].split(';');
		global.stationName = rest[0];
		result.name = rest[0];
		return result 
	},
	abisko: function(result){ 
		result.name = 'Abisko';
		global.stationName = 'Abisko'; 
	}
}
exports.preset = function(meta){
	var res = preset[id];
	if(res.preset.beforeFirstChunk){
		var be = res.preset.beforeFirstChunk;
		res.preset.beforeFirstChunk = before[be];
	}
	return res;
}


