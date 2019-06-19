
/*****************************/
/* LOADING DATA HAPPENS HERE */
/*****************************/

// TODO cached parsing and generalization

var url = function(){
	return 'https://nicklassundin.github.io/abisko-climate-plots/';
}
var monthlyFunc = (render) => function(data, id, title, src="") {
	months().forEach(month =>  
		render(data[month], id+"_"+month, title+" "+monthName(month)));
};


var containerRender = (renderF, id, title, src) => function(data){
	renderF(data, id, title, src);
}

var papaF = {
	// gisstemp:{
	// 	preset: function(complete){
	// 		return {
	// 			// //worker: useWebWorker,
	// 			header: true,
	// 			delimiter: ',',
	// 			download: true,
	// 			skipEmptyLines: true,
	// 			dynamicTyping: true,
	// 			comments: 'Station',
	// 			complete: complete, 
	// 		};	
	// 	},
	// 	cached: undefined,
	// 	parser: parseGISSTEMP,
	// },
	zonal: {
		preset: {
			//worker: useWebWorker,
			header: true,
			delimiter: ',',
			download: true,
			skipEmptyLines: true,
			dynamicTyping: true,
		},
		cached: undefined,
		parser: parseGISSTEMPzonalMeans,
		render: {
			'64n-90n': renderTemperatureDifferenceGraph,
			'nhem': renderTemperatureDifferenceGraph,
			'glob': renderTemperatureDifferenceGraph,
		}
	},
	abisko: {
		preset:{
			//worker: useWebWorker,
			header: true,
			//delimiter: ';',
			download: true,
			skipEmptyLines: true,
			dynamicTyping: false,
		},
		cached: undefined,
		parser: parseAbiskoCsv,
		render: {
			'temperatures': {
				'yrly': renderTemperatureGraph,
				'summerTemps': renderAbiskoMonthlyTemperatureGraph,
				'winterTemps': renderAbiskoMonthlyTemperatureGraph,
				'monthlyTemps': monthlyFunc(renderAbiskoMonthlyTemperatureGraph),
				'difference': renderTemperatureDifferenceGraph,
			},

			'precipitation':{
				'yrly': renderYearlyPrecipitationGraph,
				'summerPrecipitation': renderYearlyPrecipitationGraph,
				'winterPrecipitation': renderYearlyPrecipitationGraph,
				'monthlyPrecip': monthlyFunc(renderMonthlyPrecipitationGraph),
				'difference': renderPrecipitationDifferenceGraph,
			},
			'growingSeason': renderGrowingSeasonGraph,

		}
	},
	tornetrask: {
		preset: {
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		cached: undefined,
		parser: parseAbiskoIceData,
		render: renderAbiskoIceGraph,
	},
	abiskoSnowDepth: {
		preset: {
			//worker: useWebWorker, TODO BUG waiting for response
			header: true,
			download: true,
			skipEmptyLines: true,
		},
		cached: undefined,
		parser: parseAbiskoSnowData,
		render: {
			'periodMeans': renderAbiskoSnowGraph,
			'decadeMeans': renderAbiskoSnowGraph,
		}
	}
}

var tagApply = function(data, tag){
	var result = data;
	try{
		tag.forEach(each => {
			result = result[each];
		})	
	}catch{
		result = result[tag]
	}
	return result;
}

var contFunc = (type,file, src) => function(id, title, tag, renderTag=tag){
	var op = papaF[type];
		// console.log(tag)
		// console.log(op)
	if(op.cached){
		var render = tagApply(op.render, renderTag);
		var data = tagApply(op.cached,tag);
		render(data,id,title)

	}else{	
		op.preset.complete = function(result){
			var data = op.parser(result);
			papaF[type].cached = data;
			if(tag) data = tagApply(data, tag);
			var render = op.render;
			if(tag){
				render = tagApply(render, renderTag);
			}
			// TODO render all when tag=true
			render(data,id,title)
		};
		Papa.parse(url()+''+file, op.preset)
	}
}

