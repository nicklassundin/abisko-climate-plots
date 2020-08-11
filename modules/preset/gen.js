

const url = require('url');
exports.custom = new Promise((resolve, reject) => {
	var res = require('../../config/preset.json')
	require('../../config/preset.js').preset.then(data => {
		var str = JSON.stringify(data);
		if(str != JSON.stringify(res)){
			fs.writeFile('../../config/preset.json', str, (error) => {
				if(error){
					console.log(error)
				}else{

				}
			})
		}
	}).then(() => {
		resolve(require('../../config/preset.json'))
	})
})
exports.constants = require('../../config/const.json');

