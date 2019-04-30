// CONSTANTS
var SMHI_STATION_NAME_URL = "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/4.json";
var SMHI_STATION_URL = ["https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station/","/period/","/data.json"];



// return array of all TODO generalize with WMO, currently only accept SMHI_STATION_NAME_URL
// TODO input generalize function for different html documents
function getName(url,i) {
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
$(document).ready(getName(SMHI_STATION_NAME_URL, 0));

// // input ID from station and period currently string "latest-months"
function get_smhi_station_url(ID, period){
	var res = SMHI_STATION_URL[0]+ID+SMHI_STATION_URL[1]+period+SMHI_STATION_URL[2];
	return res;
}

// TODO
function get_wmo_station_url(ID){
	// TODO read up on API
}

// TODO Time;Temp_avg;Temp_min;Temp_max;Precipitation
// example string: "1913-01-01;-10,0;-13,6;-2,7;0,1"
function temp_prec_csv_row(Time,Temp_avg,Temp_min,Temp_max,Percipitation) {

}
// TODO Build csv file
function buildCSVFile(){
	
}

// TEMP get temprature from SMHI 
// TODO generalize function for WMO
function getTempSMHI(url){
	var res = $.getJSON(url, function(json) {
		var values = json.value;
		var item = [];
		item.push("<li>"+values[0].value+"</li>") // only picks out one point TODO transform to pick out all
		$("<ul/>", {
			"class": "station temperature",
			html: item
		}).appendTo("body");
	}).done(function() {
		console.log("get JSON getTempSMHI done");
	}).fail(function(jqxhr, textStatus,error) {
		console.log("get JSON error");
	}).always(function() {
		console.log("get JSON complete");
	});
}

$(document).ready(getTempSMHI(get_smhi_station_url(159880, "latest-months")));


function csv_smhi_json(url){
	var res = $.getJSON(url, function(json) {
		var values = json.value;
		var item = [];
		item.push("<li>"+values[0].value+"</li>") // only picks out one point TODO transform to pick out all
		$("<ul/>", {
			"class": "station temperature",
			html: item
		}).appendTo("body");
	}).done(function() {
		console.log("get JSON getTempSMHI done");
	}).fail(function(jqxhr, textStatus,error) {
		console.log("get JSON error");
	}).always(function() {
		console.log("get JSON complete");
	});
}

$(document).ready(getTempSMHI(get_smhi_station_url(159880, "latest-months")));
