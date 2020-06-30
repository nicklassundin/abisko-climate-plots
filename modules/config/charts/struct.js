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

global.copy = function() {
	var body = doc,
		html = document.documentElement;
	var height = Math.max( body.scrollHeight, body.offsetHeight, 
		html.clientHeight, html.scrollHeight, html.offsetHeight );
	var href = (""+window.location).split('share=true').join('share=false');
	input.setAttribute('value', "<iframe src='"+href+"' width='100%' height='"+height+"' frameBorder=''0'></iframe>") // TODO ifram
	var copyText = document.getElementById("input");
	copyText.select();
	document.execCommand("copy");
	alert(copyText.value);
}


global.getID = function(param=urlParams){
	var id = param.get('set');
	if(id){
		id = id.split(',');
	}else{
		id = charts.ids;
	}
	return id
}

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

global.buildChart = function(doc, ids, reset=false){
	var call = function(id){
		return new Promise(function(resolve,reject){
			try{
				doc.appendChild(rendF[id].html(doc));	
				rendF[id].func(reset);
				resolve(true);
			}catch(err){
				console.log(doc)
				console.log(ids)
				console.log(id)
				reject(err)
				throw err
			}
		})
	}

	var sequence = function(array){
		var target = array.shift();
		if(target){
			call(target).then(function(){
				sequence(array);
			})
		}
	};	
	var debug = urlParams.get('debug');
	if(!Array.isArray(ids)) ids = [ids];
	sequence(ids)

	if(urlParams.get('share')=='true'){
		var input = document.createElement("input");
		input.setAttribute('id', 'input');
		input.setAttribute('type', 'text');
		var body = doc;
		var html = document.documentElement;
		var height = Math.max( body.scrollHeight, body.offsetHeight, 
			html.clientHeight, html.scrollHeight, html.offsetHeight );
		input.setAttribute('value', "<iframe src='"+window.location+"&share=false"+"' width='100%' height='"+height+"'></iframe>") // TODO ifram
		doc.appendChild(input);
		var cp = document.createElement("button");
		cp.innerHTML = 'Copy link';
		cp.setAttribute('onclick', "copy()");
		doc.appendChild(cp);
	}
	// disable context menu TODO event handler maybe
	doc.oncontextmenu = function(){
		return false;
	};
	return doc
}
