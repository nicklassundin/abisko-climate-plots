var $ = require('jquery');
var d3 = require('d3');
var geo = require('geo');
var topojson = require('topojson-client');
var municipalities = require('../maps/sweden-municipalities.json');
var sweden = require('../maps/sweden-counties.json');

var stations = require('./map.js').series;

geoMap = function(){
	var clientWidth = document.body.clientWidth;
	var hConst = 730/330;
	var m_width = $("#map").width(),
		width = clientWidth / 2,
		height = hConst * width ;
	// console.log(width)
	// console.log(height)
	var projection = d3.geoAlbers()
		.center([0, 62.30])
		.rotate([-17, 0])
		.parallels([50, 60])
		.scale(3000)
		.translate([width / 2, height / 2]);

	var path = d3.geoPath()
		.projection(projection);

	var svg = d3.select("#map").append("svg")
		.attr("preserveAspectRatio", "xMidYMid")
		.attr("viewBox", "0 0 " + width + " " + height)
		.attr("width", m_width)
		.attr("height", m_width * height / width);

	// svg.append("rect")
	// .attr("class", "background")
	// .attr("width", width)
	// .attr("height", height)
	// .on("click", country_clicked);

	var g = svg.append("g");
	// console.log(sweden)
	// console.log(topojson.feature(sweden, sweden.objects.SWE_adm1).features)
	g.append("g")
		.attr("id", "Municipality")
		.selectAll("path")
		.data(topojson.feature(sweden, sweden.objects.SWE_adm1).features)
		.enter()
		.append("path")
		.attr("id", function(d) { 
			return d.NAME_1; })
		.attr("d", path)
	// .on("click", country_clicked);

	stations.then(function(entries){
		svg.selectAll(".pin")
			.data(entries)
			.enter().append("circle", ".pin")
			.attr("class", "dot")
			.attr("id", function(d){
				return d.id
			})
			.attr("r", 2)
			.attr("fill", "red")
			.attr("transform", function(d) {
				return "translate(" + projection([
					d.lon,
					d.lat
				]) + ")";
			})
			.on("mouseover", function(d) {      
				// svg.selectAll("#"+d.id)
				// 	.attr("r", 5);
			})                  
			.on("mouseout", function(d) {       

			}).on("onclick", function(d){
				console.log(d)
			});

	})


	$(window).resize(function() {
		var w = $("#map").width();
		svg.attr("width", w);
		svg.attr("height", w * height / width);
	});
}
