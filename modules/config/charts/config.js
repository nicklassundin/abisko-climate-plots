var $ = require('jquery')
const help = require('../../helpers.js')
var months = help.months;

var createDiv = require('./struct.js').createDiv;

// const preset = require('./help.js');
// const pres = preset.preset;
var datastr = require('../dataset/struct.js').struct;


// var merged = require('../../../static/modules.config.charts.merge.json');
var rendF = {
	container: {},
	build: function(config){
		var ref = config.files.ref;
		var id = ref.id
		var type = ref.type.replace('[stationType]',stationType);
		if(!rendF.container[type]){
			rendF.container[type] = datastr.create(id, config)	
		}
		res = {
			type: type,
			config: config, 
			func: function(reset=false){
				var id = config.files.ref.id;
				rendF.container[this.type].contFunc(reset, id, config);
				rendF.container[this.type].init(id);
			},
			html: function(doc){
				if(this.config.months){
					var div = document.createElement("div");
					if(variables.debug){
						months().forEach((month, index) => {
							div.appendChild(createDiv(this.config.id+'_'+month, no+index));
						})

					}else{
						months().forEach((month, index) => {
							div.appendChild(createDiv(this.config.id+'_'+month))
						})

					}
				}else{
					return createDiv(this.config.files.ref.id, false)
				}	
				return div
			}
		}
		return res
	}
}
exports.rendF = rendF;
