
// Pre-setup
require("jquery");
require("fs");
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

const config = require('./static/server.config.json')


/* Open file access
const cors = require('cors');
const server-config = require('vizchange-stats').configs;
console.log(server-config.live.url);
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
require("./modules/server/smhi").init(
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

const Axios = require('axios')
const { setupCache } = require('axios-cache-interceptor');

const axios = setupCache(Axios);

app.use('/data/:server/:params', function(req, res) {
    let url = `https://${config[req.params.server]}${req['_parsedUrl'].search}`
    axios.get(url, {
        ttl: 1000*60*60*24*14,
    }).then(async (result) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result.data));
    }).catch(err => {
        res.status(err.status)
    })
});

hbs.registerPartials(`${__dirname}/views/partials`);
const station_static = require("./static/charts/stations.json");
const http = require("http");
let version = require("./package.json").version;

custom.then((chart_list) => {
    const sets = station_static
    let stations = Object.keys(station_static).map((st) => {

            if (st === "smhi") {

                return "53430";

            }

            return st;

        });
    app.get(
        "/browse",
        (req, res) => {
	    console.log("/browse")
        console.log('remote Address:',req.ip)
	    console.log("version", version)

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

});

exports.app = app;
