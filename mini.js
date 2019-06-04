(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.regression = mod.exports;
  }
})(this, function (module) {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var DEFAULT_OPTIONS = { order: 2, precision: 2, period: null };

  /**
  * Determine the coefficient of determination (r^2) of a fit from the observations
  * and predictions.
  *
  * @param {Array<Array<number>>} data - Pairs of observed x-y values
  * @param {Array<Array<number>>} results - Pairs of observed predicted x-y values
  *
  * @return {number} - The r^2 value, or NaN if one cannot be calculated.
  */
  function determinationCoefficient(data, results) {
    var predictions = [];
    var observations = [];

    data.forEach(function (d, i) {
      if (d[1] !== null) {
        observations.push(d);
        predictions.push(results[i]);
      }
    });

    var sum = observations.reduce(function (a, observation) {
      return a + observation[1];
    }, 0);
    var mean = sum / observations.length;

    var ssyy = observations.reduce(function (a, observation) {
      var difference = observation[1] - mean;
      return a + difference * difference;
    }, 0);

    var sse = observations.reduce(function (accum, observation, index) {
      var prediction = predictions[index];
      var residual = observation[1] - prediction[1];
      return accum + residual * residual;
    }, 0);

    return 1 - sse / ssyy;
  }

  /**
  * Determine the solution of a system of linear equations A * x = b using
  * Gaussian elimination.
  *
  * @param {Array<Array<number>>} input - A 2-d matrix of data in row-major form [ A | b ]
  * @param {number} order - How many degrees to solve for
  *
  * @return {Array<number>} - Vector of normalized solution coefficients matrix (x)
  */
  function gaussianElimination(input, order) {
    var matrix = input;
    var n = input.length - 1;
    var coefficients = [order];

    for (var i = 0; i < n; i++) {
      var maxrow = i;
      for (var j = i + 1; j < n; j++) {
        if (Math.abs(matrix[i][j]) > Math.abs(matrix[i][maxrow])) {
          maxrow = j;
        }
      }

      for (var k = i; k < n + 1; k++) {
        var tmp = matrix[k][i];
        matrix[k][i] = matrix[k][maxrow];
        matrix[k][maxrow] = tmp;
      }

      for (var _j = i + 1; _j < n; _j++) {
        for (var _k = n; _k >= i; _k--) {
          matrix[_k][_j] -= matrix[_k][i] * matrix[i][_j] / matrix[i][i];
        }
      }
    }

    for (var _j2 = n - 1; _j2 >= 0; _j2--) {
      var total = 0;
      for (var _k2 = _j2 + 1; _k2 < n; _k2++) {
        total += matrix[_k2][_j2] * coefficients[_k2];
      }

      coefficients[_j2] = (matrix[n][_j2] - total) / matrix[_j2][_j2];
    }

    return coefficients;
  }

  /**
  * Round a number to a precision, specificed in number of decimal places
  *
  * @param {number} number - The number to round
  * @param {number} precision - The number of decimal places to round to:
  *                             > 0 means decimals, < 0 means powers of 10
  *
  *
  * @return {numbr} - The number, rounded
  */
  function round(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  /**
  * The set of all fitting methods
  *
  * @namespace
  */
  var methods = {
    linear: function linear(data, options) {
      var sum = [0, 0, 0, 0, 0];
      var len = 0;

      for (var n = 0; n < data.length; n++) {
        if (data[n][1] !== null) {
          len++;
          sum[0] += data[n][0];
          sum[1] += data[n][1];
          sum[2] += data[n][0] * data[n][0];
          sum[3] += data[n][0] * data[n][1];
          sum[4] += data[n][1] * data[n][1];
        }
      }

      var run = len * sum[2] - sum[0] * sum[0];
      var rise = len * sum[3] - sum[0] * sum[1];
      var gradient = run === 0 ? 0 : round(rise / run, options.precision);
      var intercept = round(sum[1] / len - gradient * sum[0] / len, options.precision);

      var predict = function predict(x) {
        return [round(x, options.precision), round(gradient * x + intercept, options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [gradient, intercept],
        r2: round(determinationCoefficient(data, points), options.precision),
        string: intercept === 0 ? 'y = ' + gradient + 'x' : 'y = ' + gradient + 'x + ' + intercept
      };
    },
    exponential: function exponential(data, options) {
      var sum = [0, 0, 0, 0, 0, 0];

      for (var n = 0; n < data.length; n++) {
        if (data[n][1] !== null) {
          sum[0] += data[n][0];
          sum[1] += data[n][1];
          sum[2] += data[n][0] * data[n][0] * data[n][1];
          sum[3] += data[n][1] * Math.log(data[n][1]);
          sum[4] += data[n][0] * data[n][1] * Math.log(data[n][1]);
          sum[5] += data[n][0] * data[n][1];
        }
      }

      var denominator = sum[1] * sum[2] - sum[5] * sum[5];
      var a = Math.exp((sum[2] * sum[3] - sum[5] * sum[4]) / denominator);
      var b = (sum[1] * sum[4] - sum[5] * sum[3]) / denominator;
      var coeffA = round(a, options.precision);
      var coeffB = round(b, options.precision);
      var predict = function predict(x) {
        return [round(x, options.precision), round(coeffA * Math.exp(coeffB * x), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + 'e^(' + coeffB + 'x)',
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    },
    logarithmic: function logarithmic(data, options) {
      var sum = [0, 0, 0, 0];
      var len = data.length;

      for (var n = 0; n < len; n++) {
        if (data[n][1] !== null) {
          sum[0] += Math.log(data[n][0]);
          sum[1] += data[n][1] * Math.log(data[n][0]);
          sum[2] += data[n][1];
          sum[3] += Math.pow(Math.log(data[n][0]), 2);
        }
      }

      var a = (len * sum[1] - sum[2] * sum[0]) / (len * sum[3] - sum[0] * sum[0]);
      var coeffB = round(a, options.precision);
      var coeffA = round((sum[2] - coeffB * sum[0]) / len, options.precision);

      var predict = function predict(x) {
        return [round(x, options.precision), round(round(coeffA + coeffB * Math.log(x), options.precision), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + ' + ' + coeffB + ' ln(x)',
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    },
    power: function power(data, options) {
      var sum = [0, 0, 0, 0, 0];
      var len = data.length;

      for (var n = 0; n < len; n++) {
        if (data[n][1] !== null) {
          sum[0] += Math.log(data[n][0]);
          sum[1] += Math.log(data[n][1]) * Math.log(data[n][0]);
          sum[2] += Math.log(data[n][1]);
          sum[3] += Math.pow(Math.log(data[n][0]), 2);
        }
      }

      var b = (len * sum[1] - sum[0] * sum[2]) / (len * sum[3] - Math.pow(sum[0], 2));
      var a = (sum[2] - b * sum[0]) / len;
      var coeffA = round(Math.exp(a), options.precision);
      var coeffB = round(b, options.precision);

      var predict = function predict(x) {
        return [round(x, options.precision), round(round(coeffA * Math.pow(x, coeffB), options.precision), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + 'x^' + coeffB,
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    },
    polynomial: function polynomial(data, options) {
      var lhs = [];
      var rhs = [];
      var a = 0;
      var b = 0;
      var len = data.length;
      var k = options.order + 1;

      for (var i = 0; i < k; i++) {
        for (var l = 0; l < len; l++) {
          if (data[l][1] !== null) {
            a += Math.pow(data[l][0], i) * data[l][1];
          }
        }

        lhs.push(a);
        a = 0;

        var c = [];
        for (var j = 0; j < k; j++) {
          for (var _l = 0; _l < len; _l++) {
            if (data[_l][1] !== null) {
              b += Math.pow(data[_l][0], i + j);
            }
          }
          c.push(b);
          b = 0;
        }
        rhs.push(c);
      }
      rhs.push(lhs);

      var coefficients = gaussianElimination(rhs, k).map(function (v) {
        return round(v, options.precision);
      });

      var predict = function predict(x) {
        return [round(x, options.precision), round(coefficients.reduce(function (sum, coeff, power) {
          return sum + coeff * Math.pow(x, power);
        }, 0), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      var string = 'y = ';
      for (var _i = coefficients.length - 1; _i >= 0; _i--) {
        if (_i > 1) {
          string += coefficients[_i] + 'x^' + _i + ' + ';
        } else if (_i === 1) {
          string += coefficients[_i] + 'x + ';
        } else {
          string += coefficients[_i];
        }
      }

      return {
        string: string,
        points: points,
        predict: predict,
        equation: [].concat(_toConsumableArray(coefficients)).reverse(),
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    }
  };

  function createWrapper() {
    var reduce = function reduce(accumulator, name) {
      return _extends({
        _round: round
      }, accumulator, _defineProperty({}, name, function (data, supplied) {
        return methods[name](data, _extends({}, DEFAULT_OPTIONS, supplied));
      }));
    };

    return Object.keys(methods).reduce(reduce, {});
  }

  module.exports = createWrapper();
});
/*@license
	Papa Parse
	v4.5.0
	https://github.com/mholt/PapaParse
	License: MIT
*/
!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof module&&"undefined"!=typeof exports?module.exports=t():e.Papa=t()}(this,function(){"use strict";var s,e,f="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==f?f:{},r=!f.document&&!!f.postMessage,o=r&&/(\?|&)papaworker(=|&|$)/.test(f.location.search),a=!1,h={},u=0,v={parse:function(e,t){var i=(t=t||{}).dynamicTyping||!1;M(i)&&(t.dynamicTypingFunction=i,i={});if(t.dynamicTyping=i,t.transform=!!M(t.transform)&&t.transform,t.worker&&v.WORKERS_SUPPORTED){var n=function(){if(!v.WORKERS_SUPPORTED)return!1;if(!a&&null===v.SCRIPT_PATH)throw new Error("Script path cannot be determined automatically when Papa Parse is loaded asynchronously. You need to set Papa.SCRIPT_PATH manually.");var e=v.SCRIPT_PATH||s;e+=(-1!==e.indexOf("?")?"&":"?")+"papaworker";var t=new f.Worker(e);return t.onmessage=y,t.id=u++,h[t.id]=t}();return n.userStep=t.step,n.userChunk=t.chunk,n.userComplete=t.complete,n.userError=t.error,t.step=M(t.step),t.chunk=M(t.chunk),t.complete=M(t.complete),t.error=M(t.error),delete t.worker,void n.postMessage({input:e,config:t,workerId:n.id})}var r=null;{if(e===v.NODE_STREAM_INPUT)return(r=new g(t)).getStream();"string"==typeof e?r=t.download?new l(t):new _(t):!0===e.readable&&M(e.read)&&M(e.on)?r=new m(t):(f.File&&e instanceof File||e instanceof Object)&&(r=new p(t))}return r.stream(e)},unparse:function(e,t){var n=!1,f=!0,d=",",c="\r\n",r='"';!function(){if("object"!=typeof t)return;"string"==typeof t.delimiter&&1===t.delimiter.length&&-1===v.BAD_DELIMITERS.indexOf(t.delimiter)&&(d=t.delimiter);("boolean"==typeof t.quotes||t.quotes instanceof Array)&&(n=t.quotes);"string"==typeof t.newline&&(c=t.newline);"string"==typeof t.quoteChar&&(r=t.quoteChar);"boolean"==typeof t.header&&(f=t.header)}();var s=new RegExp(r,"g");"string"==typeof e&&(e=JSON.parse(e));if(e instanceof Array){if(!e.length||e[0]instanceof Array)return a(null,e);if("object"==typeof e[0])return a(i(e[0]),e)}else if("object"==typeof e)return"string"==typeof e.data&&(e.data=JSON.parse(e.data)),e.data instanceof Array&&(e.fields||(e.fields=e.meta&&e.meta.fields),e.fields||(e.fields=e.data[0]instanceof Array?e.fields:i(e.data[0])),e.data[0]instanceof Array||"object"==typeof e.data[0]||(e.data=[e.data])),a(e.fields||[],e.data||[]);throw"exception: Unable to serialize unrecognized input";function i(e){if("object"!=typeof e)return[];var t=[];for(var i in e)t.push(i);return t}function a(e,t){var i="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var n=e instanceof Array&&0<e.length,r=!(t[0]instanceof Array);if(n&&f){for(var s=0;s<e.length;s++)0<s&&(i+=d),i+=l(e[s],s);0<t.length&&(i+=c)}for(var a=0;a<t.length;a++){for(var o=n?e.length:t[a].length,h=0;h<o;h++){0<h&&(i+=d);var u=n&&r?e[h]:h;i+=l(t[a][u],h)}a<t.length-1&&(i+=c)}return i}function l(e,t){if(null==e)return"";if(e.constructor===Date)return JSON.stringify(e).slice(1,25);e=e.toString().replace(s,r+r);var i="boolean"==typeof n&&n||n instanceof Array&&n[t]||function(e,t){for(var i=0;i<t.length;i++)if(-1<e.indexOf(t[i]))return!0;return!1}(e,v.BAD_DELIMITERS)||-1<e.indexOf(d)||" "===e.charAt(0)||" "===e.charAt(e.length-1);return i?r+e+r:e}}};if(v.RECORD_SEP=String.fromCharCode(30),v.UNIT_SEP=String.fromCharCode(31),v.BYTE_ORDER_MARK="\ufeff",v.BAD_DELIMITERS=["\r","\n",'"',v.BYTE_ORDER_MARK],v.WORKERS_SUPPORTED=!r&&!!f.Worker,v.SCRIPT_PATH=null,v.NODE_STREAM_INPUT=1,v.LocalChunkSize=10485760,v.RemoteChunkSize=5242880,v.DefaultDelimiter=",",v.Parser=k,v.ParserHandle=i,v.NetworkStreamer=l,v.FileStreamer=p,v.StringStreamer=_,v.ReadableStreamStreamer=m,v.DuplexStreamStreamer=g,f.jQuery){var d=f.jQuery;d.fn.parse=function(o){var i=o.config||{},h=[];return this.each(function(e){if(!("INPUT"===d(this).prop("tagName").toUpperCase()&&"file"===d(this).attr("type").toLowerCase()&&f.FileReader)||!this.files||0===this.files.length)return!0;for(var t=0;t<this.files.length;t++)h.push({file:this.files[t],inputElem:this,instanceConfig:d.extend({},i)})}),e(),this;function e(){if(0!==h.length){var e,t,i,n,r=h[0];if(M(o.before)){var s=o.before(r.file,r.inputElem);if("object"==typeof s){if("abort"===s.action)return e="AbortError",t=r.file,i=r.inputElem,n=s.reason,void(M(o.error)&&o.error({name:e},t,i,n));if("skip"===s.action)return void u();"object"==typeof s.config&&(r.instanceConfig=d.extend(r.instanceConfig,s.config))}else if("skip"===s)return void u()}var a=r.instanceConfig.complete;r.instanceConfig.complete=function(e){M(a)&&a(e,r.file,r.inputElem),u()},v.parse(r.file,r.instanceConfig)}else M(o.complete)&&o.complete()}function u(){h.splice(0,1),e()}}}function c(e){this._handle=null,this._finished=!1,this._completed=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=w(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null);this._handle=new i(t),(this._handle.streamer=this)._config=t}.call(this,e),this.parseChunk=function(e,t){if(this.isFirstChunk&&M(this._config.beforeFirstChunk)){var i=this._config.beforeFirstChunk(e);void 0!==i&&(e=i)}this.isFirstChunk=!1;var n=this._partialLine+e;this._partialLine="";var r=this._handle.parse(n,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var s=r.meta.cursor;this._finished||(this._partialLine=n.substring(s-this._baseIndex),this._baseIndex=s),r&&r.data&&(this._rowCount+=r.data.length);var a=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(o)f.postMessage({results:r,workerId:v.WORKER_ID,finished:a});else if(M(this._config.chunk)&&!t){if(this._config.chunk(r,this._handle),this._handle.paused()||this._handle.aborted())return;r=void 0,this._completeResults=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(r.data),this._completeResults.errors=this._completeResults.errors.concat(r.errors),this._completeResults.meta=r.meta),this._completed||!a||!M(this._config.complete)||r&&r.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),a||r&&r.meta.paused||this._nextChunk(),r}},this._sendError=function(e){M(this._config.error)?this._config.error(e):o&&this._config.error&&f.postMessage({workerId:v.WORKER_ID,error:e,finished:!1})}}function l(e){var n;(e=e||{}).chunkSize||(e.chunkSize=v.RemoteChunkSize),c.call(this,e),this._nextChunk=r?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(e){this._input=e,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(n=new XMLHttpRequest,this._config.withCredentials&&(n.withCredentials=this._config.withCredentials),r||(n.onload=E(this._chunkLoaded,this),n.onerror=E(this._chunkError,this)),n.open("GET",this._input,!r),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var t in e)n.setRequestHeader(t,e[t])}if(this._config.chunkSize){var i=this._start+this._config.chunkSize-1;n.setRequestHeader("Range","bytes="+this._start+"-"+i),n.setRequestHeader("If-None-Match","webkit-no-cache")}try{n.send()}catch(e){this._chunkError(e.message)}r&&0===n.status?this._chunkError():this._start+=this._config.chunkSize}},this._chunkLoaded=function(){4===n.readyState&&(n.status<200||400<=n.status?this._chunkError():(this._finished=!this._config.chunkSize||this._start>function(e){var t=e.getResponseHeader("Content-Range");if(null===t)return-1;return parseInt(t.substr(t.lastIndexOf("/")+1))}(n),this.parseChunk(n.responseText)))},this._chunkError=function(e){var t=n.statusText||e;this._sendError(new Error(t))}}function p(e){var n,r;(e=e||{}).chunkSize||(e.chunkSize=v.LocalChunkSize),c.call(this,e);var s="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,r=e.slice||e.webkitSlice||e.mozSlice,s?((n=new FileReader).onload=E(this._chunkLoaded,this),n.onerror=E(this._chunkError,this)):n=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var t=Math.min(this._start+this._config.chunkSize,this._input.size);e=r.call(e,this._start,t)}var i=n.readAsText(e,this._config.encoding);s||this._chunkLoaded({target:{result:i}})},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result)},this._chunkError=function(){this._sendError(n.error)}}function _(e){var i;c.call(this,e=e||{}),this.stream=function(e){return i=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e=this._config.chunkSize,t=e?i.substr(0,e):i;return i=e?i.substr(e):"",this._finished=!i,this.parseChunk(t)}}}function m(e){c.call(this,e=e||{});var t=[],i=!0,n=!1;this.pause=function(){c.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){c.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){n&&1===t.length&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):i=!0},this._streamData=E(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),i&&(i=!1,this._checkIsFinished(),this.parseChunk(t.shift()))}catch(e){this._streamError(e)}},this),this._streamError=E(function(e){this._streamCleanUp(),this._sendError(e)},this),this._streamEnd=E(function(){this._streamCleanUp(),n=!0,this._streamData("")},this),this._streamCleanUp=E(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function g(e){var t=require("stream").Duplex,i=w(e),n=!0,r=!1,s=[],a=null;this._onCsvData=function(e){for(var t=e.data,i=0;i<t.length;i++)a.push(t[i])||this._handle.paused()||this._handle.pause()},this._onCsvComplete=function(){a.push(null)},i.step=E(this._onCsvData,this),i.complete=E(this._onCsvComplete,this),c.call(this,i),this._nextChunk=function(){r&&1===s.length&&(this._finished=!0),s.length?s.shift()():n=!0},this._addToParseQueue=function(e,t){s.push(E(function(){if(this.parseChunk("string"==typeof e?e:e.toString(i.encoding)),M(t))return t()},this)),n&&(n=!1,this._nextChunk())},this._onRead=function(){this._handle.paused()&&this._handle.resume()},this._onWrite=function(e,t,i){this._addToParseQueue(e,i)},this._onWriteComplete=function(){r=!0,this._addToParseQueue("")},this.getStream=function(){return a},(a=new t({readableObjectMode:!0,decodeStrings:!1,read:E(this._onRead,this),write:E(this._onWrite,this)})).once("finish",E(this._onWriteComplete,this))}function i(m){var s,a,o,n=/^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i,r=/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,t=this,i=0,h=0,u=!1,e=!1,f=[],d={data:[],errors:[],meta:{}};if(M(m.step)){var c=m.step;m.step=function(e){if(d=e,p())l();else{if(l(),0===d.data.length)return;i+=e.data.length,m.preview&&i>m.preview?a.abort():c(d,t)}}}function l(){if(d&&o&&(g("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+v.DefaultDelimiter+"'"),o=!1),m.skipEmptyLines)for(var e=0;e<d.data.length;e++)1===d.data[e].length&&""===d.data[e][0]&&d.data.splice(e--,1);return p()&&function(){if(!d)return;for(var e=0;p()&&e<d.data.length;e++)for(var t=0;t<d.data[e].length;t++){var i=d.data[e][t];m.trimHeaders&&(i=i.trim()),f.push(i)}d.data.splice(0,1)}(),function(){if(!d||!m.header&&!m.dynamicTyping&&!m.transform)return d;for(var e=0;e<d.data.length;e++){var t,i=m.header?{}:[];for(t=0;t<d.data[e].length;t++){var n=t,r=d.data[e][t];m.header&&(n=t>=f.length?"__parsed_extra":f[t]),m.transform&&(r=m.transform(r,n)),r=_(n,r),"__parsed_extra"===n?(i[n]=i[n]||[],i[n].push(r)):i[n]=r}d.data[e]=i,m.header&&(t>f.length?g("FieldMismatch","TooManyFields","Too many fields: expected "+f.length+" fields but parsed "+t,h+e):t<f.length&&g("FieldMismatch","TooFewFields","Too few fields: expected "+f.length+" fields but parsed "+t,h+e))}m.header&&d.meta&&(d.meta.fields=f);return h+=d.data.length,d}()}function p(){return m.header&&0===f.length}function _(e,t){return i=e,m.dynamicTypingFunction&&void 0===m.dynamicTyping[i]&&(m.dynamicTyping[i]=m.dynamicTypingFunction(i)),!0===(m.dynamicTyping[i]||m.dynamicTyping)?"true"===t||"TRUE"===t||"false"!==t&&"FALSE"!==t&&(n.test(t)?parseFloat(t):r.test(t)?new Date(t):""===t?null:t):t;var i}function g(e,t,i,n){d.errors.push({type:e,code:t,message:i,row:n})}this.parse=function(e,t,i){if(m.newline||(m.newline=function(e){var t=(e=e.substr(0,1048576)).split("\r"),i=e.split("\n"),n=1<i.length&&i[0].length<t[0].length;if(1===t.length||n)return"\n";for(var r=0,s=0;s<t.length;s++)"\n"===t[s][0]&&r++;return r>=t.length/2?"\r\n":"\r"}(e)),o=!1,m.delimiter)M(m.delimiter)&&(m.delimiter=m.delimiter(e),d.meta.delimiter=m.delimiter);else{var n=function(e,t,i,n){for(var r,s,a,o=[",","\t","|",";",v.RECORD_SEP,v.UNIT_SEP],h=0;h<o.length;h++){var u=o[h],f=0,d=0,c=0;a=void 0;for(var l=new k({comments:n,delimiter:u,newline:t,preview:10}).parse(e),p=0;p<l.data.length;p++)if(i&&1===l.data[p].length&&0===l.data[p][0].length)c++;else{var _=l.data[p].length;d+=_,void 0!==a?1<_&&(f+=Math.abs(_-a),a=_):a=_}0<l.data.length&&(d/=l.data.length-c),(void 0===s||f<s)&&1.99<d&&(s=f,r=u)}return{successful:!!(m.delimiter=r),bestDelimiter:r}}(e,m.newline,m.skipEmptyLines,m.comments);n.successful?m.delimiter=n.bestDelimiter:(o=!0,m.delimiter=v.DefaultDelimiter),d.meta.delimiter=m.delimiter}var r=w(m);return m.preview&&m.header&&r.preview++,s=e,a=new k(r),d=a.parse(s,t,i),l(),u?{meta:{paused:!0}}:d||{meta:{paused:!1}}},this.paused=function(){return u},this.pause=function(){u=!0,a.abort(),s=s.substr(a.getCharIndex())},this.resume=function(){u=!1,t.streamer.parseChunk(s,!0)},this.aborted=function(){return e},this.abort=function(){e=!0,a.abort(),d.meta.aborted=!0,M(m.complete)&&m.complete(d),s=""}}function k(e){var S,x=(e=e||{}).delimiter,T=e.newline,O=e.comments,I=e.step,D=e.preview,P=e.fastMode,A=S=void 0===e.quoteChar?'"':e.quoteChar;if(void 0!==e.escapeChar&&(A=e.escapeChar),("string"!=typeof x||-1<v.BAD_DELIMITERS.indexOf(x))&&(x=","),O===x)throw"Comment character same as delimiter";!0===O?O="#":("string"!=typeof O||-1<v.BAD_DELIMITERS.indexOf(O))&&(O=!1),"\n"!==T&&"\r"!==T&&"\r\n"!==T&&(T="\n");var L=0,F=!1;this.parse=function(n,t,i){if("string"!=typeof n)throw"Input must be a string";var r=n.length,e=x.length,s=T.length,a=O.length,o=M(I),h=[],u=[],f=[],d=L=0;if(!n)return E();if(P||!1!==P&&-1===n.indexOf(S)){for(var c=n.split(T),l=0;l<c.length;l++){if(f=c[l],L+=f.length,l!==c.length-1)L+=T.length;else if(i)return E();if(!O||f.substr(0,a)!==O){if(o){if(h=[],y(f.split(x)),R(),F)return E()}else y(f.split(x));if(D&&D<=l)return h=h.slice(0,D),E(!0)}}return E()}for(var p,_=n.indexOf(x,L),m=n.indexOf(T,L),g=new RegExp(A.replace(/[-[\]/{}()*+?.\\^$|]/g,"\\$&")+S,"g");;)if(n[L]!==S)if(O&&0===f.length&&n.substr(L,a)===O){if(-1===m)return E();L=m+s,m=n.indexOf(T,L),_=n.indexOf(x,L)}else if(-1!==_&&(_<m||-1===m))f.push(n.substring(L,_)),L=_+e,_=n.indexOf(x,L);else{if(-1===m)break;if(f.push(n.substring(L,m)),w(m+s),o&&(R(),F))return E();if(D&&h.length>=D)return E(!0)}else for(p=L,L++;;){if(-1===(p=n.indexOf(S,p+1)))return i||u.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:h.length,index:L}),b();if(p===r-1)return b(n.substring(L,p).replace(g,S));if(S!==A||n[p+1]!==A){if(S===A||0===p||n[p-1]!==A){var v=C(_);if(n[p+1+v]===x){f.push(n.substring(L,p).replace(g,S)),L=p+1+v+e,_=n.indexOf(x,L),m=n.indexOf(T,L);break}var k=C(m);if(n.substr(p+1+k,s)===T){if(f.push(n.substring(L,p).replace(g,S)),w(p+1+k+s),_=n.indexOf(x,L),o&&(R(),F))return E();if(D&&h.length>=D)return E(!0);break}u.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:h.length,index:L}),p++}}else p++}return b();function y(e){h.push(e),d=L}function C(e){var t=0;if(-1!==e){var i=n.substring(p+1,e);i&&""===i.trim()&&(t=i.length)}return t}function b(e){return i||(void 0===e&&(e=n.substr(L)),f.push(e),L=r,y(f),o&&R()),E()}function w(e){L=e,y(f),f=[],m=n.indexOf(T,L)}function E(e){return{data:h,errors:u,meta:{delimiter:x,linebreak:T,aborted:F,truncated:!!e,cursor:d+(t||0)}}}function R(){I(E()),h=[],u=[]}},this.abort=function(){F=!0},this.getCharIndex=function(){return L}}function y(e){var t=e.data,i=h[t.workerId],n=!1;if(t.error)i.userError(t.error,t.file);else if(t.results&&t.results.data){var r={abort:function(){n=!0,C(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:b,resume:b};if(M(i.userStep)){for(var s=0;s<t.results.data.length&&(i.userStep({data:[t.results.data[s]],errors:t.results.errors,meta:t.results.meta},r),!n);s++);delete t.results}else M(i.userChunk)&&(i.userChunk(t.results,r,t.file),delete t.results)}t.finished&&!n&&C(t.workerId,t.results)}function C(e,t){var i=h[e];M(i.userComplete)&&i.userComplete(t),i.terminate(),delete h[e]}function b(){throw"Not implemented."}function w(e){if("object"!=typeof e||null===e)return e;var t=e instanceof Array?[]:{};for(var i in e)t[i]=w(e[i]);return t}function E(e,t){return function(){e.apply(t,arguments)}}function M(e){return"function"==typeof e}return o?f.onmessage=function(e){var t=e.data;void 0===v.WORKER_ID&&t&&(v.WORKER_ID=t.workerId);if("string"==typeof t.input)f.postMessage({workerId:v.WORKER_ID,results:v.parse(t.input,t.config),finished:!0});else if(f.File&&t.input instanceof File||t.input instanceof Object){var i=v.parse(t.input,t.config);i&&f.postMessage({workerId:v.WORKER_ID,results:i,finished:!0})}}:v.WORKERS_SUPPORTED&&(e=document.getElementsByTagName("script"),s=e.length?e[e.length-1].src:"",document.body?document.addEventListener("DOMContentLoaded",function(){a=!0},!0):a=!0),(l.prototype=Object.create(c.prototype)).constructor=l,(p.prototype=Object.create(c.prototype)).constructor=p,(_.prototype=Object.create(_.prototype)).constructor=_,(m.prototype=Object.create(c.prototype)).constructor=m,(g.prototype=Object.create(c.prototype)).constructor=g,v});var months = () => ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

var t = {
	t05: [0, 12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.160, 2.145 , 2.131, 2.120, 2.110, 2.101, 2.093, 2.086],
}
var t = {
	t05: [0, 12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201],
}

var monthByIndex = index => months()[index];

var monthName = month => ({
    jan: 'January', feb: 'February', mar: 'March', apr: 'April', may: 'May', jun: 'June',
    jul: 'July', aug: 'August', sep: 'September', oct: 'October', nov: 'November', dec: 'December'
})[month];

var summerMonths = ['jun', 'jul', 'aug', 'sep'];
var winterMonths = ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may'];
var summerRange = monthName(summerMonths[0]) + ' to ' + monthName(summerMonths[summerMonths.length-1]);
var winterRange = monthName(winterMonths[0]) + ' to ' + monthName(winterMonths[summerMonths.length-1]);

var isSummerMonth = month => summerMonths.includes(month);
var isWinterMonth = month => winterMonths.includes(month);

var isSummerMonthByIndex = month => isSummerMonth(monthByIndex(month));
var isWinterMonthByIndex = month => isWinterMonth(monthByIndex(month));

var sum = values => values.reduce((sum, current) => sum + current, 0);

var min = values => values.reduce((min, current) => Math.min(min, current), Infinity);

var max = values => values.reduce((max, current) => Math.max(max, current), -Infinity);

var average = (values) => {
    if (values.length === 0) return 0;
    return sum(values) / values.length;
};

var mean = average;

var movingAverage = (values, index, number) => average(values.slice(Math.max(index - number, 0), index));

var movingAverages = (values, number) => values.map((_, index) => movingAverage(values, index, number));

var varianceMovAvg = (values, number) => values.map((_, index) => variance(values.slice(Math.max(index - number,0)).map(each => each.y)));

var difference = (values, baseline) => values.map(value => value - baseline);

var sumSquareDistance = (values, mean) => values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0);

var variance = values => sumSquareDistance(values, average(values)) / (values.length - 1);


var confidenceInterval = (mean, variance, count, td=t['t05']) => {
    	var zs =[0, 12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.160, 2.145 , 2.131, 2.120, 2.110, 2.101, 2.093, 2.086];
	var z = zs[count-1] || zs.pop();
	var ci = z * Math.sqrt(variance / count);
    return {
        low: mean - ci,
        high: mean + ci
    };
};

// equally weighted averages normal distribution 
var confidenceInterval_EQ_ND = (values, count) => {
	var movAvg = movingAverages(values.map(each => each.y), count).map((avg, i) => ({
		x: values[i].x,
		y: avg,
	}));
	var movAvgVar = varianceMovAvg(values, count);
	var ciMovAvg = movAvg.map((_,index) => ({
		x: movAvg[index].x,
		y: confidenceInterval(movAvg[index].y, movAvgVar[index], count),
	})).map(each => ({
		x: each.x,
		low: each.y.low,
		high: each.y.high,
	}));
	return ({
		movAvg: movAvg,
		movAvgVar: movAvgVar,
		ciMovAvg: ciMovAvg,
	})
}




var baselineLower = 1961;
var baselineUpper = 1990;

var withinBaselinePeriod = year => year >= baselineLower && year <= baselineUpper;

var validNumber = (string) => {
    var number = +string;
    return (number) ? number : undefined;
};

var parseDate = (string) => {
    var date = string.split('-');
    if (date.length < 3) date[1] = date[2] = 0;
    return {
        year: +date[0],
        month: +date[1],
        day: +date[2],
    };
};

var isLeapYear = year => ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);

var createDate = date => new Date(date.year, date.month-1, date.day-1);

var weekNumber = (date) => {
    var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

var dayOfYear = (date) => {
    var start = new Date(date.getFullYear(), 0, 0);
    var diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};

var dateFromDayOfYear = (year, dayOfYear) => new Date(year, 0, dayOfYear);

var parseNumber = string => parseFloat(string.replace(',', '.')) || undefined;

var linearRegression = (xs, ys) => {
    var data = xs.map((x, index) => [x, ys[index]]);
    var result = regression.linear(data);
    var gradient = result.equation[0];
    var intercept = result.equation[1];
    var linear = x => gradient * x + intercept;
    linear.toString = () => gradient + ' x ' + (intercept >= 0 ? '+' : '-') + Math.abs(intercept);
    return linear;
};

Array.prototype.rotate = (function () {
    var unshift = Array.prototype.unshift,
        splice = Array.prototype.splice;

    return function (count) {
        var len = this.length >>> 0,
            count = count >> 0;

        unshift.apply(this, splice.call(this, count % len, len));
        return this;
    };
})();


$('#baseline').submit((e) => {
	e.preventDefault();
	var lower = +e.target[0].value;
	var upper = +e.target[1].value;
	if (!lower || !upper) {
		alert('Something went wrong!');
		return;
	} else if (lower < 1913) {
		alert("Lower limit must be above 1913!");
		return;
	} else if (lower >= upper) {
		alert("Lower limit cant be larger or equal to upper limit!");
		return;
	} else if (upper > 2017) {
		alert("Upper limit must be below 2017!");
		return;
	}

	baselineLower = lower;
	baselineUpper = upper;
	parseZonal();
	parseAbisko();
});

Highcharts.setOptions({
	credits: false,
});

var precipColor = '#550965';

var snowColor = {
	color: '#CDD8F0',
	borderColor: '#5F7CB9',
	hover: '#eeeeff',
};

var rainColor = {
	color: '#1000FB',
	borderColor: '#5F7CB9',
	hover: '#3333ff',
};

var useWebWorker = true;


/***************************************/
/* DATA TRANSFORMATIONS AND STATISTICS */
/***************************************/

var parseGISSTEMP = function (result, src='') {
	var fields = result.meta.fields;
	var meta = preSetMeta['default'];
	meta.src = src;
	var temperatures = [];
	// console.log(result)


	result.data.forEach((row) => {
		var year = {};

		fields.forEach(field => year[field.toLowerCase()] = validNumber(row[field]));

		var monthlyTemperatures = months().map(month => year[month]).filter(Number);		
		// console.log(row)
		year.min = Math.min.apply(null, monthlyTemperatures);
		year.max = Math.max.apply(null, monthlyTemperatures);
		year.count = monthlyTemperatures.length;

		if (year.count > 0) {
			year.avg = mean(monthlyTemperatures);

			year.variance = 0;

			if (year.count > 1) {
				year.variance = variance(monthlyTemperatures);
			}

			year.ci = confidenceInterval(year.avg, year.variance, year.count);

			temperatures.push(year);
		}
	});
	temperatures = temperatures.slice(33);
	['min', 'max', 'avg'].forEach((statistic) => {
		temperatures[statistic] = temperatures.map(temps => ({
			x: temps.year,
			y: temps[statistic],
		})).slice(10);
	});
	temperatures.movAvg = movingAverages(temperatures.map(temps => temps.avg), 10)
		.map((avg, index) => ({
			x: temperatures[index].year,
			y: avg,
		})).slice(10);

	temperatures.ci = temperatures.map(temps => ({
		x: temps.year,
		low: temps.ci.low,
		high: temps.ci.high,
	}));

	temperatures.ciMovAvg = temperatures.ci.map(each => ({ x: each.x }));

	['low', 'high'].forEach((bound) => {
		movingAverages(temperatures.ci.map(each => each[bound]), 10)
			.forEach((value, index) => temperatures.ciMovAvg[index][bound] = value);
	});
	temperatures.meta = meta;
	temperatures.src = src;
	temperatures.ci = temperatures.ci.slice(10);
	temperatures.ciMovAvg = temperatures.ciMovAvg.slice(10);
	return temperatures;
};

var parseGISSTEMPzonalMeans = function (result, src='') {
	// console.log(result)
	// console.log(src)
	var fields = result.meta.fields;
	var temperatures = [];
	temperatures['sum64n-90n'] = 0;
	temperatures['sumnhem'] = 0;
	temperatures['sumglob'] = 0;
	var yrlyAvg = [];
	var count = 0;

	result.data.forEach((row) => {
		var year = {};
		fields.forEach(field => year[field.toLowerCase()] = validNumber(row[field]));
		yrlyAvg.push({
			x: year['year'],
			y: year['64n-90n']
		})
		if (withinBaselinePeriod(year.year)) {
			temperatures['sum64n-90n'] += year['64n-90n']||0.0; // TODO resolve why .00 is undefined 
			temperatures['sumnhem'] += year['nhem']||0.0;
			temperatures['sumglob'] += year['glob']||0.0;
			count++;
		}
		if (year.year >= 1913) {
			temperatures.push(year);
		}
	});

	temperatures['avg64n-90n'] = temperatures['sum64n-90n'] / count;
	temperatures['avgnhem'] = temperatures['sumnhem'] / count;
	temperatures['avgglob'] = temperatures['sumglob'] / count;

	var difference = region => temperatures.filter((value) => {
		return value[region] != null;
	}).map(each => ({
		x: each.year,
		y: each[region] - temperatures['avg' + region],
	}));
	var linear_diff = function(data){
		return {
			years: data.map(each => each.x),
			difference: data,
			linear_diff: linearRegression(data.map(each => each.x),data.map(each => each.y)),
		};
	}

	temperatures['64n-90n'] = linear_diff(difference('64n-90n'));
	temperatures['nhem'] = linear_diff(difference('nhem'));
	temperatures['glob'] = linear_diff(difference('glob'));

	var movAvg = movingAverages(yrlyAvg.map(temps => temps.y), 10)
		.map((avg, index) => ({
			x: yrlyAvg[index].x,
			y: avg,
		}))
	var yearVar = variance(yrlyAvg.map(each => each.y));
	var yearCI = yrlyAvg.map(each => ({
		x: each.x, 
		ci: confidenceInterval(each.y, yearVar, yrlyAvg.length),
	})).map(each => ({
		x: each.x,
		low: each.ci.low,
		high: each.ci.high,
	}))
	var yearCIMovAvg = yearCI.map(each => ({ x: each.x }));
	['low', 'high'].forEach(bound =>
		movingAverages(yearCI.map(each => each[bound]), 10)
		.forEach((value, index) => yearCIMovAvg[index][bound] = value));
	temperatures.yrly = {
		avg: yrlyAvg.slice(43), // TODO nicer alignment with Ab charts
		movAvg: movAvg.slice(43),
		ciMovAvg: yearCIMovAvg.slice(43),
		ci: yearCI.slice(43),
	};
	var meta = preSetMeta['default'];
	meta.src = src;
	temperatures.meta = meta;
	temperatures.yrly.meta = meta;
	temperatures['64n-90n'].meta = meta;
	temperatures['nhem'].meta = meta; 
	temperatures['glob'].meta = meta;
	// console.log(temperatures)
	return temperatures;
};

// 1-15
var parseAbiskoCsv = function (result, src='') {
	// console.log('parseAbiskoCsv')
	// console.log(result)
	var rows = result.data;
	var meta = preSetMeta['abiskoTemp'];
	var fields = {
		time: result.meta.fields[0],
		avg: result.meta.fields[1],
		min: result.meta.fields[2],
		max: result.meta.fields[3],
		precip: result.meta.fields[4],
	};
	var data = {};
	var days = [];
	rows.forEach((row) => {
		var date = parseDate(row[fields.time]);
		var avg = parseNumber(row[fields.avg]);
		if(avg)days.push({
			x: Date.UTC(date.year,date.month-1, date.day),
			y: avg,
		})
		var precip = parseNumber(row[fields.precip]);
		var year = data[date.year] = data[date.year] || {
			sum: 0,
			count: 0,
			precip: 0,
			precip_snow: 0,
			precip_rain: 0,
			data: [],
			weeklyTemperatures: [],
			// dailyTemperatures: [],
		};
		if (avg) {
			// allTemperatures.push(avg);
			year.sum += avg;
			year.count++;

			var w = weekNumber(createDate(date));
			var weekly = year.weeklyTemperatures[w] = year.weeklyTemperatures[w] || { sum: [], count: 0 };
			weekly.sum.push(avg);
			weekly.count++;
		}
		if (precip) {
			year.precip += precip;
			if (avg < 0) {
				year.precip_snow += precip;
			} else {
				year.precip_rain += precip;
			}
		}
		year.data.push({
			date, avg,
			min: parseNumber(row[fields.min]),
			max: parseNumber(row[fields.max]),
			precip,
			precip_snow: (avg < 0) ? precip : 0,
			precip_rain: (avg >= 0) ? precip : 0,
		});
	});

	// console.log(allTemperatures);
	// console.log(data);

	var temperatureBaseline = { sum: 0, count: 0 };
	var precipitationBaselineYearly = { sum: 0, count: 0 };
	var precipitationBaselineSummer = { sum: 0, count: 0 };
	var precipitationBaselineWinter = { sum: 0, count: 0 };

	var entries = () => Object.entries(data);
	var keys = () => Object.keys(data);
	var values = () => Object.values(data);

	entries().forEach((entry) => {
		var year = entry[1];
		year.avg = year.sum / (year.count || 1);

		if (withinBaselinePeriod(entry[0])) {
			temperatureBaseline.sum += year.avg;
			temperatureBaseline.count++;
		}
		// pre work for weekly variances
		// var weeklyTemps = year.weeklyTemperatures.map(t => t.sum);
		// var weeklyTempsVar = weeklyTemps.map(t => variance(t));

		year.weeklyTemperatures = year.weeklyTemperatures.map(t => t.sum.reduce((a,b) => a+b) / t.count);
		var isWeekAboveZero = year.weeklyTemperatures.map(t => t > 0);
		var longestPeriod = 0;
		var periods = []
		isWeekAboveZero.reduce((period, aboveZero) => {
			if (aboveZero) {
				period++;
				longestPeriod = Math.max(longestPeriod, period);
				return period;
			} else {
				periods.push(period);	
				return 0;
			}
		}, 0);
		year.growingSeason = {
			max: longestPeriod,
			variance: variance(periods),
			count: periods.length,
		}
		// console.log(year.growingSeason);

		var monthlyTemperatures = [];
		var monthlyPrecip = [];
		var summerTemperatures = { sum: [], count: 0, min: Infinity, max: -Infinity };
		var winterTemperatures = { sum: [], count: 0, min: Infinity, max: -Infinity };
		var summerPrecipitation = { total: [], rain: 0, snow: 0, variance: null, ci: null};
		var winterPrecipitation = { total: [], rain: 0, snow: 0, variance: null, ci: null};

		// Sorts out data into seasonal data sets
		year.data.forEach((each) => {
			var month = +each.date.month;
			var t = monthlyTemperatures[month - 1] = monthlyTemperatures[month - 1] || {
				sum: [], count: 0, min: Infinity, max: -Infinity, temp: [],
			};
			var p = monthlyPrecip[month - 1] = monthlyPrecip[month - 1] || {
				total: [], rain: 0, snow: 0, count: 0,
			};
			if (each.avg) {
				if (isSummerMonthByIndex(month)) {
					summerTemperatures.sum.push(each.avg);
					summerTemperatures.count++;
					if(each.min) summerTemperatures.min = Math.min(summerTemperatures.min, each.min);
					if(each.max) summerTemperatures.max = Math.max(summerTemperatures.max, each.max);
				} else if (isWinterMonthByIndex(month)) {
					winterTemperatures.sum.push(each.avg);
					winterTemperatures.count++;
					if(each.min) winterTemperatures.min = Math.min(winterTemperatures.min, each.min);
					if(each.max) winterTemperatures.max = Math.max(winterTemperatures.max, each.max);

				}
				t.sum.push(each.avg);
				t.count++;
				if(each.min) t.min = Math.min(t.min, each.min);
				if(each.max) t.max = Math.max(t.max, each.max);
			}
			if (each.precip) {
				if (isSummerMonthByIndex(month)) {
					summerPrecipitation.total.push(each.precip);
					summerPrecipitation.snow += each.precip_snow;
					summerPrecipitation.rain += each.precip_rain;
				} else if (isWinterMonthByIndex(month)) {
					winterPrecipitation.total.push(each.precip);
					winterPrecipitation.snow += each.precip_snow;
					winterPrecipitation.rain += each.precip_rain;
				}
				p.total.push(each.precip);
				p.snow += each.precip_snow;
				p.rain += each.precip_rain;
				p.count++;
			}
		});
		var summerPrecVar = Math.sqrt(summerPrecipitation.total.length)*variance(summerPrecipitation.total);// TODO need check internal math
		var summerPrecTotal = summerPrecipitation.total.reduce((a,b) => a+b,0);
		var summerPrecCI = confidenceInterval(summerPrecTotal, summerPrecVar, summerMonths.length); // TODO should not be a constant '6'
		year.summerPrecipitation = {
			total: summerPrecTotal,
			snow: summerPrecipitation.snow,
			rain: summerPrecipitation.rain,
			variance: summerPrecVar,
			ci: null, 
		};
		year.summerPrecipitation.ci = {
			x: entry[0],
			low: summerPrecCI['low'],
			high: summerPrecCI['high'],
		};

		var winterPrecVar = Math.sqrt(summerPrecipitation.total.length)*variance(winterPrecipitation.total); // TODO need check internal math
		var winterPrecTotal = winterPrecipitation.total.reduce((a,b) => a+b,0);
		var winterPrecCI = confidenceInterval(winterPrecTotal, winterPrecVar, winterMonths.length); // TODO should not be a constant '6'
		year.winterPrecipitation = {
			total: winterPrecTotal,
			snow: winterPrecipitation.snow,
			rain: winterPrecipitation.rain,
			variance: winterTempsVar,
			ci: null, 
		};
		year.winterPrecipitation.ci = {
			x: entry[0],
			low: winterPrecCI['low'],
			high: winterPrecCI['high'],
		};


		year.monthlyPrecip = monthlyPrecip.map(month => ({
			total: month.total.reduce((a,b) => a+b),
			rain: month.rain,
			snow: month.snow,
			variance: Math.sqrt(month.total.length)*variance(month.total),// TODO need check internal math
			ci: null,
			n: month.total.length,
		})).map(month => ({
			total: month.total,
			rain: month.rain,
			snow: month.snow,
			variance: month.variance,
			ci: confidenceInterval(month.total, month.variance, month.n),
		}));

		// yearly precipitation
		year.precipCI = confidenceInterval(year.precip, year.monthlyPrecip.map(each => each.variance).reduce((a,b)=>a+b), year.monthlyPrecip.length);


		//
		////

		year.monthlyTemperatures = monthlyTemperatures.map(month => ({
			avg: month.sum.reduce((a,b) => a+b) / month.count,
			min: month.min,
			max: month.max,
			variance: variance(month.sum),
			ci: null,
			n: month.sum.length
		})).map(month => ({
			avg: month.avg,
			min: month.min,
			max: month.max,
			variance: month.variance,
			ci: confidenceInterval(month.avg, month.variance, month.n),
		}));


		var summerTempsAvg = summerTemperatures.sum.reduce((a,b) => a+b,0) / summerTemperatures.count;
		var summerTempsVar = variance(summerTemperatures.sum);
		var summerTempsCI = confidenceInterval(summerTempsAvg, summerTempsVar, 6); // TODO should not be a constant '6'
		year.summerTemperature = {
			avg: summerTempsAvg,
			min: summerTemperatures.min,
			max: summerTemperatures.max,
			variance: summerTempsVar,
			ci: null, 
		};
		year.summerTemperature.ci = {
			x: entry[0],
			low: summerTempsCI['low'],
			high: summerTempsCI['high'],
		};

		var winterTempsAvg = winterTemperatures.sum.reduce((a,b) => a+b,0) / winterTemperatures.count;
		var winterTempsVar = variance(summerTemperatures.sum);
		// console.log(winterTempsAvg);
		// console.log(winterTempsVar);
		var winterTempsCI = confidenceInterval(winterTempsAvg, winterTempsVar, 6); // TODO should not be a constant '6'
		year.winterTemperature = {
			avg: winterTemperatures.sum.reduce((a,b) => a+b,0)/ winterTemperatures.count,
			min: winterTemperatures.min,
			max: winterTemperatures.max,
			variance: winterTempsVar,
			ci: null,
		};
		year.winterTemperature.ci = {
			x: entry[0],
			low: winterTempsCI['low'],
			high: winterTempsCI['high'],
		};


		if (withinBaselinePeriod(entry[0])) {
			precipitationBaselineSummer.sum += summerPrecTotal;
			precipitationBaselineSummer.count++;
			precipitationBaselineWinter.sum += winterPrecTotal;
			precipitationBaselineWinter.count++;
			precipitationBaselineYearly.sum += sum(monthlyPrecip.map(p => sum(p.total))); // TODO fix nicer tangle
			precipitationBaselineYearly.count++;
		}

		year.max = max(year.monthlyTemperatures.map(m => m.avg));
		year.min = min(year.monthlyTemperatures.map(m => m.avg));

		year.variance = 0;
		year.ci = { low: -Infinity, high: Infinity };

		if (year.monthlyTemperatures.length > 1) {
			year.variance = variance(year.monthlyTemperatures.map(m => m.avg));
			year.ci = confidenceInterval(year.avg, year.variance, year.monthlyTemperatures.length);
		}


	});

	var yearly = statistic => entries().map(each => ({
		x: +each[0],
		y: each[1][statistic],
	}));

	var monthlyPrecipByStat = (monthIndex, statistic) => entries().map(each => ({
		x: +each[0],
		y: each[1].monthlyPrecip[monthIndex][statistic],
	}));

	var monthlyTempByStat = (monthIndex, statistic) => entries().map(entry => ({
		x: +entry[0],
		y: entry[1].monthlyTemperatures[monthIndex][statistic],
	}));

	var movingAveragesHighCharts = values => movingAverages(values, 10).map((avg, index) => ({
		x: keys()[index],
		y: avg,
	})).slice(10);

	var years = keys().map(Number);
	var monthlyPrecip = {};
	var monthlyTemps = {};

	months().forEach((month, index) => {
		var p = monthlyPrecip[month] = monthlyPrecip[month] || {};
		p.years = years.slice(10);
		p.total = monthlyPrecipByStat(index, 'total');
		p.movAvg = movingAveragesHighCharts(p.total.map(each => each.y));
		p.linear = linearRegression(p.years, p.total.map(each => each.y));
		p.total = p.total.slice(10);

		p.rain = monthlyPrecipByStat(index, 'rain');	
		p.rain_movAvg = movingAveragesHighCharts(p.rain.map(each => each.y)); 
		p.linear_rain_movAvg = linearRegression(p.years, p.rain_movAvg.map(each => each.y));
		p.linear_rain = linearRegression(p.years, p.rain.map(each => each.y));
		p.rain = p.rain.slice(10);

		// in pregress
		p.variance = monthlyPrecipByStat(index, 'variance');
		p.ci = monthlyPrecipByStat(index, 'ci');
		p.ci = p.ci.map((each) => ({
			x: each.x, 
			low: each.y.low,
			high: each.y.high,
		}));
		p.variance = monthlyPrecipByStat(index, 'variance');
		p.ciMovAvg = p.ci.map(each => ({ x: each.x }));
		['low', 'high'].forEach(bound =>
			movingAverages(p.ci.map(each => each[bound]), 10)
			.forEach((value, index) => p.ciMovAvg[index][bound] = value));
		p.ci = p.ci.slice(10);
		p.ciMovAvg = p.ciMovAvg.slice(10);

		p.snow = monthlyPrecipByStat(index, 'snow');
		// TODO
		p.snow_movAvg = movingAveragesHighCharts(p.snow.map(each => each.y)); // TODO REFORM
		p.linear_snow = linearRegression(p.years, p.snow.map(each => each.y));
		p.linear_snow_movAvg = linearRegression(p.years, p.snow_movAvg.map(each => each.y));
		p.snow = p.snow.slice(10);


		var t = monthlyTemps[month] = {};
		t.avg = monthlyTempByStat(index, 'avg');
		t.min = monthlyTempByStat(index, 'min').slice(10);
		t.max = monthlyTempByStat(index, 'max').slice(10);
		t.movAvg = movingAveragesHighCharts(t.avg.map(each => each.y));
		t.variance = monthlyTempByStat(index, 'variance');
		t.ci = monthlyTempByStat(index, 'ci');
		t.ci = t.ci.map((each) => ({
			x: each.x,
			low: each.y.low,
			high: each.y.high,
		}));
		t.ciMovAvg = t.ci.map(each => ({ x: each.x }));
		['low', 'high'].forEach(bound =>
			movingAverages(t.ci.map(each => each[bound]), 10)
			.forEach((value, index) => t.ciMovAvg[index][bound] = value));
		t.ci = t.ci.slice(10);
		t.ciMovAvg = t.ciMovAvg.slice(10);
		t.avg = t.avg.slice(10);
	});

	// Insert year for all season Temperatures
	var seasonal = (season, statistic) => entries().map(each => ({
		x: +each[0],
		y: each[1][season][statistic],
	}));


	var summerTemps = {
		avg: seasonal('summerTemperature', 'avg'),
		min: seasonal('summerTemperature', 'min').slice(10),
		max: seasonal('summerTemperature', 'max').slice(10),
		ci: seasonal('summerTemperature','ci').map((each) => (each.y)),
		ciMovAvg: null,
	};

	summerTemps.ciMovAvg = summerTemps.ci.map(each => ({ x: each.x }));
	['low', 'high'].forEach(bound =>
		movingAverages(summerTemps.ci.map(each => each[bound]), 10)
		.forEach((value, index) => summerTemps.ciMovAvg[index][bound] = value));

	var winterTemps = {
		avg: seasonal('winterTemperature', 'avg'),
		min: seasonal('winterTemperature', 'min').slice(10),
		max: seasonal('winterTemperature', 'max').slice(10),
		ci: seasonal('winterTemperature','ci').map((each) => (each.y)),
		ciMovAvg: null,
	};
	winterTemps.ciMovAvg = winterTemps.ci.map(each => ({ x: each.x }));
	['low', 'high'].forEach(bound =>
		movingAverages(winterTemps.ci.map(each => each[bound]), 10)
		.forEach((value, index) => winterTemps.ciMovAvg[index][bound] = value));



	summerTemps.movAvg = movingAveragesHighCharts(summerTemps.avg.map(each => each.y));
	winterTemps.movAvg = movingAveragesHighCharts(winterTemps.avg.map(each => each.y));



	summerTemps.avg = summerTemps.avg.slice(10);
	winterTemps.avg = winterTemps.avg.slice(10);

	// Inserts x: year for all seasons
	var seasonalPrecipByStat = (season, statistic) => entries().map(each => ({
		x: +each[0],
		y: each[1][season][statistic],
	}));
	var seasonalPrecipitation = { summerPrecipitation: {}, winterPrecipitation: {} };
	[
		{ season: 'summerPrecipitation', baseline: precipitationBaselineSummer },
		{ season: 'winterPrecipitation', baseline: precipitationBaselineWinter }
	].forEach((e) => {
		var p = seasonalPrecipitation[e.season];
		p.years = years.slice(10);
		p.total = seasonalPrecipByStat(e.season, 'total');
		p.snow = seasonalPrecipByStat(e.season, 'snow');
		p.ci = seasonalPrecipByStat(e.season, 'ci').map(each => each.y);
		p.ciMovAvg = p.ci.map(each => ({ x: each.x }));
		['low', 'high'].forEach(bound =>
			movingAverages(p.ci.map(each => each[bound]), 10)
			.forEach((value, index) => p.ciMovAvg[index][bound] = value));

		p.ci = p.ci.slice(10);
		p.ciMovAvg = p.ciMovAvg.slice(10);
		// TODO fix missing 10 data points
		p.linear_snow = linearRegression(p.years, p.snow.map(each => each.y)); // TODO REFORM

		p.snow_movAvg = movingAveragesHighCharts(p.snow.map(each => each.y)); 
		// p.linear_snow_movAvg = linearRegression(p.years, p.snow_movAvg.map(each => each.y)); 
		p.snow = p.snow.slice(10);

		p.rain = seasonalPrecipByStat(e.season, 'rain');	
		p.linear_rain = linearRegression(p.years, p.rain.map(each => each.y));

		p.rain_movAvg = movingAveragesHighCharts(p.rain.map(each => each.y)); 
		// p.linear_rain = linearRegression(p.years, p.rain_movAvg.map(each => each.y));
		p.rain = p.rain.slice(10);	


		p.movAvg = movingAveragesHighCharts(p.total.map(each => each.y));
		p.linear = linearRegression(p.years, p.total.map(each => each.y));
		p.difference = p.total.map(each => ({
			x: each.x,
			y: each.y - (e.baseline.sum / e.baseline.count),
		}));
		p.total = p.total.slice(10);
		p.linear_diff = linearRegression(years, p.difference.map(each => each.y));
		p.difference = p.difference.slice(10); 

	});

	var ci = entries().map((each) => ({
		x: +each[0],
		low: each[1].ci.low,
		high: each[1].ci.high,
	}));

	var ciMovAvg = ci.map(each => ({ x: each.x }));
	['low', 'high'].forEach(bound =>
		movingAverages(ci.map(each => each[bound]), 10)
		.forEach((value, index) => ciMovAvg[index][bound] = value));


	// precipitation moving average yearly
	var precipMovAvg = movingAveragesHighCharts(values().map(each => each.precip));

	yrly_diff = yearly('precip').map(each => ({
		x: each.x,
		y: each.y - (precipitationBaselineYearly.sum / precipitationBaselineYearly.count),
	}));



	// Growing Season
	var grwth_weeks = yearly('growingSeason').map(each => ({
		x: each.x,
		y: each.y.max,
		variance: each.y.variance,
		count: each.y.count,
	}));
	// console.log(yearly('growingSeason'));
	// console.log(grwth_weeks);
	// TODO restructure dubble storage of weeks
	var grwthSeason = {
		weeks: grwth_weeks,
		movAvg: movingAveragesHighCharts(grwth_weeks.map(each => each.y)),
		ci: grwth_weeks.map(each => ({
			x: each.x,
			ci: confidenceInterval(each.y,each.variance,each.count),
		})), 
		ciMovAvg: [],
	}
	grwthSeason.ci = grwthSeason.ci.map(each => ({
		x: each.x,
		low: each.ci.low,
		high: each.ci.high,
	}))
	// console.log(grwthSeason);
	grwthSeason.ciMovAvg = grwthSeason.ci.map(each => ({ x: each.x }));
	['low', 'high'].forEach(bound =>
		movingAverages(grwthSeason.ci.map(each => each[bound]), 10)
		.forEach((value, index) => grwthSeason.ciMovAvg[index][bound] = value));

	var precipCI = yearly('precipCI').map(each => ({
		x: each.x,
		low: each.y.low,
		high: each.y.high,
	}));
	var precipCIMovAvg = precipCI.map(each => ({ x: each.x }));
	['low', 'high'].forEach(bound =>
		movingAverages(precipCI.map(each => each[bound]), 10)
		.forEach((value, index) => precipCIMovAvg[index][bound] = value));
	summerTemps.meta = meta;
	winterTemps.meta = meta;

	return {
		meta,
		'days': days,
		temperatures: {
			meta,
			years,
			avg: yearly('avg').slice(10),
			min: yearly('min').slice(10),
			max: yearly('max').slice(10),
			movAvg: movingAveragesHighCharts(values().map(each => each.avg)),
			ci: ci.slice(10),
			ciMovAvg: ciMovAvg.slice(10),



			difference: yearly('avg').map(each => ({
				x: each.x,
				y: each.y - (temperatureBaseline.sum / temperatureBaseline.count),
			})),
		},
		monthlyTemps,
		summerTemps,
		winterTemps,

		growingSeason: {
			src: src,
			weeks: grwthSeason.weeks.slice(10),
			movAvg: grwthSeason.movAvg,
			ci: grwthSeason.ci.slice(10),
			ciMovAvg: grwthSeason.ciMovAvg.slice(10),
		},
		yearlyPrecipitation: {
			years: years.slice(10),
			total: yearly('precip').slice(10),
			snow: yearly('precip_snow').slice(10),
			// snow_movAvg: precipMovAvg_snow, // TODO
			linear_snow: linearRegression(years.slice(10), yearly('precip_snow').map(each => each.y)),
			rain: yearly('precip_rain').slice(10),
			// rain_movAvg:  precipMovAvg_rain,// TODO
			movAvg: precipMovAvg,
			linear_rain: linearRegression(years.slice(10), yearly('precip_rain').map(each => each.y)),
			linear: linearRegression(years.slice(10), yearly('precip').map(each => each.y)),
			difference: yrly_diff.slice(10),
			linear_diff: linearRegression(years.slice(10), yrly_diff.map(each => each.y)),
			ci: precipCI.slice(10),
			ciMovAvg: precipCIMovAvg.slice(10),
		},
		monthlyPrecip,
		summerPrecipitation: seasonalPrecipitation.summerPrecipitation,
		winterPrecipitation: seasonalPrecipitation.winterPrecipitation,
	};
};

var parseAbiskoIceData = function (result, src='') {
	var fields = result.meta.fields;
	var data = result.data;

	var iceData = [];
	data.forEach((row) => {
		var winterYear = +row[fields[0]] || undefined;
		var springYear = +row[fields[1]] || undefined;
		var freezeDate = parseDate(row[fields[2]]);
		var freezeWeek = freezeDate.year > 0 ? weekNumber(createDate(freezeDate)) : null;
		var freezeDOY = freezeDate.year > 0 ? dayOfYear(createDate(freezeDate)) : null
		var breakupDate = parseDate(row[fields[3]]);
		var breakupWeek = breakupDate.year > 0 ? weekNumber(createDate(breakupDate)) : null;
		var breakupDOY = breakupDate.year > 0 ? dayOfYear(createDate(breakupDate)) : null
		var iceTime = validNumber(row[fields[4]]) || null;

		if (springYear) {
			iceData[springYear] = {
				breakupDate: breakupDate.year > 0 ? createDate(breakupDate) : null,
				breakupDOY,
				breakupWeek,
				freezeDate: freezeDate.year > 0 ? createDate(freezeDate) : null,
				freezeDOY: freezeDOY + (freezeDOY < 50 ? 365 : 0),
				freezeWeek: freezeWeek + (freezeWeek < 20 ? 52 : 0),
				iceTime,
			};
		}
	});

	var yearly = (statistic) => iceData.map((each, year) => ({
		x: +year,
		y: each[statistic],
	})).filter(each => each.y).filter(each => each.x >= 1909);

	var dateFormat = date => date.getFullYear() + ' ' + monthName(monthByIndex(date.getMonth())) + ' ' + (+date.getDay() + 1);

	var breakupDOY = iceData.map((each, year) => ({
		x: +year,
		y: each.breakupDOY,
		name: each.breakupDate ? dateFormat(each.breakupDate) : null,
		week: each.breakupDate ? weekNumber(each.breakupDate) : null,
	})).filter(each => each.y).filter(each => each.x >= 1909).filter(each => each.name != null);
	// var breakupVar = variance(breakupDOY.map(each=>each.y));

	var freezeDOY = iceData.map((each, year) => ({
		x: +year,
		y: each.freezeDOY,
		name: each.freezeDate ? dateFormat(each.freezeDate) : null,
		week: each.freezeDate ? weekNumber(each.freezeDate) : null,
	})).filter(each => each.y).filter(each => each.x >= 1909).filter(each => each.name != null);
	// var freezeVar = variance(freezeDOY.map(each=>each.y));

	// console.log(breakupDOY);
	// console.log(freezeDOY);
	var breakupLinear = linearRegression(breakupDOY.map(w => w.x), breakupDOY.map(w => w.y));
	var freezeLinear = linearRegression(freezeDOY.map(w => w.x), freezeDOY.map(w => w.y));

	var breakup = breakupDOY.map(each => ({
		x: each.x,
		y: weekNumber(dateFromDayOfYear(each.x, each.y)),
		name: each.name,
	}));

	var freeze = freezeDOY.map(each => {
		var weekNo = weekNumber(dateFromDayOfYear(each.x, each.y));
		return {
			x: each.x,
			y: weekNo + (weekNo < 10 ? 52 : 0),
			name: each.name,
		}
	});
	var calculateMovingAverages = (values) => movingAverages(values.map(v => v.y), 10).map((avg, i) => ({
		x: values[i].x, 
		y: avg,
	}))


	var iceTime = yearly('iceTime');

	// equal weighted confidence interval
	var equal_weight = confidenceInterval_EQ_ND(iceTime, 10)	

	var iceTimeMovAvg = equal_weight.movAvg;
	var iceTimeMovAvgVar = equal_weight.movAvgVar;
	var iceTimeCIMovAvg = equal_weight.ciMovAvg;
	var iceTimeLinear = linearRegression(iceTime.map(w => w.x), iceTime.map(w => w.y));
	var iceTimeMovAvgLinear = linearRegression(iceTimeMovAvg.map(w => w.x), iceTimeMovAvg.map(w => w.y));

	var yearMax = iceData.length - 1;
	// console.log(data);
	// console.log(freeze);
	return {
		src: src,
		yearMax,
		breakup,
		freeze,
		iceTime,
		iceTimeMovAvg: iceTimeMovAvg.slice(10),
		iceTimeCIMovAvg: iceTimeCIMovAvg.slice(10),
		breakupLinear: [
			{ x: 1915, y: weekNumber(dateFromDayOfYear(1915, Math.round(breakupLinear(1915)))) },
			{ x: yearMax, y: weekNumber(dateFromDayOfYear(yearMax, Math.round(breakupLinear(yearMax)))) }
		],
		freezeLinear: [
			{ x: 1909, y: weekNumber(dateFromDayOfYear(1909, Math.round(freezeLinear(1909)))) },
			{ x: yearMax, y: weekNumber(dateFromDayOfYear(yearMax, Math.round(freezeLinear(yearMax)))) }
		],
		iceTimeLinear: [
			{ x: 1915, y: iceTimeLinear(1915) },
			{ x: yearMax, y: iceTimeLinear(yearMax) }
		],
		iceTimeMovAvgLinear: [
			{ x: 1925, y: iceTimeMovAvgLinear(1925) },
			{ x: yearMax, y: iceTimeMovAvgLinear(yearMax) }
		],
	};
};

var parseAbiskoSnowData = function (result, src='') {
	var data = result.data;
	var fields = result.meta.fields;

	var snow = [];

	data.forEach((row) => {
		var date = parseDate(row[fields[0]]);
		var depthSingleStake = validNumber(row[fields[1]]);
		if (date.year && depthSingleStake) {
			var year = snow[date.year] = snow[date.year] || [];
			var month = year[date.month] = year[date.month] || { sum: 0, count: 0 };
			month.sum += depthSingleStake;
			month.count++;
		}
	});

	snow.forEach((year) => {
		for (var i = 1; i <= 12; i++) {
			var m = year[i];
			year[i] = m ? m.sum / m.count : null;
		}
	});

	var periods = [
		//{ start: 1913, end: 1930 },
		{ start: 1931, end: 1960 },
		{ start: 1961, end: 1990 },
		{ start: 1991, end: Infinity },
		{ start: -Infinity, end: Infinity },
	];

	var decades = [
		//{ start: 1931, end: 1940, },
		//{ start: 1941, end: 1950, },
		//{ start: 1951, end: 1960, },
		{ start: 1961, end: 1970, },
		{ start: 1971, end: 1980, },
		{ start: 1981, end: 1990, },
		{ start: 1991, end: 2000, },
		{ start: 2001, end: 2010, },
		{ start: 2011, end: Infinity },
		{ start: -Infinity, end: Infinity }, // entire period
	];

	var periodMeans = {};
	var decadeMeans = {};

	var calculateMeans = (periods, periodMeans) => {
		periods.forEach((period) => {
			var key = period.start === -Infinity ? 'allTime' : period.start.toString();
			var means = periodMeans[key] = {
				period,
				means: [],
			};
			means.period.toString = () => {
				var start = means.period.start,
					end = means.period.end;
				if (key === 'allTime') return 'Entire period';
				return 'From ' + start + ' to ' + (end === Infinity ? 'present' : end);
			};
			snow.filter((_, year) => year >= period.start && year <= period.end).forEach((year) => {
				year.forEach((depth, month) => {
					if (depth) {
						var m = means.means[month - 1] = means.means[month - 1] || { sum: 0, count: 0 };
						m.sum += depth;
						m.count++;
					}
				});
			});
			for (var i = 0; i < 12; i++) {
				var m = means.means[i];
				means.means[i] = m ? m.sum / m.count : NaN;
			}
		});
	};

	calculateMeans(periods, periodMeans);
	calculateMeans(decades, decadeMeans);
	return {
		src: src,
		periodMeans,
		decadeMeans,
	};
};

// language constant 
var l = 0;
var LANG = ['Svenska','English'];

// legend label constants
var MAX = ["Max", "Max"];
var MIN = ["Min","Min"];
// var YRL_AVG = ["Yearly average", "Årligt genomsnitt"];
// var MNTH_AVG = ["Monthly average", "Månatlig genomsnitt"];
var YRL_CNF_INT = ["Confidence interval (yearly avg.)", "Konfidence interval (Årligt genomsnitt)"];
var WK = ["Weeks","veckor"];
var MVNG_AVG = ["Moving average", "Rörligt genomsnitt"];
var MVNG_AVG_CNF_INT = ["Confidence interval (moving avg.)","Konfidence interval (rörligt genomsnitt)"];

// Percipitation
var PRC_SNW = ["Precipitation from snow", "Utfällning från snö"];
var PRC_RN = ["Precipitation from rain", "Utfällning från regn"];
var PRC_AVG = ["Total average precipitation", "Genomsnittlig utfällning"];
// Freeze-up and Break-up
var FRZ = ["Freeze-up","Freeze-up"];
var BRK = ["Break-up", "Break-up"];
var ICE_TIME = ["Ice time", "Ice time"];
var ICE_TIME_MVNG_AVG = ["Ice time (moving average)", "Ice time (moving average)"];

var preSetMeta = {
	'abiskoTemp': {
		src: 'https://www.arcticcirc.net/',
		vis: {
			movAvgCI: false,
			max: false,
			min: false,
		},
		color: {
			yrlyReg: '#888888',	
		},
	},
	'default': {
		src: undefined,
		vis: {
			movAvgCI: true,
			max: true,
			min: true,
		},
		color: {
			yrlyReg: '#4444ff',
		},

	}
}

// Localization

/*****************/
/* RENDER GRAPHS */
/*****************/

Highcharts.setOptions({
	dataSrc: '',
	lang:{
		dataCredit: 'Data source',
		showDataTable: 'Show/hide data',
		langOption: 'Svenska',
		shortMonths: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
		downloadJPEG: 'Download as JPEG',
		downloadPDF: 'Download as PDF',
		downloadSVG: 'Download as SVG',
		months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
		yearlyAvg: 'Yearly average',
		monthlyAvg: 'Monthly average',
		min: 'Min',
		max: 'Max',
		weeks: 'weeks',
		yearlyCI: 'Confidence interval (yearly avg.)',
		movAvg: 'Moving average',
		movAvgCI: 'Confidence interval (moving avg.)',
		precSnow: 'Precipitation from snow',
		precRain: 'Precipitation from rain',
		precAvg: 'Total average precipitation',
		freezeup: 'Freeze-up',
		breakup: 'Break-up',
		iceTime: 'Ice time',
		iceTimeMovAvg: 'Ice time (moving avg.)',
	},
	otherLang:{
		dataCredit: 'Data källa',
		showDataTable: 'Visa/göm data',
		langOption: 'English',
		shortMonths: ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec'],
		downloadJPEG: 'Ladda ner som JPEG',
		downloadPDF: 'Ladda ner som PDF',
		downloadSVG: 'Ladda ner som SVG',
		viewFullscreen: 'Visa i fullskärm',
		resetZoom: 'Återställ zoom',
		printChart: 'Skriv ut',
		months: ['Januari','Februari','Mars','April','Maj','Juni','Juli','Augusti','September','Oktober','November','December'],
		yearlyAvg: 'Årligt medelvärde',
		mnonthlyAvg: 'Månligt medelvärde',
		weeks: 'veckor',
		yearlyCI: 'Konfidence interval (rörligt medelvärde)',
		movAvg: 'Rörligt medelvärde',
		movAvgCI: 'Konfidence interval (rörligt medelvärde)',
		precSnow: 'Utfällning från snö',
		precRain: 'Utfällning från regn',
		precAvg: 'Total genomsnittlig utfällning',
		freezeup: 'Isläggning',
		breakup: 'Islossning',
		iceTime: 'Is tid',
		iceTimeMovAvg: 'Is tid (rörligt medelvärde)',
	},
	exporting: {
		// showTable: true, // TODO DATA TABLE
		buttons: {
			contextButton: {
				menuItems: [{
					textKey: 'downloadPDF',
					onclick: function(){
						this.exportChart({
							type: 'application/pdf'
						});
					},
				},{
					textKey: 'downloadJPEG',
					onclick: function(){
						this.exportChart({
							type: 'image/jpeg'
						});
					}
				},'downloadSVG','viewFullscreen','printChart',{
					separator: true,
				},{
					textKey: 'langOption',
					onclick: function(){
						var lang = this.options.lang;
						var otherLang = this.options.otherLang;
						var options = this.options;
						options.lang = otherLang;
						options.otherLang = lang;
						var id = this.container.id;
						this.container.innerHTML = '';
						Highcharts.chart(id, options);
						// TODO bug both swedish 
					},
				},{
					textKey: 'showDataTable',
					onclick: function(){
						if(this.options.exporting.showTable) {
							this.dataTableDiv.innerHTML = '';
						};
						this.update({
							exporting: {
								showTable: !this.options.exporting.showTable, 
							},
						});
						// TODO toggle between 'Show data' and 'Hide data'
					},
				},{
					textKey: 'dataCredit',
					onclick: function(){
						if(this.options.dataSrc){
							window.location.href = this.options.dataSrc // TODO link to exact dataset with entry in data to href

						}
					},
				}],
			},
		},
	},
});


var renderTemperatureGraph = function (data, id, title) {
	// console.log(title);
	// console.log(data)
	var meta = data.meta;
	var chart = Highcharts.chart(id, {
		chart: {
			type: 'line',
			zoomType: 'xy',
		},
		dataSrc: meta.src,
		title: {
			text: title,
		},
		xAxis: {
			title: {
				text: 'Year',
			},
			crosshair: true,
		},
		yAxis: {
			title: {
				text: 'Temperature [°C]'
			},
			plotLines: [{
				value: 0,
				color: 'rgb(204, 214, 235)',
				width: 2,
			}],
			// max: 2,
			// min: -3,
			tickInterval: 1,
			lineWidth: 1,
		},
		tooltip: {
			shared: true,
			valueSuffix: ' °C',
			valueDecimals: 2,
		},
		series: [{
			name: MAX[l],
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#ff0000',
			data: data.max,
			visible: meta.vis.max,
			showInLegend: !(typeof data.min === 'undefined'),
		}, {
			name: MIN[l],
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#0000ff',
			data: data.min,
			visible: meta.vis.min, 
			showInLegend: !(typeof data.min === 'undefined'),
		},{
			name: YRL_CNF_INT[l],
			type: 'arearange',
			color: '#888888',
			data: data.ci,
			zIndex: 0,
			fillOpacity: 0.3,
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: { enabled: false },
			visible: false,
		}, {
			name: MVNG_AVG[l],
			color: '#888888',
			marker: { enabled: false },
			data: data.movAvg,
		}, {
			name: MVNG_AVG_CNF_INT[l],
			type: 'arearange',
			color: '#7777ff',
			data: data.ciMovAvg,
			zIndex: 0,
			fillOpacity: 0.3,
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: { enabled: false },
			visible: meta.vis.movAvgCI
		},{
			name: 'Yearly averages',
			regression: true,
			marker: {radius: 2},
			states: {hover: { lineWidthPlus: 0 }},
			lineWidth: 0,
			color: '#888888',
			regressionSettings: {
				type: 'linear',
				color: meta.color.yrlyReg,
				// color: '#4444ff',
				// '#888888'
				name: 'Linear regression',
			},
			data: data.avg,
		}],
	});
};



var renderAbiskoMonthlyTemperatureGraph = function (temperatures, id, title) {
	// console.log(title);
	// console.log(temperatures);
	Highcharts.chart(id, {
		chart: {
			type: 'line',
			zoomType: 'xy',
		},
		dataSrc: temperatures.src,
		title: {
			text: title,
		},
		xAxis: {
			title: {
				text: 'Year',
			},
			crosshair: true,
		},
		yAxis: {
			title: {
				text: 'Temperature [°C]'
			},
			plotLines: [{
				value: 0,
				color: 'rgb(204, 214, 235)',
				width: 2,
			}],
			//max: 2,
			//min: -3,
			tickInterval: 1,
			lineWidth: 1,
		},
		tooltip: {
			shared: true,
			valueSuffix: ' °C',
			valueDecimals: 2,
		},
		series: [{
			name: this.Highcharts.getOptions().lang.max,
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#ff0000',
			data: temperatures.max,
			visible: false,
		}, {
			name: this.Highcharts.getOptions().lang.min,
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#0000ff',
			data: temperatures.min,
			visible: false,
		}, {
			regression: true,
			regressionSettings: {
				type: 'linear',
				color: '#aaaaaa',
				name: 'linear regression',
			},
			name: this.Highcharts.getOptions().lang.monthlyAvg,
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#888888',
			data: temperatures.avg,
			visible: true,
		},{
			name: 'Confidence interval',
			type: 'arearange',
			color: '#888888',
			data: temperatures.ci,
			zIndex: 0,
			fillOpacity: 0.3,
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: { enabled: false },
			visible: false,

		},{
			name: 'Confidence interval (moving avg.)',
			type: 'arearange',
			color: '#7777ff',
			data: temperatures.ciMovAvg,
			zIndex: 0,
			fillOpacity: 0.3,
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: { enabled: false },
			visible: false,

		},{
			name: MVNG_AVG[l],
			color: '#888888',
			marker: { enabled: false },
			data: temperatures.movAvg,
		}],
	});
};

var renderTemperatureDifferenceGraph = function (temperatures, id, title) {
	// console.log(title);
	// console.log(temperatures);
	Highcharts.chart(id, {
		chart: {
			type: 'column'
		},
		dataSrc: temperatures.src,
		// rangeSelector: {
		// selected: 2
		// },
		title: {
			text: title,
		},
		subtitle: {
			//text: 'Difference between yearly average and average for 1961-1990',
		},
		xAxis: {
			title: {
				text: 'Year',
			},
			crosshair: true,
			plotBands: [{
				color: 'rgb(245, 245, 245)',
				from: baselineLower,
				to: baselineUpper,
			}],
		},
		yAxis: {
			title: {
				text: 'Temperature [°C]'
			},
			lineWidth: 1,
			min: -2,
			max: 3,
			tickInterval: 1,
		},
		tooltip: {
			shared: true,
			valueSuffix: ' °C',
			valueDecimals: 2,
		},
		legend: {
			enabled: true,
		},
		annotations: [{
			labelOptions: {
				barkgroundColor: 'red',
				verticalAlign: 'top',
			},
			labels: [{
				point: {
					xAxis: 0,
					yAxis: 0,
					x: baselineLower + (baselineUpper - baselineLower) / 2,
					y: 2.4,
				},
				text: 'Baseline',
			}],
		}],
		series: [{
			regression: true,
			regressionSettings: {
				type: 'linear',
				color: '#aa0000',
				name: 'Linear regression', 
			},
			name: 'Difference',
			data: temperatures.difference,
			color: 'red',
			negativeColor: 'blue',
		}],
	});
};

var renderGrowingSeasonGraph = function (season, id, title='Growing season') {
	Highcharts.chart(id, {
		chart: {
			type: 'line',
			zoomType: 'xy',
		},
		dataSrc: season.src,
		title: {
			text: 'Growing season',
		},
		subtitle: {
			text: 'The maximum consecutive weeks with average temperature above freezing.',
		},
		xAxis: {
			title: {
				text: 'Year',
			},
			crosshair: true,
		},
		yAxis: {
			title: {
				text: WK[l]
			},
			tickInterval: 1,
			lineWidth: 1,
		},
		tooltip: {
			shared: true,
			valueDecimals: 0,
		},
		series: [{
			regression: true,
			regressionSettings: {
				type: 'linear',
				color: '#008800',
				name: 'Linear regression',
			},
			name: WK[l],
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			color: '#00aa00',
			data: season.weeks,
			visible: true,
		},{ 
			name: 'Confidence interval',
			type: 'arearange',
			color: '#005500',
			data: season.ci,
			zIndex: 0,
			fillOpacity: 0.3,
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: { enabled: false },
			visible: false,

		}, {
			name: MVNG_AVG[l],
			color: '#00aa00',
			marker: { enabled: false },
			data: season.movAvg,
		},{
			name: 'Confidence interval (moving avg.)',
			type: 'arearange',
			color: '#006600',
			data: season.ciMovAvg,
			zIndex: 0,
			fillOpacity: 0.3,
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: { enabled: false },
			visible: false,

		}],
	});
}

var renderPrecipitationDifferenceGraph = function (precipitation, id, title) {
	// console.log(precipitation);
	Highcharts.chart(id, {
		chart: {
			type: 'column'
		},
		dataSrc: precipitation.src,
		title: {
			text: title,
		},
		subtitle: {
			//text: 'Difference between yearly average and average for 1961-1990',
		},
		xAxis: {
			title: {
				text: 'Year',
			},
			crosshair: true,
			plotBands: [{
				color: 'rgb(245, 245, 245)',
				from: baselineLower,
				to: baselineUpper,
			}],
		},
		yAxis: {
			title: {
				text: 'Precipitation [mm]'
			},
			lineWidth: 1,
			//min: -2,
			//max: 3,
			tickInterval: 1,
		},
		tooltip: {
			shared: true,
			valueSuffix: ' mm',
			valueDecimals: 2,
		},
		legend: {
			enabled: true,
		},
		annotations: [{
			labelOptions: {
				barkgroundColor: 'red',
				verticalAlign: 'top',
			},
			labels: [{
				point: {
					xAxis: 0,
					yAxis: 0,
					x: baselineLower + (baselineUpper - baselineLower) / 2,
					y: 100,
				},
				text: 'Baseline',
			}],
		}],
		series: [{
			regression: true,
			name: 'Difference',
			data: precipitation.difference,
			color: 'red',
			negativeColor: 'blue',
			regressionSettings: {
				type: 'linear',
				color: rainColor.color,
				name: 'Linear regression',
			},
		},
			//	REST code
			// 	{
			// 	name: 'Linear regression',
			// 	type: 'line',
			// 	visible: false,
			// 	marker: {
			// 		enable: false,
			// 	},
			// 	color: rainColor.color,
			// 	states: {
			// 		hober: {
			// 			lineWidth: 0,
			// 		},
			// 	},
			// 	enableMouseTracking: false,
			// 	//
			//
			// 	data: [
			// 		{ x: precipitation.years[0], 
			// 			y: precipitation.linear_diff(precipitation.years[0]) },
			// 		{ x: precipitation.years[precipitation.years.length - 1],
			// 			y: precipitation.linear_diff(precipitation.years[precipitation.years.length - 1]) }
			// 	],
			//
			// 	//
			// },
		],
	});
};

var renderYearlyPrecipitationGraph = function (precipitation, id, title) {
	Highcharts.chart(id, {
		chart: {
			type: 'line'
		},
		dataSrc: precipitation.src,
		title: {
			text: title,
		},
		xAxis: {
			title: {
				text: 'Year',
			},
			crosshair: true,
		},
		yAxis: {
			title: {
				text: 'Total precipitation [mm]'
			},
			lineWidth: 1,
			floor: 0, // Precipitation can never be negative
		},
		tooltip: {
			// shared: true,
			valueSuffix: ' mm',
			valueDecimals: 0,
			headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>' +
			'<span style="color: red">\u25CF</span> Linear regression: <b>' + precipitation.linear + '</b><br />' +
			'<span style="color: white; visibility: hidden">\u25CF</span> Total precipitation: <b>{point.total:.0f} mm</b><br />',
		},
		series: [{
			id: 'snow',
			regression: true,
			regressionSettings: {
				type: 'linear',
				color: snowColor.color,
				name: 'Linear regression of snow',
			},
			name: PRC_SNW[l],
			type: 'column',
			stack: 'precip',
			stacking: 'normal',
			data: precipitation.snow,
			color: snowColor.color,
			visible: true,
			borderColor: snowColor.borderColor,
			states: {
				hover: {
					color: snowColor.hover,
					animation: {
						duration: 0,
					},
				},
			},
		},{
			id: 'movAvg',
			name: 'Moving average precipitation',
			color: rainColor.color,
			visible: false,
			data: precipitation.movAvg,
			marker: { enabled: false },
			states: { hover: { lineWidthPlus: 0 } },
		},{
			id: 'ciMovAvg',
			name: 'Confidence interval (mov avg.)',
			type: 'arearange',
			color: '#000055',
			data: precipitation.ciMovAvg,
			zIndex: 0,
			fillOpacity: 0.3,
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: { enabled: false },
			visible: false,
		},{
			id: 'rain',
			regression: true,
			regressionSettings: {
				type: 'linear',
				color: rainColor.color,
				name: 'Linear regression of rain',
			},
			name: PRC_RN[l],
			type: 'column',
			stack: 'precip',
			stacking: 'normal',
			visible: true,
			data: precipitation.rain,
			color: rainColor.color,
			borderColor: rainColor.borderColor,
			states: {
				hover: {
					color: rainColor.hover,
					animation: {
						duration: 0,
					},
				},
			},
		},{
			id: 'linear',
			name: 'Linear regression from all sources',
			visible: false,
			// linkedTo: ':previous',
			marker: {
				enabled: false, // Linear regression lines doesn't contain points
			},
			color: 'red',
			states: {
				hover: {
					lineWidth: 0, // Do nothing on hover
				},
			},
			enableMouseTracking: false, // No interactivity
			data: [
				{ x: precipitation.years[0], 
					y: precipitation.linear(precipitation.years[0]) },
				{ x: precipitation.years[precipitation.years.length - 1],
					y: precipitation.linear(precipitation.years[precipitation.years.length - 1]) }
			],
		}],
	});
};

var renderMonthlyPrecipitationGraph = function (precipitation, id, title) {
	Highcharts.chart(id, {
		chart: {
			type: 'line'
		},
		dataSrc: precipitation.src,
		title: {
			text: title,
		},
		xAxis: {
			title: {
				text: 'Year',
			},
			crosshair: true,
		},
		yAxis: {
			title: {
				text: 'Total precipitation [mm]'
			},
			lineWidth: 1,
			max: 150,
			floor: 0, // Precipitation can never be negative
		},
		tooltip: {
			shared: true,
			valueSuffix: ' mm',
			valueDecimals: 0,
			headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>' +
			'<span style="color: red">\u25CF</span> Linear regression: <b>' + precipitation.linear + '</b><br />' +
			'<span style="color: white; visibility: hidden">\u25CF</span> Total precipitation: <b>{point.total:.0f} mm</b><br />',
		},
		series: [{
			regression: true,
			regressionSettings: {
				type: 'linear',
				color: snowColor.color,
				name: 'Linear regression (snow)',
			},
			name: PRC_SNW[l],
			type: 'column',
			stack: 'precip',
			stacking: 'normal',
			data: precipitation.snow,
			color: snowColor.color,
			borderColor: snowColor.borderColor,
			states: {
				hover: {
					color: snowColor.hover,
					animation: {
						duration: 0,
					},
				},
			},
		}, {
			regression: true,
			regressionSettings: {
				type: 'linear',
				color:rainColor.color,
				name: 'Linear regression (rain)',
			},
			name: PRC_RN[l],
			type: 'column',
			stack: 'precip',
			stacking: 'normal',
			data: precipitation.rain,
			color: rainColor.color,
			borderColor: rainColor.borderColor,
			states: {
				hover: {
					color: rainColor.hover,
					animation: {
						duration: 0,
					},
				},
			},
		},{
			name: 'Confidence interval (mov avg.)',
			type: 'arearange',
			color: '#000055',
			data: precipitation.ciMovAvg,
			zIndex: 0,
			fillOpacity: 0.3,
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: { enabled: false },
			visible: false,

		},{
			name: 'Moving average precipitation',
			visible: false,
			color: rainColor.color,
			data: precipitation.movAvg,
			marker: { enabled: false },
		},{
			name: 'Linear regression (total)',
			visible: false,
			marker: {
				enabled: false, // Linear regression lines doesn't contain points
			},
			color: 'red',
			states: {
				hover: {
					lineWidth: 0, // Do nothing on hover
				},
			},
			enableMouseTracking: false, // No interactivity
			data: [
				{ x: precipitation.years[0], 
					y: precipitation.linear(precipitation.years[0]) },
				{ x: precipitation.years[precipitation.years.length - 1],
					y: precipitation.linear(precipitation.years[precipitation.years.length - 1]) }
			],
		},
			// {
			// 	name: 'Linear regression (snow)',
			// 	visible: false,
			// 	marker: {
			// 		enabled: false 
			// 	},
			// 	color: rainColor.color,
			// 	states: {
			// 		hover: {
			// 			lineWidth: 0,	// do nothing on hover
			// 		},
			//
			// 	},
			// 	enableMouseTracking: false,
			// 	data: [
			//
			// 		{ x: precipitation.years[0], 
			// 			y: precipitation.linear_snow(precipitation.years[0]) },
			// 		{ x: precipitation.years[precipitation.years.length - 1],
			// 			y: precipitation.linear_snow(precipitation.years[precipitation.years.length - 1]) }
			// 	],
			// },{
			// 	name: 'Linear regression (rain)',
			// 	visible: false,
			// 	marker: {
			// 		enabled: false 
			// 	},
			// 	color: rainColor.color,
			// 	states: {
			// 		hover: {
			// 			lineWidth: 0,	// do nothing on hover
			// 		},
			//
			// 	},
			// 	enableMouseTracking: false,
			// 	data: [
			//
			// 		{ x: precipitation.years[0], 
			// 			y: precipitation.linear_rain(precipitation.years[0]) },
			// 		{ x: precipitation.years[precipitation.years.length - 1],
			// 			y: precipitation.linear_rain(precipitation.years[precipitation.years.length - 1]) }
			// 	],
			// },



		],
	});
};

var renderAbiskoIceGraph = function (ice, id, title) {
	// console.log(title);
	// console.log(ice);
	Highcharts.chart(id, {
		chart: {
			type: 'line'
		},
		dataSrc: ice.src,
		title: {
			text: title,
		},
		xAxis: {
			title: {
				text: 'Year',
			},
			crosshair: true,
		},
		yAxis: [{
			title: {
				text: 'Ice break-up / freeze-up [day of year]',
			},
			lineWidth: 1,
			labels: {
				formatter: function () {
					return this.value > 52 ? this.value - 52 : this.value;
				},
			}
		}, {
			title: {
				text: 'Ice time [number of days]',
			},
			lineWidth: 1,
			max: 250,
			min: 80,
			opposite: true,
		}],
		tooltip: {
			shared: true,
			valueDecimals: 0,
			formatter: function () {
				var tooltip = '<span style="font-size: 10px">' + (+this.x-1) + '/' + this.x + '</span><br/>';
				this.points.forEach(point =>
					tooltip += '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' +(point.point.options.week || point.y) + '</b><br/>');
				return tooltip;
			},
		},
		series: [{
			regression: true,
			regressionSettings: {
				type: 'linear',
				color: '#0000ee',
				name: 'Linear regression (freeze-up)',
			},
			yAxis: 0,
			name: 'Freeze-up',
			color: '#0000ee',
			lineWidth: 0,
			marker: { radius: 2 },
			states: { hover: { lineWidthPlus: 0 } },
			data: ice.freeze,
		}, 
			// {
			// 	yAxis: 0,
			// 	name: 'Linear regression (freeze-up)',
			// 	marker: { enabled: false },
			// 	color: '#0000ee',
			// 	// linkedTo: ':previous',
			// 	states: { hover: { lineWidth: 0, } },
			// 	enableMouseTracking: false,
			// 	data: ice.freezeLinear,
			// }, 
			{
				regression: true,
				regressionSettings: {
					type: 'linear',
					color: '#ee0000',
					name: 'Linear regression (break-up)',
				},
				yAxis: 0,
				name: 'Break-up',
				color: '#ee0000',
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				data: ice.breakup,
			},{
				name: 'Confidence Interval (moving avg.)',
				type: 'arearange',
				color: '#7777ff',
				data: ice.iceTimeCIMovAvg,
				zIndex: 0,
				fillOpacity: 0.3,
				lineWidth: 0,
				states: { hover: { lineWidthPlus: 0 } },
				marker: { enabled: false },
				yAxis: 1,
				visible: false,
			},
			// 	{
			// 	yAxis: 0,
			// 	name: 'Linear regression (break-up)',
			// 	marker: { enabled: false },
			// 	color: '#ee0000',
			// 	// linkedTo: ':previous',
			// 	states: { hover: { lineWidth: 0, } },
			// 	enableMouseTracking: false,
			// 	data: ice.breakupLinear,
			// },
			{
				regression: true,
				regressionSettings: {
					type: 'linear',
					color: '#00bb00',
					name: 'Linear regression (ice time)',
				},
				yAxis: 1,
				name: 'Ice time',
				color: '#00bb00',
				lineWidth: 0,
				marker: { radius: 2 },
				states: { hover: { lineWidthPlus: 0 } },
				data: ice.iceTime,
			},{
				yAxis: 1,
				name: 'Ice time (moving avg.)',
				color: '#cc00cc',
				data: ice.iceTimeMovAvg,
				marker: { enabled: false },
			}],
	});
};

var renderAbiskoSnowGraph = function (snow, id, title) {
	var series = Object.values(snow).map(p => ({
		name: p.period,
		data: p.means.rotate(6).slice(2),
	}));
	Highcharts.chart(id, {
		chart: {
			type: 'line'
		},
		dataSrc: snow.src,
		title: {
			text: title,
		},
		xAxis: {
			categories: months().rotate(6).slice(2),
			title: {
				text: 'Month',
			},
			crosshair: true,
		},
		yAxis: {
			title: {
				text: 'Snow depth [cm]',
			},
			lineWidth: 1,
			floor: 0,
		},
		tooltip: {
			shared: true,
			valueSuffix: ' cm',
			valueDecimals: 0,
		},
		series,
	});
};


var renderZoomableGraph = function(data, id, title){
	// console.log(title)
	// console.log(data);
	Highcharts.chart(id, {
		chart: {
			zoomType: 'x'
		},
		// dataSrc: data.src,
		title: {
			text: title + ' [DUMMY/START]',
		},
		subtitle: {
			text: document.ontouchstart === undefined ?
			'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
		},
		xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: { // don't display the dummy year
				month: '%e. %b',
				year: '%b'
			},
			title: {
				text: 'Date'
			}
		},
		yAxis: {
			title: {
				text: 'Temperatures'
			}
		},
		legend: {
			enabled: false
		},
		plotOptions: {
			area: {
				fillColor: {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1
					},
					stops: [
						[0, Highcharts.getOptions().colors[0]],
						[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
					]
				},
				marker: {
					radius: 2
				},
				lineWidth: 1,
				states: {
					hover: {
						lineWidth: 1
					}
				},
				threshold: null
			}
		},

		series: [{
			type: 'line',
			name: 'Average',
			data: data,
		}]
	});
}


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
	}
	return complete;
};

var monthlyFunc = (render) => function(data, id, title, src="") {
		months().forEach(month =>  
		render(data[month], id+"_"+month, title+" "+monthName(month)));
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
// function makeDocument() {
//   var div = document.getElementById("render");
//   div.innerHTML = "<div id='render'></div><figcaption></figcaption><script type=text/javascript>functorGISSTEMP('data/NH.Ts.csv',renderTemperatureGraph,'https://data.giss.nasa.gov/gistemp/')('div','Northern Hemisphere temperatures');</script>";
// }

var createBaseline = function(){
	var form = document.createElement('form');
	form.setAttribute("id",baseline);
	var header = document.createElement('header');
	header.innerHTML = "Year range for baseline";

	var lowLabel = document.createElement('label');
	lowLabel.setAttribute("for","baselineLower");
	lowLabel.innerHTML = "Lower limit ";
	var lowInput = document.createElement('input');
	lowInput.setAttribute("name","baselineLower");
	lowInput.setAttribute("type","text");
	lowInput.setAttribute("value","1961")

	var br1 = document.createElement('br');

	var upperLabel = document.createElement('label');
	upperLabel.setAttribute("for","baselineUpper");
	upperLabel.innerHTML = "Upper limit ";
	var upperInput = document.createElement('input');
	upperInput.setAttribute("name","baselineUpper");
	upperInput.setAttribute("type","text");
	upperInput.setAttribute("value","1990")

	var br2 = document.createElement('br');
	var input = document.createElement('input');
	input.setAttribute("type","submit")
	form.appendChild(header)
	form.appendChild(lowLabel)
	form.appendChild(lowInput)
	form.appendChild(br1)
	form.appendChild(upperLabel)
	form.appendChild(upperInput)
	form.appendChild(br2)
	form.appendChild(input)
	return form;
}

var copy = function() {
	var body = document.body,
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
const urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get('id');
if(id){
	id = urlParams.get('id').split(',');
}else{
	id = 'all';
}

if(id=='all'){
	id = ['AbiskoTemperatures',
		'AbiskoTemperaturesSummer',
		'AbiskoTemperaturesWinter',
		'monthlyAbiskoTemperatures',
		'growingSeason',
		'temperatureDifferenceAbisko',
		'temperatureDifference1',
		'temperatureDifference2',
		'temperatureDifference3','yearlyPrecipitation','summerPrecipitation',
		'winterPrecipitation','monthlyPrecipitation','yearlyPrecipitationDifference',
		'summerPrecipitationDifference','winterPrecipitationDifference','abiskoSnowDepthMeans','abiskoLakeIce'];
}


const debug = urlParams.get('debug');
const baseline = urlParams.get('baseline');
const share = urlParams.get('share');


var bpage = function(){
	document.body.appendChild(createBaseline());

	id.forEach(each => {
		rendF[each].html(debug);	
		rendF[each].func();
	})

	if(share=='true'){
		var input = document.createElement("input");
		input.setAttribute('id', 'input');
		input.setAttribute('type', 'text');
		var body = document.body,
			html = document.documentElement;
		var height = Math.max( body.scrollHeight, body.offsetHeight, 
			html.clientHeight, html.scrollHeight, html.offsetHeight );
		input.setAttribute('value', "<iframe src='"+window.location+"&share=false"+"' width='100%' height='"+height+"'></iframe>") // TODO ifram
		document.body.appendChild(input);
		var cp = document.createElement("button");
		cp.innerHTML = 'Copy link';
		cp.setAttribute('onclick', "copy()");
		document.body.appendChild(cp);
	}
}


var nhTemp = function() {
	functorGISSTEMP('data/NH.Ts.csv',renderTemperatureGraph,'https://data.giss.nasa.gov/gistemp/')('northernHemisphere','Northern Hemisphere temperatures');
}
var glbTemp = function(){
	functorGISSTEMP('data/GLB.Ts.csv',renderTemperatureGraph, 'https://data.giss.nasa.gov/gistemp/')('globalTemperatures','Global temperatures');

}


var zCached = null;
var zonalTemp = function(){
	var cached;
	if(zCached){
		cached = zCached;
	}else{
		var cached = parseZonal('data/ZonAnn.Ts.csv', 'https://data.giss.nasa.gov/gistemp/');
	}
	var result = {

		cached, 
		diff: {

			arctic: function(){
				cached(containerRender(renderTemperatureDifferenceGraph,'temperatureDifference1','Temperature difference for Arctic (64N-90N)'), '64n-90n');
			},
			nh: function(){
				cached(containerRender(renderTemperatureDifferenceGraph,'temperatureDifference2','Temperature difference for Northern Hemisphere'),'nhem');
			},
			glob: function(){
				cached(containerRender(renderTemperatureDifferenceGraph,'temperatureDifference3','Global temperature difference'), 'glob');
			},
		},
		arctic: function(){
			this.cached(containerRender(renderTemperatureGraph,'arcticTemperatures','Arctic (64N-90N) temperatures'), 'yrly');
		},
	}
	return result;
};


var tornetrask = function(){
	parseTornetrask('data/Tornetrask_islaggning_islossning.csv','https://www.arcticcirc.net/');
}

var abiskoSnowDepth = function() {
	parseSnowDepth('data/ANS_SnowDepth.csv','https://www.arcticcirc.net/');
}


var cached = null;
var parseAb = function(){
	if(!cached){
		var cached = parseAbisko('data/ANS_Temp_Prec.csv','https://www.arcticcirc.net/');
	}
	var result = {
		temps: {
			yrly: function(){
				cached(renderTemperatureGraph, 'AbiskoTemperatures', 'Abisko temperatures', 'temperatures');
			},
			summer: function(){
				cached(renderAbiskoMonthlyTemperatureGraph, 'AbiskoTemperaturesSummer', 'Abisko temperatures for '+summerRange, 'summerTemps');
			},
			winter: function(){
				cached(renderAbiskoMonthlyTemperatureGraph, 'AbiskoTemperaturesWinter', 'Abisko temperatures for '+winterRange, 'winterTemps');
			},
			monthly: function(){
				cached(monthlyFunc(renderAbiskoMonthlyTemperatureGraph), 'monthlyAbiskoTemperatures', 'Abisko temperatures for', 'monthlyTemps')
			},
			diff: {
				yrly: function(){
					cached(renderTemperatureDifferenceGraph, 'temperatureDifferenceAbisko', 'Temperature difference for Abisko', 'temperatures')
				},
			}
		},
		precip: {
			yrly: function(){
				cached(renderYearlyPrecipitationGraph, 'yearlyPrecipitation','Yearly precipitation', 'yearlyPrecipitation')
			},
			summer: function(){
				cached(renderYearlyPrecipitationGraph, 'summerPrecipitation','Precipitation for '+summerRange, 'summerPrecipitation')
			},
			winter: function(){
				cached(renderYearlyPrecipitationGraph, 'winterPrecipitation','Precipitation for '+winterRange, 'winterPrecipitation')
			},
			monthly: function(){
				cached(monthlyFunc(renderMonthlyPrecipitationGraph), 'monthlyPrecipitation', 'Abisko Precipitation for', 'monthlyPrecip')
			},
			diff: {
				yrly: function(){
					cached(renderPrecipitationDifferenceGraph, 'yearlyPrecipitationDifference', 'Precipitation difference', 'yearlyPrecipitation');
				},
				summer: function(){
					cached(renderPrecipitationDifferenceGraph, 'summerPrecipitationDifference', 'Precipitation difference '+summerRange, 'summerPrecipitation');
				},
				winter: function(){
					cached(renderPrecipitationDifferenceGraph, 'winterPrecipitationDifference', 'Precipitation difference '+winterRange, 'winterPrecipitation');
				},
			},
		},
		growingSeason: function(){
			cached(renderGrowingSeasonGraph,'growingSeason', 'Growing season', 'growingSeason')
		}
	};
	return result;
}

var createDiv = function(id, no=null){
	var div = document.createElement('div');
	div.setAttribute("id",id);
	var fig = document.createElement('figure');
	if(no){
		var a = document.createElement('a');
		a.innerHTML = 'no: '+no;
		fig.appendChild(a);

		var aID = document.createElement('a');
		aID.innerHTML = ' id: '+id;
		fig.appendChild(aID);
	}
	fig.appendChild(div);
	return fig
}

var rendF = {
	'northernHemisphere': {
		func: nhTemp,
		html: function(debug=false){
			var no = 16;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('northernHemisphere', no));
		},
	},
	'globalTemperatures': {
		func: zonalTemp().globTemp,
		html: function(debug=false){
			var no = 17;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('globalTemperatures', no));
		},
	},
	'temperatureDifference1': {
		func: zonalTemp().diff.arctic, 	// TODO opt
		html: function(debug=false){
			var no = 20;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('temperatureDifference1', no));
		},
	},
	'temperatureDifference2': {
		func: zonalTemp().diff.nh,    	// 
		html: function(debug=false){
			var no = 21;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('temperatureDifference2', no));
		},
	},
	'temperatureDifference3': {
		func: zonalTemp().diff.glob,	//
		html: function(debug=false){
			var no = 22;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('temperatureDifference3', no));
		},
	},
	'arcticTemperatures': {
		func: zonalTemp().arctic, 
		html: function(debug=false){
			var no = 16.1;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('arcticTemperatures', no));
		},
	},
	'abiskoLakeIce':{
		func: tornetrask,
		html: function(debug=false){
			var no = 43;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('abiskoLakeIce', no));
		},
	}, 
	'abiskoSnowDepthMeans':{
		func: abiskoSnowDepth,
		html: function(debug=false){
			var no = 41;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('abiskoSnowDepthPeriodMeans',no))
			no = 42;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('abiskoSnowDepthPeriodMeans2',no))
		},
	},
	'AbiskoTemperatures':{
		func: parseAb().temps.yrly,
		html: function(debug=false){
			var no = 1;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('AbiskoTemperatures', no));
		},

	}, 
	'AbiskoTemperaturesSummer': {
		func: parseAb().temps.summer,
		html: function(debug=false){
			var no = 2;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('AbiskoTemperaturesSummer', no));
		},
	}, 
	'AbiskoTemperaturesWinter': {
		func: parseAb().temps.winter,
		html: function(debug=false){
			var no = 3;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('AbiskoTemperaturesWinter', no));
		},
	},
	'temperatureDifferenceAbisko': {
		func: parseAb().temps.diff.yrly,
		html: function(debug=false){
			var no = 19;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('temperatureDifferenceAbisko', no));
		},
	},
	'monthlyAbiskoTemperatures': {
		func: parseAb().temps.monthly,
		html: function(debug=false){
			var no = 4;
			if(debug){
				months().forEach((month, index) => {
					document.body.appendChild(createDiv('monthlyAbiskoTemperatures_'+month, no+index));
				})

			}else{
				months().forEach((month, index) => {
					document.body.appendChild(createDiv('monthlyAbiskoTemperatures_'+month));
				})

			}
		},
	}, 
	'yearlyPrecipitation': {
		func: parseAb().precip.yrly,
		html: function(debug=false){
			var no = 23;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('yearlyPrecipitation', no));
		},
	}, 
	'summerPrecipitation': {
		func: parseAb().precip.summer,
		html: function(debug=false){
			var no = 24;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('summerPrecipitation', no));
		},
	}, 
	'winterPrecipitation': {
		func: parseAb().precip.winter,
		html: function(debug=false){
			var no = 25;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('winterPrecipitation', no));
		},
	}, 
	'yearlyPrecipitationDifference': {
		func: parseAb().precip.diff.yrly,
		html: function(debug=false){
			var no = 38;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('yearlyPrecipitationDifference', no));
		},
	}, 
	'summerPrecipitationDifference': {
		func: parseAb().precip.diff.summer,
		html: function(debug=false){
			var no = 39;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('summerPrecipitationDifference', no));
		},
	}, 
	'winterPrecipitationDifference': {
		func: parseAb().precip.diff.winter,
		html: function(debug=false){
			var no = 40;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('winterPrecipitationDifference',no));
		},
	}, 
	'monthlyPrecipitation': {
		func: parseAb().precip.monthly,
		html: function(debug=false){
			var no = 26;
			if(debug){
				months().forEach((month, index) => {
					document.body.appendChild(createDiv('monthlyPrecipitation_'+month, no+index));
				})

			}else{
				months().forEach((month, index) => {
					document.body.appendChild(createDiv('monthlyPrecipitation_'+month));
				})

			}
		},
	}, 
	'growingSeason': {
		func: parseAb().growingSeason,
		html: function(debug=false){
			var no = 18;
			if(!debug) no = debug;
			document.body.appendChild(createDiv('growingSeason', no));
		}
	}
}

