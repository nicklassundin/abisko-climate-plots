
hashCode = function(s) {
    let h = 0, l = s.length, i = 0;
    if ( l > 0 )
        while (i < l)
            h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
};

// Pre-setup
require("jquery");
const fs = require("fs");
require("request");
const express = require("express"),

    // Setup
    app = express();
/**
var cors = require('cors')
app.use('*', cors({
    origin: 'http://localhost:80',
    optionsSuccessStatus: 200, // For legacy browser support
    methods: "GET, PUT"
}))
*/
const hbs = require("hbs");



/* Open file access
const cors = require('cors');
const server-config = require('vizchange-stats').configs;
//console.log(server-config.live.url);
app.use(cors({}))

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

*/


app.use(
    "/css",
    express.static(`${__dirname}/css`)
);
// app.use(
    // "/dep",
    // express.static(`${__dirname}/dep`)
// );
app.use(
    "/modules",
    express.static(`${__dirname}/modules`)
);
app.use(
    "/config",
    express.static(`${__dirname}/config`)
);

app.use(
    "/client",
    express.static(`${__dirname}/client`)
);
app.use(
    "/maps",
    express.static(`${__dirname}/maps`)
);
const path = require('path');
require("climate-plots-config").genStaticFiles(path.join(__dirname, '/')).then()
app.use(
    "/static",
    express.static(`${__dirname}/static`)
);

// SMHI DB connection
const TYPE = "corrected-archive";
let smhi = require('vizchange-smhi');
smhi.stations.getStations().then(result => {
  // //console.log(result)
})
smhi.init(
    app,
    TYPE
);


const session = require("express-session");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({"extended": true}));
app.use(bodyParser.json());
app.use(session({
    "secret": "secret",
    "resave": true,
    "saveUninitialized": true
}));

//const url = require("url");
const plotConfig = require("climate-plots-config"),
    {custom} = plotConfig;
exports.custom = custom;

/*
 * Var charts = (req) => {
 * 	return new Promise((res, rej) => {
 * 		custom.then(IDs => {
 * 			const queryObject = url.parse(req.url,true).query;
 * 			var id;
 * 			var ids;
 * 			if(!queryObject.id) {
 * 				ids = IDs.all;
 * 			}else if(!custom[queryObject.id]){
 * 				ids = queryObject.id.split(",");
 * 			}else{
 * 				ids = IDs[queryObject.id];
 * 			}
 * 			res(ids.map(id => {
 * 				return {
 * 					id: id,
 * 					station: queryObject.station
 * 				}
 * 			}))
 * 		})
 * 	})
 * }
 */




hbs.registerPartials(`${__dirname}/views/partials`);
const station_static = require("./static/charts/stations.json");
const http = require("http");
let version = require("./package.json").version;

custom.then((chart_list) => {
    const sets = station_static

    smhi.stations.getStations().then((smhiStations) => {
        let stations = {
            smhi: smhiStations,
            fixed: Object.keys(station_static).map(value => {
                return {
                    id: value
                }
            })
        }
        // TODO remove and standardize
        app.get(
            "/browse",
            (req, res) => {
                //console.log("/browse")
                //console.log('remote Address:',req.ip)
                //console.log("version", version)

                version = `${version}`

                res.render(
                    "browse.hbs",
                    {
                        sets,
                        chrts: chart_list,
                        stations,
                        version
                    }
                );

            }
        );

    })
});

const axios = require('axios')

const { setupCache } = require('axios-cache-adapter');

const config = require('./static/server.config.json')

const zlib = require('zlib')


setupCache(axios, {
    cache: {
        ttl: 1000*60*60*24*14
    }
})
app.use('/data/:server/:params', async function(req, res) {
    let url = `https://${config[req.params.server]}${req['_parsedUrl'].search}`

    let filePath = `./cache/api/${req.params.server}${req['_parsedUrl'].search}.json`


    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', function(error, output) {
           //console.log('cached:', filePath)
            res.send(output)
        })
    }else{
        const { data } = await axios.get(url, {
            cache: {
                ttl: 1000*60*60*24*14
            }
        })
        res.setHeader('Content-Type', 'application/json')
        res.send(data)
        fs.writeFileSync(filePath, JSON.stringify(data))

        /*
        zlib.gunzip(data, function (_err, output) {
            res.setHeader('Content-Type', 'application/json')
            res.send(output)
            //console.log(output)
            try{
                fs.writeFileSync(filePath, JSON.stringify(output))
            }catch(error){
                //console.log(typeof output)
                //throw error
            }
        })

         */
    }
/*
    axios.get(url, {
        ttl: 1000*60*60*24*14,
    }).then((result) => {
        //console.log('redirect url:', url)
        //console.log(result.headers)
        res.writeHead(200, result.headers);
        res.end(JSON.stringify(result.data));
        //console.log('success:', req.params, req['_parsedUrl'].search)
    }).catch(err => {
        //console.log('failure:', req.params, err)
        res.end(JSON.stringify([]))
       // res.status(err.status)
    })
 */
});

let stats = require('vizchange-stats')
const configs = JSON.parse(JSON.stringify(stats.configs['production_redirect']));
app.get('/precalculated/:station/:type/*', (req, res) => {
    let specs = JSON.parse(JSON.stringify(configs))
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
      //  //console.log(stats.cache)
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

exports.app = app;
