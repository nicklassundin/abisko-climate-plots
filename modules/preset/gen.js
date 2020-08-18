const url = require('url');
exports.custom = new Promise((resolve, reject) => {
	var res = {};
	try{
		res = require('../../config/preset.json')
	}catch(ERROR){
		// console.log(ERROR)
	}
	require('../../config/preset.js').preset.then(data => {
		var str = JSON.stringify(data);
		if(str != JSON.stringify(res)){
			resolve(JSON.parse(str));
		}else{
			resolve(res);	
		}
	})
})
exports.constants = require('../../config/const.json');

