var $ = require('jquery')

global.urlParams = new URLSearchParams(window.location.search);

global.selectText = function(e){
	if(e === document.activeElement){
		e.blur();
	}else{
		e.focus();
		e.select();
	}
};

var createDiv = function(id, no=null){
	var el = document.createElement('div');
	if(variables.debug) {
		el = document.createElement('form')
	}
	el.setAttribute("id",id);
	var fig = document.createElement('figure');
	fig.appendChild(el);
	return fig
}
exports.createDiv = createDiv;

