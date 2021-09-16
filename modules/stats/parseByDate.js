const help = require('./../helpers.js');
const regression = require('regression')
var struct = require('./struct.js').struct
var parseByDate = function (values, type='mean', src='', custom) {
	return new Promise((res, rej) => {

		var keys = Object.keys(values[0])
		var frame = {
			weeks: {},
			yrly: {},
			yrlyTest: {},
			yrlyFull: {},
			yrlySplit: {},
			decades: {},
			monthly: {},
			spring: {},
			summer: {},
			autumn: {},
			winter: {},
			customPeriod: {},
			DOY: {},
			meta: {
				src: src,
			}
		}
		const data = {
			weeks: {},
			yrly: {},
			yrlyTest: {},
			yrlyFull: {},
			yrlySplit: {},
			decades: {},
			monthly: {},
			spring: {},
			summer: {}, 
			autumn: {},
			winter: {},	
			customPeriod: {},
			DOY: {},
			meta: {
				src: src,
			},
			insert: function(entries){
				var result = Object.assign({}, frame);
				// TODO build to general function to be use for all functions
				var set = function(entry, key, date){
					var insert = (...k) => {
						return function(data = result, e = entry){
							var kn = k[0]
							if(!data[kn]){
								if(k.length > 1){
									data[kn] = insert(...(k.slice(1)))({})
								}else{
									data[kn] = struct.create([],kn,type);
								}
							}else{
								if(k.length > 1){
									data[kn] = insert(...(k.slice(1)))(data[kn]);
								}else{
									data[kn].values.push(e)
								}
							}
							return data;
						}
					}

					var year = date.getFullYear();
					entry.year = year;
					if(!years[year+'']) years[year] = year+'';
					// entry.month = date.getMonth();
					// entry.week = date.getWeekNumber();
					// entry.monthName = help.monthByIndex(entry.month)
					// entry.season = help.getSeasonByIndex(entry.month);
					// entry.decade = entry.year - entry.year % 10;
					// entry.key = key;
					// result.all.push(entry)
					var year = date.getFullYear();
					var month = date.getMonth();
					var week = date.getWeekNumber();
					var monthName = help.monthByIndex(month)
					// Seasons	
					var season = help.getSeasonByIndex(month);
					insert(season, key, year)();
					insert('yrly', key, year)()

					// TODO test
					// insert('yrlyTest', key, year, month)()
					// insert('yrlyWeek', key, year, week)()
					// Decades
					var decade = year - year % 10;
					insert('decades', key, decade)()

					// split year over 6 month
					var splitYear = year;
					if(help.isFirstHalfYear(month)){
						splitYear = year - 1;	
					}	
					// split for Winter
					insert('yrlySplit', key, splitYear)();

					// decade month split
					insert('yrlyFull', decade, key, monthName)()

					// Monthly
					insert('monthly', monthName, key, year)()
					// Weeks
					// var wE = {};
					// Object.assign(wE, entry)
					// wE.x = week;
					// insert('weeks', key, year)(wE);
					insert('weeks', key, year, week)();
					// custom period
					if(custom){
						if(!result.customPeriod) result.customPeriod = {};
						if(!result.customPeriod[key]) result.customPeriod[key] = {};
						var pkey = custom(date);
						if(pkey) {
							if(!result.customPeriod[key][pkey]) result.customPeriod[key][pkey] = struct.create([],pkey,type);
							result.customPeriod[key][pkey].values.push(entry);
						}
					}

					return result;					
				}
				var years = []
				var build = function(entries){
					var values = {};
					entries.forEach(entry => {
						var date = undefined; 
						keys.forEach(key => {
							values = set(entry[key], key, new Date(entry[key].x));
						})
					})
					var construct = function(bValues, x){
						const str = [];
						try{
							Object.keys(bValues).forEach(key => {
								const entry = bValues[key];
								if(entry.build){
									str.push(entry.build(type))	
								}else{
									str.push(construct(entry, parseInt(key)))
								}
							})
							try{
								return struct.create(str, x).build(type)
							}catch(error){
								console.log("struct.create(str,x)")
								// console.log("str")
								// console.log(str);
								console.log("x");
								console.log(x);
								throw error
							}
						}catch(error){
							console.log(error)
							// console.log(str)
							console.log(x)
							console.log(bValues)
							// console.log(values)
							// console.log(struct.create(str, x))
							// console.log(entries)
							throw error
						}
					}
					// console.log(values.decades)
					return {
						values,
						parsed: {},
						request: function(key){
							return new Promise((res,rej) => {
								if(this.parsed[key]){
									res(this.values[key])
								}else{
									this.parsed[key] = true;
									switch(key){
										case 'monthly':
											Object.keys(this.values[key]).forEach(month => {
												keys.forEach(tkey => {
													this.values[key][month][tkey] = construct(this.values[key][month][tkey], parseInt(month))
												})
											})
											res(this.values[key])
											break;
										case 'weeks':
											// TODO
											// console.log(values[key])
											keys.forEach(tkey => {
												this.values[key][tkey] = construct(this.values[key][tkey])
											})
											res(this.values[key])
											break;
										case 'yrly':
											keys.forEach(tkey => {
												this.values[key][tkey] = construct(this.values[key][tkey])
											})
											res(this.values[key])
											break;
										case 'yrlyFull': 
											Object.keys(values[key]).forEach(year => {
												keys.forEach(tkey => {
													this.values[key][year][tkey] = construct(this.values[key][year][tkey], parseInt(year));
												})
											})
											res(this.values[key])
											break;
										case 'yrlyTest':
											res(this.values[key])
											break;
										case 'dailyExtremeHigh':
											this['yrly'].then(y => {
												this.values[key] = (y.max ? y.max : y.total).max(false);
												res(this.values[key])
											})
											break;
										case 'dailyExtremeMaxLim':
											this['yrly'].then(y => {

												// this.values[key] = (y.max ? y.max : y.total).occurrence((e) => 30 < e);
												this.values[key] = (y.max ? y.max : y.total),
												res(this.values[key])
											})
											break;
										case 'dailyExtremeMinLim':
											this['yrly'].then(y => {

												// this.values[key] = (y.max ? y.max : y.total).occurrence((e) => 30 < e);
												this.values[key] = (y.min ? y.min : y.total),
												res(this.values[key])
											})
											break;
										case 'weeksExtremeHigh':
											this['weeks'].then(y => {
												this.values[key] = (y.max ? y.max : y.total).max(false);
												res(this.values[key])
											})
											break;
										case 'yrlySplit':
											keys.forEach(tkey => {
												this.values[key][tkey] = construct(values[key][tkey])
											})
											res(this.values[key])
											break;
										case 'decades':
											Object.keys(this.values[key]).forEach(tkey => {
												this.values[key][tkey] = struct.create(Object.keys(this.values[key][tkey]).map(decade => {
													return this.values[key][tkey][decade] = val[tkey][decade].build(type);
												})).build(type);
											}) 
											res(this.values[key])
											break;
										case 'customPeriod': 
											Object.keys(this.values[key]).forEach(tkey => {
												this.values[key][tkey] = struct.create(Object.keys(this.values[key][tkey]).map(decade => {
													return this.values[key][tkey][decade].build(type);
												})).build(type);
											})
											this.parsed[key] = true;
											res(this.values[key])
											break;
										case 'meta':
											res(this.values[key])
											break;
										case 'season'|'spring'|'summer'|'winter'|'autumn':
											keys.forEach(tkey => {
												if(this.values[key][tkey]){
													this.values[key][tkey] = construct(this.values[key][tkey], help.seasons[key])
												}
											})
											this.parsed[key] = true;
											res(this.values[key])
											break;
										default:
											keys.forEach(tkey => {
												if(this.values[key][tkey]){
													this.values[key][tkey] = construct(this.values[key][tkey], help.seasons[key])
												}
											})
											this.parsed[key] = true;
											res(this.values[key])
											break;
									}
								}
							})
						},
						get: function(){
							return this.request('')	
						},
						get monthly() {
							return this.request('monthly')
						},
						get weeks() {
							return this.request('weeks')
						},
						get weeksExtremeHigh() {
							return this.request('weeksExtremeHigh')
						},
						get weeksExtremeHighLim() {
							return this.request('weeksExtremeHighLim')
						},
						get yrly() {
							return this.request('yrly')
						},
						get yrlyFull() {
							return this.request('yrlyFull')
						},
						get dailyExtremeHigh() {
							return this.request('dailyExtremeHigh')
						},
						get dailyExtremeMaxLim() {
							return this.request('dailyExtremeMaxLim')
						},
						get dailyExtremeMinLim() {
							return this.request('dailyExtremeMinLim')
						},
						get yrlySplit() {
							return this.request('yrlySplit')
						},
						get decades() {
							return this.request('decades')
						},
						get customPeriod() {
							return this.request('customPeriod')
						},
						get meta() {
							return this.request('meta')
						},
						get spring() {
							return this.request('spring')
						},
						get summer() {
							return this.request('summer')
						},
						get autumn() {
							return this.request('autumn')
						},
						get winter() {
							return this.request('winter')
						},
						get yrlyTest() {
							return this.request('yrlyTest')
						},
					}
				}
				var answer = build(entries);
				return answer
			}
		}
		res(data.insert(values));
	})
}
exports.parseByDate = parseByDate;

