
// Pre-setup
const $ = require("jquery");


const fs = require("fs");
const request = require("request");
const express = require("express"),

    // Setup
    app = express();
const hbs = require("hbs");
// Open file access
app.use(
    "/css",
    express.static(`${__dirname}/css`)
);
app.use(
    "/dep",
    express.static(`${__dirname}/dep`)
);
app.use(
    "/modules",
    express.static(`${__dirname}/modules`)
);
app.use(
    "/config",
    express.static(`${__dirname}/config`)
);
app.use(
    "/data",
    express.static(`${__dirname}/data`)
);
app.use(
    "/data/abisko",
    express.static(`${__dirname}/data/abisko`)
);
app.use(
    "/client",
    express.static(`${__dirname}/client`)
);
app.use(
    "/tmp",
    express.static(`${__dirname}/tmp`)
);
app.use(
    "/maps",
    express.static(`${__dirname}/maps`)
);
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

const url = require("url");
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
const stati = require("./static/charts/stations.json");
const stations = require("./static/charts/stations.json");
const {version} = require("./package.json");
custom.then((chrts) => {

    const sets = stati,
	 stations = Object.keys(stati).map((st) => {

            if (st === "smhi") {

                return "53430";

            }

            return st;

        }),
        temp = Object.keys(stations);
    app.get(
        "/browse",
        (req, res) => {

            res.render(
                "browse.hbs",
                {
                    sets,
                    chrts,
                    stations,
                    version
                }
            );

        }
    );

});

exports.app = app;
