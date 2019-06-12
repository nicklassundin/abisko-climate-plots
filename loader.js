
/*****************************/
/* LOADING DATA HAPPENS HERE */
/*****************************/

var url = function(){
		return 'https://nicklassundin.github.io/abisko-climate-plots/';
}

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
		Papa.parse(url()+''+file, {
			// //worker: useWebWorker,
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
		Papa.parse(url()+''+file, {
			//worker: useWebWorker,
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

var parseAbisko = (file, src='') => function (renderF, id, title, tag) {
	var cached;
	// console.log("parseAbiskoGen")
	// console.log(file)
	// console.log(id)
	var complete = (data) => {
		var rend = containerRender(renderF, id, title);

		// console.log(data[tag])
		if(Array.isArray(renderF)){
			rend.forEach(each(data[tag]));
		}else{
			rend(data[tag]);
		}
	}
	if (cached) {
		complete(cached);

	}else {
		Papa.parse(url()+''+file, {
			//worker: useWebWorker,
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
	}
	return complete;
};

var monthlyFunc = (render) => function(data, id, title, src="") {
	months().forEach(month =>  
		render(data[month], id+"_"+month, title+" "+monthName(month)));
};

var parseTornetrask = function (file='data/Tornetrask_islaggning_islossning.csv', src='') {
	Papa.parse(url()+''+file, {
		//worker: useWebWorker, TODO BUG waiting for response
		header: true,
		download: true,
		skipEmptyLines: true,
		complete: (result) => {
			var data = parseAbiskoIceData(result, src);
			renderAbiskoIceGraph(data, 'abiskoLakeIce', 'Torneträsk - Freeze-up and break-up of lake ice vs ice time');
		},
	});
};

var parseSnowDepth = function (file='data/ANS_SnowDepth.csv', src='') {
	Papa.parse(url()+''+file, {
		//worker: useWebWorker, TODO BUG waiting for response
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
