
var constant = require('../../config/const.json');
global.baselineLower = constant.baselineLower;
global.baselineUpper = constant.baselineUpper;
global.startYear = constant.startYear;

exports.baseline = {
	plotBandsDiff: function(id){
		return {
			color: 'rgb(245, 245, 245)',
			from: baselineLower,
			to: baselineUpper,
			label: {
				useHTML: true,
				text: "<div id="+id+"-plotBands-Label>Baseline</div>",
			},
			events: {
				click: function(e){
					// var lowLabel = document.getElementById(id+"lowLabel");
					// var uppLabel = document.getElementById(id+"uppLabel");
					// selectText(lowLabel);
					// document.getElementById(id+"overlay").style.display = "block";
				},
			}
		};
	},
	plotlines: function(id){
		return plotLines = [{
			color: 'rgb(160, 160, 160)',
			value: baselineUpper,
			width: 1,
			label: {
				useHTML: true,
				text: "<input id="+id+"uppLabel type=text class=input value="+baselineUpper+" maxlength=4 onclick=selectText(this) onchange=renderInterface.updatePlot("+id+","+baselineLower+",this.value)></input>",
				rotation: 0,
				y: 12,
			},
			zIndex: 1,
		},{
			color: 'rgb(160, 160, 160)',
			value: baselineLower,
			width: 1,
			label: {
				useHTML: true,
				text: "<input id="+id+"lowLabel type=text class=input value="+baselineLower+" maxlength=4 onclick=selectText(this) onchange=renderInterface.updatePlot("+id+",this.value,"+baselineUpper+")></input>",
				rotation: 0,
				textAlign: 'left',
				x: -40,
				y: 12,
			},
			zIndex: 5,
		}];
	},
	resetPlot: function(id){
		return function(a){
			return function(b){
				switch(a){
					case "baselineLower": 
						// console.log("Lower")
						baselineLower=b;
						break;
					case "baselineUpper": 
						// console.log("Upper")
						baselineUpper=b;
						break;	
					default: 
						break;
				}
				updatePlot(id.id);
			}
		}
	},
}
