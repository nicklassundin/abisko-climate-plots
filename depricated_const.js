var charts = {};

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

// Localization

/*****************/
/* RENDER GRAPHS */
/*****************/

const highcharts_Settings = {
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
		sourceWidth: 1200,
		sourceHeight: 600,
		scale: 2,
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

