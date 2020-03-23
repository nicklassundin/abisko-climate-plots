const language = require('./language.json');

// require('../modules/lib.js')
if(typeof nav_lang !== 'undefined' && nav_lang ){

}else{
	global.nav_lang = 'en';
}


var charts = {};
exports.charts = charts;

var updatePlot = function(id, bl, bu, date){
	if(date){
		date = date.split("-");
		variables.date = new Date(date[0],Number(date[1])-1,date[2]);
	}
	if(id.id) id=id.id; // TODO fix why this it gets a div not id
	if(id.renderTo) id=id.renderTo.id;
	var low = document.getElementById(id+"lowLabel") 
	var upp = document.getElementById(id+"uppLabel") 
	if(low){
		if(!bl) bl = low.value;
		if(!bu) bl = upp.value;
	} 
	if(bl<bu && bl>=1913) baselineLower=bl;
	if(bu>bl && bu<2019) baselineUpper=bu;
	var chart = charts[id]
	if(id.split('_')[1]) id = id.split('_')[0]
	var div = document.getElementById(id);
	chart.destroy();
	return buildChart(div,ids=id,reset=true)
}
global.updatePlot = updatePlot;

var preSetMeta = {
	'abiskoTemp': {
		src: 'https://www.arcticcirc.net/',
		vis: {
			movAvgCI: false,
			max: false,
			min: false,
		},
		color: {
			yrlyReg: '#888888',	
		},
	},
	'default': {
		src: undefined,
		vis: {
			movAvgCI: true,
			max: true,
			min: true,
		},
		color: {
			yrlyReg: '#4444ff',
		},

	}
}

exports.highcharts_Settings = {
	dataSrc: '',
	lang: language[nav_lang],
	chart: {
		events: {
			// dblclick: function () {
			// console.log('dbclick on chart')
			// },
			// click: function () {
			// console.log('click on chart')
			// },
			contextmenu: function () {
				console.log('right click on chart')
			}
		},
	},
	exporting: {
		chartOptions: {
			// annotationsOptions: undefined,
			// annotations: undefined,
		},
		// showTable: true, // TODO DATA TABLE
		// printMaxWidth: 1200,
		sourceWidth: 900,
		// sourceHeight: 800,
		scale: 8,
		// allowHTML: true,
		buttons: {
			contextButton: {
				menuItems: [{
					textKey: 'downloadPDF',
					onclick: function(){
						this.exportChart({
							type: 'application/pdf'
						});
					},
				},{
					textKey: 'downloadJPEG',
					onclick: function(){
						this.exportChart({
							type: 'image/jpeg'
						});
					}
				},'downloadSVG','viewFullscreen','printChart',{
					separator: true,
				},{
					textKey: 'langOption',
					onclick: function(){
						if(nav_lang=='en') nav_lang='sv';
						else nav_lang='en';
						Highcharts.setOptions({
							lang: language[nav_lang],
						})	
						var id = this.renderTo.id.split('_')[0];
						updatePlot(this);
					},
				},{
					textKey: 'showDataTable',
					onclick: function(){
						if(this.options.exporting.showTable) {
							this.dataTableDiv.innerHTML = '';
						};
						this.update({
							exporting: {
								showTable: !this.options.exporting.showTable, 
							},
						});
						// TODO toggle between 'Show data' and 'Hide data'
					},
				},{
					textKey: 'dataCredit',
					onclick: function(){
						if(this.options.dataSrc){
							window.location.href = this.options.dataSrc // TODO link to exact dataset with entry in data to href
						}
					},
				},{
					textKey: 'contribute',
					onclick: function(){
						window.location.href = 'https://github.com/nicklassundin/abisko-climate-plots/wiki';
					},
				}],
			},
		},
	},
};
