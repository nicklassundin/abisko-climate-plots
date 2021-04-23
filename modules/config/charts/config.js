var $ = require('jquery')
const help = require('../../helpers.js')
var months = help.months;

var createDiv = require('./struct.js').createDiv;

const preset = require('./help.js');
const pres = preset.preset;
var datastr = require('../dataset/struct.js').struct;

var merged = require('../../../static/modules.config.charts.merge.json');
var rendF = {
	container: {},
	configs: merged, 
	build: function(id){
		var type = rendF.configs[id].type.replace('[stationType]',stationType);
		if(!rendF.container[type]){
			rendF.container[type] = datastr.create(pres(type))	
		}
		res = {
			type: type,
			config: rendF.configs[id],
			func: function(reset=false){
				var meta = {}
				meta[id] = rendF.configs[id].config.meta
				rendF.container[this.type].contFunc(reset, meta);
				rendF.container[this.type].init(this.config.id, this.config.tag.data);
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
					return createDiv(this.config.id, false)
				}	
				return div
			}
		}
		return res
	}
}
exports.rendF = rendF;
exports.ids = Object.keys(merged);
