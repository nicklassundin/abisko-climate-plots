const help = require('./../helpers.js');
const regression = require('regression')
// const { JSDOM } = require( "jsdom" );
// const { window } = new JSDOM( "" );
// const $ = require( "jquery" )( window );

var struct = {
	type: 'mean',
	meta: 		{
		fields: [],
		src: '',
	},
	values: 	[],
	x: 		undefined,
	y: 		undefined,
	count:		undefined,
	filter: function(f, type=this.type, abs = true){
		var value = [];
		if(this.values[0].filter && abs){
			this.values.forEach(entry => {
				value.push(entry.filter(f, type));
			})
			return value;

		}else{
			return f(this);
		}
		// return struct.create(value, this.x, this.meta.src ).build(type);
	},
	split: function(f){
		if(this.values[0].split){
			return struct.create(this.values.map(each => {
				return each.split(f);
			}), this.x, src)
		}else{
			return struct.create(f(this.values), this.x, src)	
		}
	},
	filterForm: function(f, type, abs) {
		try{
			if(this.values[0].values){ // .values replace .filter ? TODO check
				return struct.create(this.values.map(each => each.filter((entry) => {
					var y = f(...entry.values.map(each => each.y));
					var date = entry.values.filter((each) => each.y == y).map(each => new Date(each.x));
					return {
						subX: date,
						y: y,
						x: entry.x
					}
				}, type, abs))).build();
			}else{
				return struct.create(this.filter((entry) => {
					var y = f(...entry.values.map(each => each.y));
					return {
						subX: entry.values.filter((each) => each.y == y).map(each => new Date(each.x)),	
						y: y, 
						x: entry.x
					}
				}, type, abs)).build()
			}
		}catch(error){
			// console.log(this.values)
			console.log(error);
			return { values: undefined }
		}
	},
	min: function(abs = true){
		return this.filterForm(Math.min, 'min', abs);
	},
	max: function(abs = false){
		return this.filterForm(Math.max, 'max', abs);
	},
	last: function(f = (e) => { return e.y <= 0 }, type=this.type){
		var res = this.filter((entry) => {
			var values = entry.values.filter(f);
			var date = new Date(Math.max(...Object.values(values).map(each => (new Date(each.x).getTime())))) 
			return {
				fullDate: date,
				year: date.getYear() + 1900,
				month:date.getMonth(),
				date: date.getDate(),
				strDate: date.getYear() + 1900+'-'+date.getMonth()+'-'+date.getDate(),
				y: help.dayOfYear(date),
				x: entry.x
			}
		})
		res.splice(-1, 1);
		return struct.create(res).build();
	},
	first: function(f = (e) => { return e.y <= 0 }, type=this.type){
		var res = this.filter((entry) => {
			var values = entry.values.filter(f);
			var date = new Date(Math.min(...Object.values(values).map(each => (new Date(each.x).getTime())))) 
			return {
				fullDate: date,
				year: date.getYear() + 1900,
				month:date.getMonth(),
				date: date.getDate(),
				strDate: date.getYear() + 1900+'-'+date.getMonth()+'-'+date.getDate(),
				y: help.dayOfYear(date),
				x: entry.x
			}
		})
		res.shift();
		return struct.create(res).build();
	},
	sequence: function(f=(e)=>{ return e > 0 }){
		var values = this.values.map(each => {
			var res = {};
			this.keys.forEach(key => {
				res[key] = each[key]
			})
			res.y = f(each.y) ? 1 : 0;
			res.x = this.x;
			res.start = each.x;
			res.end = each.x;
			return res;
		})
		var max = values.reduce((a, b) => {
			if(b.y > 0){
				if(a.length > 0){
					var i = a.length-1
					if(a[i].y > 0){
						a[i].y += b.y;
						a[i].end = b.end;
					}else{
						a.push(b);
					}
				}else{
					a.push(b);
				}
			}else{
				a.push(b)
			}
			return a;
		}, [])
		// console.log(max)
		// fsdfsd
		return struct.create(max,this.x).build('max')
	},
	variance: function(){
		switch(this.type){
			case "sum":
				return this.count*variance(this.values.map(each => each.y))	
				break;
			default:
				return variance(this.values.map(each => each.y))
		}
	},
	ci: function(){
		return help.confidenceInterval(this.y, this.variance(), this.count);
	},
	plotCI: function(){
		var result = [];
		var e = this.ci()
		var y = this.y;
		this.values.forEach(each => {
			if(each.ci) {
				e = each.ci();
				y = each.y
			}
			result.push({
				x: each.x,
				high: e.high+(each.y-y),
				low: e.low+(each.y-y),
			})
		})
		return result;
	},
	closest: function(date){
		const oneDay = 24 * 60 * 60 * 1000;
		var distance = new Array();
		this.values.forEach(each => {
			var temp = new Date(each.x);
			var end = new Date(temp.getYear() + 1900, 11, 31);
			var start = new Date(temp.getYear() + 1900, 0, 1);
			var days = Math.round(Math.abs((start - end) / oneDay));
			var degree = 360 / days;
			date = new Date(temp.getYear() + 1900, date.getMonth(), date.getDate())
			var dis = Math.round(Math.abs((date - temp) / oneDay));
			var degrees = dis * degree;
			// if(degrees > 180) degrees = 360 - degrees;
			distance.push(Math.round(degrees / degree));
		})
		var min = Math.min.apply(null, distance);
		// console.log(distance)
		var values = this.values;
		var result = {
			data: undefined,
			interval: {
				y: {
					hi: undefined,
					lo: undefined
				}
			}
		}
		distance.forEach(function(value, index){
			if(value == min){
				result.data = values[index]; 
			}
		})
		return result
	},
	movAvg: undefined,
	plotMovAvg: function(){
		if(this.movAvg!=undefined) return this.movAvg
		var movAvg = movingAverages(this.values.map(each => each.y), 10);
		var result = [];
		var variance = this.variance();
		var count = this.count;
		this.values.forEach((each, index) => {
			if(each.variance) variance = each.variance();
			if(each.count) count = each.count;
			var e = help.confidenceInterval(movAvg[index], variance, count);
			result.push({
				y: movAvg[index],
				x: each.x,
				high: e.high,
				low: e.low,
			})
		})
		return result.slice(10);
	},
	plotMovAvgCI: function(){
		if(this.movAvg==undefined) this.movAvg = this.plotMovAvg();
		return this.movAvg;				
	},
	linReg: function(){
		var result = regression.linear(this.values.map((each,index) => [index, each.y]))	
		result.linReg.points = values.map((each, index) => ([each.x, result.linReg.points[index][1]]))
		return result; 
	},
	difference: function(lower=baselineLower, upper=baselineUpper){
		// console.log([lower, upper])
		try{
			var basevalue = help.mean(this.values.filter(value => 
				(value.x >= lower && value.x <= upper)).map(each => each.y))
			return Array.from(this.values.map(each => ([each.x, each.y - basevalue])))
		}catch(ERROR){
			console.log(ERROR);
			console.log(this)
		}
	},
	xInterval: {},
	build: function(type=this.type, lower=baselineLower, upper=baselineUpper){
		this.xInterval.x = new Date(Math.min.apply(null, 
			this.values.map(each => 
				each.xInterval ? Math.min.apply(null, each.xInterval) : new Date(each.x)))).getTime();
		this.xInterval.x2 = new Date(Math.max.apply(null,
			this.values.map(each => 
				each.xInterval ? Math.max.apply(null, each.xInterval) : new Date(each.x)))).getTime();
		if(this.values.length > 0){

			if(this.values[0].keys){
				this.keys = this.values[0].keys
			}else{
				this.keys = Object.keys(this.values[0]);
			}
		}
		this.type = type;
		this.values = this.values.filter(entry => !isNaN(parseFloat(entry.y)) && isFinite(entry.y));
		var count = this.values.length;
		this.count = count;

		var y;
		if(this.y == undefined){
			switch(type){
				case "mean":
					y = help.sum(this.values.map(each => each.y));
					y = y/count;
					break;
				case "max":
					y = Math.max(...this.values.map(each => each.y));
					break;
				case "min":
					y = Math.min(...this.values.map(each => each.y));
					break;
				case "sum":
					y = help.sum(this.values.map(each => each.y));
					break;
				default:
					console.log("default: "+type)

			}
			this.y = y;
		}
		return this;
	},
	Axis: function(key){
		var keys = Object.values(this.values).map(each => each[key])
		keys = keys.filter((element, i) => i === keys.indexOf(element)) 
		var result = {}
		keys.forEach(each => {
			result[each] = this.values.filter(entry => each == entry[key]);
		})
		return result;
	},
	clone: function(){
		return Object.assign({values: []},this);
	},
	keys: undefined,
	create: function(values, x=undefined, src=''){
		var result = struct.clone();
		result.meta.src = src;
		try{
			values = values.filter(entry => !isNaN(parseFloat(entry.y)) && isFinite(entry.y));
		}catch(err){
			// console.log(Object.keys($))
			// console.log(values[0])
			// console.log(this)
			// console.log(err)
			return undefined;
		}
		result.values = values.filter(each => each.y || each.y == 0);
		result.x = x;
		return result;
	},
	map: function(F){
		return struct.create(F(this.values), this.x);	
	},
};
exports.struct = struct;

exports.parseByDate = require('./parseByDate.js').parseByDate
