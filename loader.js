
/*****************************/
/* LOADING DATA HAPPENS HERE */
/*****************************/

// TODO cached parsing and generalization
var containerRender = (renderF, id, title, src) => function(data){
	renderF(data, id, title, src);
}

var functorGISSTEMP = (file, renderF, src='') => function(id, title){
	// console.log(title);
	// console.log(file)
	var cached;
	var complete = (result) => {
		var data = parseGISSTEMP(result, src)
		cached = data;
		renderF(data, id, title)
	};
	if (cached) renderF(cached, id, title)
	else {

		Papa.parse(file, {
			worker: useWebWorker,
			header: true,
			delimiter: ',',
			download: true,
			skipEmptyLines: true,
			dynamicTyping: true,
			comments: 'Station',
			complete: function (result) {
				// console.log(title)
				// console.log(result)
				var data = parseGISSTEMP(result, src);
				// console.log(data)
				renderF(data, id, title);
			},
		});
	}
};

var parseZonal = (file, src='') => function (renderF, tag) {
	var complete = (data) => {
		if(Array.isArray(renderF)){
			renderF.forEach(each(data[tag]));
		}else{
			renderF(data[tag]);
		}
	}
	var cached;
	if(cached){
		return complete(cached);
	}else{
		Papa.parse(file, {
			worker: useWebWorker,
			header: true,
			delimiter: ',',
			download: true,
			skipEmptyLines: true,
			dynamicTyping: true,
			complete: function(result) {
				var data = parseGISSTEMPzonalMeans(result, src);
				var cached = data;
				complete(data);
			}, 
		});
	}
	return complete;
};

var parseAbiskoGen = (file, src='') => function (renderF, id, title, tag) {
	var cached;
	var complete = (data) => {
		var rend = containerRender(renderF, id, title);

		// console.log(data)
		if(Array.isArray(renderF)){
			rend.forEach(each(data[tag]));
		}else{
			rend(data[tag]);
		}
	}
	if (cached) complete(cached)
	else {

		Papa.parse(file, {
			worker: useWebWorker,
			header: true,
			//delimiter: ';',
			download: true,
			skipEmptyLines: true,
			dynamicTyping: false,
			complete: function(result){
				var data = parseAbiskoCsv(result, src);
				var cached = data;
				complete(data)
			}
		});
		return complete;
	}
};


var parseAbisko = function (file, src='') {
	var cached;

	var complete = (result) => {
		if (cached) result = cached;
		else cached = result;
		var data = parseAbiskoCsv(result, src);
		var summerRange = monthName(summerMonths[0]) + ' to ' + monthName(summerMonths[summerMonths.length - 1]);
		var winterRange = monthName(winterMonths[0]) + ' to ' + monthName(winterMonths[winterMonths.length - 1]);

		months().forEach(month =>
			renderAbiskoMonthlyTemperatureGraph(data.monthlyTemps[month], 'monthlyAbiskoTemperatures_' + month, 'Abisko temperatures for ' + monthName(month)));

		renderGrowingSeasonGraph(data.growingSeason, 'growingSeason');

		months().forEach(month =>
			renderMonthlyPrecipitationGraph(data.monthlyPrecipitation[month], 'monthlyPrecipitation_' + month, 'Precipitation for ' + monthName(month)));

	}

	Papa.parse(file, {
		worker: useWebWorker,
		header: true,
		//delimiter: ';',
		download: true,
		skipEmptyLines: true,
		dynamicTyping: false,
		complete,
	});

	return complete;
};

var parseTornetrask = function (file='data/Tornetrask_islaggning_islossning.csv', src='') {
	Papa.parse(file, {
		worker: useWebWorker,
		header: true,
		download: true,
		skipEmptyLines: true,
		complete: (result) => {
			var data = parseAbiskoIceData(result, src);
			renderAbiskoIceGraph(data, 'abiskoLakeIce', 'Torneträsk - Freeze-up and break-up of lake ice vs ice time');
		},
	});
};

var parseSnowDepth = function (file='data/ANS_SnowDepth_1913-2017.csv', src='') {
	Papa.parse(file, {
		worker: useWebWorker,
		header: true,
		download: true,
		skipEmptyLines: true,
		complete: (result) => {
			var data = parseAbiskoSnowData(result,src);
			renderAbiskoSnowGraph(data.periodMeans, 'abiskoSnowDepthPeriodMeans', 'Monthly mean snow depth for Abisko');
			renderAbiskoSnowGraph(data.decadeMeans, 'abiskoSnowDepthPeriodMeans2', 'Monthly mean snow depth for Abisko');
		},
	});
};
