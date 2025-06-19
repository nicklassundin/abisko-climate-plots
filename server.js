const cors = require('cors'); // Cors setup
const health = require('express-healthcheck'); // Health Check
require('jquery');
const { parse  } = require('csv-parse/sync');
// Cache requirements
const fs = require('fs'); 
const axios = require('axios');
// precalculated
// general express requirements
require('request');
const express = require('express');
const http = require('http');
const {version} = require('./package.json');
// Handle bar formatting
const hbs = require('hbs');
const session = require('express-session');
const bodyParser = require('body-parser');
// Pathing
const path = require('path');
// Plot modules
const plots_config = require('climate-plots-config');
const web = require('./modules/server/web.js');
const STATIC_STATIONS = require('./static/charts/stations.json');
const config = require("./static/server.config.json");

/**
 * Class representing Server instance
 */
class Server {
    /**
     * Initialize server class and create webserver
     * @param debug {boolean} defines if it is debug launch on local machine or live.
     */
    constructor(debug = false) {
        this.debug = debug;
        this.webserver = web.webserver;
    }

    /**
     * Create app and forward resources for clients
     * @returns {*|Express} return this instance of app;
     */
    createApp(){
        this.app = express();
        // Define open paths
        this.app.use('/css', express.static(`${__dirname}/css`));
        this.app.use('/modules', express.static(`${__dirname}/modules`));
        this.app.use('/config', express.static(`${__dirname}/config`));
        this.app.use('/client', express.static(`${__dirname}/client`));
        this.app.use('/static', express.static(`${__dirname}/static`));
        // Generate plot config files in local directory
        plots_config.genStaticFiles(path.join(__dirname, '/')).then();
        // Parse and page builder from Handlebars templates
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use(session({
            secret: 'secret',
            resave: true,
            saveUninitialized: true
        }))
        hbs.registerPartials(`${__dirname}/views/partials`);
        // Setup Browse preview on server
        this.setupServerPreview();
        // setup Cache
        // setup pre-calculated values TODO make obsolete
        // this.precalculation();

        this.app.use(cors({
            origin: ['*']
        }));
        this.createAPI();
        return this.app;
    }
    /**
     * Host Preview site
     */
    setupServerPreview() {
        const STATIONS = this.STATIC_STATIONS;
        this.app.get('/browse', (req, res) => {
            this.plotList.then((chart_list) => {
                this.stationList.then((stations) => {
                    res.render('browse.hbs',
                        {
                            STATIONS,
                            chrts: chart_list,
                            stations: stations,
                            version
                        })
                })
            })
        })
    }

    /**
     * get list of plots form plot config
     * @returns {Promise} promise of resolved JSON file of all plots
     */
    get plotList() {
        return plots_config.custom;
    }
    /**
     *
     * @returns {{abisko: {}, CALM: {}, "64n-90n": {}, glob: {}, nhem: {}}}
     */
    get STATIC_STATIONS() {
        return STATIC_STATIONS;
    }

    get stationList() {
	    return Promise.resolve().then(() => {
	    return {
		    fixed: Object.keys(this.STATIC_STATIONS).map(value => {
			    return {
				    id: value,
			    }
			
	    	})
	    }
	    })
    }
    createAPI(){
        this.webserver.http(this.app);
        this.app.get('/', function(req, res) {
            res.send('Lets do this');
        })
        this.app.use('/health', health());

	// API to /data
	this.app.get('/data', (req, res) => {
		// arguments station and types=['temperature', 'precipitation',..]	
		let params = req.query;
		let station = params.station;
		let types = params.type.split(',')
		let specs = params.specs ? params.specs : '';
		let subtype = params.subtype ? params.subtype : '';
		// console.log(params)
			
		var name = "ANS_AWS_annual";
		switch (types[1]) {
			case 'yrly':
				name = 'ANS_AWS_annual';
				break;
			default:
		}
		switch (types[2]) {
			case 'growingSeason':
				name = 'ANS_AWS_annual';
				break;
			default:
		}
		// check if types contain spring, summer, autumn or winter 
		if (types.includes('spring') || types.includes('summer') || types.includes('autumn') || types.includes('winter')) {
			name = 'ANS_AWS_season';
		}
		// check if types contain 'jan', feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
		if (types.includes('jan') || types.includes('feb') || types.includes('mar') || 
		    types.includes('apr') || types.includes('may') || types.includes('jun') || 
		    types.includes('jul') || types.includes('aug') || types.includes('sep') || 
		    types.includes('oct') || types.includes('nov') || types.includes('dec')) {
			name = 'ANS_AWS_month_'+types[2];
		}
		if (['glob', 'nhem', '64n-90n'].includes(station)){
			name = 'Zon_'+station
		}
		if (types.includes('perma')){
			name = 'CALM_'+station;
		}

		if(['icetime', 'freezeup', 'breakup', 'complete_ice_cover'].includes(types[0])) {
			name = 'Tornetrask_lake_data'
		}

		if (types.includes('snowdepth_single') || types.includes('snowdepth_deci')){
			name = 'SnowDepth'
		}

		if (specs == 'decadeMeans'){
			name = 'snowDecade' + subtype;
		}
		if (specs == 'periodMeans'){
			name = 'snowPeriod' + subtype;
		}
			
		if (types.includes('co2_weekly')){
			name = 'co2'
		}
		let dataPath = path.join(__dirname, 'data', name+ '.csv');
		let data = fs.readFileSync(dataPath, 'utf8');
		let data_json = parse(data, {
			columns: true,
			skip_empty_lines: true,
			trim: true,
			// convert to numbers where possible
			cast: (value, context) => {
				if (!isNaN(value)) {
					return Number(value);
				}
				return value;
			}
		});
		console.log(name, 'Data size:', JSON.stringify(data).length, 'bytes');
		
		res.json(data_json);
	})


        return this.app;
    }
}
module.exports = Server;
