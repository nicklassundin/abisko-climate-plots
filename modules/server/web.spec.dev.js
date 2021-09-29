const fs = require("fs");
const request = require("request");

const {expect} = require("chai");
const express = require("express");

const webserver = require("./web.js");

describe(
    "javascript statistic module",
    () => {

        it(
            "HTTP - start",
            function *() {

                const app = express(),
		 result = webserver.http(app).then(() => {

                        Done();

                    });
                // TODO

            }
        );
        it(
            "HTTPS - start",
            function *() {

                const app = express(),
		 result = webserver.https(app).then(() => {

                        Done();

                    });
                // TODO

            }
        );

    }
);
