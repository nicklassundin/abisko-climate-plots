const cors = require('cors'); // Cors setup
const health = require('express-healthcheck'); // Health Check
require('jquery');
// Cache requirements
const fs = require('fs');   // write files to cache etc TODO make obsolete
const axios = require('axios');
const { setupCache } = require('axios-cache-interceptor');
const { buildStorage } = require('axios-cache-interceptor');
// precalculated
let stats = require('vizchange-stats');
const stats_configs = JSON.parse(JSON.stringify(stats.configs['production_redirect']));
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
// Getting smhi server list
let smhi = require('vizchange-smhi');
const config = require("./static/server.config.json");

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
setupCache(axios, {
    cache: {
        ttl: 1000*60*60*24*365
    },
    storage    // TODO make storage work
})


class Server {
    constructor(debug = false) {
        this.debug = debug;
        this.webserver = require('./modules/server/web.js').webserver;
    }
    createApp(){
        // Create App instance
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
        return this.app;
    }
    setupServerPreview() {
        const STATIC_STATIONS = this.STATIC_STATIONS;
        this.app.get('/browse', (req, res) => {
            this.plotList.then((chart_list) => {
                this.stationList.then((stations) => {
                    res.render('browse.hbs',
                        {
                            STATIC_STATIONS,
                            chrts: chart_list,
                            stations: stations,
                            version
                        })
                })
            })
        })
    }
    get plotList() {
        return plots_config.custom;
    }
    get STATIC_STATIONS() {
        return require('./static/charts/stations.json');
    }
    get stationList() {
        this.smhiAPI();
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
    setupCache(){
        // setup cache
        const config = require('./static/server.config.json');
        this.app.use('/data/:server/:params', async function(req, res) {
            let url = `https://${config[req.params.server]}${req['_parsedUrl'].search}`
            const { data } = await axios.get(url)
            res.setHeader('Content-Type', 'application/json')
            res.send(data)
        })
    }
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

            let filePath = `./cache/${specs.station}_${specs.type}_${req.params['0'].join('_')}${req['_parsedUrl'].search}.json`

            ////console.log('specs', specs, filePath)
            if (fs.existsSync(filePath)) {
                fs.readFile(filePath, 'utf8', function(error, data) {
                    res.send(data)
                })
            }else{
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
        this.webserver.http(this.app);
        this.app.get('/', function(req, res) {
            res.send('Lets do this');
        })
        this.app.use('/health', health());
        return this.app;
    }
}
module.exports = Server;
