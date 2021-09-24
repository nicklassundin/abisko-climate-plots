
const fs = require("fs");
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

            return http.createServer(app).listen(config.port);

        } catch (err) {

            console.log(err);
            return err;

        }

    }
};


