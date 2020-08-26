var $ = require('jquery');
// var fs = require('fs');
var stations = require('./server/smhi.js').stations();
// var Highcharts = require('highcharts/highmaps');
var series = new Promise((resolve, reject) => {
	stations.then((entries) => {
		result = entries.station;
		var refDate = (new Date(1950, 1, 1)).getTime()
		var endDate = new Date().getTime();
		// console.log(refDate)
		// console.log(endDate)
		// console.log(result.length);
		// result = result.filter((each) => {
		// 	if(each.from < refDate){
		// 		return true
		// 	}else{
		// 		return false
		// 	}
		// })
		// // console.log(result.length);
		var result = result.map(each => {
			return {
				name: each.name,
				lat: each.latitude,
				lon: each.longitude,
				id: each.id,
			}
		});
		
		resolve(result);
	})
});
exports.series = series;
// Initiate the chart
map = function(id){
	series.then((data) => {
		Highcharts.mapChart(id, {
			chart: {
				map: 'countries/se/se-all'
			},

			title: {
				text: 'Highmaps basic lat/lon demo'
			},

			mapNavigation: {
				enabled: true
			},

			tooltip: {
				headerFormat: '',
				pointFormat: '<b>{point.name}</b><br>Lat: {point.lat}, Lon: {point.lon}'
			},

			series: [{
				// Use the gb-all map with no data as a basemap
				name: 'Basemap',
				borderColor: '#A0A0A0',
				nullColor: 'rgba(200, 200, 200, 0.3)',
				showInLegend: false
			}, {
				name: 'Separators',
				type: 'mapline',
				nullColor: '#707070',
				showInLegend: false,
				enableMouseTracking: false
			}, {
				// Specify points using lat/lon
				type: 'mappoint',
				name: 'Cities',
				color: Highcharts.getOptions().colors[1],
				data: data
			}]
		});
	})

}
