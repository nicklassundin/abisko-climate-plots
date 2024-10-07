//exports.module = require('../../renderer/lib');
//lib = require('vizchange-plot-builder');
//import lib from 'vizchange-plot-builder';
import lib from '../../renderer/lib.js';
import queryString from 'query-string';
window.lib = await lib;
window.queryString = await queryString;

//if(process.env.NODE_ENV === 'development') lib = require('../../renderer/lib');
