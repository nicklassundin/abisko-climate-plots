var $ = require('jquery');
const request = require('request');

// CONSTANTS
var SMHI_STATION_NAME_URL = "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/4.json";
var SMHI_STATION_URL = ["https://opendata-download-metobs.smhi.se/api/version/latest/parameter/1/station/","/period/","/data.csv"];

var SMHI_PARAM = "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/";

var smhi = {
	archive: 'corrected-archive',
	months: 'latest-months',
	days: 'latest-day',
	hour: 'latest-hour',
}

// return array of all TODO generalize with WMO, currently only accept SMHI_STATION_NAME_URL
// TODO input generalize function for different html documents
var getName = function(url,i) {
	var res = $.getJSON(url, function(json) {
		// console.log(json.station[0]);
		// console.log(json.station);
		console.log(json.station[i])	
		var name = "<li>"+json.station[i].name+"</li>";
		$("<ul/>",{
			"class": "Station Name",
			html: name
		}).appendTo("body");

	})
		.done(function() {
			console.log( "Get JSON done" );
		})
		.fail(function(jqxhr, textStatus, error) {
			console.log( "Get JSON error" );
		})
		.always(function() {
			console.log( "Get JSON complete" );
		})
}
// $(document).ready(getName(SMHI_STATION_NAME_URL, 0));

// // input ID from station and period currently string "latest-months"
var get_smhi_param = function(param='1.json'){
	var res = SMHI_PARAM+param
	return res;

}
var get_smhi_station_url = function(ID, period){
	var res = SMHI_STATION_URL[0]+ID+SMHI_STATION_URL[1]+period+SMHI_STATION_URL[2];
	return res;
}

// TODO
var get_wmo_station_url = function(ID){
	// TODO read up on API
}

// TODO Time;Temp_avg;Temp_min;Temp_max;Precipitation
// example string: "1913-01-01;-10,0;-13,6;-2,7;0,1"
var temp_prec_csv_row = function(Time,Temp_avg,Temp_min,Temp_max,Percipitation) {

}
// TODO Build csv file
var buildCSVFile = function(){

}
// TEMP get temprature from SMHI 
// TODO generalize function for WMO
var getTempSMHI = function(id, type){
	url = get_smhi_station_url(id, smhi[type]);
	var res = $.getJSON(url, function(json) {
		var values = json.value;
		var item = [];
		values = values.map(each => ({
			'date': new Date(each['date']),
			'value': each['value'],
			'quality': each['quality']
		}))
		// console.log(values)
		// item.push("<li>"+values[0].value+"</li>") // only picks out one point TODO transform to pick out all

		// $("<ul/>", {
		// 	"class": "station temperature",
		// 	html: item
		// }).appendTo("body");
	}).done(function() {
		console.log("get JSON getTempSMHI done");
	}).fail(function(jqxhr, textStatus,error) {
		console.log("get JSON error");
	}).always(function() {
		console.log("get JSON finished");
	});
	return res
}

// $(document).ready(getTempSMHI(get_smhi_station_url(159880, smhi.months)));


var csv_smhi_json = function(id, type){
	url = get_smhi_station_url(id, smhi[type]);
	result = $.getJSON(url, function(json) {
		var values = json.value;
		var item = [];
		// item.push("<li>"+values[0].value+"</li>") // only picks out one point TODO transform to pick out all
		// $("<ul/>", {
		// 	"class": "station temperature",
		// 	html: item
		// }).appendTo("body");
	}).done(function() {
		console.log("get JSON getTempSMHI done");
	}).fail(function(jqxhr, textStatus,error) {
		console.log("get JSON error");
	}).always(function() {
		console.log("get JSON finished");
	});
	return result
}

var latestMonths = function(id){
	return $(document).ready(getTempSMHI(get_smhi_station_url(id, "latest-months")));
}


exports.init = function(app, TYPE){
	console.log(get_smhi_param("1.json"));
	request({
		url: get_smhi_param("1.json"),
		json: true,
		path: '/',
		method: 'GET',
	}, function(error, response, body) {
		Object.keys(body.station).forEach(key => {
			var id = body.station[key].id;
			app.get( '/data/'+id+"/temperature.csv", (req, res) => {
				request({
					url: get_smhi_station_url(id, TYPE),
					json: true,
					path: '/',
					method: 'GET',
				}, function(error, response, body){
					// res.setHeader('Content-disposition', 'attachment; filename=customers.csv');
					res.set('Content-Type', 'text/csv');
					res.status(200).end(body);
				})
			});
		})

	});
}
