var $ = require('jquery')
const help = require('../../helpers.js')
var months = help.months;

var config = require('../dataset/config/config.js').config;
var createDiv = require('./struct.js').createDiv;

var merged = require('../../../static/modules.config.charts.merge.json');
var rendF = {
	configs: merged, 
	build: function(id){
		res = {
			type: rendF.configs[id].type.replace('[stationType]',stationType),
			config: rendF.configs[id],
			func: function(reset=false){
				config[this.type].contFunc(reset);
				config[this.type].init(this.config.id, this.config.tag.data, this.config.tag.render);
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
