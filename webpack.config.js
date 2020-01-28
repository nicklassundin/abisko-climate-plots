const path = require('path');

module.exports = {
	entry: {
    		bundle: './modules/lib.js'
  	},
	output: {
		filename: './bundle.js',
    		path: __dirname + '/client'
	},
	module: {
		rules: [
			{
				test: /\.txt$/, 
				loader: 'raw-loader'
			},{
				test: /\.csv$/,
				loader: 'csv-loader',
				// options: {
					// header: true,
					// download: true,
					// skipEmptyLines: true
				// }
			}
		]
	}
};

