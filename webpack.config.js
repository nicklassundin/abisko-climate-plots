const path = require('path');

module.exports = [{
	entry: {
		bundle: './modules/lib.js'
	},
	output: {
		filename: './bundle.js',
		path: __dirname + '/static'
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
	},
	node: {
		console: true,
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	}
},{
	entry: {
		bundle: './modules/map.js'
	},
	output: {
		filename: './map.js',
		path: __dirname + "/temp"
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
	},
	node: {
		console: true,
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	}
},{
	entry: {
		bundle: './modules/d3-map.js'
	},
	output: {
		filename: './d3-map.js',
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
	},
	node: {
		console: true,
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	}

}];

