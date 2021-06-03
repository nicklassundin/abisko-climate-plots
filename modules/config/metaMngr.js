exports.meta = {
	// metaTable: function(id, json, i=0){
	// 	Object.keys(json).forEach(index => {
	// 		var key = Object.keys(this.metaRef)[index];
	// 		if(typeof(this.metaRef[key]) == 'string'){
	// 			$('#'+id).append('<div id="'+id+'_cont"></div>');
	// 			$('#'+id+'_cont').append('<div id="'+id+'_button_'+key+'" class="mini_button">- '+key+'</div><br/>')
	// 			$('#'+id+'_cont').append('<div id="'+id+'_box_'+key+'" class="box"></div>');
	// 			$('#'+id+'_box_'+key).append('<textarea id="'+id+'_box'+key+'_textarea" class="json" cols="80">'+JSON.stringify(json[index], undefined, 4)+'</textarea>')
	// 			$('#'+id+'_box_'+key).append('<br/>')
	// 			$("#"+id+'_button_'+key).click(function(){
	// 				$("#"+id+"_box_"+key).slideToggle();
				// });
			// }
		// })
	// },
	getMeta: function(station, id){
		var metaRef = new Promise((res,rej) => {
			$.getJSON(hostUrl+'/static/charts/'+station+'/'+id+'.json', function(result){
				res(result)
			})
		}).catch(error => {
			console.log(id)
			console.log(error)
			throw error
		})
		var textMorph = this.textMorph;
		try{
			return new Promise((res,rej) => {
				metaRef.then(files => {

				res({
					files: files,
					aggr: function(){
						var aggr = {};
						$.extend(true, aggr, files.config, files.set, files[nav_lang])
						return aggr;
					},
					text: function(){
						var iter = function(obj, meta=obj){
							var res = {};
							Object.keys(obj).forEach(key => {
								if(typeof(obj[key]) == 'object'){
									res[key] = iter(obj[key], meta)
								}else if(typeof(obj[key]) == 'string'){
									res[key] = textMorph(obj[key], meta) 
								}else{
									res[key] = obj[key];
								}
							})
							return res;
						}
						return iter(this.aggr())
					} 
				})
				})
			})
		}catch(ERROR){
			console.log(files)
			console.log(define)	
			throw ERROR
		}
	},
	textMorph: function(res, meta){
		if(res){
			try{
				// TODO order of month replace for subsets
				var res = res.replace("[stationName]", stationName)

				var set = (meta.subset ? meta.subset.enabled : false) ? meta.months[meta.subset.set] : undefined;
				res = (meta.subset ? meta.subset.enabled : false) ? res.replace("[month]", set) : res.replace("[month]", meta.month)
				res = res.replace("[baseline]", baselineLower +" - "+ baselineUpper)
				res = res.replace("[CO2]", 'CO'+("2".sub()))
				res = res.replace("[SOME TEXT]", "")
				if(meta.unitType && meta.units){
					var res = res.replace("[unit]", meta.units[meta.unitType].singular).replace("[units]", meta.units[meta.unitType].plural).replace("[interval]", meta.units[meta.unitType].interval);
				}
			}catch(error){
				console.log(this.id)
				console.log(text)
				console.log(meta)
				console.log(error)
				throw error;
			}
		}else{
			res = "";
		}
		return res
		// return res
	},
}
