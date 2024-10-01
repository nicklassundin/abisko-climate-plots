import cors from 'cors';
import health from 'express-healthcheck';
// Cache requirements
import fs from 'fs';
//const axios = require('axios');
import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { buildStorage } from 'axios-cache-interceptor';
// precalculated
import stats from 'vizchange-stats';
const stats_configs = JSON.parse(JSON.stringify(stats.configs['production_redirect']));
// TODO make this right the url is undefined?position etc.....?
import request from 'request';
import express from 'express';
import http from 'http';
const {version} = await import('./package.json', {
    assert: { type: "json" }
});
// Handle bar formatting
import hbs from 'hbs';
import session from 'express-session';
import bodyParser from 'body-parser';
// Pathing
import path from 'path';
// Plot modules
import plots_config from 'climate-plots-config';
import web from './modules/server/web.js';
const STATIC_STATIONS = await import('./static/charts/stations.json', {
    assert: { type: "json" }
});
// Getting smhi server list
//let smhi = require('vizchange-smhi');
import smhi from 'vizchange-smhi'
//const config = require("./static/server.config.json");
const config = await import("./static/server.config.json", {
    assert: { type: "json" }
});
import { fileURLToPath } from "url";
// Get the __filename equivalent
const __filename = fileURLToPath(import.meta.url);
// Get the __dirname equivalent
const __dirname = path.dirname(__filename);

const storage = buildStorage({
    find(key) {
        return new Promise((resolve, reject) => {
            if(!fs.existsSync(`./cache/storage/${key}.json`)){
                resolve(undefined)
            }else{
                fs.readFile(`./cache/storage/${key}.json`, 'utf8', function(error, data) {
                    if(error) reject(error);
                    if(JSON.parse(data).length <= 0){
                        resolve(undefined)
                    }else{
                        resolve(JSON.parse(data))
                    }
                })
            }
        })
    },
    set(key, value, req) {
        try{
            fs.writeFileSync(`./cache/storage/${key}.json`, JSON.stringify(value))
        }catch(error){
            throw error;
        }
    },
    remove(key) {
        //fs.unlink(`./cache/storage/${key}.json`);
    }
})
/**
 * Axios Cache
 */
setupCache(axios, {
    cache: {
        ttl: 1000*60*60*24*365
    },
    storage    // TODO make storage work
})

/**
 * Class representing Server instance
 */
export default class Server {
    /**
     * Initialize server class and create webserver
     * @param debug {boolean} defines if it is debug launch on local machine or live.
     */
    constructor(debug = false) {
        this.debug = debug;
    }

    /**
     * Create app and forward resources for clients
     * @returns {*|Express} return this instance of app;
     */
    createApp(){
        console.log('Creating app...')
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
        this.setupCache();
        // setup pre-calculated values TODO make obsolete
        this.precalculation();

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
        return STATIC_STATIONS.default;
    }

    /**
     * get list of station from both pre-set list and smhi API list
     * @returns {Promise}
     */
    get stationList() {
        // TODO problem with smhi API list
        //this.smhiAPI();
        return this.smhi_stations().then((smhiStations) => {
            return {
                smhi: smhiStations,
                fixed: Object.keys(this.STATIC_STATIONS).map(value => {
                    return {
                        id: value
                    }
                })
            }
        })
    }
    /**
     * Setting up cache data api for request against server
     */
    setupCache(){
        // setup cache
        this.app.use('/data/:server/:params', async function(req, res) {
            let url = `https://${config.default[req.params.server]}${req['_parsedUrl'].search}`
            const { data } = await axios.get(url)
            res.setHeader('Content-Type', 'application/json')
            res.send(data)
        })
    }
    /**
     * get Precalculated data or generate it if not in registry
     */
    precalculation() {
        this.app.get('/precalculated/:station/:type/*', (req, res) => {
            let specs = JSON.parse(JSON.stringify(stats_configs))
            specs.station = req.params.station;
            specs.type = req.params.type
            req.params['0'] = req.params['0'].split('/')
            // TODO recreate req.params so no need for unshift
            req.params['0'].unshift(req.params.type)

            let search = req.query
            if(!search) search = {}
            Object.keys(search).forEach(key => {
                switch (key) {
                    case 'baselineStart':
                        specs.baseline.start = Number(search[key])
                        break;
                    case 'baselineEnd':
                        specs.baseline.end = Number(search[key])
                        break;
                    case 'start':
                    case 'end':
                        specs.dates[key] = Number(search[key])
                        break;
                    default:
                        specs[key] = search[key];
                }
            })
            /**
             * file path for precalculated data
             * @type {string}
             */
            let filePath = `./cache/${specs.station}_${specs.type}_${req.params['0'].join('_')}${req['_parsedUrl'].search}.json`
            if (fs.existsSync(filePath)) {
                fs.readFile(filePath, 'utf8', function(error, data) {
                    res.send(data)
                })
            }else{
                console.error('No cache file found')
                const result = stats.getByParams(specs, req.params['0'])
                result.then((resolved) => {
                    if(Array.isArray(resolved) && typeof resolved[0].then === 'function'){
                        return Promise.all(resolved).then(all => all)
                    }else{
                        return resolved
                    }
                }).then(result => {
                    fs.writeFileSync(filePath, JSON.stringify(result))
                    res.send(result)
                }).catch(err => {
                    //console.log(err)
                })
            }
        })
    }
    smhiAPI() {
        smhi.init(this.app, 'corrected-archive');
    }
    smhi_stations() {
        return smhi.stations.getStations();
    }
    createAPI(){
        console.log('Creating API...')
        web.http(this.app);
        this.app.get('/', function(req, res) {
            res.send('Lets do this');
        })
        this.app.use('/health', health());
        return this.app;
    }
}
