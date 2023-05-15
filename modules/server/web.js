
const fs = require("fs");
const http = require("http");
const https = require("https");
let config;
try {

    config = require("./config/server.json");

} catch (ERROR) {
    config = require("./config/default.server.json");
}

exports.webserver = {
    "http" (app) {
        const http = require("http");
        try {
	        http.createServer(app).listen(config.port);
            return http
        } catch (err) {

            //console.log(err);
            return err;

        }

    },
    "https" (app) {
        const https = require("https");
        try {
            https.createServer(app).listen(config.https.port);
            return https
        } catch (err) {
            //console.log(err);
            return err;

        }
    }
};


