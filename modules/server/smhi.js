const request = require('request');

// CONSTANTS
var SMHI_STATION_NAME_URL = "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/4.json";
var SMHI_STATION_URL = ["https://opendata-download-metobs.smhi.se/api/version/latest/parameter/","/station/","/period/","/data.csv"];

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

var smhiParam = {
	temp: {
		id: 1,
		url: SMHI_PARAM+'1.json'
	},
	perc: {
		id: 5,
		url: SMHI_PARAM+'5.json'
	} 
}

var get_smhi_station_url = function(ID, param, period=smhi.archive){
	var res = SMHI_STATION_URL[0]+param+SMHI_STATION_URL[1]+ID+SMHI_STATION_URL[2]+period+SMHI_STATION_URL[3];
	return res;
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

var restApiStations = function(parmFile=smhiParam.temp){
	return new Promise((resolve, reject) => {
		console.log(parmFile.url)
		request({
			url: parmFile.url,
			json: true,
			path: '/',
			method: 'GET',
		}, function(error, response, body) {
			if(error){
				reject(error);
			}else{
				resolve(body);
			}
		})
	})
}
exports.stations = restApiStations; 

exports.init = function(app){
	var smhiRestApi = function(body, parmFile, fileName, type='text/csv'){
		app.get( '/data/'+fileName+'/smhi', (req, res) => {
			res.send(body);
		})
		Object.keys(body.station).forEach(key => {
			var id = body.station[key].id;
			app.get( '/data/'+id+"/"+fileName+".csv", (req, res) => {
				request({
					url: get_smhi_station_url(id, parmFile.id),
					json: true,
					path: '/',
					method: 'GET',
				}, function(error, response, body){
					res.set('Content-Type', type);
					res.status(200).end(body);
				})
			});
		})
	}

	restApiStations(smhiParam.perc).then((result) => {
		smhiRestApi(result, smhiParam.perc, "precipitation")
	})
	restApiStations(smhiParam.temp).then((result) => {
		smhiRestApi(result, smhiParam.temp, "temperature")
	})
}
