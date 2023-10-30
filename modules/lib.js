//exports.module = require('../../renderer/lib');
lib = require('vizchange-plot-builder');
if(process.env.NODE_ENV === 'development') lib = require('../../renderer/lib');
exports.module = lib;
